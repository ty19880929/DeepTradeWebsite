import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DeepTrade — 本地运行的 A 股选股 CLI 框架',
};

/**
 * 落地页占位（M1）。
 * 完整实现见 M2：Hero / EcosystemGrid / FeatureSplit ×3 / FaqAccordion / Footer。
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-hero font-extrabold tracking-tight">DeepTrade</h1>
      <p className="text-muted max-w-xl text-center text-base">
        本地运行的 A 股选股 CLI 框架 · 落地页 M2 milestone 建设中
      </p>
      <code className="rounded-card border-border bg-surface text-foreground border px-4 py-3 font-mono text-sm">
        $ pipx install deeptrade-quant
      </code>
      <nav className="text-link mt-4 flex gap-6 text-sm">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          文档 →
        </Link>
        <Link href="/plugins" className="hover:text-foreground transition-colors">
          插件墙 →
        </Link>
        <Link href="/changelog" className="hover:text-foreground transition-colors">
          更新日志 →
        </Link>
      </nav>
    </main>
  );
}
