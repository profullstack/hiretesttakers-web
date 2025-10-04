/**
 * Earnings Summary API
 * GET /api/payments/earnings - Get earnings summary for a period
 */

import { json } from '@sveltejs/kit';
import { getEarningsSummary } from '$lib/services/payment-enhanced.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const session = await locals.getSession();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    if (!startDate || !endDate) {
      return json({ error: 'start_date and end_date are required' }, { status: 400 });
    }

    const summary = await getEarningsSummary(session.user.id, startDate, endDate);
    return json(summary);
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    return json({ error: error.message }, { status: 500 });
  }
}