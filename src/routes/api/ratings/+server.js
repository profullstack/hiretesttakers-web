import { json } from '@sveltejs/kit';
import { createRating, getRatingsForTestTaker } from '$lib/services/rating.js';

/**
 * POST /api/ratings
 * Create a new rating for a completed test
 */
export async function POST({ request, locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { testId, testTakerId, rating, review } = body;

    if (!testId || !testTakerId || !rating) {
      return json({ error: 'testId, testTakerId, and rating are required' }, { status: 400 });
    }

    const result = await createRating({
      testId,
      hirerId: session.user.id,
      testTakerId,
      rating,
      review,
    });

    if (result.error) {
      return json({ error: result.error.message }, { status: 400 });
    }

    return json({ data: result.data }, { status: 201 });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/ratings?testTakerId=xxx
 * Get all ratings for a test taker
 */
export async function GET({ url }) {
  try {
    const testTakerId = url.searchParams.get('testTakerId');

    if (!testTakerId) {
      return json({ error: 'testTakerId query parameter is required' }, { status: 400 });
    }

    const result = await getRatingsForTestTaker(testTakerId);

    if (result.error) {
      return json({ error: result.error.message }, { status: 400 });
    }

    return json({ data: result.data });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}