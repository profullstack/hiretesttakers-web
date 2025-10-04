/**
 * Payments API Routes
 * 
 * POST /api/payments - Initiate a new payment
 * GET /api/payments - Get payment history for current user
 */

import { json } from '@sveltejs/kit';
import { initiatePayment, getPaymentHistory } from '$lib/services/payment.js';

/**
 * POST /api/payments
 * Initiate a new payment for a completed test
 */
export async function POST({ request, locals }) {
  try {
    const session = locals.session;
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { testId, testTakerId, amount, cryptocurrency, testTakerWallet } = body;

    // Validate required fields
    if (!testId || !testTakerId || !amount || !cryptocurrency || !testTakerWallet) {
      return json(
        { error: 'Missing required fields: testId, testTakerId, amount, cryptocurrency, testTakerWallet' },
        { status: 400 }
      );
    }

    // Initiate payment
    const payment = await initiatePayment({
      testId,
      hirerId: session.user.id,
      testTakerId,
      amount,
      cryptocurrency,
      testTakerWallet
    });

    return json(payment, { status: 201 });
  } catch (error) {
    console.error('Payment initiation error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * GET /api/payments
 * Get payment history for current user
 */
export async function GET({ url, locals }) {
  try {
    const session = locals.session;
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const payments = await getPaymentHistory(session.user.id, {
      status,
      limit,
      offset
    });

    return json(payments);
  } catch (error) {
    console.error('Get payment history error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}