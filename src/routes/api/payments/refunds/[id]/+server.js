/**
 * Refund Status API
 * GET /api/payments/refunds/[id] - Get refund status
 */

import { json } from '@sveltejs/kit';
import { getRefundStatus } from '$lib/services/payment-enhanced.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const refund = await getRefundStatus(params.id);
    
    if (!refund) {
      return json({ error: 'Refund not found' }, { status: 404 });
    }

    return json(refund);
  } catch (error) {
    console.error('Error fetching refund status:', error);
    return json({ error: error.message }, { status: 500 });
  }
}