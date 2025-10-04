/**
 * Public Profile API - GET
 * 
 * GET: Get public profile by username
 */

import { json } from '@sveltejs/kit';
import { getPublicProfile } from '$lib/services/profile.js';

/**
 * GET /api/profile/public/[username]
 * Get public profile by username
 */
export async function GET({ params }) {
  try {
    const { username } = params;

    if (!username) {
      return json({ error: 'Username is required' }, { status: 400 });
    }

    const profile = await getPublicProfile(username);

    if (!profile) {
      return json({ error: 'Profile not found or not public' }, { status: 404 });
    }

    return json({ profile });
  } catch (error) {
    console.error('Public profile GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}