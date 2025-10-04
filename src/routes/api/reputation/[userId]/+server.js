import { json } from '@sveltejs/kit';
import { getUserMetrics, calculateReputationScore } from '$lib/services/reputation.js';

/**
 * GET /api/reputation/[userId]
 * Get user's reputation score and metrics
 */
export async function GET({ params }) {
  try {
    const { userId } = params;

    if (!userId) {
      return json({ error: 'User ID is required' }, { status: 400 });
    }

    const metrics = await getUserMetrics(userId);

    if (!metrics) {
      return json({ error: 'User metrics not found' }, { status: 404 });
    }

    // Calculate current reputation score
    const reputationScore = await calculateReputationScore(userId);

    return json({
      ...metrics,
      reputation_score: reputationScore,
    });
  } catch (error) {
    console.error('Error fetching reputation:', error);
    return json({ error: 'Failed to fetch reputation' }, { status: 500 });
  }
}