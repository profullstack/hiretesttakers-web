/**
 * Individual Assignment API Routes
 * 
 * GET /api/assignments/[id] - Get assignment request by ID
 * PUT /api/assignments/[id] - Update assignment request
 * DELETE /api/assignments/[id] - Delete assignment request
 */

import { json } from '@sveltejs/kit';
import {
  getAssignmentRequestById,
  submitAssignment,
  requestRevision
} from '$lib/services/assignment.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignment = await getAssignmentRequestById(params.id);
    
    if (!assignment) {
      return json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if user has access to this assignment
    if (
      assignment.user_id !== session.user.id &&
      assignment.assigned_to !== session.user.id
    ) {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    return json({ assignment });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}