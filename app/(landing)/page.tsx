import type { Metadata } from 'next';

import { DiffViewer } from '@/components/landing/DiffViewer';
import { EcosystemGrid } from '@/components/landing/EcosystemGrid';
import { FaqAccordion } from '@/components/landing/FaqAccordion';
import { FeatureBlock } from '@/components/landing/FeatureBlock';
import { Hero } from '@/components/landing/Hero';
import { PluginsBlock } from '@/components/landing/PluginsBlock';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'DeepTrade — 本地运行的 A 股选股 CLI 框架',
  path: '/',
  ogKind: 'default',
});

const HERO_DATA: {
  statement: string;
  statementEn: string;
  pillars: [string, string, string, string];
  actions: {
    label: string;
    kind: 'command' | 'link';
    value: string;
    tag?: { text: string; tone: 'green' | 'yellow' };
    forceNewTab?: boolean;
  }[];
} = {
  statement: '本地运行的 A 股选股 CLI 框架',
  statementEn: 'A LOCAL-FIRST A-SHARE CLI FRAMEWORK',
  pillars: ['LOCAL ONLY', 'NO DOCKER', 'MULTI LLM', 'PLUGIN DRIVEN'],
  actions: [
    { label: 'GET STARTED', kind: 'command', value: 'pipx install deeptrade-quant' },
    {
      label: 'GITHUB',
      kind: 'link',
      value: 'https://github.com/ty19880929/DeepTrade',
      tag: { text: '[CORE]', tone: 'yellow' },
    },
    {
      label: 'REGISTRY',
      kind: 'link',
      value: 'https://github.com/ty19880929/DeepTradePluginOfficial',
      tag: { text: '[PLUGINS]', tone: 'green' },
    },
    { label: 'DOCS', kind: 'link', value: '/docs', forceNewTab: true },
    { label: 'PLUGINS', kind: 'link', value: '/plugins' },
  ],
};

const PLUGINS_DATA = {
  description:
    '框架本体是纯透传 runtime；策略、数据采集、通知渠道全部以独立插件包发布，通过 CLI 一键安装。',
  plugins: [
    { name: 'limit-up-board', desc: 'A 股涨停板筛选与分析。' },
    { name: 'volume-anomaly', desc: '成交量异动实时检测。' },
    { name: 'stdout-channel', desc: '基础终端输出渠道。' },
  ],
};

// 顺序匹配原型：前 4 个为 native LLM 与数据源（横向排），后 2 个为附属环境
// （DuckDB / Python）补一行，与 landing-prototype.html L137-144 一致。
const ECOSYSTEM = [
  { id: 'deepseek', display: 'DeepSeek', href: 'https://www.deepseek.com' },
  { id: 'qwen', display: 'Qwen', href: 'https://qwen.ai' },
  { id: 'kimi', display: 'Kimi', href: 'https://www.moonshot.cn' },
  { id: 'tushare', display: 'Tushare', href: 'https://tushare.pro' },
  { id: 'duckdb', display: 'DuckDB', href: 'https://duckdb.org' },
  { id: 'python', display: 'Python 3.10+', href: 'https://www.python.org' },
];

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
        所有数据落在本地 <code className="bg-surface text-foreground px-1 font-mono text-sm">~/.deeptrade/deeptrade.db</code>
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
      <main className="mx-auto max-w-4xl px-6 py-24 text-xs tracking-widest uppercase">
        {/* Pixel-font wordmark —— next/font 注入的 VT323 子集 ~10KB；落地页独占。 */}
        <div className="text-foreground font-pixel mb-8 text-2xl tracking-[0.2em]">
          DEEPTRADE
        </div>

        <Hero {...HERO_DATA} />

        <EcosystemGrid entries={ECOSYSTEM} />

        {/* FEATURES 分组：三个 FeatureBlock 共享同一顶部标签 */}
        <div className="text-foreground mt-section mb-4 font-bold">FEATURES</div>
        <FeatureBlock
          title="SWITCH MODELS INSTANTLY, NO CODE CHANGES"
          summary={
            <>
              <code className="text-foreground bg-surface px-1 font-mono text-sm">llm.providers</code>{' '}
              是一个 JSON 字典，多个 OpenAI 兼容厂商并存。切默认 provider 只改一行。所有
              LLM 调用强约束 Pydantic JSON mode + 禁用 tool/function call，把&ldquo;幻觉&rdquo;
              压在结构化输出层而不是后处理。
            </>
          }
          visual={
            <DiffViewer
              before={LLM_CONFIG_BEFORE}
              after={LLM_CONFIG_AFTER}
              title="switch default llm provider"
              filename="app_config / llm.providers"
            />
          }
        />
        <FeatureBlock
          title="LOCAL-ONLY STATE: ONE DUCKDB FILE"
          summary={
            <>
              一条 <code className="text-foreground bg-surface px-1 font-mono text-sm">pipx install</code>{' '}
              跑完安装；无需 Docker、无需常驻服务进程。所有状态都落在{' '}
              <code className="text-foreground bg-surface px-1 font-mono text-sm">~/.deeptrade/deeptrade.db</code>{' '}
              单个 DuckDB 文件里——可备份、可迁移、可随手 SQL 查询。Secret 走 OS keyring，
              无 keyring 时回退到加密的 secret_store 表，不会明文落盘。
            </>
          }
        />
        <FeatureBlock
          title="COMPLETELY DECOUPLED PLUGIN BOUNDARY"
          summary={
            <>
              框架本体只持有审计表（
              <code className="text-foreground bg-surface px-1 font-mono text-sm">plugins / llm_calls / tushare_calls</code>
              ），业务表全部由插件通过 migrations 自带、按 plugin_id 命名空间隔离。
              新增策略 = 新插件包，零框架改动；CLI 命令未命中时自动透传到插件 dispatch，
              插件保留完全自治。
            </>
          }
        />

        <PluginsBlock {...PLUGINS_DATA} />

        <div className="text-foreground mt-section mb-4 font-bold">
          FREQUENTLY ASKED QUESTIONS
        </div>
        <FaqAccordion items={FAQS} />

        {/* 内联底部 —— 不再渲染 Navbar / Footer，落地页一切走 max-w-4xl 主容器内。 */}
        <div className="text-muted mt-20 text-center text-xs tracking-normal lowercase">
          deeptrade-quant © 2026 · mit license
        </div>
      </main>
    </>
  );
}
