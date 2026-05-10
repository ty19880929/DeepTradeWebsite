import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

/**
 * Fumadocs MDX 全局组件覆盖入口。
 *
 * M3 时会注入 CopyableCommand 等自研组件（详见详细设计 §6.3）；
 * 当前 milestone 仅返回 Fumadocs 默认组件。
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
  };
}
