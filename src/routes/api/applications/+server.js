/**
 * Applications API - GET and POST
 * 
 * GET: Get applications for current user (test taker's applications)
 * POST: Create a new application
 */

import { json } from '@sveltejs/kit';
import {
  createApplication,
  getApplicationsByUserId
} from '$lib/services/application.js';

/**
 * GET /api/applications
 * Get all applications for the current user (test taker)
 */
export async function GET({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applications = await getApplicationsByUserId(session.user.id);

    return json({ applications });
  } catch (error) {
    console.error('Applications GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/applications
 * Create a new application
 */
export async function POST({ request, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { test_id, application_message } = await request.json();

    const application = await createApplication({
      test_id,
      test_taker_id: session.user.id,
      application_message
    });

    return json({ application }, { status: 201 });
  } catch (error) {
    console.error('Applications POST error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}