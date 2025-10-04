/**
 * Bonus Transactions API - GET
 * 
 * GET: Get user's bonus transactions
 */

import { json } from '@sveltejs/kit';
import { getBonusTransactions } from '$lib/services/referral.js';

/**
 * GET /api/referrals/bonuses
 * Get user's bonus transactions
 */
export async function GET({ url, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const type = url.searchParams.get('type');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const options = {};
    if (type) options.type = type;
    if (limit) options.limit = limit;

    const bonuses = await getBonusTransactions(session.user.id, options);

    return json({ bonuses });
  } catch (error) {
    console.error('Bonus transactions GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}