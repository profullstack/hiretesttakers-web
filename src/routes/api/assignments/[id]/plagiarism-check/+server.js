/**
 * Assignment Plagiarism Check API Route
 * 
 * POST /api/assignments/[id]/plagiarism-check - Check assignment for plagiarism
 */

import { json } from '@sveltejs/kit';
import { checkPlagiarism } from '$lib/services/assignment.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { content } = await request.json();

    const report = await checkPlagiarism(params.id, content);

    return json({ report }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}