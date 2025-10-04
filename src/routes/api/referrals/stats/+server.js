/**
 * Referral Stats API - GET
 * 
 * GET: Get user's referral statistics
 */

import { json } from '@sveltejs/kit';
import { getReferralStats, getRewardTier } from '$lib/services/referral.js';

/**
 * GET /api/referrals/stats
 * Get user's referral statistics
 */
export async function GET({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getReferralStats(session.user.id);
    const tier = await getRewardTier(session.user.id);

    return json({ stats, tier });
  } catch (error) {
    console.error('Referral stats GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}