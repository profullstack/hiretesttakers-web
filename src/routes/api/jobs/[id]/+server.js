/**
 * Individual Job API Routes
 *
 * GET /api/jobs/[id] - Get job request by ID
 * PUT /api/jobs/[id] - Update job request
 * DELETE /api/jobs/[id] - Delete job request
 */

import { json } from '@sveltejs/kit';
import {
  getJobRequestById,
  updateJobRequest,
  submitJob,
  requestRevision
} from '$lib/services/job.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assignment = await getJobRequestById(params.id);
    
    if (!assignment) {
      return json({ error: 'Assignment not found' }, { status: 404 });
    }

    // Check if user has access to this assignment
    if (
      assignment.user_id !== session.user.id &&
      assignment.assigned_to !== session.user.id
    ) {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    return json({ assignment });
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

    // Get the existing job to check ownership
    const existingJob = await getJobRequestById(params.id);
    
    if (!existingJob) {
      return json({ error: 'Job not found' }, { status: 404 });
    }

    // Only the job creator can edit it
    if (existingJob.user_id !== session.user.id) {
      return json({ error: 'Forbidden - only job creator can edit' }, { status: 403 });
    }

    // Only pending jobs can be edited
    if (existingJob.status !== 'pending') {
      return json({ error: 'Only pending jobs can be edited' }, { status: 400 });
    }

    const updates = await request.json();
    
    const updatedJob = await updateJobRequest(params.id, updates);

    return json({ request: updatedJob });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}