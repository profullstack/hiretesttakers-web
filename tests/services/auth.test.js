/**
 * Auth Service Tests
 *
 * Tests for authentication service using Supabase Auth.
 * Uses Vitest for testing.
 */

import { describe, it, expect } from 'vitest';
import {
  signUp,
  signIn,
  signOut,
  resetPassword,
  updatePassword,
  getSession,
  getUser,
  verifyEmail,
  resendVerificationEmail
} from '../../src/lib/services/auth.js';

describe('Auth Service', () => {
  describe('signUp', () => {
    it('should throw error if email is missing', async () => {
      await expect(signUp({ password: 'password123' }))
        .rejects.toThrow('Email is required');
    });

    it('should throw error if email is invalid', async () => {
      await expect(signUp({ email: 'invalid-email', password: 'password123' }))
        .rejects.toThrow('Invalid email format');
    });

    it('should throw error if password is missing', async () => {
      await expect(signUp({ email: 'test@example.com' }))
        .rejects.toThrow('Password is required');
    });

    it('should throw error if password is too short', async () => {
      await expect(signUp({ email: 'test@example.com', password: '12345' }))
        .rejects.toThrow('Password must be at least 6 characters');
    });

    it('should return user data on successful signup', async () => {
      const result = await signUp({
        email: 'newuser@example.com',
        password: 'password123'
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('session');
      expect(result.user.email).toBe('newuser@example.com');
    });

    it('should handle metadata in signup', async () => {
      const result = await signUp({
        email: 'newuser2@example.com',
        password: 'password123',
        metadata: { username: 'testuser' }
      });

      expect(result.user).toHaveProperty('user_metadata');
      expect(result.user.user_metadata.username).toBe('testuser');
    });
  });

  describe('signIn', () => {
    it('should throw error if email is missing', async () => {
      await expect(signIn({ password: 'password123' }))
        .rejects.toThrow('Email is required');
    });

    it('should throw error if password is missing', async () => {
      await expect(signIn({ email: 'test@example.com' }))
        .rejects.toThrow('Password is required');
    });

    it('should return user and session on successful login', async () => {
      const result = await signIn({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('session');
      expect(result.user.email).toBe('test@example.com');
      expect(result.session).toHaveProperty('access_token');
    });

    it('should throw error for invalid credentials', async () => {
      await expect(signIn({
        email: 'test@example.com',
        password: 'wrongpassword'
      })).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('should successfully sign out user', async () => {
      const result = await signOut();
      expect(result).toBe(true);
    });

    it('should handle sign out when no session exists', async () => {
      const result = await signOut();
      expect(result).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('should throw error if email is missing', async () => {
      await expect(resetPassword({}))
        .rejects.toThrow('Email is required');
    });

    it('should throw error if email is invalid', async () => {
      await expect(resetPassword({ email: 'invalid-email' }))
        .rejects.toThrow('Invalid email format');
    });

    it('should send password reset email', async () => {
      const result = await resetPassword({ email: 'test@example.com' });
      expect(result).toBe(true);
    });
  });

  describe('updatePassword', () => {
    it('should throw error if new password is missing', async () => {
      await expect(updatePassword({}))
        .rejects.toThrow('New password is required');
    });

    it('should throw error if new password is too short', async () => {
      await expect(updatePassword({ newPassword: '12345' }))
        .rejects.toThrow('Password must be at least 6 characters');
    });

    it('should update password successfully', async () => {
      const result = await updatePassword({ newPassword: 'newpassword123' });
      expect(result).toHaveProperty('user');
    });
  });

  describe('getSession', () => {
    it('should return null when no session exists', async () => {
      const session = await getSession();
      expect(session).to.be.null;
    });

    it('should return session when user is logged in', async () => {
      // First sign in
      await signIn({
        email: 'test@example.com',
        password: 'password123'
      });

      const session = await getSession();
      expect(session).to.not.be.null;
      expect(session).to.have.property('access_token');
      expect(session).to.have.property('user');
    });
  });

  describe('getUser', () => {
    it('should return null when no user is logged in', async () => {
      const user = await getUser();
      expect(user).to.be.null;
    });

    it('should return user when logged in', async () => {
      // First sign in
      await signIn({
        email: 'test@example.com',
        password: 'password123'
      });

      const user = await getUser();
      expect(user).to.not.be.null;
      expect(user).to.have.property('email', 'test@example.com');
      expect(user).to.have.property('id');
    });
  });

  describe('verifyEmail', () => {
    it('should throw error if token is missing', async () => {
      try {
        await verifyEmail({});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Token is required');
      }
    });

    it('should verify email with valid token', async () => {
      const result = await verifyEmail({ 
        token: 'valid-token',
        type: 'signup'
      });
      expect(result).to.have.property('user');
      expect(result).to.have.property('session');
    });
  });

  describe('resendVerificationEmail', () => {
    it('should throw error if email is missing', async () => {
      try {
        await resendVerificationEmail({});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Email is required');
      }
    });

    it('should resend verification email', async () => {
      const result = await resendVerificationEmail({ 
        email: 'test@example.com' 
      });
      expect(result).to.be.true;
    });
  });
});