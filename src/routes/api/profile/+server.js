/**
 * Profile API - GET and PUT
 * 
 * GET: Get current user's profile
 * PUT: Update current user's profile
 */

import { json } from '@sveltejs/kit';
import { getProfile, updateProfile } from '$lib/services/profile.js';

/**
 * GET /api/profile
 * Get current user's profile
 */
export async function GET({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfile(session.user.id);

    if (!profile) {
      return json({ error: 'Profile not found' }, { status: 404 });
    }

    return json({ profile });
  } catch (error) {
    console.error('Profile GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/profile
 * Update current user's profile
 */
export async function PUT({ request, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    const profile = await updateProfile(session.user.id, updates);

    return json({ profile });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}