/**
 * Resources Service Tests
 * Testing Framework: Mocha
 * Assertions: Chai
 */

import { expect } from 'chai';
import { describe, it, before, after, beforeEach } from 'mocha';
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  searchResources,
  rateResource,
  getUserRating,
  trackView,
  trackDownload,
  getUserContributions,
  getCategories,
  addResourceToCategory,
  removeResourceFromCategory,
  getResourcesByCategory,
  getResourceStats
} from '../../src/lib/services/resources.js';
import { supabase } from '../../src/lib/supabaseClient.js';

describe('Resources Service', () => {
  let testUserId;
  let testResourceId;
  let testCategoryId;

  before(async () => {
    // Create a test user for authentication
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `test-resources-${Date.now()}@example.com`,
      password: 'TestPassword123!'
    });

    if (authError) throw authError;
    testUserId = authData.user.id;

    // Get a test category
    const { data: categories } = await supabase
      .from('resource_categories')
      .select('id')
      .limit(1)
      .single();
    
    if (categories) {
      testCategoryId = categories.id;
    }
  });

  after(async () => {
    // Cleanup: Delete test user and related data
    if (testUserId) {
      await supabase.auth.admin.deleteUser(testUserId);
    }
  });

  describe('createResource', () => {
    it('should create a new resource with valid data', async () => {
      const resourceData = {
        title: 'Introduction to Algorithms',
        description: 'A comprehensive guide to algorithms',
        type: 'study_guide',
        content: '# Introduction\n\nThis is a study guide...',
        subject: 'Computer Science',
        tags: ['algorithms', 'data-structures'],
        author_id: testUserId
      };

      const result = await createResource(resourceData);

      expect(result).to.have.property('id');
      expect(result.title).to.equal(resourceData.title);
      expect(result.type).to.equal(resourceData.type);
      expect(result.status).to.equal('draft');
      expect(result.view_count).to.equal(0);
      expect(result.download_count).to.equal(0);

      testResourceId = result.id;
    });

    it('should create a blog article resource', async () => {
      const blogData = {
        title: 'Understanding Big O Notation',
        description: 'Learn about algorithm complexity',
        type: 'blog_article',
        content: '# Big O Notation\n\nBig O notation is...',
        subject: 'Computer Science',
        tags: ['algorithms', 'complexity'],
        author_id: testUserId
      };

      const result = await createResource(blogData);

      expect(result).to.have.property('id');
      expect(result.type).to.equal('blog_article');
    });

    it('should create a video tutorial resource', async () => {
      const videoData = {
        title: 'Python Tutorial for Beginners',
        description: 'Learn Python from scratch',
        type: 'tutorial_video',
        video_url: 'https://youtube.com/watch?v=example',
        thumbnail_url: 'https://example.com/thumb.jpg',
        subject: 'Programming',
        tags: ['python', 'tutorial'],
        author_id: testUserId
      };

      const result = await createResource(videoData);

      expect(result).to.have.property('id');
      expect(result.type).to.equal('tutorial_video');
      expect(result.video_url).to.equal(videoData.video_url);
    });

    it('should throw error when required fields are missing', async () => {
      const invalidData = {
        description: 'Missing title and type'
      };

      try {
        await createResource(invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('required');
      }
    });

    it('should throw error with invalid resource type', async () => {
      const invalidData = {
        title: 'Test Resource',
        type: 'invalid_type',
        author_id: testUserId
      };

      try {
        await createResource(invalidData);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.exist;
      }
    });
  });

  describe('getResources', () => {
    it('should retrieve all published resources', async () => {
      const result = await getResources({ status: 'published' });

      expect(result).to.be.an('array');
      result.forEach(resource => {
        expect(resource.status).to.equal('published');
      });
    });

    it('should filter resources by type', async () => {
      const result = await getResources({ type: 'blog_article' });

      expect(result).to.be.an('array');
      result.forEach(resource => {
        expect(resource.type).to.equal('blog_article');
      });
    });

    it('should filter resources by subject', async () => {
      const result = await getResources({ subject: 'Computer Science' });

      expect(result).to.be.an('array');
      result.forEach(resource => {
        expect(resource.subject).to.equal('Computer Science');
      });
    });

    it('should filter resources by tags', async () => {
      const result = await getResources({ tags: ['algorithms'] });

      expect(result).to.be.an('array');
      result.forEach(resource => {
        expect(resource.tags).to.include('algorithms');
      });
    });

    it('should paginate results', async () => {
      const page1 = await getResources({ limit: 5, offset: 0 });
      const page2 = await getResources({ limit: 5, offset: 5 });

      expect(page1).to.be.an('array');
      expect(page2).to.be.an('array');
      expect(page1.length).to.be.at.most(5);
      expect(page2.length).to.be.at.most(5);
    });

    it('should sort resources by created date', async () => {
      const result = await getResources({ 
        sortBy: 'created_at',
        sortOrder: 'desc'
      });

      expect(result).to.be.an('array');
      if (result.length > 1) {
        const firstDate = new Date(result[0].created_at);
        const secondDate = new Date(result[1].created_at);
        expect(firstDate.getTime()).to.be.at.least(secondDate.getTime());
      }
    });

    it('should sort resources by rating', async () => {
      const result = await getResources({ 
        sortBy: 'rating',
        sortOrder: 'desc'
      });

      expect(result).to.be.an('array');
      if (result.length > 1) {
        const firstRating = result[0].rating_count > 0 
          ? result[0].rating_sum / result[0].rating_count 
          : 0;
        const secondRating = result[1].rating_count > 0 
          ? result[1].rating_sum / result[1].rating_count 
          : 0;
        expect(firstRating).to.be.at.least(secondRating);
      }
    });
  });

  describe('getResourceById', () => {
    it('should retrieve a resource by ID', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const result = await getResourceById(testResourceId);

      expect(result).to.be.an('object');
      expect(result.id).to.equal(testResourceId);
      expect(result).to.have.property('title');
      expect(result).to.have.property('type');
    });

    it('should return null for non-existent resource', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const result = await getResourceById(fakeId);

      expect(result).to.be.null;
    });

    it('should throw error with invalid UUID', async () => {
      try {
        await getResourceById('invalid-uuid');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.exist;
      }
    });
  });

  describe('updateResource', () => {
    it('should update resource title and description', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const updates = {
        title: 'Updated Title',
        description: 'Updated description'
      };

      const result = await updateResource(testResourceId, updates);

      expect(result.title).to.equal(updates.title);
      expect(result.description).to.equal(updates.description);
    });

    it('should update resource status to published', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const result = await updateResource(testResourceId, { 
        status: 'published' 
      });

      expect(result.status).to.equal('published');
    });

    it('should update resource tags', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const newTags = ['updated', 'tags', 'test'];
      const result = await updateResource(testResourceId, { 
        tags: newTags 
      });

      expect(result.tags).to.deep.equal(newTags);
    });

    it('should throw error when updating non-existent resource', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      try {
        await updateResource(fakeId, { title: 'Test' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.exist;
      }
    });
  });

  describe('searchResources', () => {
    it('should search resources by query string', async () => {
      const result = await searchResources('algorithm');

      expect(result).to.be.an('array');
      result.forEach(resource => {
        const searchableText = `${resource.title} ${resource.description}`.toLowerCase();
        expect(searchableText).to.include('algorithm');
      });
    });

    it('should search with filters', async () => {
      const result = await searchResources('python', {
        type: 'tutorial_video',
        subject: 'Programming'
      });

      expect(result).to.be.an('array');
      result.forEach(resource => {
        expect(resource.type).to.equal('tutorial_video');
        expect(resource.subject).to.equal('Programming');
      });
    });

    it('should return empty array for no matches', async () => {
      const result = await searchResources('xyznonexistentquery123');

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(0);
    });
  });

  describe('rateResource', () => {
    it('should add a rating to a resource', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const rating = {
        resource_id: testResourceId,
        user_id: testUserId,
        rating: 5,
        review: 'Excellent resource!'
      };

      const result = await rateResource(rating);

      expect(result).to.have.property('id');
      expect(result.rating).to.equal(5);
      expect(result.review).to.equal('Excellent resource!');
    });

    it('should update existing rating', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const updatedRating = {
        resource_id: testResourceId,
        user_id: testUserId,
        rating: 4,
        review: 'Good resource, updated review'
      };

      const result = await rateResource(updatedRating);

      expect(result.rating).to.equal(4);
      expect(result.review).to.equal('Good resource, updated review');
    });

    it('should throw error with invalid rating value', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const invalidRating = {
        resource_id: testResourceId,
        user_id: testUserId,
        rating: 6 // Invalid: must be 1-5
      };

      try {
        await rateResource(invalidRating);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.exist;
      }
    });

    it('should throw error with rating below 1', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const invalidRating = {
        resource_id: testResourceId,
        user_id: testUserId,
        rating: 0
      };

      try {
        await rateResource(invalidRating);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.exist;
      }
    });
  });

  describe('getUserRating', () => {
    it('should retrieve user rating for a resource', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const result = await getUserRating(testResourceId, testUserId);

      expect(result).to.be.an('object');
      expect(result.rating).to.be.a('number');
      expect(result.rating).to.be.at.least(1);
      expect(result.rating).to.be.at.most(5);
    });

    it('should return null if user has not rated resource', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      const result = await getUserRating(testResourceId, fakeUserId);

      expect(result).to.be.null;
    });
  });

  describe('trackView', () => {
    it('should increment view count', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const before = await getResourceById(testResourceId);
      await trackView(testResourceId);
      const after = await getResourceById(testResourceId);

      expect(after.view_count).to.equal(before.view_count + 1);
    });

    it('should handle multiple views', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const before = await getResourceById(testResourceId);
      await trackView(testResourceId);
      await trackView(testResourceId);
      await trackView(testResourceId);
      const after = await getResourceById(testResourceId);

      expect(after.view_count).to.equal(before.view_count + 3);
    });
  });

  describe('trackDownload', () => {
    it('should increment download count', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const before = await getResourceById(testResourceId);
      await trackDownload(testResourceId);
      const after = await getResourceById(testResourceId);

      expect(after.download_count).to.equal(before.download_count + 1);
    });
  });

  describe('getUserContributions', () => {
    it('should retrieve user contributions', async () => {
      const result = await getUserContributions(testUserId);

      expect(result).to.be.an('array');
      result.forEach(contribution => {
        expect(contribution.user_id).to.equal(testUserId);
        expect(contribution).to.have.property('resource_id');
        expect(contribution).to.have.property('contribution_type');
      });
    });

    it('should return empty array for user with no contributions', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      const result = await getUserContributions(fakeUserId);

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(0);
    });
  });

  describe('getCategories', () => {
    it('should retrieve all categories', async () => {
      const result = await getCategories();

      expect(result).to.be.an('array');
      expect(result.length).to.be.at.least(1);
      result.forEach(category => {
        expect(category).to.have.property('id');
        expect(category).to.have.property('name');
      });
    });

    it('should include default categories', async () => {
      const result = await getCategories();
      const categoryNames = result.map(c => c.name);

      expect(categoryNames).to.include('Mathematics');
      expect(categoryNames).to.include('Computer Science');
    });
  });

  describe('addResourceToCategory', () => {
    it('should add resource to category', async () => {
      if (!testResourceId || !testCategoryId) {
        this.skip();
      }

      const result = await addResourceToCategory(testResourceId, testCategoryId);

      expect(result).to.be.an('object');
      expect(result.resource_id).to.equal(testResourceId);
      expect(result.category_id).to.equal(testCategoryId);
    });

    it('should handle duplicate category assignment', async () => {
      if (!testResourceId || !testCategoryId) {
        this.skip();
      }

      // Try to add the same category again
      try {
        await addResourceToCategory(testResourceId, testCategoryId);
        // If it doesn't throw, that's fine (idempotent operation)
      } catch (error) {
        // If it throws, check it's a duplicate error
        expect(error.message).to.exist;
      }
    });
  });

  describe('getResourcesByCategory', () => {
    it('should retrieve resources by category', async () => {
      if (!testCategoryId) {
        this.skip();
      }

      const result = await getResourcesByCategory(testCategoryId);

      expect(result).to.be.an('array');
      // Resources should be associated with this category
    });
  });

  describe('removeResourceFromCategory', () => {
    it('should remove resource from category', async () => {
      if (!testResourceId || !testCategoryId) {
        this.skip();
      }

      await removeResourceFromCategory(testResourceId, testCategoryId);

      const resources = await getResourcesByCategory(testCategoryId);
      const resourceIds = resources.map(r => r.id);
      expect(resourceIds).to.not.include(testResourceId);
    });
  });

  describe('getResourceStats', () => {
    it('should retrieve resource statistics', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const result = await getResourceStats(testResourceId);

      expect(result).to.be.an('object');
      expect(result).to.have.property('view_count');
      expect(result).to.have.property('download_count');
      expect(result).to.have.property('rating_count');
      expect(result).to.have.property('average_rating');
      expect(result.view_count).to.be.a('number');
      expect(result.download_count).to.be.a('number');
    });

    it('should calculate average rating correctly', async () => {
      if (!testResourceId) {
        this.skip();
      }

      const result = await getResourceStats(testResourceId);

      if (result.rating_count > 0) {
        expect(result.average_rating).to.be.at.least(1);
        expect(result.average_rating).to.be.at.most(5);
      } else {
        expect(result.average_rating).to.equal(0);
      }
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource', async () => {
      if (!testResourceId) {
        this.skip();
      }

      await deleteResource(testResourceId);

      const result = await getResourceById(testResourceId);
      expect(result).to.be.null;
    });

    it('should throw error when deleting non-existent resource', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      try {
        await deleteResource(fakeId);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.exist;
      }
    });
  });
});