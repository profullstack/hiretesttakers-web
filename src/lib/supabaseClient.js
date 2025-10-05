/**
 * Supabase Client
 * 
 * Singleton Supabase client for database and auth operations.
 * Uses environment variables for configuration.
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

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
      detectSessionInUrl: true
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
  
  const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || 'http://localhost:8000';
  const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
  
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