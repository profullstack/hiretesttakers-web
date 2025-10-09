/**
 * Assignment Quality Report API Route
 * 
 * GET /api/jobs/[id]/quality-report - Get quality report for assignment
 */

import { json } from '@sveltejs/kit';
import { generateQualityReport } from '$lib/services/job.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const report = await generateQualityReport(params.id);

    return json({ report });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}