import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { source } from '@/lib/source';

/**
 * 文档站 layout。
 *
 * 用 data-theme="light" 包一层让整个 /docs/* 子树切到亮色主题（详见
 * app/globals.css 的主题分区注释）。落地页 / /plugins / /changelog
 * 仍走默认暗色。
 */
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div data-theme="light" className="bg-background text-foreground min-h-screen">
      <DocsLayout
        tree={source.pageTree}
        nav={{
          title: (
            <span className="font-mono text-sm tracking-tight">
              <span className="text-foreground font-bold">DeepTrade</span>{' '}
              <span className="text-muted">/ docs</span>
            </span>
          ),
        }}
        githubUrl="https://github.com/ty19880929/DeepTrade"
      >
        {children}
      </DocsLayout>
    </div>
  );
}
