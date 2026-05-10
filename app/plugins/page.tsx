import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '官方插件',
  description: 'DeepTrade 官方注册表插件目录',
};

/**
 * 插件墙占位（M1）。
 * 完整实现见 M4：从 DeepTradePluginOfficial/registry/index.json 拉取并渲染。
 */
export default function PluginsPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-24">
      <h1 className="text-section font-bold tracking-tight">官方插件</h1>
      <p className="text-muted">M4 milestone 实现：build 时从注册表拉取插件元数据并渲染卡片墙。</p>
      <Link href="/" className="text-link hover:text-foreground text-sm transition-colors">
        ← 返回首页
      </Link>
    </main>
  );
}
