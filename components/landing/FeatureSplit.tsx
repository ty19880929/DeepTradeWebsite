import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface FeatureSplitProps {
  /** false：左文右视觉；true：反向 */
  reverse?: boolean;
  /** 小标签，渲染在标题上方 */
  eyebrow?: string;
  title: string;
  body: ReactNode;
  visual: ReactNode;
  /** 锚点 id（落地页内导航备用） */
  id?: string;
}

export function FeatureSplit({ reverse, eyebrow, title, body, visual, id }: FeatureSplitProps) {
  return (
    <section id={id} className="border-border-soft border-t py-section">
      <div
        className={cn(
          'mx-auto grid max-w-6xl items-center gap-12 px-6 lg:gap-16',
          'lg:grid-cols-2',
        )}
      >
        <div className={cn('order-1', reverse ? 'lg:order-2' : 'lg:order-1')}>
          {eyebrow ? (
            <p className="text-muted-2 mb-4 font-mono text-xs tracking-widest uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-foreground text-section font-bold tracking-tight">{title}</h2>
          <div className="text-muted mt-6 space-y-4 text-base leading-7">{body}</div>
        </div>
        <div className={cn('order-2', reverse ? 'lg:order-1' : 'lg:order-2')}>{visual}</div>
      </div>
    </section>
  );
}
