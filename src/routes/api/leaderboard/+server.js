import { json } from '@sveltejs/kit';
import { getLeaderboard, getLeaderboardWithFilters } from '$lib/services/leaderboard.js';

/**
 * GET /api/leaderboard
 * Fetch leaderboard data with optional filters
 */
export async function GET({ url }) {
  try {
    // Parse query parameters
    const sortBy = url.searchParams.get('sortBy') || 'tests_completed';
    const location = url.searchParams.get('location') || null;
    const skillsParam = url.searchParams.get('skills');
    const skills = skillsParam ? skillsParam.split(',') : null;
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    // Use filtered query if any filters are provided
    const hasFilters = sortBy !== 'tests_completed' || location || skills;

    const result = hasFilters
      ? await getLeaderboardWithFilters({ sortBy, location, skills, limit, offset })
      : await getLeaderboard({ limit, offset });

    if (result.error) {
      return json({ error: result.error.message }, { status: 400 });
    }

    return json({ data: result.data });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}