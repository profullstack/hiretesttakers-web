/**
 * Client-side hooks for SvelteKit
 *
 * Handles client-side error reporting and Supabase client initialization.
 * The Supabase client is now managed through supabaseClient.js using @supabase/ssr.
 */

import { getSupabaseClient } from '$lib/supabaseClient';

/** @type {import('@sveltejs/kit').HandleClientError} */
export async function handleError({ error, event }) {
  console.error('Client error:', error);
  return {
    message: 'An error occurred'
  };
}

/**
 * Get the browser Supabase client
 * This is a convenience wrapper around the supabaseClient.js export
 *
 * @returns {Object} Supabase client instance
 */
export function getSupabaseBrowserClient() {
  return getSupabaseClient();
}