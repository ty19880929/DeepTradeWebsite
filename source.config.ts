import { defineConfig, defineDocs } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

// 注：/changelog 不走 fumadocs MDX collection。
// CHANGELOG.md 是外部内容，常含 {...} 字面文本（JSX 表达式语法）会让 MDX
// 解析失败。改用 react-markdown 渲染纯 markdown，对任意 CHANGELOG 内容鲁棒。

/**
 * shiki code block 主题：固定走 github-light，因为：
 *   - /docs/* 走亮色作用域，原本就需要 light theme
 *   - 落地页 / /plugins 不渲染 MDX 代码块，不受影响
 *   - /changelog（M4）后续若有代码块，亮色 vs 暗色背景对比度也都能读
 */
export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      themes: {
        light: 'github-light',
        dark: 'github-light',
      },
    },
  },
});
