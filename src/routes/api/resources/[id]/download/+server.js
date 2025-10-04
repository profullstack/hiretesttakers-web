/**
 * Resource Download Tracking API Endpoint
 * POST /api/resources/[id]/download - Track a download
 */

import { json } from '@sveltejs/kit';
import { trackDownload, getResourceById } from '$lib/services/resources.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params }) {
  try {
    const { id } = params;

    // Verify resource exists
    const resource = await getResourceById(id);
    if (!resource) {
      return json({ error: 'Resource not found' }, { status: 404 });
    }

    await trackDownload(id);
    return json({ success: true });
  } catch (error) {
    console.error('Error tracking download:', error);
    return json(
      { error: error.message || 'Failed to track download' },
      { status: 500 }
    );
  }
}