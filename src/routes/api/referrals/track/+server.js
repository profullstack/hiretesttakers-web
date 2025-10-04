/**
 * Track Referral API - POST
 * 
 * POST: Track a new referral
 */

import { json } from '@sveltejs/kit';
import { trackReferral } from '$lib/services/referral.js';

/**
 * POST /api/referrals/track
 * Track a new referral
 */
export async function POST({ request, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { referralCode } = await request.json();

    if (!referralCode) {
      return json({ error: 'Referral code is required' }, { status: 400 });
    }

    const referral = await trackReferral(referralCode, session.user.id);

    return json({ referral }, { status: 201 });
  } catch (error) {
    console.error('Track referral error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}