import Link from 'next/link';

import { cn } from '@/lib/utils';

interface EcosystemEntry {
  /** 内部 key */
  id: string;
  /** 渲染的展示文本（外层 main 已 uppercase，传 mixed case 也会被强制大写） */
  display: string;
  /** 可选外链。提供时整个 cell 变成 a 标签 */
  href?: string;
}

interface EcosystemGridProps {
  /** 分组标签，默认 "ECOSYSTEM" */
  title?: string;
  /** 副标签（block header），默认 "NATIVE SUPPORT" */
  groupLabel?: string;
  entries: EcosystemEntry[];
}

/**
 * R1 Tabular：bordered 单容器内分两段渲染 ——
 * - 顶段：4 列横向排（divide-x），少于 4 个时按实际列数；
 * - 次段：剩余 entries 按 2 列网格再补一行。
 *
 * 设计意图来自 landing-prototype.html L131-146：先呈现核心 native support（4
 * 个 LLM/数据源），再用一行附属环境（DuckDB / Python 版本）兜底，信息层级
 * 清晰而不拥挤。
 */
export function EcosystemGrid({
  title = 'ECOSYSTEM',
  groupLabel = 'NATIVE SUPPORT',
  entries,
}: EcosystemGridProps) {
  const first = entries.slice(0, 4);
  const rest = entries.slice(4);

  return (
    <section className="mt-section">
      <div className="text-foreground mb-4 font-bold">{title}</div>
      <div className="border-border border">
        <div className="border-border text-muted border-b p-4">{groupLabel}</div>

        <div className="divide-border text-muted grid grid-cols-2 divide-y text-center md:grid-cols-4 md:divide-x md:divide-y-0">
          {first.map((entry) => (
            <Cell key={entry.id} entry={entry} />
          ))}
        </div>

        {rest.length > 0 && (
          <div className="border-border divide-border text-muted grid grid-cols-2 divide-x border-t text-center">
            {rest.map((entry) => (
              <Cell key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Cell({ entry }: { entry: EcosystemEntry }) {
  const className = cn(
    'hover:text-foreground block py-4 transition-colors',
  );
  if (entry.href) {
    const isExternal = /^https?:\/\//.test(entry.href);
    if (isExternal) {
      return (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          aria-label={entry.display}
        >
          {entry.display}
        </a>
      );
    }
    return (
      <Link href={entry.href} className={className} aria-label={entry.display}>
        {entry.display}
      </Link>
    );
  }
  return <div className={className}>{entry.display}</div>;
}
