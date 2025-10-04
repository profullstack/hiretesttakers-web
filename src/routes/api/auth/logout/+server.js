/**
 * Logout API Route
 * 
 * POST /api/auth/logout
 * Handles user logout
 */

import { json } from '@sveltejs/kit';
import { signOut } from '$lib/services/auth.js';

/**
 * Handle POST request for user logout
 * @param {Object} params - Request parameters
 * @returns {Response} JSON response with success status
 */
export async function POST() {
  try {
    await signOut();

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