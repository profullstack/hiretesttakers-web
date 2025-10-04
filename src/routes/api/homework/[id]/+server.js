/**
 * Individual Homework Request API Routes
 * 
 * GET /api/homework/[id] - Get homework request by ID
 * PUT /api/homework/[id] - Update homework request
 * DELETE /api/homework/[id] - Delete homework request
 */

import { json } from '@sveltejs/kit';
import {
  getHomeworkRequestById,
  updateHomeworkRequest,
  deleteHomeworkRequest
} from '$lib/services/homework.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  try {
    const request = await getHomeworkRequestById(params.id);

    if (!request) {
      return json({ error: 'Homework request not found' }, { status: 404 });
    }

    return json({ request });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request, locals }) {
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
      return json({ error: 'Not authorized to update this request' }, { status: 403 });
    }

    const updates = await request.json();
    const updatedRequest = await updateHomeworkRequest(params.id, updates);

    return json({ request: updatedRequest });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params, locals }) {
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
      return json({ error: 'Not authorized to delete this request' }, { status: 403 });
    }

    await deleteHomeworkRequest(params.id);

    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}