/**
 * Public Jobs Browse API Route
 *
 * GET /api/jobs/browse - List publicly available jobs (no auth required)
 */

import { json } from '@sveltejs/kit';
import { getJobRequests } from '$lib/services/job.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  try {
    // Get job requests with filters - no authentication required for public browsing
    const filters = {
      status: url.searchParams.get('status') || 'pending', // Default to pending for public
      limit: parseInt(url.searchParams.get('limit') || '50')
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