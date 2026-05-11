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
 * 通过 Google Fonts CSS API 按 ?text=... 子集化拉 Noto Sans SC 700。
 * 仅取 title 里出现的字 + 站点必备字，woff2 通常 < 30KB；Vercel Edge 自动缓存。
 *
 * 任一步失败直接 throw，外层调用方拿不到字体就退化到 Latin-only fallback。
 */
async function loadCjkFont(text: string): Promise<ArrayBuffer> {
  const cssRes = await fetch(
    `https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@700&display=swap&text=${encodeURIComponent(text)}`,
    {
      headers: {
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
  const { searchParams } = new URL(request.url);
  const rawTitle = (searchParams.get('title') ?? 'DeepTrade').slice(0, 80);
  const rawKind = searchParams.get('kind') ?? 'default';
  const kind = SUPPORTED_KINDS.has(rawKind) ? rawKind : 'default';
  const label = KIND_LABELS[kind]!;

  // 字体加载独立 try/catch；失败也要给 social crawler 出图，不能 500/0-byte
  let fontData: ArrayBuffer | null = null;
  try {
    const subset =
      rawTitle +
      Object.values(KIND_LABELS)
        .map((l) => l.cn)
        .join('') +
      'DeepTrade本地运行的A股选股CLI框架';
    fontData = await loadCjkFont(subset);
  } catch (err) {
    console.warn('[og] CJK font load failed, falling back to default:', err);
  }

  // Satori 硬要求：每个元素都得有显式 display，纯文本必须包在 element 里
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
          fontFamily: fontData ? 'NotoSansSC, sans-serif' : 'sans-serif',
        }}
      >
        {/* 顶部 wordmark */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            style={{
              display: 'flex',
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: '0.18em',
              color: '#f8fafc',
            }}
          >
            DEEPTRADE
          </span>
        </div>

        {/* 主标题 */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <span
            style={{
              display: 'flex',
              fontSize: rawTitle.length > 28 ? 56 : 72,
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              maxWidth: '1056px',
            }}
          >
            {rawTitle}
          </span>
        </div>

        {/* 底部 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
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
            <span style={{ display: 'flex', color: '#475569', margin: '0 12px' }}>·</span>
            <span style={{ display: 'flex', color: '#94a3b8' }}>{label.cn}</span>
          </div>
          <span
            style={{
              display: 'flex',
              fontFamily: 'monospace',
              fontSize: 22,
              color: '#64748b',
              letterSpacing: '0.04em',
            }}
          >
            deeptrade.tiey.ai
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fontData
        ? {
            fonts: [
              {
                name: 'NotoSansSC',
                data: fontData,
                weight: 700,
                style: 'normal',
              },
            ],
          }
        : {}),
    },
  );
}
