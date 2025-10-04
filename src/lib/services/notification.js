/**
 * Notification Service
 * Handles all notification-related operations including creation, retrieval,
 * preferences management, and email notifications.
 */

import { supabase } from '../supabaseClient.js';

/**
 * Replace template variables in a string with actual values
 * @param {string} template - Template string with {{variable}} placeholders
 * @param {Object} data - Data object with variable values
 * @returns {string} - String with variables replaced
 */
const replaceTemplateVariables = (template, data = {}) => {
  if (!template || !data) return template;
  
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return data[key] !== undefined ? data[key] : match;
  });
};

/**
 * Get notification type by name
 * @param {string} typeName - Name of the notification type
 * @returns {Promise<Object>} - Notification type object
 */
const getNotificationType = async (typeName) => {
  const { data, error } = await supabase
    .from('notification_types')
    .select('*')
    .eq('name', typeName)
    .single();

  if (error || !data) {
    throw new Error(`Invalid notification type: ${typeName}`);
  }

  return data;
};

/**
 * Create a new notification
 * @param {string} userId - User ID to send notification to
 * @param {string} typeName - Type of notification (e.g., 'new_message', 'payment_received')
 * @param {Object} options - Notification options
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message
 * @param {Object} options.data - Additional data for the notification
 * @param {Date} options.expiresAt - Optional expiration date
 * @returns {Promise<Object>} - Created notification
 */
export const createNotification = async (userId, typeName, options) => {
  const { title, message, data = {}, expiresAt } = options;

  if (!title || !message) {
    throw new Error('Title and message are required');
  }

  // Get notification type
  const type = await getNotificationType(typeName);

  // Replace template variables in message
  const processedMessage = replaceTemplateVariables(message, data);

  // Create notification
  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type_id: type.id,
      title,
      message: processedMessage,
      data,
      expires_at: expiresAt || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create notification: ${error.message}`);
  }

  return notification;
};

/**
 * Get notifications for a user
 * @param {string} userId - User ID
 * @param {Object} filters - Optional filters
 * @param {boolean} filters.read - Filter by read status
 * @param {string} filters.type - Filter by notification type name
 * @param {number} filters.limit - Limit number of results
 * @returns {Promise<Array>} - Array of notifications
 */
export const getNotifications = async (userId, filters = {}) => {
  const { read, type, limit = 50 } = filters;

  let query = supabase
    .from('notifications')
    .select('*, notification_types(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  // Filter out expired notifications
  query = query.or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

  // Apply read filter
  if (read !== undefined) {
    query = query.eq('read', read);
  }

  // Apply type filter
  if (type) {
    const typeData = await getNotificationType(type);
    query = query.eq('type_id', typeData.id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get notifications: ${error.message}`);
  }

  return data || [];
};

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 * @param {string} userId - User ID (for security check)
 * @returns {Promise<boolean>} - True if successful
 */
export const markAsRead = async (notificationId, userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({
      read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', notificationId)
    .eq('user_id', userId)
    .select();

  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }

  return data && data.length > 0;
};

/**
 * Mark all notifications as read for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Number of notifications marked as read
 */
export const markAllAsRead = async (userId) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({
      read: true,
      read_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('read', false)
    .select();

  if (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`);
  }

  return data ? data.length : 0;
};

/**
 * Get unread notification count for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} - Number of unread notifications
 */
export const getUnreadCount = async (userId) => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)
    .or('expires_at.is.null,expires_at.gt.' + new Date().toISOString());

  if (error) {
    throw new Error(`Failed to get unread count: ${error.message}`);
  }

  return count || 0;
};

/**
 * Get notification preferences for a user
 * @param {string} userId - User ID
 * @param {Object} filters - Optional filters
 * @param {string} filters.type - Filter by notification type name
 * @returns {Promise<Array>} - Array of preferences
 */
export const getPreferences = async (userId, filters = {}) => {
  const { type } = filters;

  let query = supabase
    .from('notification_preferences')
    .select('*, notification_types(*)')
    .eq('user_id', userId);

  // Apply type filter
  if (type) {
    const typeData = await getNotificationType(type);
    query = query.eq('type_id', typeData.id);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get preferences: ${error.message}`);
  }

  return data || [];
};

/**
 * Update notification preferences for a user
 * @param {string} userId - User ID
 * @param {string} typeName - Notification type name
 * @param {Object} preferences - Preference settings
 * @param {boolean} preferences.in_app_enabled - Enable in-app notifications
 * @param {boolean} preferences.email_enabled - Enable email notifications
 * @param {boolean} preferences.push_enabled - Enable push notifications
 * @returns {Promise<Object>} - Updated preferences
 */
export const updatePreferences = async (userId, typeName, preferences) => {
  const type = await getNotificationType(typeName);

  const updateData = {
    user_id: userId,
    type_id: type.id,
    updated_at: new Date().toISOString(),
  };

  // Only include provided fields
  if (preferences.in_app_enabled !== undefined) {
    updateData.in_app_enabled = preferences.in_app_enabled;
  }
  if (preferences.email_enabled !== undefined) {
    updateData.email_enabled = preferences.email_enabled;
  }
  if (preferences.push_enabled !== undefined) {
    updateData.push_enabled = preferences.push_enabled;
  }

  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert(updateData, {
      onConflict: 'user_id,type_id',
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update preferences: ${error.message}`);
  }

  return data;
};

/**
 * Send email notification to a user
 * @param {string} userId - User ID
 * @param {string} typeName - Notification type name
 * @param {Object} data - Data for template variables
 * @returns {Promise<Object|null>} - Email result or null if disabled
 */
export const sendEmailNotification = async (userId, typeName, data = {}) => {
  // Get notification type
  const type = await getNotificationType(typeName);

  // Check if email notifications are enabled for this type
  const preferences = await getPreferences(userId, { type: typeName });
  
  if (preferences.length === 0 || !preferences[0].email_enabled) {
    return null;
  }

  // Get email template
  const { data: template, error: templateError } = await supabase
    .from('notification_templates')
    .select('*')
    .eq('type_id', type.id)
    .eq('channel', 'email')
    .single();

  if (templateError || !template) {
    throw new Error(`Email template not found for type: ${typeName}`);
  }

  // Replace template variables
  const subject = replaceTemplateVariables(template.subject, data);
  const body = replaceTemplateVariables(template.body_template, data);

  // TODO: Integrate with actual email service (e.g., SendGrid, AWS SES, etc.)
  // For now, we'll just return the prepared email data
  const emailData = {
    userId,
    subject,
    body,
    type: typeName,
    sentAt: new Date().toISOString(),
  };

  // In production, you would send the email here:
  // await emailService.send({ to: userEmail, subject, body });

  return emailData;
};

/**
 * Delete expired notifications (cleanup function)
 * @returns {Promise<number>} - Number of deleted notifications
 */
export const cleanupExpiredNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .lt('expires_at', new Date().toISOString())
    .select();

  if (error) {
    throw new Error(`Failed to cleanup expired notifications: ${error.message}`);
  }

  return data ? data.length : 0;
};