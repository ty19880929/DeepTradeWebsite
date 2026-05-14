# DeepTradeWebsite

**DeepTrade 官方网站 — 落地页 + 中文文档 + 官方插件墙。**

[DeepTrade](https://github.com/ty19880929/DeepTrade) 是一个**本地运行的 A 股选股 CLI 框架**。融合 tushare 行情、兼容 OpenAI 的多种 LLM (DeepSeek, Qwen, Kimi 等)、DuckDB 单机数据仓库与纯透传式插件机制。

- 🌐 在线访问：[deeptrade.tiey.ai](https://deeptrade.tiey.ai)
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
| **UI 库** | React 19 + Radix UI |
| **文档引擎** | Fumadocs (UI + MDX + Orama 中文搜索) |
| **样式** | Tailwind CSS v4 (CSS-first `@theme`) |
| **部署托管** | Vercel (Production 自动化流水线) |

## 💻 本地开发指南

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器（http://localhost:3000）
pnpm dev
```

**常用脚本：**

- `pnpm build`: 执行 SSG 静态构建
- `pnpm lint`: ESLint 静态检查
- `pnpm typecheck`: TypeScript 类型检查
- `pnpm format`: 代码风格格式化
- `pnpm sync:changelog`: 手动触发主仓更新日志同步
- `pnpm verify:content`: 校验本地文档与 Fallback 数据一致性

## 🗺️ 路由地图

| 页面路径 | 模块说明 | 状态 |
|---|---|---|
| `/` | **落地页** (产品特性、生态展示) | 已上线 |
| `/docs` | 文档总览与入口 | 持续更新 |
| `/docs/user/*` | **用户手册** (使用、配置教程) | 已上线 |
| `/docs/developer/*` | **开发者手册** (架构、插件开发) | 已上线 |
| `/plugins` | **官方插件墙** (自动同步插件注册表) | 已上线 |
| `/changelog` | **更新日志** (自动同步主仓发布记录) | 已上线 |

## 🔄 自动化同步机制

为了保持官网内容与主项目同步，项目内置了多项自动化任务：

1. **更新日志同步** (`scripts/sync-changelog.mjs`): 构建期自动抓取 `DeepTrade` 主仓的 `CHANGELOG.md`。如果网络异常，则退化到本地 `content/changelog.md` 基线。
2. **插件注册表同步** (`lib/registry.ts`): 实时/构建期抓取 `DeepTradePluginOfficial` 的插件列表，并通过 Zod 进行严格模式校验。
3. **GitHub 数据增强**: 如果配置了 `GITHUB_TOKEN`，插件墙会自动显示对应仓库的 Stars 数量和最新 Release 标签。

## 🏗️ 架构与设计文档

项目相关设计文档请参考内部路径 `E:\personal\docs\DeepTrade\`：
- `website_detailed_design.md` — 详细设计方案
- `website_iteration_plan.md` — 迭代路线图与任务拆解 (M1-M5)
- `openspec_design_tokens.md` — 视觉设计规范（Design Tokens）

## 📄 许可协议

本项目采用 [MIT License](./LICENSE) 开源。