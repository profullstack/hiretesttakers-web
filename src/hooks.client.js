import { createBrowserClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

/** @type {import('@sveltejs/kit').HandleClientError} */
export async function handleError({ error, event }) {
  console.error('Client error:', error);
  return {
    message: 'An error occurred'
  };
}

// Initialize Supabase client for browser
let supabaseClient;

export function getSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = env.PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
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
        document.cookie = cookie;
      },
      remove(key, options) {
        if (typeof document === 'undefined') return;
        let cookie = `${key}=; max-age=0`;
        if (options?.path) cookie += `; path=${options.path}`;
        document.cookie = cookie;
      }
    }
  });

  return supabaseClient;
}