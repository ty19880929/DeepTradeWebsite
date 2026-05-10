#!/usr/bin/env node
/**
 * sync-changelog: 从主仓拉 CHANGELOG.md，写到 content/changelog/index.mdx。
 *
 * 失败语义（详细设计 §7.2 已确认）：
 *   - 网络不可达 / HTTP 非 200 → 打 warning，**保留**仓内 fallback 不动
 *   - 不抛错，不阻塞构建（CHANGELOG 慢半拍可接受，更新日志陈旧 < 站挂掉）
 *
 * 跑在 package.json 的 prebuild 钩子里，会先于 fumadocs-mdx 的代码生成。
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../..');
const TARGET = join(ROOT, 'content', 'changelog.md');
const SOURCE_URL = 'https://raw.githubusercontent.com/ty19880929/DeepTrade/main/CHANGELOG.md';

async function main() {
  let raw;
  try {
    const res = await fetch(SOURCE_URL, {
      headers: { Accept: 'text/plain' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    raw = await res.text();
  } catch (err) {
    console.warn(
      `[sync-changelog] fetch failed (${err.message}); 保留仓内 fallback ${TARGET}`,
    );
    return;
  }

  const previous = (() => {
    try {
      return readFileSync(TARGET, 'utf8');
    } catch {
      return '';
    }
  })();
  if (previous.trim() === raw.trim()) {
    console.log('[sync-changelog] up to date, nothing to write');
    return;
  }
  writeFileSync(TARGET, raw, 'utf8');
  console.log(`[sync-changelog] wrote ${raw.length} bytes to content/changelog.md`);
}

main().catch((err) => {
  // 捕兜底：连兜底逻辑都炸了，退一步打 warning，让构建继续
  console.warn('[sync-changelog] unexpected error, continuing with fallback:', err);
});
