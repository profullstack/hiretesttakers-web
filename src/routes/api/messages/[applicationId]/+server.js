/**
 * Messages by Application API - GET
 * 
 * GET: Get all messages for a specific application (conversation)
 */

import { json } from '@sveltejs/kit';
import { getConversation } from '$lib/services/message.js';

/**
 * GET /api/messages/[applicationId]
 * Get all messages for a specific application
 */
export async function GET({ params, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId } = params;

    const messages = await getConversation({ applicationId });

    return json({ messages });
  } catch (error) {
    console.error('Messages GET by application error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}