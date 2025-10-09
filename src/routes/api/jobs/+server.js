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
export async function GET({ url, locals }) {
  try {
    // Check if requesting academic levels (no auth required)
    if (url.searchParams.get('academic_levels') === 'true') {
      const levels = await getAcademicLevels();
      return json({ academic_levels: levels });
    }

    // Check if requesting citation styles (no auth required)
    if (url.searchParams.get('citation_styles') === 'true') {
      const styles = await getCitationStyles();
      return json({ citation_styles: styles });
    }

    // For job requests, require authentication
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get assignment requests with filters
    const filters = {
      status: url.searchParams.get('status'),
      user_id: url.searchParams.get('user_id') || session.user.id, // Default to current user
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

    // Use the authenticated Supabase client from locals
    const supabase = locals.supabase;
    
    // Prepare job data
    const jobData = {
      ...requestData,
      user_id: session.user.id,
      status: 'pending'
    };

    // Insert directly using the authenticated client
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create job: ${error.message}`);
    }

    return json({ request: data }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}