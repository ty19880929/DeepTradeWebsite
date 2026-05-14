'use client';

interface TerminalSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TerminalSearch({ value, onChange, placeholder = 'type to filter plugins...' }: TerminalSearchProps) {
  return (
    <div className="border-border bg-surface/30 flex h-12 items-center border font-mono text-sm lowercase tracking-normal">
      <div className="bg-background text-muted flex h-full shrink-0 items-center border-r border-border px-4 select-none uppercase tracking-widest text-[10px]">
        $ SEARCH
      </div>
      <div className="flex flex-1 items-center px-4">
        <span className="text-accent mr-2">&gt;</span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="text-foreground placeholder:text-muted/50 h-full min-w-0 flex-1 bg-transparent outline-hidden"
          autoFocus
        />
        <span className="bg-foreground/50 ml-1 h-4 w-2 animate-pulse" />
      </div>
    </div>
  );
}
