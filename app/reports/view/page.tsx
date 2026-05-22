import Link from 'next/link';

/**
 * 报告预览页
 * 
 * 使用 iframe 隔离 HTML 报告的样式和脚本，确保不影响主站。
 */
export default async function ReportViewPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ url?: string }> 
}) {
  const { url } = await searchParams;

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 text-[10px] tracking-widest uppercase font-mono">
        <div className="flex items-center gap-6">
          <Link href="/reports" className="text-muted hover:text-white transition-colors flex items-center gap-2">
            <span className="text-xs">←</span> BACK TO LIST
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-white font-bold tracking-widest">REPORT PREVIEW</span>
        </div>
        
        <div className="flex gap-4">
           {url && (
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted hover:text-white transition-colors underline underline-offset-4"
            >
              OPEN RAW
            </a>
          )}
        </div>
      </header>
      
      <main className="flex-1 bg-white relative">
        {url ? (
          <iframe 
            src={url} 
            className="w-full h-full border-none"
            title="Strategy Report"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-black font-mono uppercase text-xs">
            invalid or missing report url
          </div>
        )}
      </main>
    </div>
  );
}
