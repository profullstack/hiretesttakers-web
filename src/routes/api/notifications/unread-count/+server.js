/**
 * Notifications Unread Count API
 * 
 * GET: Get count of unread notifications
 */

import { json } from '@sveltejs/kit';
import { getUnreadCount } from '$lib/services/notification.js';

/**
 * GET /api/notifications/unread-count
 * Get count of unread notifications for the current user
 */
export async function GET({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const count = await getUnreadCount(session.user.id);

    return json({ count });
  } catch (error) {
    console.error('Unread count GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}