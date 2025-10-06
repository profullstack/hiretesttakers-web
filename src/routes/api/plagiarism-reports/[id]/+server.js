/**
 * Individual Plagiarism Report API
 * 
 * GET /api/plagiarism-reports/[id] - Get a specific plagiarism report
 * PATCH /api/plagiarism-reports/[id] - Update report (archive/unarchive)
 * DELETE /api/plagiarism-reports/[id] - Delete a plagiarism report
 */

import { json } from '@sveltejs/kit';
import {
  getPlagiarismReportById,
  archivePlagiarismReport,
  unarchivePlagiarismReport,
  deletePlagiarismReport
} from '$lib/services/plagiarism.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await getPlagiarismReportById(params.id);

    if (!report) {
      return json({ error: 'Report not found' }, { status: 404 });
    }

    return json({ report }, { status: 200 });
  } catch (error) {
    console.error('Error fetching plagiarism report:', error);
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

    const { archived } = await request.json();

    if (typeof archived !== 'boolean') {
      return json({ error: 'archived field must be a boolean' }, { status: 400 });
    }

    const report = archived
      ? await archivePlagiarismReport(params.id)
      : await unarchivePlagiarismReport(params.id);

    return json({ report }, { status: 200 });
  } catch (error) {
    console.error('Error updating plagiarism report:', error);
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

    await deletePlagiarismReport(params.id);

    return json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting plagiarism report:', error);
    return json({ error: error.message }, { status: 400 });
  }
}