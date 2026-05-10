import Link from 'next/link';

import { cn } from '@/lib/utils';

interface EcosystemEntry {
  /** 内部 key */
  id: string;
  /** 渲染的展示文本 */
  display: string;
  /** 可选外链。提供时整个 cell 变成 a 标签 */
  href?: string;
}

interface EcosystemGridProps {
  title: string;
  /** 副标题，可选 */
  description?: string;
  entries: EcosystemEntry[];
}

/**
 * 复刻 openspec.dev 的 "Supported Tools" 区块。
 * 当前 milestone 用单色文字 wordmark 占位（mono 字体 + 边框），
 * 后续可替换为官方 brand kit SVG（参见 R6）。
 */
export function EcosystemGrid({ title, description, entries }: EcosystemGridProps) {
  return (
    <section className="border-border-soft mx-auto max-w-6xl border-t px-6 py-section">
      <div className="text-center">
        <h2 className="text-foreground text-section font-bold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-muted mx-auto mt-4 max-w-2xl text-sm leading-6 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>

      <ul className="mt-12 grid grid-cols-3 gap-3 sm:gap-4 lg:grid-cols-6">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Cell entry={entry} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Cell({ entry }: { entry: EcosystemEntry }) {
  const cellClass = cn(
    'group flex h-20 items-center justify-center rounded-card border border-border-soft bg-surface/40 px-4',
    'text-muted-2 font-mono text-sm tracking-wider transition',
    'hover:text-foreground hover:border-border hover:bg-surface',
    'focus-visible:text-foreground focus-visible:border-border focus-visible:bg-surface',
  );
  const inner = <span className="select-none">{entry.display}</span>;

  if (entry.href) {
    const isExternal = /^https?:\/\//.test(entry.href);
    if (isExternal) {
      return (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cellClass}
          aria-label={entry.display}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={entry.href} className={cellClass} aria-label={entry.display}>
        {inner}
      </Link>
    );
  }
  return <div className={cellClass}>{inner}</div>;
}
