import type { Metadata } from 'next';

import { RegistryTable } from '@/components/plugins/RegistryTable';
import { loadPluginRecords } from '@/lib/registry';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '官方插件',
  description:
    '从 DeepTradePluginOfficial 注册表自动同步 — 按 strategy / channel 类型筛选，一键复制安装命令',
  path: '/plugins',
  ogKind: 'plugin',
});

export default async function PluginsPage() {
  const plugins = await loadPluginRecords();
  const total = plugins.length;
  const strategyCount = plugins.filter((p) => p.type === 'strategy').length;
  const channelCount = plugins.filter((p) => p.type === 'channel').length;

  return (
    <div className="bg-background text-foreground min-h-screen font-mono uppercase tracking-widest text-xs">
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <header className="mb-16 border-l-2 border-accent pl-6">
          <div className="flex items-center justify-between">
            <p className="text-muted-2 text-[10px]">
              DeepTradePluginOfficial / registry / index.json
            </p>
            <div className="text-accent border border-accent hidden px-2 py-1 text-[10px] md:block">
              LIVE · REGISTRY V1
            </div>
          </div>
          <h1 className="text-foreground mt-2 text-xl font-bold tracking-[0.2em]">
            PLUGIN_REGISTRY
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-muted lowercase tracking-normal">
            <p>
              total_count: <span className="text-foreground">{total}</span>
            </p>
            <p>
              strategies: <span className="text-foreground">{strategyCount}</span>
            </p>
            <p>
              channels: <span className="text-foreground">{channelCount}</span>
            </p>
          </div>
          <p className="mt-4 max-w-2xl text-muted-2 lowercase tracking-normal leading-relaxed">
            the framework is a pure runtime; all business logic (strategies, data collectors, notification channels) 
            are decoupled as independent pypi packages. install via: 
            <code className="text-foreground ml-2 select-all">deeptrade plugin install &lt;id&gt;</code>
          </p>
        </header>

        <RegistryTable plugins={plugins} />
      </main>
    </div>
  );
}
