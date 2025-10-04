/**
 * Payment Methods API
 * GET /api/payments/methods - Get user's payment methods
 * POST /api/payments/methods - Add new payment method
 */

import { json } from '@sveltejs/kit';
import { getPaymentMethods, addPaymentMethod } from '$lib/services/payment-enhanced.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const methods = await getPaymentMethods(session.user.id);
    return json(methods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const method = await addPaymentMethod({
      userId: session.user.id,
      ...data
    });

    return json(method, { status: 201 });
  } catch (error) {
    console.error('Error adding payment method:', error);
    return json({ error: error.message }, { status: 400 });
  }
}