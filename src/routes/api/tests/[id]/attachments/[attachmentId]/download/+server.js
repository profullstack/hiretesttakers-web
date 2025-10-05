/**
 * Attachment Download Proxy API
 * 
 * GET /api/tests/[id]/attachments/[attachmentId]/download
 * Proxies file downloads from Supabase storage with proper headers
 */

import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals, fetch }) {
  try {
    const { id: testId, attachmentId } = params;

    // Get attachment metadata from database
    const { data: attachment, error: dbError } = await locals.supabase
      .from('test_attachments')
      .select('*')
      .eq('id', attachmentId)
      .eq('test_id', testId)
      .single();

    if (dbError || !attachment) {
      throw error(404, 'Attachment not found');
    }

    // Get file from Supabase storage
    const { data: fileData, error: storageError } = await locals.supabase.storage
      .from('test-attachments')
      .download(attachment.file_path);

    if (storageError || !fileData) {
      throw error(404, 'File not found in storage');
    }

    // Convert blob to array buffer for response
    const arrayBuffer = await fileData.arrayBuffer();

    // Return file with proper headers
    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': attachment.file_type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${attachment.file_name}"`,
        'Content-Length': attachment.file_size?.toString() || fileData.size.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err) {
    console.error('Attachment download error:', err);
    if (err.status) {
      throw err;
    }
    throw error(500, 'Failed to download attachment');
  }
}