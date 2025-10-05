import { redirect } from '@sveltejs/kit';
import { getSupabaseClient } from '$lib/supabaseClient.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
  const supabase = getSupabaseClient();
  
  // Get the session from cookies
  const { data: { session } } = await supabase.auth.getSession();
  
  // If no session, redirect to login
  if (!session) {
    throw redirect(303, '/auth/login?redirectTo=/browse-tests/new');
  }
  
  // Return user data if authenticated
  return {
    user: session.user
  };
}