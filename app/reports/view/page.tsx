import Link from 'next/link';
import { ReportViewer } from '@/components/reports/ReportViewer';

/**
 * 报告预览页
 * 
 * 根据 URL 后缀，自动选择原生 JSON 渲染还是老版的 iframe 代理渲染。
 */
export default async function ReportViewPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ url?: string }> 
}) {
  const { url } = await searchParams;
  
  const isJson = url?.endsWith('.json');

  let jsonData = null;
  let fetchError = false;

  if (isJson && url) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) {
        fetchError = true;
      } else {
        jsonData = await res.json();
      }
    } catch (e) {
      console.error("Failed to fetch JSON report:", e);
      fetchError = true;
    }
  }

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${isJson ? 'bg-slate-50' : 'bg-black'}`}>
      <header className={`flex items-center justify-between px-6 py-4 border-b text-[10px] tracking-widest uppercase font-mono ${isJson ? 'border-slate-200 bg-white' : 'border-white/10 bg-black'}`}>
        <div className="flex items-center gap-6">
          <Link href="/reports" className={`${isJson ? 'text-slate-500 hover:text-slate-900' : 'text-muted hover:text-white'} transition-colors flex items-center gap-2`}>
            <span className="text-xs">←</span> BACK TO LIST
          </Link>
          <div className={`w-px h-4 ${isJson ? 'bg-slate-200' : 'bg-white/10'}`} />
          <span className={`${isJson ? 'text-slate-900' : 'text-white'} font-bold tracking-widest`}>
            {isJson ? 'REPORT VIEWER (NATIVE)' : 'REPORT PREVIEW (LEGACY)'}
          </span>
        </div>
        
        <div className="flex gap-4">
           {url && (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${isJson ? 'text-slate-500 hover:text-slate-900' : 'text-muted hover:text-white'} transition-colors underline underline-offset-4`}
            >
              OPEN RAW
            </a>
          )}
        </div>
      </header>
      
      <main className={`flex-1 relative overflow-y-auto ${isJson ? 'bg-slate-50' : 'bg-white'}`}>
        {!url ? (
          <div className="absolute inset-0 flex items-center justify-center font-mono uppercase text-xs text-slate-500">
            invalid or missing report url
          </div>
        ) : isJson ? (
          fetchError ? (
            <div className="absolute inset-0 flex items-center justify-center font-mono uppercase text-xs text-rose-500">
              failed to load json report data
            </div>
          ) : jsonData ? (
            <ReportViewer data={jsonData} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono uppercase text-xs text-slate-500">
              loading report...
            </div>
          )
        ) : (
          <iframe 
            src={`/api/reports/proxy?url=${encodeURIComponent(url)}`} 
            className="w-full h-full border-none"
            title="Strategy Report"
          />
        )}
      </main>
    </div>
  );
}
