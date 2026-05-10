import { diffLines } from 'diff';

import { cn } from '@/lib/utils';

interface DiffViewerProps {
  before: string;
  after: string;
  /** 显示在顶部的标题 */
  title?: string;
  /** 文件路径或语言标识 */
  filename?: string;
  className?: string;
}

interface DiffRow {
  type: 'add' | 'remove' | 'context';
  text: string;
}

/**
 * 构建期 line-level diff（RSC 组件，diffLines 调用不下发到客户端）。
 * 渲染 unified diff 行：+ 绿底，- 红底，context 中性。
 */
export function DiffViewer({ before, after, title, filename, className }: DiffViewerProps) {
  const rows = computeRows(before, after);

  return (
    <figure
      className={cn(
        'rounded-card border-border bg-surface overflow-hidden border font-mono text-sm shadow-2xl shadow-black/40',
        className,
      )}
      aria-label={title ?? '配置 diff'}
    >
      <header className="border-border-soft flex h-9 items-center justify-between border-b px-4 text-xs">
        <span className="text-foreground select-none">{title ?? 'unified diff'}</span>
        {filename ? <span className="text-muted-2 select-none">{filename}</span> : null}
      </header>
      <pre className="m-0 overflow-x-auto px-5 py-4 leading-6">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className={cn(
              'flex items-start gap-2 px-2 -mx-2',
              row.type === 'add' && 'bg-diff-add/10 text-diff-add',
              row.type === 'remove' && 'bg-diff-remove/10 text-diff-remove',
              row.type === 'context' && 'text-muted',
            )}
          >
            <span className="select-none w-3 text-right">
              {row.type === 'add' ? '+' : row.type === 'remove' ? '-' : ' '}
            </span>
            <span className="whitespace-pre-wrap break-words">{row.text}</span>
          </div>
        ))}
      </pre>
    </figure>
  );
}

function computeRows(before: string, after: string): DiffRow[] {
  const parts = diffLines(before, after);
  const rows: DiffRow[] = [];
  for (const part of parts) {
    const lines = part.value.split('\n');
    // diffLines 末尾如果是换行会多一个空 entry，去掉
    if (lines[lines.length - 1] === '') lines.pop();
    for (const line of lines) {
      if (part.added) rows.push({ type: 'add', text: line });
      else if (part.removed) rows.push({ type: 'remove', text: line });
      else rows.push({ type: 'context', text: line });
    }
  }
  return rows;
}
