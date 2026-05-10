import type { MetadataRoute } from 'next';

import { SITE } from '@/lib/seo';

/**
 * /robots.txt（详细设计 §9.2）。
 * 全部允许；指向 sitemap。如果将来要屏蔽 /api/ 之类，单独 disallow 即可。
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
