import { Callout } from 'fumadocs-ui/components/callout';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { CopyableCommand } from '@/components/landing/CopyableCommand';

/**
 * Fumadocs MDX 全局组件覆盖。
 *
 * 注入的内容（见详细设计 §6.3）：
 * - Tabs / Tab：多语言或多平台切换
 * - Steps / Step：分步教程
 * - Files / Folder / File：目录树可视化
 * - Callout：提示 / 警告框
 * - CopyableCommand：自研命令行复制组件，文档里直接 &lt;CopyableCommand command="..." /&gt;
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Tabs,
    Tab,
    Steps,
    Step,
    Files,
    Folder,
    File,
    Callout,
    CopyableCommand,
    ...components,
  };
}
