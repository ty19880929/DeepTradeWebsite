import type { Metadata } from 'next';

/**
 * 全站 SEO 元数据工厂。
 *
 * 设计目标（详细设计 §9.2）：
 *   - 一处定义站点 base、复用到所有页面，避免 og:title / twitter:title 漂移
 *   - 每页只需告诉 buildMetadata 三件事：title / description / path
 *   - OG 图自动指向 /api/og?title=...&kind=...，无需手维护静态 PNG
 */

export const SITE = {
  name: 'DeepTrade',
  url: 'https://deeptrade.tiey.ai',
  description:
    'tushare 行情 + 兼容 OpenAI LLM + DuckDB 单机仓库 + 纯透传式插件机制。你的数据，你的策略，全在本地。',
  locale: 'zh_CN',
} as const;

export type OgKind = 'default' | 'docs' | 'plugin' | 'changelog';

interface BuildMetadataInput {
  /** 页面标题（不含站名后缀，会自动 ` · DeepTrade` 由根 layout template 处理） */
  title?: string;
  /** 页面描述。省略时用站点默认。 */
  description?: string;
  /** 页面路径，开头必须是 `/`。例：'/docs/user/install' */
  path?: string;
  /** OG 图变体（影响 /api/og 的视觉模板） */
  ogKind?: OgKind;
  /** 自定义 OG 图标题（省略时复用 title） */
  ogTitle?: string;
}

/**
 * 用法：
 * ```tsx
 * export const metadata: Metadata = buildMetadata({
 *   title: '安装框架',
 *   description: '...',
 *   path: '/docs/user/install',
 *   ogKind: 'docs',
 * });
 * ```
 */
export function buildMetadata(input: BuildMetadataInput = {}): Metadata {
  const { title, description, path = '/', ogKind = 'default', ogTitle } = input;
  const url = `${SITE.url}${path}`;
  const desc = description ?? SITE.description;
  const ogImage = buildOgImageUrl({
    title: ogTitle ?? title ?? SITE.name,
    kind: ogKind,
  });

  return {
    title: title ?? SITE.name,
    description: desc,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: SITE.locale,
      siteName: SITE.name,
      title: title ?? SITE.name,
      description: desc,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title ?? SITE.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title ?? SITE.name,
      description: desc,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

interface OgImageInput {
  title: string;
  kind: OgKind;
}

export function buildOgImageUrl({ title, kind }: OgImageInput): string {
  const params = new URLSearchParams();
  params.set('title', title);
  params.set('kind', kind);
  return `${SITE.url}/api/og?${params.toString()}`;
}
