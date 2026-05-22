import { list, type ListBlobResultBlob } from '@vercel/blob';
import Link from 'next/link';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: '执行报告',
  path: '/reports',
  ogKind: 'default',
});

/**
 * 策略执行报告列表页
 * 
 * 展示逻辑：
 * 1. 从 Vercel Blob 拉取 reports/ 前缀的所有文件
 * 2. 按日期（目录名）进行分组
 * 3. 每个日期内按执行序号（文件名）排序
 */
export default async function ReportsPage() {
  let blobs: ListBlobResultBlob[] = [];
  let error: string | null = null;

  try {
    const result = await list({ prefix: 'reports/' });
    blobs = result.blobs;
  } catch (e) {
    console.error('[reports-page] failed to list blobs:', e);
    error = (e as Error).message;
  }

  // 1. 分组处理
  const reportsByDate: Record<string, ListBlobResultBlob[]> = {};
  
  blobs.forEach(blob => {
    // 路径格式：reports/2026-05-22/1.html
    const parts = blob.pathname.split('/');
    if (parts.length >= 3) {
      const date = parts[1];
      if (!reportsByDate[date]) reportsByDate[date] = [];
      reportsByDate[date].push(blob);
    }
  });

  // 2. 排序：日期倒序，序号正序
  const sortedDates = Object.keys(reportsByDate).sort((a, b) => b.localeCompare(a));

  return (
    <div data-theme="legacy-dark" className="bg-background text-foreground min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-24 text-xs tracking-widest uppercase min-h-screen">
        <div className="mb-12 flex items-baseline gap-4">
          <h1 className="text-foreground font-pixel text-2xl tracking-[0.2em]">
            DEEPTRADE
          </h1>
          <span className="text-muted text-[10px] tracking-normal font-mono">/ STRATEGY REPORTS</span>
        </div>

        {error && (
          <div className="p-4 border border-red-900/50 bg-red-900/10 text-red-500 mb-8 lowercase tracking-normal">
            Error: {error}. Make sure BLOB_READ_WRITE_TOKEN is configured.
          </div>
        )}

        <div className="space-y-16">
          {sortedDates.length === 0 && !error && (
            <div className="text-muted italic tracking-normal lowercase py-20 text-center border border-dashed border-border">
              no reports uploaded yet.
            </div>
          )}
          
          {sortedDates.map(date => (
            <div key={date} className="relative">
              {/* 时间轴装饰 */}
              <div className="absolute -left-3 top-0 bottom-0 w-px bg-border" />
              
              <h2 className="text-foreground font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-2 bg-foreground rounded-full -ml-[15.5px]" />
                {date}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
                {reportsByDate[date]
                  .sort((a, b) => {
                    const getIdx = (path: string) => {
                      const filename = path.split('/').pop() || '';
                      const match = filename.match(/_(\d+)\.[^.]+$/) || filename.match(/^(\d+)\.[^.]+$/);
                      return match ? parseInt(match[1], 10) : 0;
                    };
                    return getIdx(a.pathname) - getIdx(b.pathname);
                  })
                  .map((report) => {
                    const parts = report.pathname.split('/');
                    const filename = parts[parts.length - 1];
                    const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
                    
                    let displayName = nameWithoutExt;
                    if (/^\d+$/.test(nameWithoutExt)) {
                      const dateFormatted = date.replace(/-/g, '');
                      displayName = `未知插件_${dateFormatted}_${nameWithoutExt}`;
                    } else {
                      try {
                        displayName = decodeURIComponent(nameWithoutExt);
                      } catch {
                        // ignore decode error
                      }
                    }

                    const uploadTime = new Date(report.uploadedAt).toLocaleTimeString('zh-CN', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false 
                    });
                    
                    return (
                      <Link 
                        key={report.url}
                        href={`/reports/view?url=${encodeURIComponent(report.url)}`}
                        className="group block p-6 bg-background hover:bg-surface transition-colors"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold">{displayName}</span>
                          <span className="text-muted group-hover:text-foreground transition-colors">→</span>
                        </div>
                        <div className="text-[10px] text-muted tracking-normal lowercase font-mono">
                          uploaded at {uploadTime}
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
