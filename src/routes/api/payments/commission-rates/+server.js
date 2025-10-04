/**
 * Commission Rates API
 * GET /api/payments/commission-rates - Get all commission rates
 */

import { json } from '@sveltejs/kit';
import { getCommissionRates } from '$lib/services/payment-enhanced.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const rates = await getCommissionRates();
    return json(rates);
  } catch (error) {
    console.error('Error fetching commission rates:', error);
    return json({ error: error.message }, { status: 500 });
  }
}