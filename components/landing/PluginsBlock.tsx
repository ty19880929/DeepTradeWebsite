'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface PluginEntry {
  name: string;
  desc: string;
}

interface PluginsBlockProps {
  description: string;
  plugins: PluginEntry[];
  /** 命令行前缀，默认 "deeptrade plugin search "（含尾空格） */
  searchPrefix?: string;
}

const DEFAULT_PREFIX = 'deeptrade plugin search ';

/**
 * R1 新增 —— 三段式 bordered 区块：
 *   1. 顶部说明 + [DECOUPLED] tag
 *   2. 中部 bullet 列表（外层 main uppercase，这里 lowercase 翻回 mixed case）
 *   3. 底部"伪命令行"搜索条：input 默认值带前缀，可编辑后半段；按 RUN /
 *      Enter 走 useRouter 跳转 /plugins?q=<suffix>。/plugins 当前不消费
 *      ?q=（progressive enhancement），未来若加搜索功能可直接对接。
 */
export function PluginsBlock({
  description,
  plugins,
  searchPrefix = DEFAULT_PREFIX,
}: PluginsBlockProps) {
  const router = useRouter();
  const [value, setValue] = useState(searchPrefix);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const suffix = value.startsWith(searchPrefix)
      ? value.slice(searchPrefix.length).trim()
      : value.trim();
    router.push(suffix ? `/plugins?q=${encodeURIComponent(suffix)}` : '/plugins');
  };

  return (
    <section className="mt-section">
      <div className="text-foreground mb-4 font-bold">PLUGINS</div>
      <div className="border-border border p-6 md:p-8">
        <div className="mb-6 flex items-start justify-between">
          <p className="text-link max-w-2xl text-sm tracking-normal lowercase">{description}</p>
          <span className="border-accent-yellow text-accent-yellow ml-4 hidden border px-2 py-1 text-[10px] md:inline-block">
            DECOUPLED
          </span>
        </div>

        <ul className="text-muted mb-8 list-inside list-disc space-y-2 text-sm tracking-normal lowercase">
          {plugins.map((p) => (
            <li key={p.name}>
              <span className="text-foreground">{p.name}</span>: {p.desc}
            </li>
          ))}
        </ul>

        <div className="text-muted mb-4">SEARCH THE REGISTRY</div>
        <form
          onSubmit={handleSubmit}
          action="/plugins"
          method="get"
          className="border-border bg-surface flex h-12 border"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="搜索插件注册表"
            className="text-foreground w-full bg-transparent px-4 font-mono text-sm tracking-normal lowercase outline-none"
          />
          <button
            type="submit"
            className="bg-foreground text-background hover:bg-foreground/80 px-6 font-bold transition-colors"
          >
            RUN
          </button>
        </form>
      </div>
    </section>
  );
}
