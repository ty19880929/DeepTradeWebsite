import Link from 'next/link';

import { BrandLogo } from '@/components/shared/BrandLogo';

interface LinkItem {
  href: string;
  label: string;
  external?: boolean;
}

interface Column {
  title: string;
  links: LinkItem[];
}

const COLUMNS: Column[] = [
  {
    title: '文档',
    links: [
      { href: '/docs', label: '总入口' },
      { href: '/docs/user', label: '用户手册' },
      { href: '/docs/developer', label: '开发者手册' },
    ],
  },
  {
    title: '资源',
    links: [
      { href: '/plugins', label: '官方插件' },
      { href: '/changelog', label: '更新日志' },
      { href: '/sitemap.xml', label: 'Sitemap', external: true },
    ],
  },
  {
    title: '仓库',
    links: [
      { href: 'https://github.com/ty19880929/DeepTrade', label: 'DeepTrade', external: true },
      {
        href: 'https://github.com/ty19880929/DeepTradePluginOfficial',
        label: '官方插件注册表',
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-border-soft mt-32 border-t">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:gap-16">
        <div className="space-y-4 lg:col-span-2 lg:pr-8">
          <Link href="/" aria-label="DeepTrade 首页" className="text-foreground inline-block">
            <BrandLogo className="h-8" />
          </Link>
          <p className="text-muted text-sm leading-6">
            本地运行的 A 股选股 CLI 框架。
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="space-y-4">
            <h3 className="text-foreground text-sm font-semibold tracking-wide uppercase">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((link) =>
                link.external ? (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-link hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-link hover:text-foreground text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-border-soft border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs sm:flex-row sm:items-center">
          <p className="text-muted-2">
            MIT License · &copy; 2025-2026 DeepTrade Contributors
          </p>
          <p className="text-muted-2 font-mono">
            Built with Next.js · Fumadocs · deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
