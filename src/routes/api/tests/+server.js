/**
 * Tests API Routes
 * 
 * GET /api/tests - List tests with filters
 * POST /api/tests - Create new test
 */

import { json } from '@sveltejs/kit';
import { getTests, createTest, searchTests } from '$lib/services/test.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const searchQuery = url.searchParams.get('q');
    
    // If search query provided, use search
    if (searchQuery) {
      const results = await searchTests(searchQuery);
      return json({ tests: results });
    }

    // Otherwise, get tests with filters
    const filters = {
      status: url.searchParams.get('status'),
      cryptocurrency: url.searchParams.get('cryptocurrency'),
      category: url.searchParams.get('category'),
      difficulty: url.searchParams.get('difficulty'),
      limit: parseInt(url.searchParams.get('limit') || '20'),
      offset: parseInt(url.searchParams.get('offset') || '0')
    };

    // Remove null/undefined filters
    Object.keys(filters).forEach(key => {
      if (filters[key] === null || filters[key] === undefined || filters[key] === 'null') {
        delete filters[key];
      }
    });

    const tests = await getTests(filters);
    return json({ tests });
  } catch (error) {
    return json({ error: error.message }, { status: 400 });
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  console.log('[API /api/tests POST] Request received');
  console.log('[API /api/tests POST] locals.session:', {
    hasSession: !!locals.session,
    hasUser: !!locals.session?.user,
    userId: locals.session?.user?.id
  });
  
  try {
    const session = locals.session;
    if (!session?.user) {
      console.log('[API /api/tests POST] Unauthorized - no session or user');
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testData = await request.json();
    console.log('[API /api/tests POST] Creating test for user:', session.user.id);
    const test = await createTest(session.user.id, testData, locals.supabase);
    
    console.log('[API /api/tests POST] Test created successfully:', test.id);
    return json({ test }, { status: 201 });
  } catch (error) {
    console.error('[API /api/tests POST] Error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}