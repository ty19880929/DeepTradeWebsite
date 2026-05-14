import { ExternalLink } from 'lucide-react';
import { CopyableCommand } from '@/components/landing/CopyableCommand';
import type { PluginRecord } from '@/lib/registry';

interface RegistryRowProps {
  plugin: PluginRecord;
}

export function RegistryRow({ plugin }: RegistryRowProps) {
  const isOfficial = plugin.repo.includes('ty19880929');

  return (
    <div className="hover:bg-white/[0.02] group grid grid-cols-12 border-b border-l border-border transition-colors last:border-b-border">
      {/* Col 1: ID & Version */}
      <div className="col-span-12 flex flex-col justify-center border-r border-border p-4 md:col-span-3">
        <div className="text-foreground font-mono text-sm lowercase tracking-normal font-bold">
          {plugin.id}
        </div>
        <div className="text-muted-2 mt-1 font-mono text-[10px] tracking-widest uppercase">
          {plugin.latestTag || 'v0.0.0'} · 2026-05-13
        </div>
      </div>

      {/* Col 2: Description */}
      <div className="col-span-12 flex items-center border-r border-border p-4 md:col-span-4">
        <p className="text-muted group-hover:text-foreground font-mono text-xs lowercase tracking-normal transition-colors leading-relaxed">
          {plugin.description}
        </p>
      </div>

      {/* Col 3: Tags */}
      <div className="col-span-12 flex flex-col justify-center gap-2 border-r border-border p-4 md:col-span-2">
        {isOfficial && (
          <span className="text-accent text-[10px] tracking-widest">[OFFICIAL]</span>
        )}
        <span className={isOfficial ? "text-muted text-[10px] tracking-widest" : "text-accent-yellow text-[10px] tracking-widest"}>
          {plugin.type.toUpperCase()}
        </span>
        <a
          href={`https://github.com/${plugin.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-2 hover:text-foreground inline-flex items-center gap-1 text-[10px] tracking-widest transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          REPO
        </a>
      </div>

      {/* Col 4: Action */}
      <div className="col-span-12 flex items-center border-r border-border p-4 md:col-span-3">
        <div className="border-border bg-background group-hover:border-muted flex w-full items-center justify-between border transition-colors">
          <CopyableCommand
            command={`pipx run deeptrade plugin install ${plugin.id}`}
            prefix=""
            inline
            className="w-full px-3"
          />
        </div>
      </div>
    </div>
  );
}
