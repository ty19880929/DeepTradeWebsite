'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { cn } from '@/lib/utils';

export interface TerminalLine {
  type: 'cmd' | 'output' | 'comment';
  content: string;
  /** 出现前的延迟（毫秒），叠加到累计时序 */
  delayMs?: number;
}

interface TerminalDemoProps {
  lines: TerminalLine[];
  /** 默认 false。true 时循环重播。 */
  loop?: boolean;
  className?: string;
  /** 顶部窗口标题，默认 "deeptrade" */
  title?: string;
}

const DEFAULT_DELAY = 350;
const LOOP_PAUSE = 1500;

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => undefined;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getReducedMotionServerSnapshot(): boolean {
  // SSR：默认按"无障碍优先"假设关闭动画，避免首屏视觉抖动
  return true;
}

export function TerminalDemo({
  lines,
  loop = false,
  className,
  title = 'deeptrade',
}: TerminalDemoProps) {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (reduced) return; // reduced 时下方 render 直接全量展示，无需状态推进

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const schedule = (offsetStart: number) => {
      let cumulative = offsetStart;
      for (let i = 0; i < lines.length; i++) {
        cumulative += lines[i]?.delayMs ?? DEFAULT_DELAY;
        const idx = i;
        timeouts.push(
          setTimeout(() => {
            if (!cancelled) setRevealedCount(idx + 1);
          }, cumulative),
        );
      }
      if (loop) {
        cumulative += LOOP_PAUSE;
        timeouts.push(
          setTimeout(() => {
            if (cancelled) return;
            setRevealedCount(0);
            schedule(0);
          }, cumulative),
        );
      }
    };

    // 不在 effect 同步 reset state（react-hooks/set-state-in-effect）；
    // 第一帧 timer 会很快推到 idx=1，再退回 0 视觉上无感。
    schedule(0);

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [reduced, lines, loop]);

  const fullyVisible = reduced;

  return (
    <figure
      className={cn(
        'rounded-card border-border bg-surface overflow-hidden border font-mono text-sm shadow-2xl shadow-black/40',
        className,
      )}
      aria-label={`${title} 终端演示`}
    >
      <header className="border-border-soft flex h-9 items-center gap-2 border-b px-4">
        <span aria-hidden className="bg-diff-remove h-3 w-3 rounded-full" />
        <span aria-hidden className="h-3 w-3 rounded-full bg-yellow-500" />
        <span aria-hidden className="bg-diff-add h-3 w-3 rounded-full" />
        <span className="text-muted-2 ml-3 select-none text-xs">{title}</span>
      </header>
      <div className="space-y-1 px-5 py-4">
        {lines.map((line, idx) => {
          const visible = fullyVisible || idx < revealedCount;
          const isCursorRow = !fullyVisible && idx === revealedCount - 1;
          return (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-2 leading-6 transition-opacity',
                visible ? 'opacity-100' : 'opacity-0',
              )}
              aria-hidden={!visible}
            >
              {line.type === 'cmd' && (
                <span className="text-muted-2 shrink-0 select-none">$</span>
              )}
              {line.type === 'comment' && (
                <span className="text-muted-2 shrink-0 select-none">#</span>
              )}
              <span
                className={cn(
                  'whitespace-pre-wrap break-words',
                  line.type === 'cmd' && 'text-foreground',
                  line.type === 'output' && 'text-muted',
                  line.type === 'comment' && 'text-muted-2 italic',
                )}
              >
                {line.content}
                {isCursorRow && <span aria-hidden className="terminal-cursor" />}
              </span>
            </div>
          );
        })}
      </div>
      <style>{`
        .terminal-cursor {
          display: inline-block;
          width: 0.5ch;
          height: 1em;
          margin-left: 2px;
          background: var(--color-foreground);
          vertical-align: text-bottom;
          animation: dt-blink 1s steps(2, start) infinite;
        }
        @keyframes dt-blink {
          to { visibility: hidden; }
        }
      `}</style>
    </figure>
  );
}
