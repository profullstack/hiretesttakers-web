import { json } from '@sveltejs/kit';
import { canRateTest } from '$lib/services/rating.js';

/**
 * GET /api/ratings/can-rate?testId=xxx
 * Check if the current user can rate a specific test
 */
export async function GET({ url, locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testId = url.searchParams.get('testId');

    if (!testId) {
      return json({ error: 'testId query parameter is required' }, { status: 400 });
    }

    const result = await canRateTest(testId, session.user.id);

    if (result.error) {
      return json({ error: result.error.message }, { status: 400 });
    }

    return json({ data: result.data });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}