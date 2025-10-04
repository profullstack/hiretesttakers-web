/**
 * Profile Service Tests
 * 
 * Tests for user profile management service.
 * Uses Mocha and Chai for testing.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  getProfile,
  getPublicProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  updateUsername,
  checkUsernameAvailability
} from '../../src/lib/services/profile.js';

describe('Profile Service', () => {
  describe('getProfile', () => {
    it('should throw error if user ID is missing', async () => {
      try {
        await getProfile();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should return user profile data', async () => {
      const userId = 'test-user-id';
      const profile = await getProfile(userId);
      
      expect(profile).to.be.an('object');
      expect(profile).to.have.property('id', userId);
      expect(profile).to.have.property('email');
      expect(profile).to.have.property('full_name');
      expect(profile).to.have.property('avatar_url');
      expect(profile).to.have.property('user_type');
      expect(profile).to.have.property('username');
    });

    it('should return null for non-existent user', async () => {
      const profile = await getProfile('non-existent-id');
      expect(profile).to.be.null;
    });
  });

  describe('getPublicProfile', () => {
    it('should throw error if username is missing', async () => {
      try {
        await getPublicProfile();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Username is required');
      }
    });

    it('should return public profile data by username', async () => {
      const username = 'testuser';
      const profile = await getPublicProfile(username);
      
      expect(profile).to.be.an('object');
      expect(profile).to.have.property('username', username);
      expect(profile).to.have.property('full_name');
      expect(profile).to.have.property('avatar_url');
      expect(profile).to.have.property('bio');
      expect(profile).to.have.property('location');
    });

    it('should return null for private profiles', async () => {
      const profile = await getPublicProfile('privateuser');
      expect(profile).to.be.null;
    });

    it('should return null for non-existent username', async () => {
      const profile = await getPublicProfile('nonexistentuser123');
      expect(profile).to.be.null;
    });
  });

  describe('updateProfile', () => {
    it('should throw error if user ID is missing', async () => {
      try {
        await updateProfile(null, { full_name: 'Test User' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should throw error if updates object is missing', async () => {
      try {
        await updateProfile('test-user-id');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Updates object is required');
      }
    });

    it('should update profile successfully', async () => {
      const userId = 'test-user-id';
      const updates = {
        full_name: 'Updated Name',
        bio: 'Updated bio',
        location: 'New York, NY'
      };
      
      const result = await updateProfile(userId, updates);
      
      expect(result).to.be.an('object');
      expect(result).to.have.property('full_name', updates.full_name);
      expect(result).to.have.property('bio', updates.bio);
      expect(result).to.have.property('location', updates.location);
    });

    it('should update languages array', async () => {
      const userId = 'test-user-id';
      const updates = {
        languages: ['English', 'Spanish', 'French']
      };
      
      const result = await updateProfile(userId, updates);
      
      expect(result).to.have.property('languages');
      expect(result.languages).to.be.an('array');
      expect(result.languages).to.include('English');
      expect(result.languages).to.include('Spanish');
    });

    it('should update profile_public setting', async () => {
      const userId = 'test-user-id';
      const updates = {
        profile_public: false
      };
      
      const result = await updateProfile(userId, updates);
      
      expect(result).to.have.property('profile_public', false);
    });

    it('should not allow updating protected fields', async () => {
      const userId = 'test-user-id';
      const updates = {
        id: 'different-id',
        email: 'newemail@example.com',
        created_at: new Date()
      };
      
      try {
        await updateProfile(userId, updates);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Cannot update protected fields');
      }
    });
  });

  describe('uploadAvatar', () => {
    it('should throw error if user ID is missing', async () => {
      try {
        await uploadAvatar(null, new Blob());
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should throw error if file is missing', async () => {
      try {
        await uploadAvatar('test-user-id');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('File is required');
      }
    });

    it('should throw error if file is not an image', async () => {
      try {
        const textFile = new Blob(['text'], { type: 'text/plain' });
        await uploadAvatar('test-user-id', textFile);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('File must be an image');
      }
    });

    it('should upload avatar and return URL', async () => {
      const userId = 'test-user-id';
      const imageFile = new Blob(['image'], { type: 'image/jpeg' });
      
      const result = await uploadAvatar(userId, imageFile);
      
      expect(result).to.be.an('object');
      expect(result).to.have.property('avatar_url');
      expect(result.avatar_url).to.be.a('string');
      expect(result.avatar_url).to.include('avatars');
    });
  });

  describe('deleteAvatar', () => {
    it('should throw error if user ID is missing', async () => {
      try {
        await deleteAvatar();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should delete avatar successfully', async () => {
      const userId = 'test-user-id';
      const result = await deleteAvatar(userId);
      
      expect(result).to.be.true;
    });

    it('should handle case when no avatar exists', async () => {
      const userId = 'user-without-avatar';
      const result = await deleteAvatar(userId);
      
      expect(result).to.be.true;
    });
  });

  describe('updateUsername', () => {
    it('should throw error if user ID is missing', async () => {
      try {
        await updateUsername(null, 'newusername');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should throw error if username is missing', async () => {
      try {
        await updateUsername('test-user-id');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Username is required');
      }
    });

    it('should throw error if username is too short', async () => {
      try {
        await updateUsername('test-user-id', 'ab');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Username must be at least 3 characters');
      }
    });

    it('should throw error if username contains invalid characters', async () => {
      try {
        await updateUsername('test-user-id', 'user@name');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Username can only contain letters, numbers, and underscores');
      }
    });

    it('should throw error if username is already taken', async () => {
      try {
        await updateUsername('test-user-id', 'existinguser');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Username is already taken');
      }
    });

    it('should update username successfully', async () => {
      const userId = 'test-user-id';
      const newUsername = 'newusername123';
      
      const result = await updateUsername(userId, newUsername);
      
      expect(result).to.be.an('object');
      expect(result).to.have.property('username', newUsername);
    });
  });

  describe('checkUsernameAvailability', () => {
    it('should throw error if username is missing', async () => {
      try {
        await checkUsernameAvailability();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Username is required');
      }
    });

    it('should return false for taken username', async () => {
      const available = await checkUsernameAvailability('existinguser');
      expect(available).to.be.false;
    });

    it('should return true for available username', async () => {
      const available = await checkUsernameAvailability('availableuser123');
      expect(available).to.be.true;
    });

    it('should return false for invalid username format', async () => {
      const available = await checkUsernameAvailability('ab');
      expect(available).to.be.false;
    });
  });
});