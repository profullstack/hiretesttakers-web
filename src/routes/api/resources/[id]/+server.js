/**
 * Individual Resource API Endpoints
 * GET /api/resources/[id] - Get resource by ID
 * PUT /api/resources/[id] - Update resource
 * DELETE /api/resources/[id] - Delete resource
 */

import { json } from '@sveltejs/kit';
import {
  getResourceById,
  updateResource,
  deleteResource,
  trackView
} from '$lib/services/resources.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, url }) {
  try {
    const { id } = params;
    const resource = await getResourceById(id);

    if (!resource) {
      return json({ error: 'Resource not found' }, { status: 404 });
    }

    // Track view if requested
    const trackViewParam = url.searchParams.get('trackView');
    if (trackViewParam === 'true') {
      await trackView(id);
    }

    return json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return json(
      { error: error.message || 'Failed to fetch resource' },
      { status: 500 }
    );
  }
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ params, request, locals }) {
  try {
    const session = await locals.getSession?.();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const updates = await request.json();

    // Verify ownership
    const resource = await getResourceById(id);
    if (!resource) {
      return json({ error: 'Resource not found' }, { status: 404 });
    }

    if (resource.author_id !== session.user.id) {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    // Don't allow changing author_id
    delete updates.author_id;

    const updatedResource = await updateResource(id, updates);
    return json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return json(
      { error: error.message || 'Failed to update resource' },
      { status: 400 }
    );
  }
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ params, locals }) {
  try {
    const session = await locals.getSession?.();
    if (!session) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Verify ownership
    const resource = await getResourceById(id);
    if (!resource) {
      return json({ error: 'Resource not found' }, { status: 404 });
    }

    if (resource.author_id !== session.user.id) {
      return json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteResource(id);
    return json({ success: true });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return json(
      { error: error.message || 'Failed to delete resource' },
      { status: 500 }
    );
  }
}