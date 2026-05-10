import type { Metadata } from 'next';

import { EcosystemGrid } from '@/components/landing/EcosystemGrid';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { FeatureSplit } from '@/components/landing/FeatureSplit';
import { FileTreeViz } from '@/components/landing/FileTreeViz';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { Navbar } from '@/components/landing/Navbar';
import { DiffViewer } from '@/components/landing/DiffViewer';
import { TerminalDemo } from '@/components/landing/TerminalDemo';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'DeepTrade — 本地运行的 A 股选股 CLI 框架',
  path: '/',
  ogKind: 'default',
});

const ECOSYSTEM = [
  { id: 'deepseek', display: 'DeepSeek', href: 'https://www.deepseek.com' },
  { id: 'qwen', display: 'Qwen', href: 'https://qwen.ai' },
  { id: 'kimi', display: 'Kimi', href: 'https://www.moonshot.cn' },
  { id: 'duckdb', display: 'DuckDB', href: 'https://duckdb.org' },
  { id: 'tushare', display: 'Tushare', href: 'https://tushare.pro' },
  { id: 'python', display: 'Python', href: 'https://www.python.org' },
];

const TERMINAL_LINES = [
  { type: 'cmd' as const, content: 'pipx install deeptrade-quant' },
  { type: 'output' as const, content: '✓ installed deeptrade 0.2.0' },
  { type: 'cmd' as const, content: 'deeptrade init', delayMs: 600 },
  { type: 'output' as const, content: '✓ ~/.deeptrade/ created' },
  { type: 'output' as const, content: '✓ DuckDB schema applied · 8 framework tables' },
  { type: 'output' as const, content: '> tushare token: ********' },
  { type: 'output' as const, content: '✓ saved to OS keyring' },
  { type: 'cmd' as const, content: 'deeptrade plugin install limit-up-board', delayMs: 700 },
  { type: 'output' as const, content: '✓ migrations applied · 3 plugin tables registered' },
  { type: 'comment' as const, content: 'done · 你已经准备好跑第一个策略', delayMs: 500 },
];

const FILE_TREE = {
  name: '~/.deeptrade',
  type: 'dir' as const,
  badge: 'framework' as const,
  children: [
    {
      name: 'deeptrade.db',
      type: 'file' as const,
      badge: 'framework' as const,
      hint: 'DuckDB 单文件',
    },
    {
      name: 'plugins',
      type: 'dir' as const,
      badge: 'framework' as const,
      hint: '注册表',
      children: [
        { name: 'plugins', type: 'file' as const, badge: 'framework' as const },
        { name: 'plugin_tables', type: 'file' as const, badge: 'framework' as const },
        { name: 'llm_calls', type: 'file' as const, badge: 'framework' as const, hint: 'plugin_id 维度审计' },
        { name: 'tushare_calls', type: 'file' as const, badge: 'framework' as const },
        { name: 'lub_runs', type: 'file' as const, badge: 'plugin-a' as const },
        { name: 'lub_screens', type: 'file' as const, badge: 'plugin-a' as const },
        { name: 'va_runs', type: 'file' as const, badge: 'plugin-b' as const },
        { name: 'va_anomalies', type: 'file' as const, badge: 'plugin-b' as const },
      ],
    },
  ],
};

const LLM_CONFIG_BEFORE = `{
  "providers": {
    "qwen": {
      "model": "qwen-plus",
      "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1"
    },
    "deepseek": {
      "model": "deepseek-chat",
      "base_url": "https://api.deepseek.com"
    }
  },
  "default": "qwen"
}`;

const LLM_CONFIG_AFTER = `{
  "providers": {
    "qwen": {
      "model": "qwen-plus",
      "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1"
    },
    "deepseek": {
      "model": "deepseek-chat",
      "base_url": "https://api.deepseek.com"
    }
  },
  "default": "deepseek"
}`;

