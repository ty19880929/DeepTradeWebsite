import { cn } from '@/lib/utils';

export type FileTreeBadge = 'framework' | 'plugin-a' | 'plugin-b';

export interface FileTreeNode {
  name: string;
  type: 'dir' | 'file';
  badge?: FileTreeBadge;
  children?: FileTreeNode[];
  /** 行末注释，灰色 */
  hint?: string;
}

interface FileTreeVizProps {
  root: FileTreeNode;
  className?: string;
  title?: string;
}

const BADGE_CLASSES: Record<FileTreeBadge, string> = {
  framework: 'text-foreground',
  // 蓝/紫两种插件着色，token 落在 globals 的字面值里
  'plugin-a': 'text-sky-400',
  'plugin-b': 'text-fuchsia-400',
};

const BADGE_LABEL: Record<FileTreeBadge, string> = {
  framework: '__framework__',
  'plugin-a': 'limit_up_board',
  'plugin-b': 'volume_anomaly',
};

/**
 * 渲染 ASCII 字符树。颜色按 badge 区分 framework / plugin。
 * RSC 组件，无客户端 JS 开销。
 */
export function FileTreeViz({ root, className, title }: FileTreeVizProps) {
  const rows: { line: string; badge?: FileTreeBadge; hint?: string }[] = [];
  walk(root, '', true, true, rows);

  return (
    <figure
      className={cn(
        'rounded-card border-border bg-surface overflow-hidden border font-mono text-sm shadow-2xl shadow-black/40',
        className,
      )}
      aria-label={title ?? '文件树可视化'}
    >
      {title ? (
        <header className="border-border-soft flex h-9 items-center border-b px-4">
          <span className="text-muted-2 select-none text-xs">{title}</span>
        </header>
      ) : null}
      <pre className="m-0 overflow-x-auto px-5 py-4 leading-6">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className={cn(
                row.badge ? BADGE_CLASSES[row.badge] : 'text-muted',
                'whitespace-pre',
              )}
            >
              {row.line}
            </span>
            {row.hint ? <span className="text-muted-2 text-xs">{`// ${row.hint}`}</span> : null}
          </div>
        ))}
      </pre>
      {/* 颜色图例 */}
      <footer className="border-border-soft text-muted-2 flex flex-wrap items-center gap-4 border-t px-5 py-3 text-xs">
        <Legend swatch="text-foreground" label="__framework__" />
        <Legend swatch="text-sky-400" label="limit_up_board" />
        <Legend swatch="text-fuchsia-400" label="volume_anomaly" />
      </footer>
    </figure>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className={cn('inline-block h-2 w-2 rounded-sm bg-current', swatch)} />
      <span className="font-mono">{label}</span>
    </span>
  );
}

function walk(
  node: FileTreeNode,
  prefix: string,
  isLast: boolean,
  isRoot: boolean,
  rows: { line: string; badge?: FileTreeBadge; hint?: string }[],
) {
  const connector = isRoot ? '' : isLast ? '└── ' : '├── ';
  const dirSuffix = node.type === 'dir' ? '/' : '';
  rows.push({
    line: `${prefix}${connector}${node.name}${dirSuffix}`,
    badge: node.badge,
    hint: node.hint,
  });
  if (node.children && node.children.length > 0) {
    const childPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ');
    node.children.forEach((child, i) => {
      walk(child, childPrefix, i === node.children!.length - 1, false, rows);
    });
  }
}

export { BADGE_LABEL };
