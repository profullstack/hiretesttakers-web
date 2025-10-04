/**
 * Notifications API
 * 
 * GET: Get user's notifications with optional filters
 */

import { json } from '@sveltejs/kit';
import { getNotifications } from '$lib/services/notification.js';

/**
 * GET /api/notifications
 * Get user's notifications
 * Query params: read (boolean), type (string), limit (number)
 */
export async function GET({ locals, url }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const filters = {};
    
    const readParam = url.searchParams.get('read');
    if (readParam !== null) {
      filters.read = readParam === 'true';
    }

    const type = url.searchParams.get('type');
    if (type) {
      filters.type = type;
    }

    const limit = url.searchParams.get('limit');
    if (limit) {
      filters.limit = parseInt(limit, 10);
    }

    const notifications = await getNotifications(session.user.id, filters);

    return json({ notifications });
  } catch (error) {
    console.error('Notifications GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}