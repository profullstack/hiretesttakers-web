/**
 * Application API - GET, PUT, DELETE
 * 
 * GET: Get a specific application by ID
 * PUT: Update application status (for hirers)
 * DELETE: Delete an application
 */

import { json } from '@sveltejs/kit';
import {
  getApplicationById,
  updateApplicationStatus,
  deleteApplication
} from '$lib/services/application.js';

/**
 * GET /api/applications/[id]
 * Get a specific application
 */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await getApplicationById(params.id);

    if (!application) {
      return json({ error: 'Application not found' }, { status: 404 });
    }

    return json({ application });
  } catch (error) {
    console.error('Application GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/applications/[id]
 * Update application status (hirers only)
 */
export async function PUT({ params, request, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status } = await request.json();

    const application = await updateApplicationStatus({
      id: params.id,
      status
    });

    return json({ application });
  } catch (error) {
    console.error('Application PUT error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}

/**
 * DELETE /api/applications/[id]
 * Delete an application
 */
export async function DELETE({ params, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const success = await deleteApplication(params.id);

    if (!success) {
      return json({ error: 'Application not found' }, { status: 404 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Application DELETE error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}