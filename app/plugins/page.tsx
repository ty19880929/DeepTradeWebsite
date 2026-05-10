import type { Metadata } from 'next';

import { Footer } from '@/components/landing/Footer';
import { Navbar } from '@/components/landing/Navbar';
import { PluginGrid } from '@/components/plugins/PluginGrid';
import { loadPluginRecords } from '@/lib/registry';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '官方插件',
  description:
    '从 DeepTradePluginOfficial 注册表自动同步 — 按 strategy / channel 类型筛选，CopyableCommand 一键复制安装命令',
  path: '/plugins',
  ogKind: 'plugin',
});

/**
 * 插件墙 RSC（SSG）。构建期一次性拉取注册表 + 可选 GitHub 增强；
 * 运行时纯静态。注册表更新由 .github/workflows/registry-sync.yml 的 cron
 * 触发 Vercel deploy hook 重建。
 */
export default async function PluginsPage() {
  const plugins = await loadPluginRecords();
  const total = plugins.length;
  const strategyCount = plugins.filter((p) => p.type === 'strategy').length;
  const channelCount = plugins.filter((p) => p.type === 'channel').length;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-muted-2 font-mono text-xs tracking-widest uppercase">
            DeepTradePluginOfficial · registry/index.json
          </p>
          <h1 className="text-section text-foreground mt-4 font-bold tracking-tight">
            官方插件目录
          </h1>
          <p className="text-muted mt-6 text-base leading-7">
            框架本体只是运行时；选股策略与推送渠道全部以独立插件包发布。当前共{' '}
            <strong className="text-foreground font-semibold">{total}</strong> 个官方插件 ——{' '}
            <span className="text-foreground">{strategyCount}</span> 个策略、
            <span className="text-foreground"> {channelCount}</span> 个渠道。
          </p>
          <p className="text-muted-2 mt-4 text-sm">
            通过 <code className="bg-surface text-foreground rounded px-1.5 py-0.5 font-mono text-xs">deeptrade plugin install &lt;id&gt;</code>{' '}
            安装；卡片右上角 GitHub 图标跳源码目录。
          </p>
        </header>

        <div className="mt-16 flex justify-center">
          <PluginGrid plugins={plugins} />
        </div>
      </main>
      <Footer />
    </>
  );
}
