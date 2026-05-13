'use client';

import type { ReactNode } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronUp } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface FaqItem {
  id: string;
  q: string;
  a: ReactNode;
}

interface FaqAccordionProps {
  items: FaqItem[];
  className?: string;
}

/**
 * R1 重写：移除卡片底色 / 圆角 / 大 padding 与单独 max-w 容器，改为表格化
 * 行式列表 —— 外层 1px 边框 + 行间 divide-y。视觉上是 Tabular bordered table
 * row，但语义保留 Radix Accordion 的 single-open 行为与键盘交互。
 *
 * 箭头：默认 ChevronUp（指向上方，提示"展开往下走"）；open 时 rotate-180 翻
 * 转成 ChevronDown，逻辑沿用 Radix data-[state] selector + 200ms 过渡。
 */
export function FaqAccordion({ items, className }: FaqAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className={cn('border-border divide-border divide-y border', className)}
    >
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id}>
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                'group text-muted hover:text-foreground focus-visible:text-foreground flex w-full items-center justify-between px-4 py-4 text-left text-xs tracking-widest uppercase transition-colors md:px-6',
                'hover:bg-white/[0.02]',
              )}
            >
              <span>{item.q}</span>
              <ChevronUp
                aria-hidden="true"
                className="text-muted h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className={cn(
              'overflow-hidden',
              'data-[state=closed]:animate-fd-accordion-up data-[state=open]:animate-fd-accordion-down',
            )}
          >
            <div className="text-link px-4 pb-4 text-sm leading-7 tracking-normal lowercase md:px-6">
              {item.a}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
