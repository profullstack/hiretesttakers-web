/**
 * Payment Method Management API
 * PUT /api/payments/methods/[id] - Set as default
 * DELETE /api/payments/methods/[id] - Delete payment method
 */

import { json } from '@sveltejs/kit';
import { setDefaultPaymentMethod, deletePaymentMethod } from '$lib/services/payment-enhanced.js';

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    await setDefaultPaymentMethod(session.user.id, params.id);
    return json({ success: true });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return json({ error: error.message }, { status: 400 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params, locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deletePaymentMethod(session.user.id, params.id);
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return json({ error: error.message }, { status: 400 });
  }
}