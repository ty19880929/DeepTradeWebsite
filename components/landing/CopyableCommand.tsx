'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CopyableCommandProps {
  command: string;
  /** 默认 '$ '，传 '' 可关掉 */
  prefix?: string;
  className?: string;
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

export function CopyableCommand({ command, prefix = '$ ', className }: CopyableCommandProps) {
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

  return (
    <div
      className={cn(
        'group rounded-card border-border bg-surface text-foreground relative inline-flex items-center gap-3 border px-4 py-3 font-mono text-sm',
        className,
      )}
    >
      <code className="select-all whitespace-nowrap">
        <span className="text-muted-2 mr-1 select-none">{prefix}</span>
        {command}
      </code>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? '已复制' : '复制命令'}
        className={cn(
          'text-muted hover:text-foreground focus-visible:text-foreground inline-flex h-7 w-7 items-center justify-center rounded transition',
          'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
        )}
      >
        {copied ? (
          <Check className="text-diff-add h-4 w-4" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      {copied && (
        <span
          role="status"
          aria-live="polite"
          className="bg-foreground text-background pointer-events-none absolute -top-8 right-0 rounded px-2 py-1 text-xs font-medium"
        >
          已复制
        </span>
      )}
    </div>
  );
}
