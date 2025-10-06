/**
 * Plagiarism Reports API
 * 
 * GET /api/plagiarism-reports?jobId=xxx - List plagiarism reports for a job
 * POST /api/plagiarism-reports - Generate a new plagiarism report
 */

import { json } from '@sveltejs/kit';
import { generatePlagiarismReport, getPlagiarismReports } from '$lib/services/plagiarism.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobId = url.searchParams.get('jobId');
    const includeArchived = url.searchParams.get('includeArchived') === 'true';

    if (!jobId) {
      return json({ error: 'Job ID is required' }, { status: 400 });
    }

    const reports = await getPlagiarismReports(jobId, includeArchived);

    return json({ reports }, { status: 200 });
  } catch (error) {
    console.error('Error fetching plagiarism reports:', error);
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

    const { jobId, content } = await request.json();

    if (!jobId) {
      return json({ error: 'Job ID is required' }, { status: 400 });
    }

    if (!content) {
      return json({ error: 'Content is required' }, { status: 400 });
    }

    const report = await generatePlagiarismReport(jobId, content);

    return json({ report }, { status: 201 });
  } catch (error) {
    console.error('Error generating plagiarism report:', error);
    return json({ error: error.message }, { status: 400 });
  }
}