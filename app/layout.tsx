import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, VT323 } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { RootProvider } from 'fumadocs-ui/provider/next';

import { SITE, buildMetadata } from '@/lib/seo';

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

// VT323 pixel font 仅用于落地页 logo —— next/font 自动 subset，运行时 ~10KB woff2。
const vt323 = VT323({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-vt323',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  applicationName: SITE.name,
  authors: [{ name: 'DeepTrade Contributors' }],
  title: {
    default: 'DeepTrade — 本地运行的 A 股选股 CLI 框架',
    template: '%s · DeepTrade',
  },
  // openGraph / twitter / canonical / robots 全部由 lib/seo.ts 工厂统一生成；
  // 这里只声明根级落地页的"默认"那份，子页通过 buildMetadata 覆盖。
  ...buildMetadata({ ogKind: 'default' }),
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${vt323.variable}`}
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
