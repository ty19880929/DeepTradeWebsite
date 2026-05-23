import { NextResponse } from 'next/server';
import { put, list, del } from '@vercel/blob';

/**
 * 策略报告上传接口
 * 
 * 鉴权：Header [Authorization: Bearer deeptrade]
 * 参数：form-data [file: File, plugin_name?: string, trade_date?: string]
 * 存储路径：reports/{YYYY-MM-DD}/{plugin_name}_{YYYYMMDD}.{ext}
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

    const tradeDateFromForm = formData.get('trade_date') as string;
    const today = new Date().toISOString().split('T')[0];
    const tradeDate = tradeDateFromForm || today;
    const prefix = `reports/${tradeDate}/`;

    const originalName = file.name || '';
    const extension = originalName.includes('.') ? originalName.split('.').pop() : 'json';
    
    // 提取插件中文名
    const pluginNameFromForm = formData.get('plugin_name') as string;
    let pluginName = pluginNameFromForm;
    if (!pluginName) {
      pluginName = originalName.includes('.') ? originalName.slice(0, originalName.lastIndexOf('.')) : originalName;
    }
    // 移除可能存在的 _yyyyMMdd 后缀或 _yyyyMMdd_n 后缀以防重复
    pluginName = pluginName.replace(/_\d{8}(_\d+)?$/, '');
    if (!pluginName || /^\d+$/.test(pluginName)) {
      pluginName = '未知插件';
    }

    const dateFormatted = tradeDate.replace(/-/g, '');
    const finalFilename = `${pluginName}_${dateFormatted}.${extension}`;
    const pathname = `${prefix}${finalFilename}`;

    // 1. 获取并删除相同日期且相同文件名的执行报告
    const { blobs } = await list({ prefix });
    const existingBlob = blobs.find(b => b.pathname === pathname);
    if (existingBlob) {
      await del(existingBlob.url);
      console.log(`[upload-report] deleted existing report: ${pathname}`);
    }

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
      date: tradeDate
    });
  } catch (error) {
    console.error('[upload-report] error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
