import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  updatePreferences,
  getPreferences,
  sendEmailNotification,
} from '../../src/lib/services/notification.js';
import { supabase } from '../../src/lib/supabaseClient.js';

describe('Notification Service', () => {
  let testUserId;
  let testNotificationId;
  let testTypeId;

  beforeEach(async () => {
    // Create test user
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: `test-notification-${Date.now()}@example.com`,
      password: 'testpassword123',
    });

    if (userError) throw userError;
    testUserId = userData.user.id;

    // Get a notification type for testing
    const { data: typeData } = await supabase
      .from('notification_types')
      .select('id')
      .eq('name', 'new_message')
      .single();

    testTypeId = typeData?.id;
  });

  afterEach(async () => {
    // Clean up test data
    if (testUserId) {
      await supabase.from('notifications').delete().eq('user_id', testUserId);
      await supabase.from('notification_preferences').delete().eq('user_id', testUserId);
      await supabase.auth.admin.deleteUser(testUserId);
    }
  });

  describe('createNotification', () => {
    it('should create a new notification', async () => {
      const result = await createNotification(testUserId, 'new_message', {
        title: 'New Message',
        message: 'You have a new message from John',
        data: { sender_name: 'John', test_title: 'Math Test' },
      });

      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testUserId);
      expect(result.title).to.equal('New Message');
      expect(result.message).to.equal('You have a new message from John');
      expect(result.read).to.be.false;
      expect(result.data).to.deep.equal({ sender_name: 'John', test_title: 'Math Test' });

      testNotificationId = result.id;
    });

    it('should create notification with type name', async () => {
      const result = await createNotification(testUserId, 'payment_received', {
        title: 'Payment Received',
        message: 'You received $50',
        data: { amount: '$50' },
      });

      expect(result).to.be.an('object');
      expect(result.type_id).to.be.a('string');
    });

    it('should throw error for invalid notification type', async () => {
      try {
        await createNotification(testUserId, 'invalid_type', {
          title: 'Test',
          message: 'Test message',
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Invalid notification type');
      }
    });

    it('should throw error for missing required fields', async () => {
      try {
        await createNotification(testUserId, 'new_message', {
          title: 'Test',
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('required');
      }
    });

    it('should set expiration date if provided', async () => {
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      const result = await createNotification(testUserId, 'new_message', {
        title: 'Expiring Notification',
        message: 'This will expire',
        expiresAt,
      });

      expect(result.expires_at).to.not.be.null;
    });
  });

  describe('getNotifications', () => {
    beforeEach(async () => {
      // Create test notifications
      await createNotification(testUserId, 'new_message', {
        title: 'Message 1',
        message: 'First message',
      });
      await createNotification(testUserId, 'payment_received', {
        title: 'Payment 1',
        message: 'Payment received',
      });
      await createNotification(testUserId, 'new_message', {
        title: 'Message 2',
        message: 'Second message',
      });
    });

    it('should retrieve all notifications for user', async () => {
      const notifications = await getNotifications(testUserId);

      expect(notifications).to.be.an('array');
      expect(notifications.length).to.equal(3);
      expect(notifications[0].user_id).to.equal(testUserId);
    });

    it('should filter notifications by read status', async () => {
      const unread = await getNotifications(testUserId, { read: false });
      expect(unread.length).to.equal(3);

      const read = await getNotifications(testUserId, { read: true });
      expect(read.length).to.equal(0);
    });

    it('should filter notifications by type', async () => {
      const messages = await getNotifications(testUserId, { type: 'new_message' });
      expect(messages.length).to.equal(2);

      const payments = await getNotifications(testUserId, { type: 'payment_received' });
      expect(payments.length).to.equal(1);
    });

    it('should respect limit parameter', async () => {
      const limited = await getNotifications(testUserId, { limit: 2 });
      expect(limited.length).to.be.at.most(2);
    });

    it('should return notifications in descending order by created_at', async () => {
      const notifications = await getNotifications(testUserId);
      
      for (let i = 0; i < notifications.length - 1; i++) {
        const current = new Date(notifications[i].created_at);
        const next = new Date(notifications[i + 1].created_at);
        expect(current.getTime()).to.be.at.least(next.getTime());
      }
    });
  });

  describe('markAsRead', () => {
    beforeEach(async () => {
      const notification = await createNotification(testUserId, 'new_message', {
        title: 'Test',
        message: 'Test message',
      });
      testNotificationId = notification.id;
    });

    it('should mark notification as read', async () => {
      const result = await markAsRead(testNotificationId, testUserId);

      expect(result).to.be.true;

      const notification = await supabase
        .from('notifications')
        .select('read, read_at')
        .eq('id', testNotificationId)
        .single();

      expect(notification.data.read).to.be.true;
      expect(notification.data.read_at).to.not.be.null;
    });

    it('should return false for non-existent notification', async () => {
      const result = await markAsRead('00000000-0000-0000-0000-000000000000', testUserId);
      expect(result).to.be.false;
    });

    it('should not mark notification as read for different user', async () => {
      const { data: otherUser } = await supabase.auth.signUp({
        email: `other-user-${Date.now()}@example.com`,
        password: 'testpassword123',
      });

      const result = await markAsRead(testNotificationId, otherUser.user.id);
      expect(result).to.be.false;

      await supabase.auth.admin.deleteUser(otherUser.user.id);
    });
  });

  describe('markAllAsRead', () => {
    beforeEach(async () => {
      // Create multiple unread notifications
      await createNotification(testUserId, 'new_message', {
        title: 'Message 1',
        message: 'First message',
      });
      await createNotification(testUserId, 'payment_received', {
        title: 'Payment 1',
        message: 'Payment received',
      });
      await createNotification(testUserId, 'new_message', {
        title: 'Message 2',
        message: 'Second message',
      });
    });

    it('should mark all notifications as read', async () => {
      const count = await markAllAsRead(testUserId);

      expect(count).to.equal(3);

      const unread = await getNotifications(testUserId, { read: false });
      expect(unread.length).to.equal(0);
    });

    it('should return 0 if no unread notifications', async () => {
      await markAllAsRead(testUserId);
      const count = await markAllAsRead(testUserId);

      expect(count).to.equal(0);
    });
  });

  describe('getUnreadCount', () => {
    it('should return 0 for user with no notifications', async () => {
      const count = await getUnreadCount(testUserId);
      expect(count).to.equal(0);
    });

    it('should return correct unread count', async () => {
      await createNotification(testUserId, 'new_message', {
        title: 'Message 1',
        message: 'First message',
      });
      await createNotification(testUserId, 'payment_received', {
        title: 'Payment 1',
        message: 'Payment received',
      });

      const count = await getUnreadCount(testUserId);
      expect(count).to.equal(2);
    });

    it('should update count after marking as read', async () => {
      const notification = await createNotification(testUserId, 'new_message', {
        title: 'Message 1',
        message: 'First message',
      });

      let count = await getUnreadCount(testUserId);
      expect(count).to.equal(1);

      await markAsRead(notification.id, testUserId);

      count = await getUnreadCount(testUserId);
      expect(count).to.equal(0);
    });
  });

  describe('getPreferences', () => {
    it('should return default preferences for new user', async () => {
      const preferences = await getPreferences(testUserId);

      expect(preferences).to.be.an('array');
      expect(preferences.length).to.be.greaterThan(0);
      
      const messagePref = preferences.find((p) => p.notification_types?.name === 'new_message');
      expect(messagePref).to.exist;
      expect(messagePref.in_app_enabled).to.be.true;
      expect(messagePref.email_enabled).to.be.true;
      expect(messagePref.push_enabled).to.be.false;
    });

    it('should filter preferences by type', async () => {
      const preferences = await getPreferences(testUserId, { type: 'new_message' });

      expect(preferences).to.be.an('array');
      expect(preferences.length).to.equal(1);
      expect(preferences[0].notification_types?.name).to.equal('new_message');
    });
  });

  describe('updatePreferences', () => {
    it('should update notification preferences', async () => {
      const result = await updatePreferences(testUserId, 'new_message', {
        in_app_enabled: false,
        email_enabled: false,
        push_enabled: true,
      });

      expect(result).to.be.an('object');
      expect(result.in_app_enabled).to.be.false;
      expect(result.email_enabled).to.be.false;
      expect(result.push_enabled).to.be.true;
    });

    it('should create preference if it does not exist', async () => {
      // Delete existing preference
      await supabase
        .from('notification_preferences')
        .delete()
        .eq('user_id', testUserId)
        .eq('type_id', testTypeId);

      const result = await updatePreferences(testUserId, 'new_message', {
        in_app_enabled: false,
      });

      expect(result).to.be.an('object');
      expect(result.in_app_enabled).to.be.false;
    });

    it('should throw error for invalid notification type', async () => {
      try {
        await updatePreferences(testUserId, 'invalid_type', {
          in_app_enabled: false,
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Invalid notification type');
      }
    });

    it('should only update provided fields', async () => {
      await updatePreferences(testUserId, 'new_message', {
        email_enabled: false,
      });

      const preferences = await getPreferences(testUserId, { type: 'new_message' });
      expect(preferences[0].in_app_enabled).to.be.true; // Should remain unchanged
      expect(preferences[0].email_enabled).to.be.false; // Should be updated
    });
  });

  describe('sendEmailNotification', () => {
    it('should send email notification if enabled', async () => {
      // This is a mock test - actual email sending would require email service integration
      const result = await sendEmailNotification(testUserId, 'new_message', {
        sender_name: 'John',
        test_title: 'Math Test',
      });

      // For now, we just verify the function doesn't throw
      expect(result).to.exist;
    });

    it('should not send email if preference is disabled', async () => {
      await updatePreferences(testUserId, 'new_message', {
        email_enabled: false,
      });

      const result = await sendEmailNotification(testUserId, 'new_message', {
        sender_name: 'John',
      });

      expect(result).to.be.null;
    });

    it('should throw error for invalid notification type', async () => {
      try {
        await sendEmailNotification(testUserId, 'invalid_type', {});
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Invalid notification type');
      }
    });
  });

  describe('Notification templates', () => {
    it('should use template for notification message', async () => {
      const result = await createNotification(testUserId, 'new_message', {
        title: 'New Message',
        message: 'You have a new message from {{sender_name}}',
        data: { sender_name: 'John' },
      });

      expect(result.message).to.include('John');
    });

    it('should handle multiple template variables', async () => {
      const result = await createNotification(testUserId, 'payment_received', {
        title: 'Payment Received',
        message: 'You received {{amount}} for {{test_title}}',
        data: { amount: '$50', test_title: 'Math Test' },
      });

      expect(result.message).to.include('$50');
      expect(result.message).to.include('Math Test');
    });
  });

  describe('Notification expiration', () => {
    it('should not return expired notifications', async () => {
      // Create expired notification
      const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
      await createNotification(testUserId, 'new_message', {
        title: 'Expired',
        message: 'This is expired',
        expiresAt: pastDate,
      });

      // Create valid notification
      await createNotification(testUserId, 'new_message', {
        title: 'Valid',
        message: 'This is valid',
      });

      const notifications = await getNotifications(testUserId);
      
      // Should only return non-expired notification
      const expired = notifications.find((n) => n.title === 'Expired');
      expect(expired).to.be.undefined;
    });
  });

  describe('Batch operations', () => {
    it('should handle multiple notifications efficiently', async () => {
      const notifications = [];
      
      for (let i = 0; i < 10; i++) {
        notifications.push(
          createNotification(testUserId, 'new_message', {
            title: `Message ${i}`,
            message: `Test message ${i}`,
          })
        );
      }

      const results = await Promise.all(notifications);
      expect(results.length).to.equal(10);
    });

    it('should mark multiple notifications as read efficiently', async () => {
      // Create multiple notifications
      for (let i = 0; i < 5; i++) {
        await createNotification(testUserId, 'new_message', {
          title: `Message ${i}`,
          message: `Test message ${i}`,
        });
      }

      const count = await markAllAsRead(testUserId);
      expect(count).to.equal(5);
    });
  });
});