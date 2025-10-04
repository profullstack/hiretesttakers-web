import { json } from '@sveltejs/kit';
import { getSpecialists } from '$lib/services/reputation.js';

/**
 * GET /api/reputation/specialists/[type]
 * Get specialists for a specific service type
 */
export async function GET({ params, url }) {
  try {
    const { type } = params;
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const minServices = parseInt(url.searchParams.get('minServices') || '5', 10);

    if (!type) {
      return json({ error: 'Service type is required' }, { status: 400 });
    }

    const specialists = await getSpecialists(type, { limit, minServices });

    return json({ specialists });
  } catch (error) {
    console.error('Error fetching specialists:', error);
    return json({ error: 'Failed to fetch specialists' }, { status: 500 });
  }
}