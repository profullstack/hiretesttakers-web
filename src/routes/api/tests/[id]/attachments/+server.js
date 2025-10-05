/**
 * Test Attachments API
 * 
 * POST /api/tests/[id]/attachments - Upload file attachment
 * GET /api/tests/[id]/attachments - Get test attachments
 * DELETE /api/tests/[id]/attachments/[attachmentId] - Delete attachment
 */

import { json } from '@sveltejs/kit';

const BUCKET_NAME = 'test-attachments';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: testId } = params;
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return json({ 
        error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB` 
      }, { status: 400 });
    }

    const supabase = locals.supabase;

    // Generate unique file path
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${session.user.id}/${testId}/${timestamp}_${sanitizedFileName}`;

    // Upload to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return json({ error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    // Create database record
    const { data: attachment, error: dbError } = await supabase
      .from('test_attachments')
      .insert({
        test_id: testId,
        file_name: file.name,
        file_path: uploadData.path,
        file_size: file.size,
        file_type: file.type,
        uploaded_by: session.user.id
      })
      .select()
      .single();

    if (dbError) {
      // Try to clean up uploaded file
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      return json({ error: `Database error: ${dbError.message}` }, { status: 500 });
    }

    return json({
      success: true,
      attachment: {
        ...attachment,
        publicUrl
      }
    }, { status: 201 });

  } catch (error) {
    console.error('[API /api/tests/[id]/attachments POST] Error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const { id: testId } = params;
    const supabase = locals.supabase;

    const { data, error } = await supabase
      .from('test_attachments')
      .select('*')
      .eq('test_id', testId)
      .order('created_at', { ascending: false });

    if (error) {
      return json({ error: error.message }, { status: 500 });
    }

    return json({ attachments: data || [] });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}