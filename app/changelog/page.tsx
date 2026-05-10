import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Footer } from '@/components/landing/Footer';
import { Navbar } from '@/components/landing/Navbar';

export const metadata: Metadata = {
  title: '更新日志',
  description: 'DeepTrade 框架版本变更历史 — 构建期自动从主仓 CHANGELOG.md 同步',
};

const SOURCE_PATH = join(process.cwd(), 'content', 'changelog.md');
const REPO_CHANGELOG_URL = 'https://github.com/ty19880929/DeepTrade/blob/main/CHANGELOG.md';

/**
 * /changelog SSG。
 *
 * 数据流：
 *   1. prebuild：scripts/sync-changelog.mjs 拉主仓 CHANGELOG.md → content/changelog.md
 *   2. 这里 readFileSync 同步读，react-markdown + remark-gfm 渲染
 *
 * 为什么不走 fumadocs MDX collection：CHANGELOG 含大量字面 {…} 文本（在 MDX
 * 里被当 JSX 表达式解析），还有 ≥/≤ 等非 ASCII 符号会让 acorn 报 SyntaxError。
 * 用纯 markdown 渲染对任意 CHANGELOG 内容鲁棒。
 *
 * 与文档站一致地切到 [data-theme="light"]：CHANGELOG 阅读时长高，强对比暗色累。
 */
export default function ChangelogPage() {
  const raw = readFileSync(SOURCE_PATH, 'utf8');
  // 主仓 CHANGELOG.md 第一行常是 "# Changelog"，本页 hero 已有大标题，剥掉避免重复
  const body = raw.replace(/^#\s+Changelog\s*\n+/i, '');

  return (
    <>
      <Navbar />
      <main>
        <div data-theme="light" className="bg-background text-foreground">
          <article className="mx-auto max-w-3xl px-6 py-16">
            <header className="border-border-soft mb-10 border-b pb-8">
              <p className="text-muted-2 font-mono text-xs tracking-widest uppercase">
                <a
                  href={REPO_CHANGELOG_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  ty19880929/DeepTrade · CHANGELOG.md
                </a>
              </p>
              <h1 className="text-foreground mt-4 text-4xl font-bold tracking-tight">更新日志</h1>
              <p className="text-muted mt-3 text-base leading-7">
                构建期从主仓 CHANGELOG.md 自动同步；网络异常时退化到仓内基线。
              </p>
            </header>
            <div className="prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
