import { json } from '@sveltejs/kit';
import { getTopPerformers } from '$lib/services/reputation.js';

/**
 * GET /api/reputation/top-performers
 * Get top performers by reputation score
 */
export async function GET({ url }) {
  try {
    const serviceType = url.searchParams.get('serviceType');
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);

    const filters = { limit };
    if (serviceType) {
      filters.serviceType = serviceType;
    }

    const topPerformers = await getTopPerformers(filters);

    return json({ topPerformers });
  } catch (error) {
    console.error('Error fetching top performers:', error);
    return json({ error: 'Failed to fetch top performers' }, { status: 500 });
  }
}