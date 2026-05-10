import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

/**
 * 注册表 schema —— 与 DeepTradePluginOfficial/registry/index.json 一一对应。
 *
 * `.strict()` 让 Zod 在检测到未声明字段时直接抛错（schema 漂移立即发现，
 * 而不是无声漂移到生产）。
 */
const RegistryEntrySchema = z
  .object({
    name: z.string().min(1),
    type: z.enum(['strategy', 'channel']),
    description: z.string().min(1),
    repo: z.string().min(1),
    subdir: z.string().min(1),
    tag_prefix: z.string().min(1),
    min_framework_version: z.string().min(1),
  })
  .strict();

const RegistrySchema = z
  .object({
    schema_version: z.literal(1),
    plugins: z.record(z.string(), RegistryEntrySchema),
  })
  .strict();

export type Registry = z.infer<typeof RegistrySchema>;
export type RegistryEntry = z.infer<typeof RegistryEntrySchema>;

/**
 * 添加 id 字段（从 plugins 字典 key 提升到对象上）+ 可选的 GitHub 增强字段。
 * 卡片组件直接吃这个形态。
 */
export interface PluginRecord extends RegistryEntry {
  id: string;
  /** GitHub repo stars，构建期 fetch；失败时 undefined（卡片自动隐藏） */
  stars?: number;
  /** 最新 release tag，根据 tag_prefix 过滤；失败时 undefined */
  latestTag?: string;
}

const REGISTRY_URL =
  'https://raw.githubusercontent.com/ty19880929/DeepTradePluginOfficial/main/registry/index.json';

const FALLBACK_PATH = join(process.cwd(), 'content', 'plugins-fallback.json');

/**
 * 拉取并 Zod 严格校验注册表。失败兜底走仓内 fallback。
 *
 * 失败兜底：网络不可达 / GitHub raw 限流 / Zod 校验失败 → 退化到
 * `content/plugins-fallback.json`（每次成功构建后建议手动 sync 一次基线）。
 *
 * 注意：**Zod 校验失败不走 fallback**——schema 漂移必须让构建立刻挂掉，
 * 否则错误数据会无声地推到生产。
 */
export async function loadRegistry(): Promise<Registry> {
  let raw: unknown;
  let fromFallback = false;
  try {
    const res = await fetch(REGISTRY_URL, {
      // SSG 一次性拉取，构建后不回网；运行时也不会再 revalidate
      next: { revalidate: false },
    });
    if (!res.ok) throw new Error(`Registry fetch failed: HTTP ${res.status}`);
    raw = await res.json();
  } catch (err) {
    console.warn('[registry] live fetch failed, using fallback:', (err as Error).message);
    raw = JSON.parse(readFileSync(FALLBACK_PATH, 'utf8'));
    fromFallback = true;
  }

  const parsed = RegistrySchema.parse(raw); // 失败直接抛
  if (fromFallback) {
    console.warn(
      `[registry] using fallback snapshot (${Object.keys(parsed.plugins).length} plugins)`,
    );
  }
  return parsed;
}

/**
 * 把 plugins 字典摊平成数组并按 id 排序。
 */
export async function loadPluginRecords(): Promise<PluginRecord[]> {
  const registry = await loadRegistry();
  const records: PluginRecord[] = Object.entries(registry.plugins)
    .map(([id, entry]) => ({ id, ...entry }))
    .sort((a, b) => a.id.localeCompare(b.id));

  // GitHub stars / latestTag 增强：构建期可选 fetch；失败不阻塞。
  // 默认关闭，避免本地 dev 频繁打 GitHub API；CI 通过 GITHUB_TOKEN env 启用。
  if (process.env.GITHUB_TOKEN) {
    await Promise.all(records.map(enhanceWithGithub));
  }
  return records;
}

async function enhanceWithGithub(record: PluginRecord): Promise<void> {
  const [owner, ...rest] = record.repo.split('/');
  if (!owner || rest.length === 0) return;
  const repo = rest.join('/');
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  try {
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (repoRes.ok) {
      const repoJson = (await repoRes.json()) as { stargazers_count?: number };
      if (typeof repoJson.stargazers_count === 'number') {
        record.stars = repoJson.stargazers_count;
      }
    }
  } catch {
    /* 忽略 */
  }

  try {
    const releasesRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=30`,
      { headers },
    );
    if (releasesRes.ok) {
      const releases = (await releasesRes.json()) as { tag_name: string; draft: boolean }[];
      const tag = releases.find(
        (r) => !r.draft && r.tag_name.startsWith(record.tag_prefix),
      )?.tag_name;
      if (tag) record.latestTag = tag;
    }
  } catch {
    /* 忽略 */
  }
}
