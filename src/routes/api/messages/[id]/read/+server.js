/**
 * Mark Message as Read API - PATCH
 * 
 * PATCH: Mark a specific message as read
 */

import { json } from '@sveltejs/kit';
import { markAsRead } from '$lib/services/message.js';

/**
 * PATCH /api/messages/[id]/read
 * Mark a message as read
 */
export async function PATCH({ params, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const message = await markAsRead({ messageId: id });

    return json({ message });
  } catch (error) {
    console.error('Mark as read error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}