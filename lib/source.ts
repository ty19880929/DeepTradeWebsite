import { loader } from 'fumadocs-core/source';

import { docs } from '@/.source/server';

/**
 * Fumadocs 文档树根。所有 docs 路由都消费这个 source 实例。
 *
 * 中文导航条目说明（详见 website_detailed_design.md §5.3）：
 * 通过 content/docs/**\/meta.json 控制顺序与分组分隔符（"---快速上手---" 之类）。
 */
export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});
