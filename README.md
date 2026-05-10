# DeepTradeWebsite

DeepTrade 官方网站 — 落地页 + 中文文档 + 官方插件墙。

- 在线访问：`https://deeptrade.tiey.ai`（M5 milestone 后绑定）
- 框架仓库：[ty19880929/DeepTrade](https://github.com/ty19880929/DeepTrade)
- 插件注册表：[ty19880929/DeepTradePluginOfficial](https://github.com/ty19880929/DeepTradePluginOfficial)

## 技术栈

| 层 | 选型 |
|---|---|
| 运行时 | Node.js ≥ 20.11 LTS |
| 包管理 | pnpm ≥ 10 |
| 框架 | Next.js 16 App Router + RSC |
| 文档 | Fumadocs UI + Fumadocs MDX（内置 Orama 中文搜索） |
| 样式 | Tailwind CSS v4（CSS-first `@theme`） |
| 字体 | `next/font/google` 自托管 Inter + JetBrains Mono |
| 部署 | Vercel（Production = main，Preview = PR） |

## 本地开发

```bash
pnpm install
pnpm dev          # 启动开发服务器（http://localhost:3000）
```

其他常用脚本：

```bash
pnpm build        # 生产构建（webpack）
pnpm start        # 起 production 服务器
pnpm lint         # ESLint
pnpm typecheck    # tsc --noEmit
pnpm format       # Prettier 写盘
```

## 路由地图

| 路径 | 说明 | Milestone |
|---|---|---|
| `/` | 落地页 | M2 |
| `/docs` | 文档总入口 | M1 占位 → M3/M4 |
| `/docs/user/*` | 用户手册（11 篇） | M3 |
| `/docs/developer/*` | 开发者手册（9 篇） | M4 |
| `/plugins` | 官方插件墙 | M4 |
| `/changelog` | 更新日志（同步主仓 CHANGELOG） | M4 |

## 设计文档

详见 `E:\personal\docs\DeepTrade\` 下的：

- `website_detailed_design.md` — 详细设计（"宪法"）
- `website_iteration_plan.md` — 迭代计划（M1-M5 任务清单）
- `openspec_design_tokens.md` — 视觉规范

## 部署（Vercel）

仓库初次接入步骤（一次性）：

1. 在 [Vercel](https://vercel.com/new) Import `ty19880929/DeepTradeWebsite`
2. Framework Preset 自动识别为 Next.js
3. Install Command 改为 `pnpm install --frozen-lockfile`
4. Production Branch 设为 `main`，Preview Branch = PR
5. （可选）Project Settings → Environment Variables 添加 `GITHUB_TOKEN` 用于提高 GitHub API 限速
6. M5 milestone 时再绑定自定义域名 `deeptrade.tiey.ai`

## 许可

[MIT License](./LICENSE)
