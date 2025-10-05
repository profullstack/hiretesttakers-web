/**
 * Supabase Client
 *
 * SSR-compatible Supabase client for database and auth operations.
 * Uses @supabase/ssr for proper cookie-based authentication.
 *
 * IMPORTANT: For SSR routes, use event.locals.supabase from hooks.server.js
 * This client is primarily for client-side operations.
 */

import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

let supabaseInstance = null;

/**
 * Create a browser-compatible Supabase client with cookie storage
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
  
  // Use createBrowserClient from @supabase/ssr for proper cookie handling
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(key) {
        if (typeof document === 'undefined') return undefined;
        const cookie = document.cookie
          .split('; ')
          .find(row => row.startsWith(`${key}=`));
        return cookie ? decodeURIComponent(cookie.split('=')[1]) : undefined;
      },
      set(key, value, options) {
        if (typeof document === 'undefined') return;
        let cookie = `${key}=${encodeURIComponent(value)}`;
        if (options?.maxAge) cookie += `; max-age=${options.maxAge}`;
        if (options?.path) cookie += `; path=${options.path}`;
        if (options?.domain) cookie += `; domain=${options.domain}`;
        if (options?.sameSite) cookie += `; samesite=${options.sameSite}`;
        if (options?.secure) cookie += '; secure';
        document.cookie = cookie;
      },
      remove(key, options) {
        if (typeof document === 'undefined') return;
        let cookie = `${key}=; max-age=0`;
        if (options?.path) cookie += `; path=${options.path}`;
        if (options?.domain) cookie += `; domain=${options.domain}`;
        document.cookie = cookie;
      }
    }
  });
}

/**
 * Get singleton Supabase client instance for browser
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

// Default export for convenience (client-side only)
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : null;