/**
 * Messages API - GET and POST
 * 
 * GET: Get all conversations for current user
 * POST: Send a new message
 */

import { json } from '@sveltejs/kit';
import {
  sendMessage,
  getConversations
} from '$lib/services/message.js';

/**
 * GET /api/messages
 * Get all conversations for the current user
 */
export async function GET({ locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await getConversations();

    return json({ conversations });
  } catch (error) {
    console.error('Messages GET error:', error);
    return json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/messages
 * Send a new message
 */
export async function POST({ request, locals }) {
  try {
    const session = locals.session;

    if (!session?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { applicationId, receiverId, content } = await request.json();

    const message = await sendMessage({
      applicationId,
      receiverId,
      content
    });

    return json({ message }, { status: 201 });
  } catch (error) {
    console.error('Messages POST error:', error);
    return json({ error: error.message }, { status: 400 });
  }
}