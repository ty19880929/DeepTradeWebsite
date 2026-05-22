'use client';

import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Check } from 'lucide-react';
import type { PluginRecord } from '@/lib/registry';

interface RegistryRowProps {
  plugin: PluginRecord;
}

const TOAST_TIMEOUT_MS = 1200;

export function RegistryRow({ plugin }: RegistryRowProps) {
  const isOfficial = plugin.repo.includes('ty19880929');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleCopy = async () => {
    const command = `pipx run deeptrade plugin install ${plugin.id}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(command);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), TOAST_TIMEOUT_MS);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  return (
    <div className="hover:bg-white/[0.02] group grid grid-cols-12 border-b border-l border-border transition-colors last:border-b-border">
      {/* Col 1: ID & Version */}
      <div 
        onClick={handleCopy}
        className="col-span-12 flex flex-col justify-center border-r border-border p-4 md:col-span-4 cursor-pointer relative group/id"
      >
        <div className="flex items-center gap-2">
          <div className="text-foreground font-mono text-sm lowercase tracking-normal font-bold group-hover/id:text-accent transition-colors">
            {plugin.id}
          </div>
          {copied ? (
            <Check className="text-diff-add h-3 w-3" />
          ) : (
            <span className="text-[10px] text-muted-2 opacity-0 group-hover/id:opacity-100 transition-opacity uppercase tracking-tighter">
              [click to copy]
            </span>
          )}
        </div>
        <div className="text-muted-2 mt-1 font-mono text-[10px] tracking-widest uppercase">
          {plugin.latest_version?.split('/').pop() || plugin.latestTag || 'v0.0.0'} · 2026-05-22
        </div>
      </div>

      {/* Col 2: Description */}
      <div className="col-span-12 flex items-center border-r border-border p-4 md:col-span-5">
        <p className="text-muted group-hover:text-foreground font-mono text-xs lowercase tracking-normal transition-colors leading-relaxed">
          {plugin.description}
        </p>
      </div>

      {/* Col 3: Tags & Links */}
      <div className="col-span-12 flex flex-row items-center justify-between gap-4 border-r border-border p-4 md:col-span-3">
        <div className="flex flex-col gap-1">
          {isOfficial && (
            <span className="text-accent text-[10px] tracking-widest">[OFFICIAL]</span>
          )}
          <span className={isOfficial ? "text-muted text-[10px] tracking-widest" : "text-accent-yellow text-[10px] tracking-widest"}>
            {plugin.type.toUpperCase()}
          </span>
        </div>
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
    </div>
  );
}
