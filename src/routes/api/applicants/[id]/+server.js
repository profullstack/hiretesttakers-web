/**
 * Applicants API - PATCH and DELETE
 * 
 * PATCH: Update applicant status or archive status
 * DELETE: Delete an applicant
 */

import { json } from '@sveltejs/kit';
import { updateApplicationStatus, deleteApplication } from '$lib/services/application.js';

/**
 * PATCH /api/applicants/[id]
 * Update applicant status (approved, rejected, hired) or archive status
 */
export async function PATCH({ params, request, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status, archived } = body;

    // Verify the user owns the test this application is for
    const { data: application, error: fetchError } = await locals.supabase
      .from('applications')
      .select(`
        *,
        tests!inner(creator_id)
      `)
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.tests.creator_id !== session.user.id) {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the application
    const updates = {};
    if (status !== undefined) {
      const validStatuses = ['pending', 'approved', 'rejected', 'hired'];
      if (!validStatuses.includes(status)) {
        return json({ error: 'Invalid status' }, { status: 400 });
      }
      updates.status = status;
    }
    if (archived !== undefined) {
      updates.archived = archived;
    }

    const { data: updatedApplication, error: updateError } = await locals.supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Application update error:', updateError);
      return json({ error: updateError.message }, { status: 500 });
    }

    return json({ application: updatedApplication });
  } catch (error) {
    console.error('Applicants PATCH error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/applicants/[id]
 * Delete an applicant
 */
export async function DELETE({ params, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify the user owns the test this application is for
    const { data: application, error: fetchError } = await locals.supabase
      .from('applications')
      .select(`
        *,
        tests!inner(creator_id)
      `)
      .eq('id', id)
      .single();

    if (fetchError || !application) {
      return json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.tests.creator_id !== session.user.id) {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the application
    const deleted = await deleteApplication(id, locals.supabase);

    if (!deleted) {
      return json({ error: 'Failed to delete application' }, { status: 500 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Applicants DELETE error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}