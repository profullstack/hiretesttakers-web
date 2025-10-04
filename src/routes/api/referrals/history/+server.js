/**
 * Referral History API - GET
 * 
 * GET: Get user's referral history
 */

import { json } from '@sveltejs/kit';
import { getReferralHistory } from '$lib/services/referral.js';

/**
 * GET /api/referrals/history
 * Get user's referral history
 */
export async function GET({ url, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    const options = {};
    if (status) options.status = status;
    if (limit) options.limit = limit;

    const history = await getReferralHistory(session.user.id, options);

    return json({ history });
  } catch (error) {
    console.error('Referral history GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}