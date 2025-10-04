/**
 * Individual Test API Routes
 * 
 * GET /api/tests/[id] - Get test by ID
 * PUT /api/tests/[id] - Update test
 * DELETE /api/tests/[id] - Delete test
 */

import { json } from '@sveltejs/kit';
import { getTest, updateTest, deleteTest } from '$lib/services/test.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  try {
    const test = await getTest(params.id);
    
    if (!test) {
      return json({ error: 'Test not found' }, { status: 404 });
    }

    return json({ test });
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

    const updates = await request.json();
    const test = await updateTest(params.id, session.user.id, updates);
    
    return json({ test });
  } catch (error) {
    const status = error.message.includes('Not authorized') ? 403 : 400;
    return json({ error: error.message }, { status });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteTest(params.id, session.user.id);
    
    return json({ success: true });
  } catch (error) {
    const status = error.message.includes('Not authorized') ? 403 : 400;
    return json({ error: error.message }, { status });
  }
}