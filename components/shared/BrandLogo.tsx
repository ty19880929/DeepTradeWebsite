import { cn } from '@/lib/utils';

/**
 * DeepTrade 像素字标。算法渲染 9 个字母 × 4 列 × 5 行 × 16 SVG 单位 cell。
 * fill 走 currentColor，颜色由父级 className（如 text-foreground）控制。
 *
 * 详见详细设计 §6.4。源 SVG 在 public/logos/deeptrade.svg（设计稿副本）。
 */
const LETTERS: Record<string, string[]> = {
  D: ['###.', '#..#', '#..#', '#..#', '###.'],
  E: ['####', '#...', '###.', '#...', '####'],
  P: ['###.', '#..#', '####', '#...', '#...'],
  T: ['####', '.#..', '.#..', '.#..', '.#..'],
  R: ['###.', '#..#', '###.', '#.#.', '#..#'],
  A: ['.##.', '#..#', '####', '#..#', '#..#'],
};

const WORD = 'DEEPTRADE';
const CELL = 16; // SVG units per pixel cell
const LETTER_W = 4 * CELL; // 64
const LETTER_H = 5 * CELL; // 80
const GAP = CELL; // 16
const VB_W = WORD.length * LETTER_W + (WORD.length - 1) * GAP + GAP; // 720
const VB_H = LETTER_H; // 80

interface BrandLogoProps {
  /** 控制高度，e.g. `h-6` / `h-8`。宽度由 viewBox 自动维持比例。 */
  className?: string;
  ariaLabel?: string;
}

export function BrandLogo({ className, ariaLabel = 'DeepTrade' }: BrandLogoProps) {
  const cells: { x: number; y: number }[] = [];

  for (let i = 0; i < WORD.length; i++) {
    const letter = WORD[i]!;
    const pattern = LETTERS[letter];
    if (!pattern) continue;
    const xOffset = i * (LETTER_W + GAP);
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 4; col++) {
        if (pattern[row]![col] === '#') {
          cells.push({ x: xOffset + col * CELL, y: row * CELL });
        }
      }
    }
  }

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className={cn('block w-auto', className)}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      {cells.map((cell, idx) => (
        <rect key={idx} x={cell.x} y={cell.y} width={CELL} height={CELL} />
      ))}
    </svg>
  );
}
