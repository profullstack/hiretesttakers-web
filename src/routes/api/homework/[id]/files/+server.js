/**
 * Homework Files API Route
 * 
 * POST /api/homework/[id]/files - Upload files for homework request
 */

import { json } from '@sveltejs/kit';
import {
  getHomeworkRequestById,
  uploadHomeworkFiles
} from '$lib/services/homework.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get existing request to verify ownership
    const existingRequest = await getHomeworkRequestById(params.id);
    if (!existingRequest) {
      return json({ error: 'Homework request not found' }, { status: 404 });
    }

    if (existingRequest.user_id !== session.user.id) {
      return json(
        { error: 'Not authorized to upload files for this request' },
        { status: 403 }
      );
    }

    const { files } = await request.json();

    if (!files || !Array.isArray(files)) {
      return json({ error: 'Files array is required' }, { status: 400 });
    }

    const uploadedFiles = await uploadHomeworkFiles(params.id, files);

    return json({ files: uploadedFiles }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}