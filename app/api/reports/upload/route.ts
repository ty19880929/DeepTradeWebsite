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

    const today = new Date().toISOString().split('T')[0];
    const prefix = `reports/${today}/`;

    // 1. 获取今日已上传的列表以确定序号 N
    const { blobs } = await list({ prefix });

    const existingIndices = blobs
      .map(b => {
        const parts = b.pathname.split('/');
        const filename = parts[parts.length - 1];
        // 匹配新格式 _n.ext 或老格式 n.ext
        const match = filename.match(/_(\d+)\.[^.]+$/) || filename.match(/^(\d+)\.[^.]+$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => n > 0);

    const nextIndex = existingIndices.length > 0 ? Math.max(...existingIndices) + 1 : 1;

    const originalName = file.name || '';
    const extension = originalName.includes('.') ? originalName.split('.').pop() : 'json';
    
    // 提取插件中文名
    const pluginNameFromForm = formData.get('plugin_name') as string;
    let pluginName = pluginNameFromForm;
    if (!pluginName) {
      pluginName = originalName.includes('.') ? originalName.slice(0, originalName.lastIndexOf('.')) : originalName;
    }
    // 移除可能存在的 _yyyyMMdd_n 后缀以防重复
    pluginName = pluginName.replace(/_\d{8}_\d+$/, '');
    if (!pluginName || /^\d+$/.test(pluginName)) {
      pluginName = '未知插件';
    }

    const dateFormatted = today.replace(/-/g, '');
    const finalFilename = `${pluginName}_${dateFormatted}_${nextIndex}.${extension}`;
    const pathname = `${prefix}${finalFilename}`;

    // 2. 上传至 Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      contentType: file.type || (extension === 'json' ? 'application/json' : 'text/html'),      // 允许浏览器直接预览而不是触发下载
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
