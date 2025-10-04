/**
 * Homework API Routes
 * 
 * GET /api/homework - List homework requests with filters
 * POST /api/homework - Create new homework request
 */

import { json } from '@sveltejs/kit';
import {
  getHomeworkRequests,
  createHomeworkRequest,
  getSubjects
} from '$lib/services/homework.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  try {
    // Check if requesting subjects list
    if (url.searchParams.get('subjects') === 'true') {
      const subjects = await getSubjects();
      return json({ subjects });
    }

    // Get homework requests with filters
    const filters = {
      status: url.searchParams.get('status'),
      difficulty_level: url.searchParams.get('difficulty_level'),
      subject_id: url.searchParams.get('subject_id'),
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

    const requests = await getHomeworkRequests(filters);
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

    // Add user_id from session
    const homeworkRequest = await createHomeworkRequest({
      ...requestData,
      user_id: session.user.id
    });

    return json({ request: homeworkRequest }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}