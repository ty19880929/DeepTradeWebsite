'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CopyableCommandProps {
  command: string;
  /** 默认 '$ '，传 '' 可关掉 */
  prefix?: string;
  className?: string;
  /**
   * inline 变体（R1 Tabular）：移除外壳卡片样式（border / radius / 卡片底色 /
   * px-4 py-3），仅保留命令文本 + 右侧 copy 按钮。按钮 opacity 默认 100%，不
   * 再 group-hover 才显。用于落地页 Hero ActionRow 等表格化排版场景。
   */
  inline?: boolean;
}

const TOAST_TIMEOUT_MS = 1200;

async function copyText(text: string): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to legacy fallback
    }
  }

  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch {
    ok = false;
  }
  document.body.removeChild(textarea);
  return ok;
}

export function CopyableCommand({
  command,
  prefix = '$ ',
  className,
  inline = false,
}: CopyableCommandProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    const ok = await copyText(command);
    if (!ok) return;
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), TOAST_TIMEOUT_MS);
  };

  const wrapperClass = inline
    ? cn(
        'group text-link relative inline-flex items-center gap-3 font-mono text-sm lowercase tracking-normal',
        className,
      )
    : cn(
        'group rounded-card border-border bg-surface text-foreground relative inline-flex items-center gap-3 border px-4 py-3 font-mono text-sm',
        className,
      );

  const codeClass = inline
    ? 'min-w-0 select-all overflow-x-auto whitespace-nowrap'
    : 'min-w-0 flex-1 select-all overflow-x-auto whitespace-nowrap';

  const buttonClass = inline
    ? 'text-muted hover:text-foreground focus-visible:text-foreground inline-flex h-6 w-6 items-center justify-center transition'
    : cn(
        'text-muted hover:text-foreground focus-visible:text-foreground inline-flex h-7 w-7 items-center justify-center rounded transition',
        'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
      );

  // inline 模式下复制提示挂在下方，避免与上一行 ActionRow 重叠；卡片模式保留
  // 上方提示，沿用 M5 视觉。
  const toastClass = inline
    ? 'bg-foreground text-background pointer-events-none absolute top-6 right-0 rounded px-2 py-1 text-xs font-medium'
    : 'bg-foreground text-background pointer-events-none absolute -top-8 right-0 rounded px-2 py-1 text-xs font-medium';

  return (
    <div className={wrapperClass}>
      <code className={codeClass}>
        {prefix && (
          <span className="text-muted-2 mr-1 select-none">{prefix}</span>
        )}
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? '已复制' : '复制命令'}
        className={buttonClass}
      >
        {copied ? (
          <Check className="text-diff-add h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      {copied && (
        <span role="status" aria-live="polite" className={toastClass}>
          已复制
        </span>
      )}
    </div>
  );
}
