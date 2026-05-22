import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';

/**
 * 策略报告上传接口
 * 
 * 鉴权：Header [Authorization: Bearer deeptrade]
 * 参数：form-data [file: File]
 * 存储路径：reports/{YYYY-MM-DD}/{N}.html
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== 'Bearer deeptrade') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.endsWith('.html')) {
      return NextResponse.json({ error: 'Only HTML files are allowed' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const prefix = `reports/${today}/`;

    // 1. 获取今日已上传的列表以确定序号 N
    const { blobs } = await list({ prefix });
    
    const existingIndices = blobs
      .map(b => {
        const parts = b.pathname.split('/');
        const filename = parts[parts.length - 1];
        const match = filename.match(/^(\d+)\.html$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => n > 0);
    
    const nextIndex = existingIndices.length > 0 ? Math.max(...existingIndices) + 1 : 1;
    const pathname = `${prefix}${nextIndex}.html`;

    // 2. 上传至 Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      contentType: 'text/html',
      // 允许浏览器直接预览而不是触发下载
      addRandomSuffix: false, 
    });

    return NextResponse.json({
      success: true,
      url: blob.url,
      pathname: blob.pathname,
      index: nextIndex,
      date: today
    });
  } catch (error) {
    console.error('[upload-report] error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
