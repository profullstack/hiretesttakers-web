/**
 * Job Applications API Routes
 *
 * GET /api/job-applications - List job applications (filtered by user or job)
 * POST /api/job-applications - Create new job application
 */

import { json } from '@sveltejs/kit';
import {
  createJobApplication,
  getJobApplicationsByUserId,
  getJobApplicationsByJobId
} from '$lib/services/application.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = locals.supabase;
    const jobId = url.searchParams.get('job_id');
    const userId = url.searchParams.get('user_id') || session.user.id;

    let applications;

    if (jobId) {
      // Get applications for a specific job (job poster view)
      applications = await getJobApplicationsByJobId(jobId, supabase);
    } else {
      // Get applications by user (applicant view)
      applications = await getJobApplicationsByUserId(userId, supabase);
    }

    return json({ applications });
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

    const { job_id, application_note } = await request.json();

    if (!job_id) {
      return json({ error: 'Job ID is required' }, { status: 400 });
    }

    const supabase = locals.supabase;

    const application = await createJobApplication({
      job_id,
      applicant_id: session.user.id,
      application_note,
      supabase
    });

    return json({ application }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}