/**
 * Signup API Route
 * 
 * POST /api/auth/signup
 * Handles user registration
 */

import { json } from '@sveltejs/kit';
import { signUp } from '$lib/services/auth.js';

/**
 * Handle POST request for user signup
 * @param {Object} params - Request parameters
 * @param {Request} params.request - The request object
 * @returns {Response} JSON response with user data or error
 */
export async function POST({ request }) {
  try {
    const body = await request.json();
    const { email, password, metadata } = body;

    const result = await signUp({ email, password, metadata });

    return json({
      success: true,
      user: result.user,
      session: result.session
    }, { status: 201 });
  } catch (error) {
    return json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}