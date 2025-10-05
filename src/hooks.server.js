import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const supabaseUrl = env.PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
  
  // Create Supabase server client with proper cookie handling
  event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => {
        event.cookies.set(key, value, {
          ...options,
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: options?.maxAge ?? 60 * 60 * 24 * 7 // 7 days default
        });
      },
      remove: (key, options) => {
        event.cookies.delete(key, {
          ...options,
          path: '/'
        });
      }
    }
  });

  // Get session from Supabase - this will read from cookies
  const { data: { session }, error } = await event.locals.supabase.auth.getSession();
  
  console.log('[hooks.server.js] Session check:', {
    hasSession: !!session,
    userId: session?.user?.id,
    email: session?.user?.email,
    error: error?.message
  });
  
  // Make session and user available to endpoints via locals
  event.locals.session = session;
  event.locals.user = session?.user ?? null;
  
  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
}