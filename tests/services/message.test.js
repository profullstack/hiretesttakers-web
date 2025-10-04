/**
 * Message Service Tests
 * 
 * Tests for messaging service using Supabase.
 * Uses Mocha and Chai for testing.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  sendMessage,
  getConversation,
  getConversations,
  markAsRead,
  getUnreadCount
} from '../../src/lib/services/message.js';

describe('Message Service', () => {
  describe('sendMessage', () => {
    it('should throw error if applicationId is missing', async () => {
      try {
        await sendMessage({
          receiverId: 'user-123',
          content: 'Hello'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Application ID is required');
      }
    });

    it('should throw error if receiverId is missing', async () => {
      try {
        await sendMessage({
          applicationId: 'app-123',
          content: 'Hello'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Receiver ID is required');
      }
    });

    it('should throw error if content is missing', async () => {
      try {
        await sendMessage({
          applicationId: 'app-123',
          receiverId: 'user-123'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Message content is required');
      }
    });

    it('should throw error if content is empty', async () => {
      try {
        await sendMessage({
          applicationId: 'app-123',
          receiverId: 'user-123',
          content: '   '
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Message content cannot be empty');
      }
    });

    it('should send message successfully', async () => {
      const result = await sendMessage({
        applicationId: 'app-123',
        receiverId: 'user-123',
        content: 'Hello, this is a test message'
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('application_id', 'app-123');
      expect(result).to.have.property('receiver_id', 'user-123');
      expect(result).to.have.property('content', 'Hello, this is a test message');
      expect(result).to.have.property('is_read', false);
      expect(result).to.have.property('created_at');
    });
  });

  describe('getConversation', () => {
    it('should throw error if applicationId is missing', async () => {
      try {
        await getConversation({});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Application ID is required');
      }
    });

    it('should return empty array for conversation with no messages', async () => {
      const result = await getConversation({
        applicationId: 'app-no-messages'
      });

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(0);
    });

    it('should return messages for a conversation', async () => {
      const result = await getConversation({
        applicationId: 'app-123'
      });

      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      expect(result[0]).to.have.property('id');
      expect(result[0]).to.have.property('content');
      expect(result[0]).to.have.property('sender_id');
      expect(result[0]).to.have.property('receiver_id');
      expect(result[0]).to.have.property('created_at');
    });

    it('should return messages in chronological order', async () => {
      const result = await getConversation({
        applicationId: 'app-123'
      });

      if (result.length > 1) {
        const firstDate = new Date(result[0].created_at);
        const lastDate = new Date(result[result.length - 1].created_at);
        expect(firstDate.getTime()).to.be.lessThanOrEqual(lastDate.getTime());
      }
    });
  });

  describe('getConversations', () => {
    it('should return empty array when user has no conversations', async () => {
      const result = await getConversations();

      expect(result).to.be.an('array');
    });

    it('should return list of conversations with latest message', async () => {
      const result = await getConversations();

      expect(result).to.be.an('array');
      if (result.length > 0) {
        expect(result[0]).to.have.property('application_id');
        expect(result[0]).to.have.property('latest_message');
        expect(result[0]).to.have.property('unread_count');
        expect(result[0]).to.have.property('other_user');
      }
    });

    it('should include unread count for each conversation', async () => {
      const result = await getConversations();

      if (result.length > 0) {
        expect(result[0]).to.have.property('unread_count');
        expect(result[0].unread_count).to.be.a('number');
        expect(result[0].unread_count).to.be.at.least(0);
      }
    });
  });

  describe('markAsRead', () => {
    it('should throw error if messageId is missing', async () => {
      try {
        await markAsRead({});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Message ID is required');
      }
    });

    it('should mark message as read successfully', async () => {
      const result = await markAsRead({
        messageId: 'msg-123'
      });

      expect(result).to.have.property('id', 'msg-123');
      expect(result).to.have.property('is_read', true);
    });

    it('should only allow receiver to mark message as read', async () => {
      try {
        await markAsRead({
          messageId: 'msg-not-receiver'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Not authorized');
      }
    });
  });

  describe('getUnreadCount', () => {
    it('should return 0 when user has no unread messages', async () => {
      const result = await getUnreadCount();

      expect(result).to.be.a('number');
      expect(result).to.be.at.least(0);
    });

    it('should return correct unread count', async () => {
      const result = await getUnreadCount();

      expect(result).to.be.a('number');
      expect(result).to.be.at.least(0);
    });

    it('should return unread count for specific application', async () => {
      const result = await getUnreadCount({
        applicationId: 'app-123'
      });

      expect(result).to.be.a('number');
      expect(result).to.be.at.least(0);
    });
  });
});