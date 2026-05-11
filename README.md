# DeepTradeWebsite

**DeepTrade 官方网站 — 落地页 + 中文文档 + 官方插件墙。**

[DeepTrade](https://github.com/ty19880929/DeepTrade) 是一个**本地运行的 A 股选股 CLI 框架**。融合 tushare 行情、兼容 OpenAI 的多种 LLM (DeepSeek, Qwen, Kimi 等)、DuckDB 单机数据仓库与纯透传式插件机制。

- 🌐 在线访问：`https://deeptrade.tiey.ai`（部署中）
- 📦 框架仓库：[ty19880929/DeepTrade](https://github.com/ty19880929/DeepTrade)
- 🧩 插件注册表：[ty19880929/DeepTradePluginOfficial](https://github.com/ty19880929/DeepTradePluginOfficial)

---

## 🚀 核心特性

- **无缝集成大模型与基建**：原生支持多个主流大模型（DeepSeek、Qwen、Kimi等），兼容 OpenAI 协议。内置 DuckDB 单文件数据管理与 Tushare 行情接入，Python 原生驱动。
- **极致轻量的本地体验**：只需一条 `pipx install deeptrade-quant` 即可安装运行。无须容器，没有常驻进程。所有状态均落在本地文件 `~/.deeptrade/deeptrade.db`，可无缝备份、迁移与直接 SQL 查询，敏感数据加密落盘。
- **完全解耦的插件生态**：框架极致精简，仅维持运行审计表。业务能力完全交由插件自治，策略的注册与调用实现物理隔离。
- **原生多模型 LLM 矩阵**：简单修改 JSON 即可秒级切换大模型引擎，并强制所有 LLM 调用结构化输出（JSON Mode + Pydantic），在底层过滤大模型幻觉。

## 🛠️ 技术栈 (Website)

本项目为 DeepTrade 官网代码仓库，采用现代化前端栈构建：

| 层级 | 技术选型 |
|---|---|
| **运行时** | Node.js ≥ 20.11 LTS |
| **包管理** | pnpm ≥ 10 |
| **框架** | Next.js 16 (App Router + RSC) |
| **文档** | Fumadocs UI + Fumadocs MDX（内置 Orama 中文搜索） |
| **样式** | Tailwind CSS v4（CSS-first `@theme`） |
| **字体** | `next/font/google` 优化的 Inter + JetBrains Mono 自托管字体 |
| **部署托管** | Vercel（Production = main 自动部署，Preview = PR） |

## 💻 本地开发指南

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器（http://localhost:3000）
pnpm dev
```

**其他常用脚本：**

```bash
pnpm build        # 生产构建（Next.js 打包）
pnpm start        # 启动生产服务器
pnpm lint         # 执行 ESLint 静态检查
pnpm typecheck    # 执行 TypeScript 类型检查 (tsc --noEmit)
pnpm format       # 执行 Prettier 格式化写入
```

## 🗺️ 路由地图

| 页面路径 | 模块说明 | 状态/Milestone |
|---|---|---|
| `/` | **落地页** (产品特性、生态展示) | 已完成 (M2) |
| `/docs` | 文档总览与入口 | 持续迭代 (M3/M4) |
| `/docs/user/*` | 用户手册 (使用、配置教程，约11篇) | 持续迭代 (M3) |
| `/docs/developer/*` | 开发者手册 (架构、插件开发，约9篇) | 持续迭代 (M4) |
| `/plugins` | **官方插件墙** (可用策略/插件展示) | 规划中 (M4) |
| `/changelog` | **更新日志** (同步主仓发布记录) | 规划中 (M4) |

## 🏗️ 架构与设计文档

项目相关设计文档请参考内部路径 `E:\personal\docs\DeepTrade\`：
- `website_detailed_design.md` — 详细设计方案
- `website_iteration_plan.md` — 迭代路线图与任务拆解 (M1-M5)
- `openspec_design_tokens.md` — 视觉设计规范（Design Tokens）

## ☁️ 部署说明 (Vercel)

本项目使用 Vercel 进行自动化部署：

1. 在 Vercel 后台 Import 仓库 `ty19880929/DeepTradeWebsite`。
2. Framework Preset 保持默认 `Next.js`。
3. **Install Command 修改为 `pnpm install --frozen-lockfile`**。
4. 在 Project Settings → Environment Variables 中建议配置 `GITHUB_TOKEN` 用于缓解 GitHub API 限速。
5. 自定义域名 `deeptrade.tiey.ai` 已在规划中。

## 📄 许可协议

本项目采用 [MIT License](./LICENSE) 开源。