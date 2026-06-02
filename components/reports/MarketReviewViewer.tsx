"use client";

import React from 'react';
import { ChevronDown, AlertTriangle, Info, ShieldAlert, BarChart3, Clock, ArrowRight } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

export function MarketReviewViewer({ data }: { data: any }) {
  if (!data || !data.meta) return <div>Invalid Data</div>;
  const { meta, headline, overview, sectors, sentiment, capital, leaders, style, riskOutlook, metrics } = data;

  const statusColors: Record<string, string> = {
    success: 'text-emerald-600',
    partial_failed: 'text-amber-600',
    failed: 'text-rose-600',
    cancelled: 'text-slate-500',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8 text-slate-900">
      {/* Header */}
      <header>
        {meta.status === 'partial_failed' && meta.failedSections && (
          <div className="mb-4 bg-amber-50 border border-amber-400 rounded-lg p-3 text-amber-800 text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>部分模块失败: </span>
            <div className="flex gap-2 flex-wrap">
              {meta.failedSections.map((s: string) => (
                <span key={s} className="bg-amber-100 px-2 py-0.5 rounded text-xs">{s}</span>
              ))}
            </div>
          </div>
        )}
        {(meta.status === 'failed' || meta.status === 'cancelled') && (
          <div className={`mb-4 border rounded-lg p-3 text-sm flex items-center gap-2 ${meta.status === 'failed' ? 'bg-rose-50 border-rose-400 text-rose-800' : 'bg-slate-50 border-slate-400 text-slate-800'}`}>
            <AlertTriangle size={16} />
            <span>执行状态: {meta.status}</span>
            {meta.error && <span className="ml-2 text-xs">{meta.error}</span>}
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{meta.title || "市场复盘"}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Run ID: <span className="font-mono">{meta.runId}</span> •
          Status: <span className={`font-medium ${statusColors[meta.status] || 'text-slate-500'}`}>{meta.status}</span> •
          {meta.window?.mode === 'day' ? `T = ${meta.window.anchor}` : `Window = ${meta.window?.start} → ${meta.window?.end}`}
        </p>
      </header>

      {/* Headline Card */}
      {headline && (
        <section className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mb-2">
              {headline.marketTone}
            </span>
            <p className="text-lg font-medium text-slate-800">{headline.oneLiner}</p>
            {headline.themeTags && headline.themeTags.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {headline.themeTags.map((tag: string) => (
                  <span key={tag} className="text-xs px-2 py-1 bg-white/60 border border-indigo-100 rounded text-indigo-700">#{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {headline.coreMetrics?.map((m: any, i: number) => (
              <div key={i} className="bg-white/80 rounded-lg p-3 border border-white/40 shadow-sm">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">{m.label}</div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-lg font-bold text-slate-900">{m.value ?? '--'}</span>
                  {m.unit !== 'none' && <span className="text-xs text-slate-500">{m.unit}</span>}
                </div>
                {m.delta != null && (
                  <div className={`text-xs mt-1 font-medium ${m.delta > 0 ? 'text-rose-600' : m.delta < 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {m.delta > 0 ? '+' : ''}{m.delta}{m.deltaUnit}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sections rendering helper */}
      {['overview', 'sectors', 'sentiment', 'capital', 'leaders', 'style', 'riskOutlook'].map(secName => {
        const sec = data[secName];
        if (!sec) return null;
        
        let icon = <Info size={18} />;
        let title = secName.toUpperCase();
        if (secName === 'overview') { icon = <BarChart3 size={18} />; title = 'OVERVIEW 大势'; }
        if (secName === 'sectors') { icon = <ArrowRight size={18} />; title = 'SECTORS 板块'; }
        if (secName === 'sentiment') { icon = <Clock size={18} />; title = 'SENTIMENT 情绪'; }
        if (secName === 'capital') { icon = <BarChart3 size={18} />; title = 'CAPITAL 资金'; }
        if (secName === 'leaders') { icon = <ArrowRight size={18} />; title = 'LEADERS 龙头'; }
        if (secName === 'style') { icon = <Info size={18} />; title = 'STYLE 风格'; }
        if (secName === 'riskOutlook') { icon = <ShieldAlert size={18} />; title = 'RISK & OUTLOOK 风险与展望'; }

        return (
          <section key={secName} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2 uppercase tracking-wider text-slate-800">
              <span className="text-indigo-500">{icon}</span> {title}
            </h2>
            {sec.error ? (
              <div className="text-sm text-rose-500 bg-rose-50 p-3 rounded border border-rose-100">
                Error generating section: {sec.error}
              </div>
            ) : (
              <div className="space-y-6">
                {sec.narrativeMd && (
                  <div className="prose prose-sm prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                    {sec.narrativeMd}
                  </div>
                )}
                {sec.findings && sec.findings.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {sec.findings.map((f: any, i: number) => (
                      <div key={i} className={`p-4 rounded-lg border ${f.severity === 'warning' ? 'bg-amber-50 border-amber-200' : f.severity === 'critical' ? 'bg-rose-50 border-rose-200' : f.severity === 'positive' ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <h4 className="font-medium text-sm text-slate-800 mb-1">{f.headline}</h4>
                        <p className="text-xs text-slate-600 mb-3">{f.detail}</p>
                        {f.evidence && f.evidence.length > 0 && (
                          <div className="bg-white/60 p-2.5 rounded text-xs grid gap-2">
                            {f.evidence.map((ev: any, j: number) => (
                              <div key={j} className="flex items-baseline gap-2">
                                <span className="text-slate-400 font-mono w-1/4 truncate" title={ev.field}>{ev.field}</span>
                                <span className="font-medium text-slate-700">{ev.value} {ev.unit !== 'none' ? ev.unit : ''}</span>
                                <span className="text-slate-500 flex-1">{ev.interpretation}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        );
      })}

      {/* Raw Data Accordion */}
      <section className="pt-8">
        <Accordion.Root type="single" collapsible className="space-y-3">
          <Accordion.Item value="raw" className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                📦 完整原始 JSON 数据 (Raw Data)
                <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs">
               <pre className="whitespace-pre-wrap font-mono text-slate-600 overflow-x-auto">
                 {JSON.stringify(data, null, 2)}
               </pre>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </section>

    </div>
  );
}
