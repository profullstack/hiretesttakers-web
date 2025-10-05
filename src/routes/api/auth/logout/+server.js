/**
 * Logout API Route
 * 
 * POST /api/auth/logout
 * Handles user logout
 */

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ locals }) {
  try {
    const supabase = locals.supabase;
    
    if (supabase) {
      await supabase.auth.signOut();
    }

    return json({
      success: true,
      message: 'Logged out successfully'
    }, { status: 200 });
  } catch (error) {
    return json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}