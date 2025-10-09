/**
 * Jobs API Routes
 *
 * GET /api/jobs - List job requests with filters
 * POST /api/jobs - Create new job request
 */

import { json } from '@sveltejs/kit';
import {
  getJobRequests,
  createJobRequest,
  getAcademicLevels,
  getCitationStyles
} from '$lib/services/job.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  try {
    // Check if requesting academic levels
    if (url.searchParams.get('academic_levels') === 'true') {
      const levels = await getAcademicLevels();
      return json({ academic_levels: levels });
    }

    // Check if requesting citation styles
    if (url.searchParams.get('citation_styles') === 'true') {
      const styles = await getCitationStyles();
      return json({ citation_styles: styles });
    }

    // Get assignment requests with filters
    const filters = {
      status: url.searchParams.get('status'),
      user_id: url.searchParams.get('user_id'),
      assigned_to: url.searchParams.get('assigned_to'),
      limit: parseInt(url.searchParams.get('limit') || '20')
    };

    // Remove null/undefined filters
    Object.keys(filters).forEach((key) => {
      if (
        filters[key] === null ||
        filters[key] === undefined ||
        filters[key] === 'null'
      ) {
        delete filters[key];
      }
    });

    const requests = await getJobRequests(filters);
    return json({ requests });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestData = await request.json();

    // Add user_id from session
    const jobRequest = await createJobRequest({
      ...requestData,
      user_id: session.user.id
    });

    return json({ request: jobRequest }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}