'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { PluginRecord } from '@/lib/registry';
import { TerminalSearch } from './TerminalSearch';
import { RegistryRow } from './RegistryRow';

interface RegistryTableProps {
  plugins: PluginRecord[];
}

type Category = 'all' | 'strategy' | 'channel';

export function RegistryTable({ plugins }: RegistryTableProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');

  const counts = useMemo(() => {
    return {
      all: plugins.length,
      strategy: plugins.filter((p) => p.type === 'strategy').length,
      channel: plugins.filter((p) => p.type === 'channel').length,
    };
  }, [plugins]);

  const filtered = useMemo(() => {
    let result = plugins;
    
    if (category !== 'all') {
      result = result.filter((p) => p.type === category);
    }

    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.id.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower) ||
          p.type.toLowerCase().includes(lower)
      );
    }
    
    return result;
  }, [plugins, search, category]);

  return (
    <div className="flex flex-col gap-8">
      <TerminalSearch value={search} onChange={setSearch} />

      {/* Category Filters */}
      <div className="border-border bg-background flex divide-x divide-border border overflow-x-auto">
        {(['all', 'strategy', 'channel'] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              'px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-colors whitespace-nowrap',
              category === cat
                ? 'bg-foreground text-background font-bold'
                : 'text-muted hover:text-foreground hover:bg-white/[0.02]'
            )}
          >
            {cat} <span className={cn('ml-2', category === cat ? 'text-background/70' : 'text-accent-yellow')}>[{counts[cat]}]</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col">
        {/* Table Header */}
        <div className="text-muted-2 hidden border border-border bg-surface/50 font-mono text-[10px] tracking-[0.2em] uppercase md:grid md:grid-cols-12">
          <div className="col-span-4 border-r border-border p-4">plugin_id / version</div>
          <div className="col-span-5 border-r border-border p-4">description / metadata</div>
          <div className="col-span-3 p-4">links</div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col border-t border-border">
          {filtered.length > 0 ? (
            filtered.map((plugin) => (
              <RegistryRow key={plugin.id} plugin={plugin} />
            ))
          ) : (
            <div className="border-border border-b border-l border-r p-12 text-center font-mono text-sm lowercase tracking-normal text-muted-2">
              no matches found for &quot;{search}&quot;
            </div>
          )}
        </div>

        {/* Table Footer / Summary */}
        <div className="text-muted-2 mt-4 flex justify-between font-mono text-[10px] tracking-widest uppercase px-1">
          <div>showing {filtered.length} of {plugins.length} plugins</div>
          <div className="flex gap-4">
            <span>FILTER: {category}</span>
            <span>REGISTRY_V1</span>
          </div>
        </div>
      </div>
    </div>
  );
}
