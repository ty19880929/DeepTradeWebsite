'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { GithubIcon } from '@/components/shared/GithubIcon';

const NAV_LINKS = [
  { href: '/docs', label: '文档' },
  { href: '/plugins', label: '插件' },
  { href: '/changelog', label: '更新日志' },
];

const SCROLL_THRESHOLD = 16;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 h-16 transition-colors duration-200',
        scrolled
          ? 'bg-background/70 border-border-soft border-b backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          aria-label="DeepTrade 首页"
          className="text-foreground hover:opacity-80 focus-visible:opacity-80"
        >
          <BrandLogo className="h-6" />
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/ty19880929/DeepTrade"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="DeepTrade GitHub 仓库"
            className="text-link hover:text-foreground inline-flex h-8 w-8 items-center justify-center transition-colors"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
