/**
 * Individual Job Application API Routes
 *
 * GET /api/job-applications/[id] - Get specific job application
 * PATCH /api/job-applications/[id] - Update job application status
 * DELETE /api/job-applications/[id] - Delete job application
 */

import { json } from '@sveltejs/kit';
import {
  getJobApplicationById,
  updateJobApplicationStatus,
  deleteJobApplication
} from '$lib/services/application.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = locals.supabase;
    const application = await getJobApplicationById(params.id, supabase);

    if (!application) {
      return json({ error: 'Application not found' }, { status: 404 });
    }

    return json({ application });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function PATCH({ params, request, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    if (!status) {
      return json({ error: 'Status is required' }, { status: 400 });
    }

    const supabase = locals.supabase;

    const application = await updateJobApplicationStatus({
      id: params.id,
      status,
      supabase
    });

    return json({ application });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = locals.supabase;
    const deleted = await deleteJobApplication(params.id, supabase);

    if (!deleted) {
      return json({ error: 'Application not found' }, { status: 404 });
    }

    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}