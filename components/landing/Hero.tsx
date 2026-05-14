import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

import { CopyableCommand } from '@/components/landing/CopyableCommand';

type Tone = 'green' | 'yellow';

interface HeroTag {
  text: string;
  tone: Tone;
}

interface HeroAction {
  label: string;
  kind: 'command' | 'link';
  value: string;
  tag?: HeroTag;
  forceNewTab?: boolean;
}

interface HeroProps {
  statement: string;
  statementEn?: string;
  pillars: [string, string, string, string];
  actions: HeroAction[];
}

const TONE_CLASS: Record<Tone, string> = {
  green: 'text-accent',
  yellow: 'text-accent-yellow',
};

function ActionRow({ action }: { action: HeroAction }) {
  const isExternal =
    action.kind === 'link' && /^https?:\/\//.test(action.value);
  const shouldOpenInNewTab = isExternal || action.forceNewTab;

  const label = (
    <div className="text-muted mb-2 w-48 md:mb-0">
      {action.label}
      {action.tag && (
        <span className={`ml-2 ${TONE_CLASS[action.tag.tone]}`}>
          {action.tag.text}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col justify-between p-4 transition-colors hover:bg-white/[0.02] md:flex-row md:items-center md:px-6">
      {label}
      {action.kind === 'command' ? (
        <CopyableCommand command={action.value} prefix="" inline />
      ) : (
        <Link
          href={action.value}
          {...(shouldOpenInNewTab
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
          className="text-link hover:text-foreground inline-flex items-center gap-3 font-mono text-sm tracking-normal lowercase transition-colors"
        >
          {action.value}
          <ArrowUpRight className="text-muted h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function Hero({ statement, statementEn, pillars, actions }: HeroProps) {
  return (
    <section className="border-border border">
      {/* Statement —— page H1，纵使外层 main 是 uppercase，statement 自身保留 */}
      <div className="border-border flex h-48 flex-col items-center justify-center gap-2 border-b px-6 text-center">
        <h1 className="text-foreground text-base font-medium tracking-[0.15em] md:text-lg">
          {statement}
        </h1>
        {statementEn && (
          <p className="text-muted text-xs tracking-widest">{statementEn}</p>
        )}
      </div>

      {/* 4 Pillars */}
      <div className="divide-border border-border text-muted grid grid-cols-2 divide-y border-b text-center md:grid-cols-4 md:divide-x md:divide-y-0">
        {pillars.map((pillar) => (
          <div
            key={pillar}
            className="hover:text-foreground cursor-default py-4 transition-colors"
          >
            {pillar}
          </div>
        ))}
      </div>

      {/* Action Rows */}
      <div className="divide-border divide-y">
        {actions.map((action) => (
          <ActionRow key={action.label} action={action} />
        ))}
      </div>
    </section>
  );
}
