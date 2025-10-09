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

    let profile = await getProfile(session.user.id, locals.supabase);

    // If profile doesn't exist, create it
    if (!profile) {
      const { data: { user: authUser } } = await locals.supabase.auth.getUser();
      
      if (!authUser) {
        return json({ error: 'Authentication required' }, { status: 401 });
      }

      // Create user profile
      const { data: newProfile, error: insertError } = await locals.supabase
        .from('users')
        .insert({
          id: session.user.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || null,
          user_type: 'test_taker'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Failed to create profile:', insertError);
        return json({ error: 'Failed to create profile' }, { status: 500 });
      }

      profile = newProfile;
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

    const profile = await updateProfile(session.user.id, updates, locals.supabase);

    return json({ profile });
  } catch (error) {
    console.error('Profile PUT error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}