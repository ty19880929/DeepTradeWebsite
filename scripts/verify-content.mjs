#!/usr/bin/env node
/**
 * verify-content: 校验 content/docs/ 下所有 MDX 的健康度。
 *
 * 检查项：
 *   1. frontmatter 必填 title + description
 *   2. 所有 /docs/<slug> 内部链接指向真实存在的 MDX
 *   3. code block 语言 tag 在白名单里（避免拼写错）
 *
 * 退出码：失败 1，全绿 0。CI 在 build 之后跑。
 */

import { readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'node:fs/promises';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const DOCS_DIR = join(ROOT, 'content', 'docs');

const ALLOWED_LANGS = new Set([
  '',
  'text',
  'plain',
  'plaintext',
  'bash',
  'sh',
  'shell',
  'zsh',
  'powershell',
  'ps1',
  'js',
  'jsx',
  'ts',
  'tsx',
  'json',
  'yaml',
  'yml',
  'toml',
  'sql',
  'python',
  'py',
  'md',
  'mdx',
  'css',
  'html',
  'diff',
  'http',
  'env',
  'dotenv',
]);

const REQUIRED_FRONTMATTER = ['title', 'description'];

const errors = [];

function err(file, msg) {
  errors.push(`${relative(ROOT, file)}: ${msg}`);
}

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return { fields: {}, body: raw };
  const fmRaw = m[1];
  const body = raw.slice(m[0].length);
  const fields = {};
  for (const line of fmRaw.split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    fields[key] = val;
  }
  return { fields, body };
}

async function collectAllMdx() {
  const files = [];
  for await (const file of glob('**/*.mdx', { cwd: DOCS_DIR })) {
    files.push(join(DOCS_DIR, file));
  }
  return files.sort();
}

function fileToSlug(absPath) {
  // E:/.../content/docs/user/install.mdx → /docs/user/install
  // E:/.../content/docs/index.mdx        → /docs
  // E:/.../content/docs/user/index.mdx   → /docs/user
  let slug = relative(DOCS_DIR, absPath).replace(/\\/g, '/');
  slug = slug.replace(/\.mdx$/, '');
  if (slug.endsWith('/index')) slug = slug.slice(0, -'/index'.length);
  if (slug === 'index') slug = '';
  return slug ? `/docs/${slug}` : '/docs';
}

function checkFrontmatter(file, fields) {
  for (const key of REQUIRED_FRONTMATTER) {
    if (!fields[key] || fields[key].length === 0) {
      err(file, `缺少 frontmatter 字段: ${key}`);
    }
  }
}

function checkInternalLinks(file, body, allSlugs) {
  // 匹配 markdown / MDX 里的 [text](/docs/xxx) 与 href="/docs/xxx"
  const patterns = [/\]\((\/docs[^\s)#]*)/g, /href="(\/docs[^"#]*)"/g];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(body)) !== null) {
      const target = m[1].replace(/\/$/, '');
      if (target === '/docs') continue;
      if (!allSlugs.has(target)) {
        err(file, `内部链接指向不存在的 doc: ${target}`);
      }
    }
  }
}

function checkCodeBlockLangs(file, body) {
  // ```lang\n...\n```
  const re = /```([\w-]*)/g;
  let m;
  while ((m = re.exec(body)) !== null) {
    const lang = m[1].toLowerCase();
    if (!ALLOWED_LANGS.has(lang)) {
      err(file, `未知的 code block 语言 tag: \`${lang}\`（如需新增请加入 ALLOWED_LANGS）`);
    }
  }
}

async function main() {
  const files = await collectAllMdx();
  if (files.length === 0) {
    console.error('content/docs/ 下没有任何 .mdx 文件');
    process.exit(1);
  }

  const allSlugs = new Set(files.map(fileToSlug));

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const { fields, body } = parseFrontmatter(raw);
    checkFrontmatter(file, fields);
    checkInternalLinks(file, body, allSlugs);
    checkCodeBlockLangs(file, body);
  }

  if (errors.length > 0) {
    console.error('\nverify-content 失败：');
    for (const e of errors) console.error('  ✘ ' + e);
    console.error(`\n共 ${errors.length} 处问题，扫描了 ${files.length} 个 MDX 文件。\n`);
    process.exit(1);
  }

  console.log(`✓ verify-content 全绿（扫描 ${files.length} 个 MDX 文件）`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
