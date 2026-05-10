import type { Metadata } from 'next';

import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { Navbar } from '@/components/landing/Navbar';

export const metadata: Metadata = {
  title: 'DeepTrade — 本地运行的 A 股选股 CLI 框架',
};

/**
 * 落地页（M2 批次 A）。Hero / Navbar / Footer 已落地，
 * 中间 EcosystemGrid / FeatureSplit ×3 / FaqAccordion 留给批次 B/C。
 */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero installCommand="pipx install deeptrade-quant" docsHref="/docs" />

        <PlaceholderSection title="生态与集成墙" upcomingMilestone="M2 批次 B" />
        <PlaceholderSection title="特性 A：极致轻量的本地体验" upcomingMilestone="M2 批次 C" />
        <PlaceholderSection title="特性 B：完全解耦的插件生态" upcomingMilestone="M2 批次 C" />
        <PlaceholderSection title="特性 C：原生多模型 LLM 矩阵" upcomingMilestone="M2 批次 C" />
        <PlaceholderSection title="常见问题" upcomingMilestone="M2 批次 C" />
      </main>
      <Footer />
    </>
  );
}

function PlaceholderSection({
  title,
  upcomingMilestone,
}: {
  title: string;
  upcomingMilestone: string;
}) {
  return (
    <section className="border-border-soft mx-auto flex max-w-6xl items-center justify-between border-t px-6 py-section">
      <div>
        <h2 className="text-foreground text-section font-bold tracking-tight">{title}</h2>
        <p className="text-muted-2 mt-2 text-sm">建设中 · {upcomingMilestone}</p>
      </div>
      <span className="text-muted-2 font-mono text-xs">{'// placeholder'}</span>
    </section>
  );
}
