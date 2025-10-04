/**
 * Login API Route
 * 
 * POST /api/auth/login
 * Handles user login
 */

import { json } from '@sveltejs/kit';
import { signIn } from '$lib/services/auth.js';

/**
 * Handle POST request for user login
 * @param {Object} params - Request parameters
 * @param {Request} params.request - The request object
 * @returns {Response} JSON response with user data or error
 */
export async function POST({ request }) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const result = await signIn({ email, password });

    return json({
      success: true,
      user: result.user,
      session: result.session
    }, { status: 200 });
  } catch (error) {
    return json({
      success: false,
      error: error.message
    }, { status: 401 });
  }
}