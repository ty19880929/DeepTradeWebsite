"use client";

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDown, AlertTriangle, Eye, CheckCircle2, TrendingUp, Minus, TrendingDown } from 'lucide-react';

interface ReportMeta {
  title: string;
  run_id: string;
  trade_date_t: string;
  trade_date_t1: string;
  status: "success" | "partial_failed" | "failed" | "cancelled";
  model_version: string;
  counts: { initial: number; selected: number; predicted: number };
  dataSource: {
    themeStrength: "limit_cpt_list" | "lu_desc_aggregation" | "industry_fallback";
    unavailable: string[];
  };
  failedBatches: string[];
  generatedAt: string;
}

interface Evidence {
  field: string;
  value: string | number | string[] | null;
  unit: string;
  interpretation: string;
}

interface ScreeningItem {
  rank: number;
  code: string;
  name: string;
  close: number;
  score: number;
  lgb: { score: number | null; rank: string | null };
  level: "强" | "中" | "弱";
  theme: string;
  rationale: string;
  tags: string[];
  evidence: Evidence[];
  missingData: string[];
}

interface PredictionCardData {
  rank: number;
  code: string;
  name: string;
  prediction: "top_candidate" | "watchlist" | "avoid";
  confidence: "高" | "中" | "低";
  score: number;
  close: number;
  lgb: { score: number | null; rank: string | null };
  rationale: string;
  observationPoints: string[];
  failureConditions: string[];
  keyEvidence: Evidence[];
  missingData: string[];
  batchLocalRank: number | null;
  deltaVsBatch: "upgraded" | "kept" | "downgraded" | null;
  reasonVsPeers: string | null;
}

interface MarketSnapshot {
  limit_up_count: number;
  limit_step_distribution: Record<string, number>;
  limit_step_distribution_prev: Record<string, number>;
  limit_step_trend: {
    max_height: number;
    max_height_prev: number;
    high_board_delta: number;
    total_limit_up_delta: number;
    interpretation: string;
  };
  yesterday_failure_rate: {
    trade_date_prev: string;
    u_count: number;
    z_count: number;
    rate_pct: number;
    interpretation: string;
  };
  yesterday_winners_today: {
    trade_date_prev: string;
    n_winners: number;
    n_continued_today: number;
    continuation_rate_pct: number;
    n_negative_today: number;
    avg_pct_chg_today: number;
    interpretation: string;
  };
  candidates: Array<{
    code: string;
    name: string;
    close: number;
    float_mv: number;
    theme: string;
    lgb: { score: number | null; rank: string | null };
  }>;
}

interface FilteringLog {
  entered: number;
  passed: number;
  rejected: number;
  thresholds: {
    min_float_mv_yi: number;
    max_float_mv_yi: number;
    max_close_yuan: number;
  };
  rejectedItems: Array<{
    code: string;
    name: string;
    float_mv: number;
    close: number;
    reason: string;
  }>;
}

interface StrategyReportSchema {
  meta: ReportMeta;
  marketSnapshot: MarketSnapshot | null;
  scoreDistribution: {
    stats?: { n: number; min: number; p25: number; median: number; p75: number; max: number };
    histogram?: Array<{ range: string; count: number }>;
  } | null;
  step2_screening: ScreeningItem[];
  step4_prediction: {
    top_candidate: PredictionCardData[];
    watchlist: PredictionCardData[];
    avoid: PredictionCardData[];
  };
  filteringDetails: FilteringLog | null;
  _extras: Record<string, unknown>;
}

