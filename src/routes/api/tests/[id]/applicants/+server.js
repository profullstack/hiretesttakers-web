/**
 * Test Applicants API - GET
 * 
 * GET: Get all applicants for a specific test (hirers only)
 */

import { json } from '@sveltejs/kit';
import { getApplicationsByTestId } from '$lib/services/application.js';

/**
 * GET /api/tests/[id]/applicants
 * Get all applicants for a test
 */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await getApplicationsByTestId(params.id);

    return json({ applications });
  } catch (error) {
    console.error('Test applicants GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}