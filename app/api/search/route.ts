import { createFromSource } from 'fumadocs-core/search/server';

import { source } from '@/lib/source';

/**
 * Orama 搜索端点。M3 会通过 frontmatter description 强化中文召回率。
 */
export const { GET } = createFromSource(source);
