/**
 * Reward Tiers API - GET
 * 
 * GET: Get all reward tiers
 */

import { json } from '@sveltejs/kit';
import { getRewardTiers } from '$lib/services/referral.js';

/**
 * GET /api/referrals/rewards
 * Get all reward tiers
 */
export async function GET() {
  try {
    const tiers = await getRewardTiers();

    return json({ tiers });
  } catch (error) {
    console.error('Reward tiers GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}