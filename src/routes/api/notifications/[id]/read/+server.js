/**
 * Mark Notification as Read API
 * 
 * PUT: Mark a specific notification as read
 */

import { json } from '@sveltejs/kit';
import { markAsRead } from '$lib/services/notification.js';

/**
 * PUT /api/notifications/[id]/read
 * Mark a notification as read
 */
export async function PUT({ locals, params }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return json({ error: 'Notification ID is required' }, { status: 400 });
    }

    const success = await markAsRead(id, session.user.id);

    if (!success) {
      return json({ error: 'Notification not found or already read' }, { status: 404 });
    }

    return json({ success: true });
  } catch (error) {
    console.error('Mark as read PUT error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}