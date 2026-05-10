import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { RootProvider } from 'fumadocs-ui/provider/next';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://deeptrade.tiey.ai'),
  title: {
    default: 'DeepTrade — 本地运行的 A 股选股 CLI 框架',
    template: '%s · DeepTrade',
  },
  description:
    'tushare 行情 + 兼容 OpenAI LLM + DuckDB 单机仓库 + 纯透传式插件机制。你的数据，你的策略，全在本地。',
  applicationName: 'DeepTrade',
  authors: [{ name: 'DeepTrade Contributors' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'DeepTrade',
    title: 'DeepTrade — 本地运行的 A 股选股 CLI 框架',
    description:
      'tushare 行情 + 兼容 OpenAI LLM + DuckDB 单机仓库 + 纯透传式插件机制。你的数据，你的策略，全在本地。',
    images: ['/og-default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeepTrade — 本地运行的 A 股选股 CLI 框架',
    description: 'tushare + OpenAI 兼容 LLM + DuckDB 的本地化选股工具',
    images: ['/og-default.png'],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      data-theme="dark"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <RootProvider theme={{ enabled: false, defaultTheme: 'dark', forcedTheme: 'dark' }}>
          {children}
        </RootProvider>
        <Analytics />
      </body>
    </html>
  );
}
