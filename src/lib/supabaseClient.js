/**
 * Supabase Client
 *
 * Singleton Supabase client for database and auth operations.
 * Uses environment variables for configuration.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

let supabaseInstance = null;

/**
 * Create a new Supabase client
 * 
 * @param {string} supabaseUrl - Supabase project URL
 * @param {string} supabaseAnonKey - Supabase anonymous key
 * @returns {Object} Supabase client instance
 * @throws {Error} If URL or key is missing
 */
export function createClient(supabaseUrl, supabaseAnonKey) {
  if (!supabaseUrl || supabaseUrl.trim() === '') {
    throw new Error('Supabase URL is required');
  }
  
  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    throw new Error('Supabase anon key is required');
  }
  
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'sb-auth-token',
      flowType: 'pkce'
    }
  });
}

/**
 * Get singleton Supabase client instance
 * 
 * @returns {Object} Supabase client instance
 * @throws {Error} If environment variables are not set
 */
export function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }
  
  const supabaseUrl = env.PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  
  return supabaseInstance;
}

/**
 * Reset singleton instance (useful for testing)
 */
export function resetSupabaseClient() {
  supabaseInstance = null;
}

// Default export for convenience
export const supabase = getSupabaseClient();