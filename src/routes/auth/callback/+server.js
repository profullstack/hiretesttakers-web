import { redirect } from '@sveltejs/kit';

/**
 * Auth callback handler for email confirmation and OAuth flows
 * Supabase redirects here after email confirmation or OAuth login
 */
export async function GET({ url, locals }) {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		
		if (!error) {
			throw redirect(303, `/${next.slice(1)}`);
		}
	}

	// If no code or error, redirect to error page or home
	throw redirect(303, '/auth/login?error=auth_callback_failed');
}