const FAQS = [
  {
    id: 'faq-strategies',
    q: 'DeepTrade 包含交易策略吗？',
    a: (
      <>
        不包含。框架本身只是运行时（init / config / plugin / data / db），所有策略都通过插件按需从
        <a
          href="https://github.com/ty19880929/DeepTradePluginOfficial"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link hover:text-foreground underline underline-offset-4"
        >
          {' '}官方注册表{' '}
        </a>
        安装。`limit-up-board`、`volume-anomaly` 都是独立 PyPI 包。
      </>
    ),
  },
  {
    id: 'faq-privacy',
    q: '如何保障数据隐私？',
    a: (
      <>
        所有数据落在本地 <code className="bg-surface text-foreground rounded px-1 font-mono text-sm">~/.deeptrade/deeptrade.db</code>
        （DuckDB 单文件）。除你显式配置的 LLM provider 与 tushare 接口外，框架不向任何外部服务发遥测。
      </>
    ),
  },
  {
    id: 'faq-trading',
    q: '支持实盘交易吗？',
    a: <>不支持。当前定位是策略研究、异动筛选与标的分析，不包含也不规划自动下单接口。</>,
  },
];

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'DeepTrade',
  alternateName: 'deeptrade-quant',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Windows, macOS, Linux',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
  description:
    'tushare 行情 + 兼容 OpenAI LLM + DuckDB 单机仓库 + 纯透传式插件机制。本地运行的 A 股选股 CLI 框架。',
  url: 'https://deeptrade.tiey.ai',
  downloadUrl: 'https://pypi.org/project/deeptrade-quant/',
  softwareVersion: '0.2.0',
  license: 'https://opensource.org/licenses/MIT',
  codeRepository: 'https://github.com/ty19880929/DeepTrade',
  programmingLanguage: 'Python',
};

export default function LandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <Navbar />
      <main>
        <Hero installCommand="pipx install deeptrade-quant" docsHref="/docs" />

        <EcosystemGrid
          title="无缝集成你熟悉的基建与大模型"
          description="OpenAI 兼容协议，配好 base_url 与 api_key 即可。本地 DuckDB 仓库由框架统一管理，行情来自 tushare。"
          entries={ECOSYSTEM}
        />

        <FeatureSplit
          eyebrow="特性 A"
          title="极致轻量的本地体验"
          body={
            <>
              <p>
                一条 <code className="bg-surface text-foreground rounded px-1 font-mono text-sm">pipx install</code>
                跑完安装。无需 Docker、无需常驻服务进程。所有状态都落在
                <code className="bg-surface text-foreground rounded px-1 font-mono text-sm">~/.deeptrade/deeptrade.db</code>
                单个 DuckDB 文件里——可备份、可迁移、可随手 SQL 查询。
              </p>
              <p>secret 走 OS keyring，没有 keyring 时回退到加密的 secret_store 表，不会明文落盘。</p>
            </>
          }
          visual={<TerminalDemo lines={TERMINAL_LINES} loop />}
        />

        <FeatureSplit
          reverse
          eyebrow="特性 B"
          title="完全解耦的插件生态"
          body={
            <>
              <p>
                框架只持有审计表（<code className="text-foreground bg-surface rounded px-1 font-mono text-sm">plugins / llm_calls / tushare_calls</code>），
                业务表全部由插件通过 migrations 自带、按 plugin_id 命名空间隔离。
              </p>
              <p>
                添加新策略 = 新插件包，零框架改动。框架命令未命中时，CLI 自动透传到插件 dispatch；插件保留完全自治。
              </p>
            </>
          }
          visual={<FileTreeViz root={FILE_TREE} title="按插件维度物理隔离" />}
        />

        <FeatureSplit
          eyebrow="特性 C"
          title="原生多模型 LLM 矩阵"
          body={
            <>
              <p>
                <code className="text-foreground bg-surface rounded px-1 font-mono text-sm">llm.providers</code>
                是一个 JSON 字典，多个 OpenAI 兼容厂商并存。切默认 provider 只改一行。
              </p>
              <p>
                所有 LLM 调用强约束 JSON mode + Pydantic 校验，禁用 tool/function call，
                把“幻觉”压在结构化输出层而不是后处理。
              </p>
            </>
          }
          visual={
            <DiffViewer
              before={LLM_CONFIG_BEFORE}
              after={LLM_CONFIG_AFTER}
              title="切换 default LLM provider"
              filename="app_config / llm.providers"
            />
          }
        />

        <section className="border-border-soft border-t py-section">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-foreground text-section text-center font-bold tracking-tight">
              常见问题
            </h2>
            <div className="mt-12">
              <FaqAccordion items={FAQS} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
