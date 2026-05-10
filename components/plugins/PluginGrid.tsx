'use client';

import { useMemo, useState } from 'react';

import { PluginCard } from '@/components/plugins/PluginCard';
import { cn } from '@/lib/utils';
import type { PluginRecord } from '@/lib/registry';

type Filter = 'all' | 'strategy' | 'channel';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'strategy', label: '策略' },
  { value: 'channel', label: '渠道' },
];

interface PluginGridProps {
  plugins: PluginRecord[];
}

export function PluginGrid({ plugins }: PluginGridProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? plugins : plugins.filter((p) => p.type === filter)),
    [filter, plugins],
  );

  const counts = useMemo(
    () => ({
      all: plugins.length,
      strategy: plugins.filter((p) => p.type === 'strategy').length,
      channel: plugins.filter((p) => p.type === 'channel').length,
    }),
    [plugins],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="插件类型筛选"
        className="border-border-soft bg-surface/40 inline-flex rounded-full border p-1"
      >
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              role="tab"
              aria-selected={active}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                active
                  ? 'bg-foreground text-background'
                  : 'text-muted hover:text-foreground focus-visible:text-foreground',
              )}
            >
              {f.label}
              <span className={cn('ml-2 font-mono text-xs', active ? 'opacity-60' : 'opacity-50')}>
                {counts[f.value]}
              </span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="text-muted-2 mt-12 rounded-card border-border-soft border border-dashed py-16 text-center text-sm">
          这个分类暂无官方插件。
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {visible.map((plugin) => (
            <li key={plugin.id} className="contents">
              <PluginCard plugin={plugin} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
