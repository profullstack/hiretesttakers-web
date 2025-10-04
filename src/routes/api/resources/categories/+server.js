/**
 * Resource Categories API Endpoint
 * GET /api/resources/categories - Get all categories
 */

import { json } from '@sveltejs/kit';
import { getCategories } from '$lib/services/resources.js';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
  try {
    const categories = await getCategories();
    return json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}