/**
 * Messages Stream API - GET (SSE)
 * 
 * GET: Server-Sent Events endpoint for real-time message updates
 */

import { getSupabaseClient } from '$lib/supabaseClient.js';

/**
 * GET /api/messages/stream
 * SSE endpoint for real-time message updates
 */
export async function GET({ locals }) {
  const session = locals.session;

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = getSupabaseClient();

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
      );

      // Subscribe to new messages where user is receiver
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${session.user.id}`
          },
          (payload) => {
            // Send new message to client
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'new_message', message: payload.new })}\n\n`
              )
            );
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${session.user.id}`
          },
          (payload) => {
            // Send message update to client
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'message_updated', message: payload.new })}\n\n`
              )
            );
          }
        )
        .subscribe();

      // Keep connection alive with heartbeat
      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(': heartbeat\n\n'));
      }, 30000); // Every 30 seconds

      // Cleanup on close
      return () => {
        clearInterval(heartbeat);
        supabase.removeChannel(channel);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  });
}