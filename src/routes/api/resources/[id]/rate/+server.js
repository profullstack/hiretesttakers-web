/**
 * Resource Rating API Endpoint
 * POST /api/resources/[id]/rate - Rate a resource
 * GET /api/resources/[id]/rate - Get user's rating for a resource
 */

import { json } from '@sveltejs/kit';
import { rateResource, getUserRating } from '$lib/services/resources.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request, locals }) {
  try {
    const session = await locals.getSession?.();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { rating, review } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const ratingData = {
      resource_id: id,
      user_id: session.user.id,
      rating,
      review
    };

    const result = await rateResource(ratingData);
    return json(result);
  } catch (error) {
    console.error('Error rating resource:', error);
    return json(
      { error: error.message || 'Failed to rate resource' },
      { status: 400 }
    );
  }
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const session = await locals.getSession?.();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const rating = await getUserRating(id, session.user.id);

    if (!rating) {
      return json({ error: 'Rating not found' }, { status: 404 });
    }

    return json(rating);
  } catch (error) {
    console.error('Error fetching user rating:', error);
    return json(
      { error: error.message || 'Failed to fetch rating' },
      { status: 500 }
    );
  }
}