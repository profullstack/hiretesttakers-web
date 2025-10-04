/**
 * Unread Messages Count API - GET
 * 
 * GET: Get count of unread messages for current user
 */

import { json } from '@sveltejs/kit';
import { getUnreadCount } from '$lib/services/message.js';

/**
 * GET /api/messages/unread-count
 * Get unread message count, optionally filtered by application
 */
export async function GET({ url, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const applicationId = url.searchParams.get('applicationId');

    const count = await getUnreadCount(
      applicationId ? { applicationId } : undefined
    );

    return json({ count });
  } catch (error) {
    console.error('Unread count error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}