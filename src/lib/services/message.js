/**
 * Message Service
 * 
 * Messaging service using Supabase.
 * Provides functions for sending messages, getting conversations, marking as read, etc.
 */

import { getSupabaseClient } from '../supabaseClient.js';

/**
 * Send a message
 * @param {Object} params - Message parameters
 * @param {string} params.applicationId - Application ID
 * @param {string} params.receiverId - Receiver user ID
 * @param {string} params.content - Message content
 * @returns {Promise<Object>} Created message data
 * @throws {Error} If validation fails or send fails
 */
export async function sendMessage({ applicationId, receiverId, content }) {
  if (!applicationId || applicationId.trim() === '') {
    throw new Error('Application ID is required');
  }

  if (!receiverId || receiverId.trim() === '') {
    throw new Error('Receiver ID is required');
  }

  if (!content || content.trim() === '') {
    throw new Error('Message content is required');
  }

  if (content.trim() === '') {
    throw new Error('Message content cannot be empty');
  }

  const supabase = getSupabaseClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User must be authenticated to send messages');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      application_id: applicationId,
      sender_id: user.id,
      receiver_id: receiverId,
      content: content.trim(),
      is_read: false
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Get conversation messages for an application
 * @param {Object} params - Query parameters
 * @param {string} params.applicationId - Application ID
 * @returns {Promise<Array>} Array of messages
 * @throws {Error} If validation fails or query fails
 */
export async function getConversation({ applicationId }) {
  if (!applicationId || applicationId.trim() === '') {
    throw new Error('Application ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Get all conversations for current user
 * @returns {Promise<Array>} Array of conversations with metadata
 * @throws {Error} If query fails
 */
export async function getConversations() {
  const supabase = getSupabaseClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User must be authenticated to get conversations');
  }

  // Get all messages where user is sender or receiver
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  if (!messages || messages.length === 0) {
    return [];
  }

  // Group messages by application_id
  const conversationsMap = new Map();

  for (const message of messages) {
    const appId = message.application_id;
    
    if (!conversationsMap.has(appId)) {
      // Determine the other user in the conversation
      const otherUserId = message.sender_id === user.id 
        ? message.receiver_id 
        : message.sender_id;

      conversationsMap.set(appId, {
        application_id: appId,
        latest_message: message,
        unread_count: 0,
        other_user: otherUserId
      });
    }

    // Count unread messages (where current user is receiver and message is unread)
    if (message.receiver_id === user.id && !message.is_read) {
      const conv = conversationsMap.get(appId);
      conv.unread_count++;
    }
  }

  return Array.from(conversationsMap.values());
}

/**
 * Mark a message as read
 * @param {Object} params - Update parameters
 * @param {string} params.messageId - Message ID
 * @returns {Promise<Object>} Updated message data
 * @throws {Error} If validation fails or update fails
 */
export async function markAsRead({ messageId }) {
  if (!messageId || messageId.trim() === '') {
    throw new Error('Message ID is required');
  }

  const supabase = getSupabaseClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User must be authenticated to mark messages as read');
  }

  // First check if user is the receiver
  const { data: message, error: fetchError } = await supabase
    .from('messages')
    .select('receiver_id')
    .eq('id', messageId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (message.receiver_id !== user.id) {
    throw new Error('Not authorized to mark this message as read');
  }

  const { data, error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('id', messageId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Get unread message count
 * @param {Object} [params] - Optional query parameters
 * @param {string} [params.applicationId] - Filter by application ID
 * @returns {Promise<number>} Count of unread messages
 * @throws {Error} If query fails
 */
export async function getUnreadCount({ applicationId } = {}) {
  const supabase = getSupabaseClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User must be authenticated to get unread count');
  }

  let query = supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('receiver_id', user.id)
    .eq('is_read', false);

  if (applicationId) {
    query = query.eq('application_id', applicationId);
  }

  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count || 0;
}