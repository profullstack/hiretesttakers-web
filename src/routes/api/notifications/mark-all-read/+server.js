/**
 * Mark All Notifications as Read API
 * 
 * PUT: Mark all notifications as read for the current user
 */

import { json } from '@sveltejs/kit';
import { markAllAsRead } from '$lib/services/notification.js';

/**
 * PUT /api/notifications/mark-all-read
 * Mark all notifications as read
 */
export async function PUT({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const count = await markAllAsRead(session.user.id);

    return json({ count, success: true });
  } catch (error) {
    console.error('Mark all as read PUT error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}