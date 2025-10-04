/**
 * Referral Code API - GET
 * 
 * GET: Get or generate user's referral code
 */

import { json } from '@sveltejs/kit';
import { generateReferralCode, getReferralCode } from '$lib/services/referral.js';

/**
 * GET /api/referrals/code
 * Get or generate user's referral code
 */
export async function GET({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try to get existing code first
    let code = await getReferralCode(session.user.id);

    // Generate if doesn't exist
    if (!code) {
      code = await generateReferralCode(session.user.id);
    }

    return json({ code });
  } catch (error) {
    console.error('Referral code GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}