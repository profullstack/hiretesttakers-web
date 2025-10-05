/**
 * Applicants API - GET
 * 
 * GET: Get all applicants for tests owned by the current user (tutor/admin view)
 */

import { json } from '@sveltejs/kit';

/**
 * GET /api/applicants
 * Get all applicants for tests owned by the current user
 */
export async function GET({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all applications for tests created by this user
    const { data: applicants, error } = await locals.supabase
      .from('applications')
      .select(`
        *,
        tests!inner(
          id,
          title,
          description,
          creator_id
        ),
        profiles!applications_test_taker_id_fkey(
          id,
          username,
          email
        )
      `)
      .eq('tests.creator_id', session.user.id)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Applicants GET error:', error);
      return json({ error: error.message }, { status: 500 });
    }

    return json({ applicants: applicants || [] });
  } catch (error) {
    console.error('Applicants GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}