# Supabase SSR Authentication Fix

## Overview

Fixed the Supabase SSR authentication system to properly handle cookie-based sessions in SvelteKit. The previous implementation wasn't setting HTTP-only cookies correctly, causing session persistence issues.

## Changes Made

### 1. [`hooks.server.js`](../src/hooks.server.js)
**Problem**: Cookie options weren't properly configured for security and persistence.

**Solution**: 
- Added `httpOnly: true` for security (prevents XSS attacks)
- Added `secure: true` in production (HTTPS only)
- Added `sameSite: 'lax'` for CSRF protection
- Set default `maxAge` to 7 days for session persistence

```javascript
set: (key, value, options) => {
  event.cookies.set(key, value, {
    ...options,
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: options?.maxAge ?? 60 * 60 * 24 * 7 // 7 days default
  });
}
```

### 2. [`supabaseClient.js`](../src/lib/supabaseClient.js)
**Problem**: Used old `@supabase/supabase-js` client instead of SSR-compatible client.

**Solution**:
- Switched from `createClient` to `createBrowserClient` from `@supabase/ssr`
- Implemented proper cookie handling for browser environment
- Added SSR safety check (`typeof window !== 'undefined'`)
- Updated documentation to clarify server vs client usage

### 3. [`hooks.client.js`](../src/hooks.client.js)
**Problem**: Duplicated cookie handling logic unnecessarily.

**Solution**:
- Simplified to use `getSupabaseClient()` from `supabaseClient.js`
- Removed redundant cookie handling code
- Maintained error handling functionality

### 4. [`api/auth/login/+server.js`](../src/routes/api/auth/login/+server.js)
**Problem**: Didn't verify session creation or provide detailed logging.

**Solution**:
- Added session verification after login
- Enhanced error logging with session details
- Added explicit session expiry logging
- Improved error messages

### 5. [`api/auth/logout/+server.js`](../src/routes/api/auth/logout/+server.js)
**Problem**: Minimal error handling and logging.

**Solution**:
- Added proper error handling for missing Supabase client
- Enhanced logging for debugging
- Improved error messages

## How It Works

### Authentication Flow

1. **Login Request**:
   ```
   Client → POST /api/auth/login → Server
   ```
   - Server uses `locals.supabase` (from hooks.server.js)
   - Calls `signInWithPassword()`
   - Supabase automatically sets cookies via hooks

2. **Cookie Storage**:
   ```
   Server → Set-Cookie headers → Browser
   ```
   - Cookies are HTTP-only (secure)
   - Cookies persist for 7 days
   - Cookies are sent with every request

3. **Session Verification**:
   ```
   Client → Any Request → Server
   ```
   - hooks.server.js reads cookies
   - Calls `getSession()` to verify
   - Sets `locals.session` and `locals.user`

4. **API Access**:
   ```
   Client → API Request → Server
   ```
   - API endpoints access `locals.user`
   - RLS policies use authenticated user
   - No manual token management needed

## Testing the Fix

### 1. Test Login Flow

```bash
# Start the dev server
pnpm run dev

# In browser, navigate to:
http://localhost:5173/auth/login

# Login with test credentials
# Check browser DevTools → Application → Cookies
# Should see cookies like:
# - sb-<project>-auth-token
# - sb-<project>-auth-token-code-verifier
```

### 2. Verify Session Persistence

```bash
# After login, refresh the page
# User should remain logged in

# Check server logs for:
[hooks.server.js] Session check: {
  hasSession: true,
  userId: '...',
  email: '...'
}
```

### 3. Test API Endpoints

```bash
# Create a test (requires authentication)
curl -X POST http://localhost:5173/api/tests \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-..." \
  -d '{
    "title": "Test",
    "description": "Test description",
    "budget": 100
  }'

# Should return success, not "User not authenticated"
```

### 4. Test UserDropdown

```bash
# After login, check the header
# UserDropdown should show:
# - User avatar with initials
# - Dropdown menu on click
# - User email in dropdown

# Before login, should show:
# - "Login" button
```

### 5. Test Logout

```bash
# Click logout in UserDropdown
# Should redirect to home page
# Cookies should be cleared
# UserDropdown should show "Login" button
```

## Common Issues and Solutions

### Issue: "User not authenticated" after login

**Cause**: Cookies not being set or read properly.

**Solution**:
1. Check browser DevTools → Application → Cookies
2. Verify cookies are present and not expired
3. Check server logs for session verification
4. Ensure `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are set

### Issue: Session not persisting after page refresh

**Cause**: Cookie maxAge not set or cookies being cleared.

**Solution**:
1. Verify `maxAge` is set in hooks.server.js
2. Check browser cookie settings (not blocking cookies)
3. Ensure `sameSite` and `secure` settings are appropriate

### Issue: CORS errors in production

**Cause**: Cookie settings incompatible with production environment.

**Solution**:
1. Ensure `secure: true` in production
2. Verify domain matches in cookie settings
3. Check Supabase project URL configuration

## Environment Variables

Required environment variables in `.env`:

```bash
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

For local development with Supabase CLI:
```bash
PUBLIC_SUPABASE_URL=http://localhost:54321
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Considerations

1. **HTTP-Only Cookies**: Prevents XSS attacks by making cookies inaccessible to JavaScript
2. **Secure Flag**: Ensures cookies only sent over HTTPS in production
3. **SameSite**: Protects against CSRF attacks
4. **Short-lived Sessions**: 7-day expiry with automatic refresh

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │  supabaseClient.js (createBrowserClient)         │  │
│  │  - Reads cookies from document.cookie            │  │
│  │  - Used for client-side operations               │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests with Cookies
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Server (SvelteKit)                    │
│  ┌──────────────────────────────────────────────────┐  │
│  │  hooks.server.js (createServerClient)            │  │
│  │  - Reads cookies from request                    │  │
│  │  - Sets cookies in response                      │  │
│  │  - Creates locals.supabase for all routes        │  │
│  └──────────────────────────────────────────────────┘  │
│                            │                             │
│                            ▼                             │
│  ┌──────────────────────────────────────────────────┐  │
│  │  API Routes (use locals.supabase)                │  │
│  │  - /api/auth/login                               │  │
│  │  - /api/auth/logout                              │  │
│  │  - /api/auth/session                             │  │
│  │  - /api/tests (requires auth)                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ Authenticated Requests
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase (Backend)                      │
│  - Validates JWT from cookies                            │
│  - Enforces RLS policies                                 │
│  - Returns data based on user permissions                │
└─────────────────────────────────────────────────────────┘
```

## Next Steps

1. Test the authentication flow thoroughly
2. Verify RLS policies work with authenticated users
3. Test test creation with proper authentication
4. Monitor server logs for any authentication issues
5. Consider adding refresh token handling for long sessions

## References

- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side-rendering)
- [SvelteKit Hooks Documentation](https://kit.svelte.dev/docs/hooks)
- [HTTP Cookie Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)