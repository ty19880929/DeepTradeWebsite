import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { CopyableCommand } from '@/components/landing/CopyableCommand';

interface HeroProps {
  installCommand: string;
  docsHref: string;
}

export function Hero({ installCommand, docsHref }: HeroProps) {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-hero text-foreground max-w-4xl text-balance font-extrabold tracking-tight">
        本地运行的 A 股选股 CLI 框架
      </h1>
      <p className="text-muted mx-auto mt-8 max-w-2xl text-balance text-base leading-7 sm:text-lg">
        tushare 行情 + 兼容 OpenAI LLM + DuckDB 单机仓库 + 纯透传式插件机制。你的数据，你的策略，全在本地。
      </p>

      <div className="mt-10">
        <CopyableCommand command={installCommand} />
      </div>

      <Link
        href={docsHref}
        className="text-link hover:text-foreground mt-6 inline-flex items-center gap-2 text-sm transition-colors"
      >
        阅读文档
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
