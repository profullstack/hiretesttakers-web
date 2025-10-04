/**
 * Assignment Submission API Route
 * 
 * POST /api/assignments/[id]/submit - Submit completed assignment
 */

import { json } from '@sveltejs/kit';
import { submitAssignment } from '$lib/services/assignment.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content, file_url } = await request.json();

    const submission = await submitAssignment(params.id, {
      content,
      file_url,
      submitted_by: session.user.id
    });

    return json({ submission }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}