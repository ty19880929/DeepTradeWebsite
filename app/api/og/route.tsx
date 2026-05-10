import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const KIND_LABELS: Record<string, { en: string; cn: string }> = {
  default: { en: 'OFFICIAL', cn: 'DeepTrade' },
  docs: { en: 'DOCS', cn: '文档' },
  plugin: { en: 'PLUGINS', cn: '插件' },
  changelog: { en: 'CHANGELOG', cn: '更新日志' },
};

const SUPPORTED_KINDS = new Set(Object.keys(KIND_LABELS));

/**
 * 通过 Google Fonts CSS API 取 Noto Sans SC 700 的"按字符子集化"版本。
 * 把 title 里出现的字传进去，gstatic 只回包含这些字的 woff2，size 通常
 * < 30KB。Vercel Edge cache 自动按响应缓存。
 */
async function loadCjkFont(text: string): Promise<ArrayBuffer> {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap&text=${encodeURIComponent(text)}`,
    {
      headers: {
        // 不带 UA，gstatic 会回 .ttf；带主流浏览器 UA 则回 woff2（更小）
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0 Safari/537.36',
      },
    },
  );
  if (!cssRes.ok) throw new Error(`Google Fonts CSS fetch failed: ${cssRes.status}`);
  const css = await cssRes.text();
  const match = css.match(/url\((https:\/\/[^)]+)\)\s+format\('?woff2'?\)/);
  if (!match) throw new Error('woff2 URL not found in Google Fonts CSS response');
  const fontRes = await fetch(match[1]!);
  if (!fontRes.ok) throw new Error(`woff2 fetch failed: ${fontRes.status}`);
  return fontRes.arrayBuffer();
}

export async function GET(request: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const rawTitle = searchParams.get('title')?.slice(0, 80) ?? 'DeepTrade';
    const rawKind = searchParams.get('kind') ?? 'default';
    const kind = SUPPORTED_KINDS.has(rawKind) ? rawKind : 'default';
    const label = KIND_LABELS[kind]!;

    // 子集只覆盖 title + 全部 kind 标签 + 站点必备字（避免后续不同 title 命中冷字时 fallback）
    const subsetText =
      rawTitle +
      Object.values(KIND_LABELS)
        .map((l) => l.cn)
        .join('') +
      'DeepTrade本地运行的A股选股CLI框架';
    const fontData = await loadCjkFont(subsetText);

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#000000',
            color: '#f8fafc',
            padding: '64px 72px',
            fontFamily: 'NotoSansSC, system-ui, -apple-system, sans-serif',
            position: 'relative',
          }}
        >
          {/* 顶部：DEEPTRADE wordmark */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#f8fafc',
            }}
          >
            DEEPTRADE
          </div>

          {/* 主标题 */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              fontSize: rawTitle.length > 28 ? 56 : 72,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              maxWidth: '1056px',
            }}
          >
            {rawTitle}
          </div>

          {/* 底部 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 24,
              color: '#94a3b8',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                border: '1px solid #1e293b',
                borderRadius: 9999,
                fontSize: 18,
                fontWeight: 500,
                letterSpacing: '0.18em',
                color: '#e2e8f0',
              }}
            >
              <span style={{ display: 'flex' }}>{label.en}</span>
              <span style={{ display: 'flex', color: '#475569' }}>·</span>
              <span style={{ display: 'flex', color: '#94a3b8' }}>{label.cn}</span>
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'monospace',
                fontSize: 22,
                color: '#64748b',
                letterSpacing: '0.04em',
              }}
            >
              deeptrade.tiey.ai
            </div>
          </div>

          {/* 右上角微弱网格装饰 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 360,
              height: 360,
              backgroundImage:
                'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
              maskImage:
                'radial-gradient(circle at top right, black 0%, transparent 70%)',
              WebkitMaskImage:
                'radial-gradient(circle at top right, black 0%, transparent 70%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'NotoSansSC',
            data: fontData,
            weight: 700,
            style: 'normal',
          },
        ],
      },
    );
  } catch (err) {
    // 兜底：字体拉取失败也要给 social crawler 一张图，不能 500
    console.error('[og] render failed, falling back:', err);
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            color: '#f8fafc',
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: '0.18em',
          }}
        >
          DEEPTRADE
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }
}
