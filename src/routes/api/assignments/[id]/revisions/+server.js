/**
 * Assignment Revisions API Route
 * 
 * POST /api/assignments/[id]/revisions - Request revision for assignment
 */

import { json } from '@sveltejs/kit';
import { requestRevision } from '$lib/services/assignment.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { notes } = await request.json();

    const revision = await requestRevision(params.id, {
      requested_by: session.user.id,
      notes
    });

    return json({ revision }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}