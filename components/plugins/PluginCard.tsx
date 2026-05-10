import { ExternalLink } from 'lucide-react';

import { CopyableCommand } from '@/components/landing/CopyableCommand';
import { GithubIcon } from '@/components/shared/GithubIcon';
import { cn } from '@/lib/utils';
import type { PluginRecord } from '@/lib/registry';

const TYPE_BADGE: Record<PluginRecord['type'], { label: string; className: string }> = {
  strategy: {
    label: 'Strategy',
    className: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
  },
  channel: {
    label: 'Channel',
    className: 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-300',
  },
};

interface PluginCardProps {
  plugin: PluginRecord;
}

export function PluginCard({ plugin }: PluginCardProps) {
  const badge = TYPE_BADGE[plugin.type];
  const repoUrl = `https://github.com/${plugin.repo}/tree/main/${plugin.subdir}`;

  return (
    <article className="rounded-card border-border bg-surface flex h-full flex-col gap-5 border p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-pill border px-2 py-0.5 font-mono text-[11px] tracking-wider uppercase',
                badge.className,
              )}
            >
              {badge.label}
            </span>
            {plugin.latestTag ? (
              <span className="text-muted-2 font-mono text-[11px]">{plugin.latestTag}</span>
            ) : null}
          </div>
          <h3 className="text-foreground mt-3 text-lg font-semibold tracking-tight">
            {plugin.name}
          </h3>
          <p className="text-muted-2 mt-1 font-mono text-xs">{plugin.id}</p>
        </div>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${plugin.name} GitHub`}
          className="text-muted hover:text-foreground focus-visible:text-foreground inline-flex h-9 w-9 shrink-0 items-center justify-center rounded transition-colors"
        >
          <GithubIcon className="h-5 w-5" />
        </a>
      </header>

      <p className="text-muted text-sm leading-6">{plugin.description}</p>

      <dl className="text-muted-2 grid grid-cols-2 gap-2 font-mono text-xs">
        <div>
          <dt className="opacity-60">framework</dt>
          <dd className="text-muted">≥ {plugin.min_framework_version}</dd>
        </div>
        <div>
          <dt className="opacity-60">tag prefix</dt>
          <dd className="text-muted">{plugin.tag_prefix}</dd>
        </div>
        {typeof plugin.stars === 'number' ? (
          <div>
            <dt className="opacity-60">stars</dt>
            <dd className="text-muted">{plugin.stars.toLocaleString()}</dd>
          </div>
        ) : null}
        <div className="col-span-2">
          <dt className="opacity-60">repo</dt>
          <dd className="text-muted truncate">
            <a
              href={`https://github.com/${plugin.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              {plugin.repo}
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </dd>
        </div>
      </dl>

      <div className="border-border-soft mt-auto border-t pt-5">
        <CopyableCommand command={`deeptrade plugin install ${plugin.id}`} className="w-full" />
      </div>
    </article>
  );
}
