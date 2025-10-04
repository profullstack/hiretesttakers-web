/**
 * Refunds API
 * POST /api/payments/refunds - Request a refund
 */

import { json } from '@sveltejs/kit';
import { requestRefund } from '$lib/services/payment-enhanced.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const refund = await requestRefund({
      ...data,
      requesterId: session.user.id
    });

    return json(refund, { status: 201 });
  } catch (error) {
    console.error('Error requesting refund:', error);
    return json({ error: error.message }, { status: 400 });
  }
}