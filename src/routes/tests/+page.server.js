import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient.js';

export async function load({ cookies, url }) {
  try {
    // Get session from cookies
    const accessToken = cookies.get('sb-access-token');
    const refreshToken = cookies.get('sb-refresh-token');

    if (!accessToken || !refreshToken) {
      // No session, redirect to login with return URL
      throw redirect(302, `/auth/login?ref=${url.pathname}`);
    }

    // Verify session is valid
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      // Invalid session, redirect to login
      throw redirect(302, `/auth/login?ref=${url.pathname}`);
    }

    // User is authenticated, allow access
    return {
      user
    };
  } catch (error) {
    // If it's already a redirect, re-throw it
    if (error?.status === 302) {
      throw error;
    }
    
    // Otherwise redirect to login
    throw redirect(302, `/auth/login?ref=${url.pathname}`);
  }
}