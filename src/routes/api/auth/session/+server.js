/**
 * Session API Route
 * 
 * GET /api/auth/session
 * Returns current user session
 */

import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ locals }) {
  const session = locals.session;
  const user = locals.user;
  
  if (!session || !user) {
    return json({ user: null }, { status: 200 });
  }

  return json({
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    }
  }, { status: 200 });
}