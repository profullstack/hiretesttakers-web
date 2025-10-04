/**
 * Individual Job Offer API Routes
 * 
 * GET /api/job-offers/[id] - Get specific job offer
 * PATCH /api/job-offers/[id] - Update job offer status (accept/reject/withdraw)
 * DELETE /api/job-offers/[id] - Delete job offer (not implemented - use withdraw instead)
 */

import { json } from '@sveltejs/kit';
import {
  getJobOffer,
  updateJobOfferStatus,
  withdrawJobOffer
} from '$lib/services/jobOffer.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;
    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offer = await getJobOffer(params.id);
    
    if (!offer) {
      return json({ error: 'Job offer not found' }, { status: 404 });
    }

    // Check if user has access to this offer
    if (offer.employer_id !== session.user.id && offer.test_taker_id !== session.user.id) {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    return json({ offer });
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

    const { action, status } = await request.json();

    // Get the offer first to check permissions
    const offer = await getJobOffer(params.id);
    
    if (!offer) {
      return json({ error: 'Job offer not found' }, { status: 404 });
    }

    // Handle withdraw action (employer only)
    if (action === 'withdraw') {
      if (offer.employer_id !== session.user.id) {
        return json({ error: 'Only employer can withdraw offer' }, { status: 403 });
      }

      const updatedOffer = await withdrawJobOffer(params.id);
      return json({ offer: updatedOffer });
    }

    // Handle status update (test taker only - accept/reject)
    if (status) {
      if (offer.test_taker_id !== session.user.id) {
        return json({ error: 'Only test taker can accept/reject offer' }, { status: 403 });
      }

      if (status !== 'accepted' && status !== 'rejected') {
        return json({ error: 'Invalid status. Must be accepted or rejected' }, { status: 400 });
      }

      const updatedOffer = await updateJobOfferStatus({
        id: params.id,
        status
      });

      return json({ offer: updatedOffer });
    }

    return json({ error: 'Invalid action or status' }, { status: 400 });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}