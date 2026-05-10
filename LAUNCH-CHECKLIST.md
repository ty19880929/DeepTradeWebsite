# DeepTradeWebsite v1 上线 Checklist

> 仓内技术工作（M1-M5 全部）已落地。这份 checklist 列出**只能由用户本人完成**的最终验收项。

## 1. Vercel 配置

- [ ] **Production 域名绑定** `deeptrade.tiey.ai`（Vercel → Project → Settings → Domains）— 当前已能解析到 Preview，确认它是 Production 主域
- [ ] **Deploy Hook**（驱动 cron 同步）：
  - Vercel → Project → Settings → Git → Deploy Hooks → 创建 hook（branch=`main`，name=`registry-sync`）
  - 复制 hook URL
  - GitHub repo `DeepTradeWebsite` → Settings → Secrets and variables → Actions → New secret `VERCEL_DEPLOY_HOOK_URL`
  - GitHub Actions tab → "Registry Sync" workflow → "Run workflow" 一次手动验证
- [ ] **`GITHUB_TOKEN` 环境变量（可选）**：Vercel → Project → Settings → Environment Variables → 加 `GITHUB_TOKEN`（任意 PAT，repo 范围只读即可）。配后 `/plugins` 卡片会显示 stars 数与最新 release tag

## 2. 性能（Lighthouse）— 设计文档 §11.1 硬指标

部署的 Production URL 上跑（不要在 dev / Preview 上跑）：

| 页面 | LCP | CLS | TBT | Performance | a11y |
|---|---|---|---|---|---|
| `/`（落地页） | < 2.0s | < 0.05 | < 200ms | ≥ 95 | ≥ 95 |
| `/docs/user/install` | < 2.0s | < 0.05 | < 200ms | ≥ 95 | ≥ 95 |
| `/plugins` | < 2.0s | < 0.05 | < 200ms | ≥ 95 | ≥ 95 |

跑法：

```bash
# Chrome DevTools → Lighthouse tab → Mobile + Performance + Accessibility → Analyze
# 或命令行：
npx lighthouse https://deeptrade.tiey.ai/ --view --preset=desktop
npx lighthouse https://deeptrade.tiey.ai/ --view --form-factor=mobile
```

不达标时：

- LCP 高 → 看是不是字体子集化没生效（Network panel 看 woff2 大小）
- CLS 非零 → 看 image 是否设了显式宽高
- TBT 高 → bundle-analyzer 看落地页 client JS 是否超 90KB（Hero 之外只有 Navbar / FaqAccordion / TerminalDemo / CopyableCommand 是 client）

## 3. 跨浏览器烟测

至少试 5 个组合，每个跑落地页 + 一篇 doc + /plugins：

- [ ] Chrome 桌面（Mac/Windows）
- [ ] Safari 桌面（Mac）
- [ ] Firefox 桌面
- [ ] iOS Safari（iPhone）
- [ ] Android Chrome（任意安卓）

重点关注：

- 字体加载（Inter / JetBrains Mono / 中文系统 fallback）
- `CopyableCommand` 复制按钮在每个浏览器都能复制
- `/docs` 亮色 + `/`/`/plugins` 暗色 切换无闪烁
- 移动端 docs 侧栏汉堡菜单可开关

## 4. 可访问性（axe DevTools）

```text
Chrome 安装 axe DevTools 插件 → 在每页面跑一次 → 0 critical / 0 serious
```

至少 4 个代表页：`/`、`/docs`、`/docs/user/install`、`/plugins`。

允许的 minor / moderate：跨语言对比度边缘 case 可放宽（已设主文 ≥ 7:1，二级文 ≥ 4.5:1）。

## 5. 社媒 OG 图分享（设计文档 §9.3）

**v1 启用了动态 OG `/api/og`**，每页都会生成定制图。验证：

- [ ] 把 `https://deeptrade.tiey.ai/` 贴进 [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] 贴进飞书私聊（自检卡片预览）
- [ ] 贴进微信单聊（看缩略图，受微信缓存影响可能延迟 24h）
- [ ] 贴进 Slack（DM 自己）
- [ ] 几个文档页 `/docs/user/install` / `/plugins` 也分别试一次，确认动态 title 正确

每张图应该看到：

- 黑色背景
- 顶部 `DEEPTRADE` wordmark
- 中间是 page title（中英文混排都能正确渲染）
- 底部 kind 徽章（`OFFICIAL` / `DOCS` / `PLUGINS` / `CHANGELOG`）+ `deeptrade.tiey.ai`

如果 OG 图始终显示 fallback（只有 DEEPTRADE 大字，没标题）：说明字体拉取失败，看 Vercel function logs 找 `[og] render failed` 行。

## 6. SEO 基础

- [ ] `https://deeptrade.tiey.ai/sitemap.xml` 200，列出 / + /plugins + /changelog + 所有 /docs/* 路径
- [ ] `https://deeptrade.tiey.ai/robots.txt` 200，含 `Sitemap: https://deeptrade.tiey.ai/sitemap.xml`
- [ ] [Google Search Console](https://search.google.com/search-console) 提交 sitemap（抓取频率会上来）
- [ ] 落地页 view-source 看到 `application/ld+json` 的 `SoftwareApplication`
- [ ] 任一 docs 页面 view-source 看到 `application/ld+json` 的 `TechArticle`

## 7. 主仓互链（跨仓 PR）

- [ ] [`ty19880929/DeepTrade`](https://github.com/ty19880929/DeepTrade) README 顶部加一行 `📖 在线文档：[deeptrade.tiey.ai](https://deeptrade.tiey.ai)`（独立 PR）
- [ ] [`ty19880929/DeepTradePluginOfficial`](https://github.com/ty19880929/DeepTradePluginOfficial) README 同样加一行

## 8. 回滚演练

- [ ] Vercel → Deployments → 当前 Production 之前任意一个 → ⋯ → "Promote to Production"，确认 30s 内域名指过去
- [ ] 再 Promote 回最新版；演练记录可留 commit 描述

## 9. 上线日操作

正式切线上时：

1. 确认上述 1-8 全勾
2. 主仓 PR 合并（README 加文档站链接）
3. （可选）发 changelog 通告
4. 备份当前 Production deployment（在 Vercel 上点 "Pin"，方便快速 rollback）

## 10. 后续运营储备（不在 v1 范围）

迭代计划 §8 已列：

- 浅色主题切换（用户量上来后做；当前 docs 强制亮色，其他页强制暗色，已基本满足）
- 文档 SemVer 版本切换（框架 ≥ v0.5 引入）
- 插件详情页 `/plugins/<id>`（拉每个插件 README 内嵌）
- 英文双语
- 博客 `/blog`
- Webhook 替代 cron 触发 registry rebuild（需要 `DeepTradePluginOfficial` 配 `repository_dispatch`）
- Umami 自托管 analytics（隐私合规需求出现后）
