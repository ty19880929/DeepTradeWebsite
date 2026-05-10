import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/seo';
import { source } from '@/lib/source';

/**
 * 全站 sitemap（详细设计 §9.2）。
 *
 * 来源：
 *   - 根：/
 *   - /plugins、/changelog 静态路由
 *   - /docs/** 全部经 source.generateParams() 自动汇总
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE.url}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE.url}/plugins`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE.url}/changelog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const docsRoutes: MetadataRoute.Sitemap = source.generateParams().map((p) => {
    const slug = p.slug ?? [];
    const path = slug.length === 0 ? '/docs' : `/docs/${slug.join('/')}`;
    return {
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });

  return [...staticRoutes, ...docsRoutes];
}
