/**
 * Payment Status API Route
 * 
 * GET /api/payments/[id] - Get payment status by ID
 */

import { json } from '@sveltejs/kit';
import { getPaymentStatus } from '$lib/services/payment.js';

/**
 * GET /api/payments/[id]
 * Get payment status by ID
 */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const payment = await getPaymentStatus(id, session.user.id);

    if (!payment) {
      return json({ error: 'Payment not found' }, { status: 404 });
    }

    return json(payment);
  } catch (error) {
    console.error('Get payment status error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}