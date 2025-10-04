import { json } from '@sveltejs/kit';
import { getUserStats, getUserLeaderboardProfile } from '$lib/services/leaderboard.js';

/**
 * GET /api/leaderboard/[userId]
 * Fetch stats and profile for a specific user
 */
export async function GET({ params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get both stats and leaderboard profile
    const [statsResult, profileResult] = await Promise.all([
      getUserStats(userId),
      getUserLeaderboardProfile(userId),
    ]);

    if (statsResult.error && profileResult.error) {
      return json({ error: 'User not found' }, { status: 404 });
    }

    return json({
      stats: statsResult.data,
      profile: profileResult.data,
    });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
}