/**
 * Reset Password API Route
 * 
 * POST /api/auth/reset-password
 * Handles password reset email sending
 */

import { json } from '@sveltejs/kit';
import { resetPassword } from '$lib/services/auth.js';

/**
 * Handle POST request for password reset
 * @param {Object} params - Request parameters
 * @param {Request} params.request - The request object
 * @returns {Response} JSON response with success status
 */
export async function POST({ request }) {
  try {
    const body = await request.json();
    const { email } = body;

    await resetPassword({ email });

    return json({
      success: true,
      message: 'Password reset email sent'
    }, { status: 200 });
  } catch (error) {
    return json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}