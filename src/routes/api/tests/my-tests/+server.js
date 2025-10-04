/**
 * My Tests API Route
 * 
 * GET /api/tests/my-tests - Get current user's tests
 */

import { json } from '@sveltejs/kit';
import { getMyTests } from '$lib/services/test.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const filters = {
      status: url.searchParams.get('status')
    };

    // Remove null/undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === 'null') {
        delete filters[key];
      }
    });

    const tests = await getMyTests(session.user.id, filters);
    return json({ tests });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}