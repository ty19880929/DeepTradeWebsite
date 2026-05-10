import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';

import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
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
  );
}
