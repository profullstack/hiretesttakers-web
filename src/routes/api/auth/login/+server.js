/**
 * Login API Route
 *
 * POST /api/auth/login
 * Handles user login and sets auth cookies
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

    const supabase = locals.supabase;
    
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

    console.log('[API /api/auth/login] Login successful for:', email);

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
      error: error.message
    }, { status: 500 });
  }
}