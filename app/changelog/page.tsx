import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '更新日志',
  description: 'DeepTrade 框架版本变更历史',
};

/**
 * 更新日志占位（M1）。
 * 完整实现见 M4：scripts/sync-changelog.ts 在 prebuild 拉取主仓 CHANGELOG.md。
 */
export default function ChangelogPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-24">
      <h1 className="text-section font-bold tracking-tight">更新日志</h1>
      <p className="text-muted">
        M4 milestone 实现：构建前从主仓{' '}
        <a
          className="text-link hover:text-foreground underline underline-offset-4"
          href="https://github.com/ty19880929/DeepTrade/blob/main/CHANGELOG.md"
          rel="noopener noreferrer"
          target="_blank"
        >
          CHANGELOG.md
        </a>{' '}
        同步。
      </p>
      <Link href="/" className="text-link hover:text-foreground text-sm transition-colors">
        ← 返回首页
      </Link>
    </main>
  );
}
