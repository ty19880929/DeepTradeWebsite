'use client';

import type { ReactNode } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

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

export function FaqAccordion({ items, className }: FaqAccordionProps) {
  return (
    <Accordion.Root
      type="single"
      collapsible
      className={cn('border-border-soft divide-border-soft mx-auto max-w-3xl divide-y border-y', className)}
    >
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id}>
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                'group hover:text-foreground focus-visible:text-foreground flex w-full items-center justify-between gap-6 py-6 text-left',
                'text-foreground/90 text-base font-medium',
              )}
            >
              <span>{item.q}</span>
              <ChevronDown
                aria-hidden="true"
                className="text-muted h-5 w-5 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180"
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content
            className={cn(
              'overflow-hidden text-sm leading-7',
              'data-[state=closed]:animate-fd-accordion-up data-[state=open]:animate-fd-accordion-down',
            )}
          >
            <div className="text-muted pb-6 pr-12">{item.a}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