export function ReportViewer({ data }: { data: StrategyReportSchema }) {
  if (!data || !data.meta) return <div>Invalid Data</div>;

  const { meta, scoreDistribution, step2_screening, step4_prediction, marketSnapshot, filteringDetails } = data;

  const statusColors = {
    success: 'text-emerald-600',
    partial_failed: 'text-amber-600',
    failed: 'text-rose-600',
    cancelled: 'text-slate-500',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20 space-y-8 text-slate-900">
      
      {/* 1. Meta Header & Key Metrics */}
      <header>
        {meta.status === 'partial_failed' && meta.failedBatches && meta.failedBatches.length > 0 && (
          <div className="mb-4 bg-amber-50 border border-amber-400 rounded-lg p-3 text-amber-800 text-sm flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>部分批次失败: </span>
            <div className="flex gap-2 flex-wrap">
              {meta.failedBatches.map(batch => (
                <span key={batch} className="bg-amber-100 px-2 py-0.5 rounded text-xs">{batch}</span>
              ))}
            </div>
          </div>
        )}
        {(meta.status === 'failed' || meta.status === 'cancelled') && (
          <div className={`mb-4 border rounded-lg p-3 text-sm flex items-center gap-2 ${meta.status === 'failed' ? 'bg-rose-50 border-rose-400 text-rose-800' : 'bg-slate-50 border-slate-400 text-slate-800'}`}>
            <AlertTriangle size={16} />
            <span>执行状态: {meta.status}</span>
          </div>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{meta.title || "策略报告"}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Run ID: <span className="font-mono">{meta.run_id}</span> • 
          Status: <span className={`font-medium ${statusColors[meta.status] || 'text-slate-500'}`}>{meta.status}</span>
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="T 交易日" value={meta.trade_date_t} />
        <MetricCard label="T+1 预测日" value={meta.trade_date_t1} />
        <MetricCard label="强势/候选/预测" value={`${meta.counts?.initial || 0} / ${meta.counts?.selected || 0} / ${meta.counts?.predicted || 0}`} valueClass="text-indigo-600" />
        <MetricCard label="LGB 模型版本" value={meta.model_version === 'disabled' ? 'Disabled' : meta.model_version} valueClass="text-cyan-700" />
      </div>

      {/* 2. Score Distribution (Recharts) */}
      {scoreDistribution && scoreDistribution.histogram && (
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
            📊 LGB 评分分布
            <span className="text-xs font-normal text-slate-500">次日最大溢价概率 (0-100)</span>
          </h2>
          
          {scoreDistribution.stats && (
            <div className="flex flex-wrap gap-2 mb-6">
              {Object.entries(scoreDistribution.stats).map(([k, v]) => (
                <div key={k} className="bg-slate-50 px-3 py-1.5 rounded-md flex flex-col items-center min-w-[60px]">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400">{k}</span>
                  <span className="text-sm font-semibold">{v as number}</span>
                </div>
              ))}
            </div>
          )}

          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution.histogram} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {scoreDistribution.histogram.map((entry, index: number) => (
                    <Cell key={`cell-${index}`} fill="#6366f1" opacity={entry.count > 0 ? 0.8 : 0.3} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* 4. Prediction Cards (Step 4) */}
      {step4_prediction && (
        <section className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            🔮 次日连板预测 <span className="text-sm font-normal text-slate-500">Step 4</span>
          </h2>
          
          {/* Top Candidate Group */}
          {step4_prediction.top_candidate && step4_prediction.top_candidate.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <TrendingUp size={12} /> 重点关注
                </span>
                <span className="text-xs text-slate-500">{step4_prediction.top_candidate.length} 只</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {step4_prediction.top_candidate.map((item) => <PredictionCard key={item.code} data={item} type="top_candidate" />)}
              </div>
            </div>
          )}

          {/* Watchlist Group */}
          {step4_prediction.watchlist && step4_prediction.watchlist.length > 0 && (
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <Eye size={12} /> 观察
                </span>
                <span className="text-xs text-slate-500">{step4_prediction.watchlist.length} 只</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {step4_prediction.watchlist.map((item) => <PredictionCard key={item.code} data={item} type="watchlist" />)}
              </div>
            </div>
          )}

          {/* Avoid Group */}
          {step4_prediction.avoid && step4_prediction.avoid.length > 0 && (
            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-2">
                <span className="bg-rose-500 text-white px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <AlertTriangle size={12} /> 回避
                </span>
                <span className="text-xs text-slate-500">{step4_prediction.avoid.length} 只</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {step4_prediction.avoid.map((item) => <PredictionCard key={item.code} data={item} type="avoid" />)}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. Screening Table (Step 2) */}
      {step2_screening && step2_screening.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-base font-semibold">🎯 强势初筛入选 ({step2_screening.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Rank</th>
                  <th className="px-4 py-3 font-medium">Code/Name</th>
                  <th className="px-4 py-3 font-medium">Close</th>
                  <th className="px-4 py-3 font-medium">LGB</th>
                  <th className="px-4 py-3 font-medium">Level</th>
                  <th className="px-4 py-3 font-medium">Theme</th>
                  <th className="px-4 py-3 font-medium w-1/3">Rationale</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {step2_screening.map((item, i) => (
                  <ScreeningRow key={item.code || i} data={item} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 5. Snapshots & Logs (Accordion) */}
      <section className="pt-8">
        <Accordion.Root type="single" collapsible className="space-y-3">
          
          {marketSnapshot && (
            <Accordion.Item value="market" className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  📦 市场数据快照 (Market Snapshot)
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs">
                 <pre className="whitespace-pre-wrap font-mono text-slate-600 overflow-x-auto">
                   {JSON.stringify(marketSnapshot, null, 2)}
                 </pre>
              </Accordion.Content>
            </Accordion.Item>
          )}

          {filteringDetails && (
            <Accordion.Item value="filter" className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                  🧹 候选筛选日志 (Filtering Log)
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 text-xs">
                 <pre className="whitespace-pre-wrap font-mono text-slate-600 overflow-x-auto">
                   {JSON.stringify(filteringDetails, null, 2)}
                 </pre>
              </Accordion.Content>
            </Accordion.Item>
          )}

        </Accordion.Root>
      </section>

    </div>
  );
}

// Subcomponents

function getClsUrl(code: string) {
  if (!code) return '#';
  const parts = code.split('.');
  if (parts.length === 2) {
    return `https://www.cls.cn/stock?code=${parts[1].toUpperCase()}${parts[0]}`;
  }
  return `https://www.cls.cn/stock?code=${code}`;
}

function MetricCard({ label, value, valueClass = "text-slate-900" }: { label: string, value: string | number, valueClass?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">{label}</span>
      <span className={`mt-1.5 text-lg font-bold truncate ${valueClass}`}>{value}</span>
    </div>
  );
}

function ScreeningRow({ data }: { data: ScreeningItem }) {
  const [expanded, setExpanded] = useState(false);
  const hasEvidence = data.evidence && data.evidence.length > 0;

  return (
    <React.Fragment>
      <tr className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => hasEvidence && setExpanded(!expanded)}>
        <td className="px-4 py-3 text-slate-400 font-mono text-xs">{data.rank}</td>
        <td className="px-4 py-3">
          <div className="font-mono text-xs text-slate-500">{data.code}</div>
          <a 
            href={getClsUrl(data.code)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="font-medium text-slate-900 hover:text-indigo-600 hover:underline transition-colors block w-max"
          >
            {data.name}
          </a>
        </td>
        <td className="px-4 py-3 font-mono text-xs">{data.close}</td>
        <td className="px-4 py-3">
          <div className="text-cyan-700 font-medium">{data.lgb?.score ?? '—'}</div>
          <div className="text-[10px] text-slate-400 font-mono">{data.lgb?.rank ?? ''}</div>
        </td>
        <td className="px-4 py-3">
          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium
            ${data.level === '强' ? 'bg-emerald-100 text-emerald-700' : 
              data.level === '中' ? 'bg-amber-100 text-amber-700' : 
              'bg-slate-100 text-slate-600'}`}>
            {data.level || '未知'}
          </span>
        </td>
        <td className="px-4 py-3 text-xs text-slate-600">{data.theme || '—'}</td>
        <td className="px-4 py-3">
          <p className="text-xs text-slate-700 line-clamp-2" title={data.rationale}>{data.rationale}</p>
          {data.tags && data.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {data.tags.map((t) => (
                <span key={t} className="px-1.5 py-0.5 bg-rose-50 text-rose-700 text-[9px] rounded font-medium">{t}</span>
              ))}
            </div>
          )}
          {hasEvidence && (
            <div className="text-[10px] text-indigo-500 mt-1 flex items-center gap-1 font-medium">
              {expanded ? '▾ Hide Evidence' : '▸ View Evidence'}
            </div>
          )}
        </td>
      </tr>
      {expanded && hasEvidence && (
        <tr>
          <td colSpan={7} className="p-0 border-0">
            <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 text-xs shadow-inner">
              <table className="w-full">
                <thead className="text-[10px] text-slate-400 uppercase tracking-wider text-left border-b border-slate-200">
                  <tr>
                    <th className="pb-2 font-medium w-1/4">Field</th>
                    <th className="pb-2 font-medium w-1/4">Value</th>
                    <th className="pb-2 font-medium w-1/2">Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.evidence.map((ev, idx) => (
                    <tr key={idx}>
                      <td className="py-2 font-mono text-slate-500">{ev.field}</td>
                      <td className="py-2 font-medium text-slate-800">
                        {String(ev.value)} {ev.unit !== 'none' && ev.unit !== '【无】' && <span className="text-slate-400 font-normal">{ev.unit}</span>}
                      </td>
                      <td className="py-2 text-slate-600">{ev.interpretation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

function PredictionCard({ data, type }: { data: PredictionCardData, type: 'top_candidate' | 'watchlist' | 'avoid' }) {
  const themeColors = {
    top_candidate: 'border-emerald-300',
    watchlist: 'border-amber-300',
    avoid: 'border-rose-300'
  };
  const themeColor = themeColors[type];
  
  const deltaBadge = {
    upgraded: { icon: <TrendingUp size={10} />, class: 'bg-emerald-100 text-emerald-700', text: '升' },
    kept: { icon: <Minus size={10} />, class: 'bg-slate-100 text-slate-600', text: '保' },
    downgraded: { icon: <TrendingDown size={10} />, class: 'bg-rose-100 text-rose-700', text: '降' }
  };
  
  return (
    <div className={`bg-white rounded-xl border border-slate-200 border-l-4 ${themeColor} p-5 shadow-sm flex flex-col h-full relative`}>
      
      {/* Delta Badge (Multi-batch mode) */}
      {data.deltaVsBatch && deltaBadge[data.deltaVsBatch] && (
        <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${deltaBadge[data.deltaVsBatch].class}`} title="全局重排变动">
          {deltaBadge[data.deltaVsBatch].icon}
          {deltaBadge[data.deltaVsBatch].text}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-3 pr-12">
        <div>
          <div className="flex items-center gap-2 group relative">
            <span className="text-xs text-slate-400 font-mono">#{data.rank}</span>
            <a 
              href={getClsUrl(data.code)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-900 text-lg hover:text-indigo-600 hover:underline transition-colors"
            >
              {data.name}
            </a>
            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">{data.code}</span>
            {data.batchLocalRank && (
              <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block w-max bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg z-10">
                批内 #{data.batchLocalRank}
              </div>
            )}
          </div>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
            <span>信心: <strong className="text-slate-600">{data.confidence}</strong></span>
            <span>评分: <strong className="text-slate-600">{data.score}</strong></span>
          </div>
        </div>
        <div className="text-right flex flex-col items-end">
           <div className="text-[10px] text-slate-400 uppercase tracking-wider">Close</div>
           <div className="font-mono font-medium text-sm text-slate-800">{data.close}</div>
           <div className="text-[10px] text-slate-400 uppercase tracking-wider mt-1">LGB</div>
           <div className="font-mono font-bold text-sm text-cyan-700">{data.lgb?.score ?? '—'} <span className="text-xs font-normal opacity-70">({data.lgb?.rank ?? ''})</span></div>
        </div>
      </div>

      {/* Rationale */}
      <p className="text-sm text-slate-700 leading-relaxed mb-4 flex-1">
        {data.rationale}
      </p>

      {/* Reason vs Peers (Multi-batch mode) */}
      {data.reasonVsPeers && (
        <div className="bg-indigo-50 border-l-2 border-indigo-300 p-2.5 mb-4 rounded-r">
          <p className="text-xs text-indigo-900">
            <span className="font-semibold mr-1">重排说明:</span>
            {data.reasonVsPeers}
          </p>
        </div>
      )}

      {/* Observations & Failures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {data.observationPoints && data.observationPoints.length > 0 && (
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
            <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5 mb-1.5">
              <CheckCircle2 size={12} /> 次日观察点
            </div>
            <ul className="text-xs text-emerald-700/80 space-y-1 pl-4 list-disc marker:text-emerald-300">
              {data.observationPoints.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
          </div>
        )}
        {data.failureConditions && data.failureConditions.length > 0 && (
          <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-3">
            <div className="text-[11px] font-semibold text-rose-800 flex items-center gap-1.5 mb-1.5">
              <AlertTriangle size={12} /> 失败触发条件
            </div>
            <ul className="text-xs text-rose-700/80 space-y-1 pl-4 list-disc marker:text-rose-300">
              {data.failureConditions.map((pt, i) => <li key={i}>{pt}</li>)}
            </ul>
          </div>
        )}
      </div>

      {/* Key Evidence Mini Table */}
      {data.keyEvidence && data.keyEvidence.length > 0 && (
        <div className="mt-auto border-t border-slate-100 pt-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">Key Evidence</div>
          <div className="space-y-1.5">
            {data.keyEvidence.map((ev, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs gap-3">
                <span className="font-mono text-slate-400 w-1/3 truncate" title={ev.field}>{ev.field}</span>
                <span className="font-medium text-slate-700 w-1/4 whitespace-nowrap text-right">
                  {String(ev.value)} {ev.unit !== 'none' && ev.unit !== '【无】' && <span className="text-slate-400 font-normal text-[10px]">{ev.unit}</span>}
                </span>
                <span className="text-slate-500 w-5/12 text-right line-clamp-1" title={ev.interpretation}>{ev.interpretation}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
