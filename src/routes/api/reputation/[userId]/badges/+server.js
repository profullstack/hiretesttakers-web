import { json } from '@sveltejs/kit';
import { getUserBadges } from '$lib/services/reputation.js';

/**
 * GET /api/reputation/[userId]/badges
 * Get all badges earned by a user
 */
export async function GET({ params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }

    const badges = await getUserBadges(userId);

    return json({ badges });
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
}