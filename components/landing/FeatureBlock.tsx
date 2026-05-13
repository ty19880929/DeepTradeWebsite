import type { ReactNode } from 'react';

interface FeatureBlockProps {
  /** 锚点 id（落地页内导航备用） */
  id?: string;
  /** 顶部分组标签，仅显式传入时渲染 —— 多个 FeatureBlock 共享同一分组时，外
   *  部页面写一行 "FEATURES" 即可，单个 block 不再重复。 */
  eyebrow?: string;
  /** 子标题（结构性英文 caps）；显示在容器顶部强调行 */
  title: string;
  /** 正文（中文 + 可选 <code>），保留 mixed case，外层 main 的 uppercase 由
   *  本组件 lowercase 类反转 */
  summary: ReactNode;
  /** 可选视觉（DiffViewer / TerminalDemo 等）。无 visual 时整个区块为纯文字 */
  visual?: ReactNode;
}

/**
 * R1 取代 FeatureSplit：垂直堆叠 bordered box，title + summary + 可选 visual
 * 三层；不再左右分栏，避免 visual 缺位时空白拉胯。
 *
 * 设计意图：信息密度优先 + Tabular 视觉 —— 整页都是表格化区块，FeatureBlock
 * 是其中"段落型"区块。
 */
export function FeatureBlock({ id, eyebrow, title, summary, visual }: FeatureBlockProps) {
  return (
    <section id={id} className="mt-section">
      {eyebrow ? <div className="text-foreground mb-4 font-bold">{eyebrow}</div> : null}
      <div className="border-border border p-6 md:p-8">
        <div className="text-link mb-6 text-sm tracking-normal lowercase">
          <strong className="text-foreground mb-2 block text-xs tracking-widest uppercase">
            {title}
          </strong>
          {summary}
        </div>
        {visual}
      </div>
    </section>
  );
}
