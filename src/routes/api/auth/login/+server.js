/**
 * Login API Route
 *
 * POST /api/auth/login
 * Handles user login and sets auth cookies via Supabase SSR
 */

import { json } from '@sveltejs/kit';

/**
 * Handle POST request for user login
 * @param {Object} params - Request parameters
 * @param {Request} params.request - The request object
 * @param {Object} params.locals - SvelteKit locals with supabase client
 * @returns {Response} JSON response with user data or error
 */
export async function POST({ request, locals }) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Use the server-side Supabase client from locals
    // This client is configured with proper cookie handling in hooks.server.js
    const supabase = locals.supabase;
    
    // Sign in with password - this will automatically set cookies via the hooks
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[API /api/auth/login] Login error:', error.message);
      return json({
        success: false,
        error: error.message || 'Invalid credentials'
      }, { status: 401 });
    }

    // Verify session was created
    if (!data.session) {
      console.error('[API /api/auth/login] No session created after login');
      return json({
        success: false,
        error: 'Failed to create session'
      }, { status: 500 });
    }

    console.log('[API /api/auth/login] Login successful for:', email, {
      userId: data.user.id,
      hasSession: !!data.session,
      sessionExpiry: data.session.expires_at
    });

    // Return user data - cookies are already set by Supabase via hooks
    return json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at
      }
    }, { status: 200 });
  } catch (error) {
    console.error('[API /api/auth/login] Unexpected error:', error);
    return json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}