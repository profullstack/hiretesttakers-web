/**
 * Username API - PUT and GET
 * 
 * PUT: Update username
 * GET: Check username availability
 */

import { json } from '@sveltejs/kit';
import { updateUsername, checkUsernameAvailability } from '$lib/services/profile.js';

/**
 * PUT /api/profile/username
 * Update username
 */
export async function PUT({ request, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username } = await request.json();

    if (!username) {
      return json({ error: 'Username is required' }, { status: 400 });
    }

    const profile = await updateUsername(session.user.id, username);

    return json({ profile });
  } catch (error) {
    console.error('Username update error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}

/**
 * GET /api/profile/username?username=value
 * Check username availability
 */
export async function GET({ url }) {
  try {
    const username = url.searchParams.get('username');

    if (!username) {
      return json({ error: 'Username parameter is required' }, { status: 400 });
    }

    const available = await checkUsernameAvailability(username);

    return json({ available });
  } catch (error) {
    console.error('Username check error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}