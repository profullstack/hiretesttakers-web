/**
 * Resources API Endpoints
 * GET /api/resources - List resources with filters
 * POST /api/resources - Create a new resource
 */

import { json } from '@sveltejs/kit';
import {
  getResources,
  createResource,
  searchResources
} from '$lib/services/resources.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, locals }) {
  try {
    const searchQuery = url.searchParams.get('q');

    // If search query provided, use search
    if (searchQuery) {
      const filters = {
        type: url.searchParams.get('type'),
        subject: url.searchParams.get('subject'),
        status: url.searchParams.get('status')
      };

      const results = await searchResources(searchQuery, filters);
      return json(results);
    }

    // Otherwise, get resources with filters
    const filters = {
      status: url.searchParams.get('status') || 'published',
      type: url.searchParams.get('type'),
      subject: url.searchParams.get('subject'),
      tags: url.searchParams.get('tags')?.split(',').filter(Boolean),
      author_id: url.searchParams.get('author_id'),
      limit: parseInt(url.searchParams.get('limit') || '50'),
      offset: parseInt(url.searchParams.get('offset') || '0'),
      sortBy: url.searchParams.get('sortBy') || 'created_at',
      sortOrder: url.searchParams.get('sortOrder') || 'desc'
    };

    const resources = await getResources(filters);
    return json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return json(
      { error: error.message || 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
  try {
    const session = await locals.getSession?.();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resourceData = await request.json();

    // Set author_id from session
    resourceData.author_id = session.user.id;

    const resource = await createResource(resourceData);
    return json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return json(
      { error: error.message || 'Failed to create resource' },
      { status: 400 }
    );
  }
}