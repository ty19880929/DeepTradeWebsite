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
 * R1 Tabular DiffViewer：
 * - 取消 rounded-card / shadow-2xl，外框 1px #2a2a2a；
 * - 左侧固定 w-8 行号列（bg-surface-2），与代码 1:1 对齐（双侧 leading-6 + py-4）；
 * - add / remove 行用 --color-diff-add-bg / --color-diff-remove-bg 横向通铺背景；
 * - 构建期完成 diffLines 计算（RSC），diff 包不下发到客户端 bundle。
 */
export function DiffViewer({ before, after, title, filename, className }: DiffViewerProps) {
  const rows = computeRows(before, after);

  return (
    <figure
      className={cn(
        'border-border bg-surface overflow-hidden border font-mono text-sm tracking-normal normal-case',
        className,
      )}
      aria-label={title ?? '配置 diff'}
    >
      <header className="border-border flex h-9 items-center justify-between border-b px-4 text-xs">
        <span className="text-foreground select-none">{title ?? 'unified diff'}</span>
        {filename ? <span className="text-muted-2 select-none">{filename}</span> : null}
      </header>
      <div className="flex">
        <div className="border-border bg-surface-2 text-muted-2 w-8 shrink-0 border-r py-4 pr-2 text-right leading-6 select-none">
          {rows.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 overflow-x-auto py-4 leading-6 whitespace-pre">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className={cn(
                'px-4',
                row.type === 'add' && 'bg-diff-add-bg text-diff-add',
                row.type === 'remove' && 'bg-diff-remove-bg text-diff-remove',
                row.type === 'context' && 'text-muted',
              )}
            >
              {row.type === 'add' ? '+ ' : row.type === 'remove' ? '- ' : '  '}
              {row.text || ' '}
            </div>
          ))}
        </div>
      </div>
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
