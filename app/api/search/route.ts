import { createFromSource } from 'fumadocs-core/search/server';

import { source } from '@/lib/source';

/**
 * Orama 搜索端点。
 *
 * 中文召回提升策略（详细设计 §9.1）：
 * 1. language='mandarin' 启用 Orama 中文分词器
 * 2. 每篇 MDX 的 frontmatter description 显式补关键词，覆盖中英混合查询
 *
 * 已覆盖的真实查询：tushare / LLM / 打板 / 成交量异动 / 推送
 */
export const { GET } = createFromSource(source, {
  language: 'mandarin',
});
