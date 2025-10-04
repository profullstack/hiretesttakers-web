/**
 * Update Password API Route
 * 
 * POST /api/auth/update-password
 * Handles password update for authenticated users
 */

import { json } from '@sveltejs/kit';
import { updatePassword } from '$lib/services/auth.js';

/**
 * Handle POST request for password update
 * @param {Object} params - Request parameters
 * @param {Request} params.request - The request object
 * @returns {Response} JSON response with success status
 */
export async function POST({ request }) {
  try {
    const body = await request.json();
    const { newPassword } = body;

    const result = await updatePassword({ newPassword });

    return json({
      success: true,
      user: result.user
    }, { status: 200 });
  } catch (error) {
    return json({
      success: false,
      error: error.message
    }, { status: 400 });
  }
}