/**
 * Logout API Route
 *
 * POST /api/auth/logout
 * Handles user logout and clears auth cookies via Supabase SSR
 */

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ locals }) {
  try {
    const supabase = locals.supabase;
    
    if (!supabase) {
      console.error('[API /api/auth/logout] No Supabase client available');
      return json({
        success: false,
        error: 'Authentication service unavailable'
      }, { status: 500 });
    }

    // Sign out - this will automatically clear cookies via hooks.server.js
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('[API /api/auth/logout] Logout error:', error.message);
      return json({
        success: false,
        error: error.message
      }, { status: 500 });
    }

    console.log('[API /api/auth/logout] Logout successful');

    return json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('[API /api/auth/logout] Unexpected error:', error);
    return json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}