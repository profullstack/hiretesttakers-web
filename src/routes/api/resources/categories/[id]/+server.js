/**
 * Category Resources API Endpoint
 * GET /api/resources/categories/[id] - Get resources by category
 */

import { json } from '@sveltejs/kit';
import { getResourcesByCategory } from '$lib/services/resources.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params }) {
  try {
    const { id } = params;
    const resources = await getResourcesByCategory(id);
    return json(resources);
  } catch (error) {
    console.error('Error fetching resources by category:', error);
    return json(
      { error: error.message || 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}