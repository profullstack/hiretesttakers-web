/**
 * Test Service Tests
 * 
 * Tests for test listing management service.
 * Uses Mocha and Chai for testing.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  createTest,
  getTest,
  getTests,
  updateTest,
  deleteTest,
  getMyTests,
  searchTests
} from '../../src/lib/services/test.js';

describe('Test Service', () => {
  describe('createTest', () => {
    it('should throw error if user ID is missing', async () => {
      try {
        await createTest(null, {});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should throw error if title is missing', async () => {
      try {
        await createTest('user-id', {});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Title is required');
      }
    });

    it('should throw error if description is missing', async () => {
      try {
        await createTest('user-id', { title: 'Test Title' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Description is required');
      }
    });

    it('should throw error if cryptocurrency is missing', async () => {
      try {
        await createTest('user-id', {
          title: 'Test Title',
          description: 'Test Description'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Cryptocurrency is required');
      }
    });

    it('should throw error if cryptocurrency is invalid', async () => {
      try {
        await createTest('user-id', {
          title: 'Test Title',
          description: 'Test Description',
          cryptocurrency: 'INVALID'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid cryptocurrency');
      }
    });

    it('should throw error if price is missing', async () => {
      try {
        await createTest('user-id', {
          title: 'Test Title',
          description: 'Test Description',
          cryptocurrency: 'BTC'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Price is required');
      }
    });

    it('should throw error if price is negative', async () => {
      try {
        await createTest('user-id', {
          title: 'Test Title',
          description: 'Test Description',
          cryptocurrency: 'BTC',
          price: -1
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Price must be positive');
      }
    });

    it('should create test with fixed price', async () => {
      const testData = {
        title: 'Math Test',
        description: 'Basic algebra test',
        cryptocurrency: 'BTC',
        price: 0.001,
        category: 'mathematics',
        difficulty: 'medium'
      };

      const result = await createTest('user-id', testData);

      expect(result).to.be.an('object');
      expect(result).to.have.property('id');
      expect(result).to.have.property('title', testData.title);
      expect(result).to.have.property('description', testData.description);
      expect(result).to.have.property('cryptocurrency', testData.cryptocurrency);
      expect(result).to.have.property('price', testData.price);
      expect(result).to.have.property('price_max').that.is.null;
      expect(result).to.have.property('hirer_id', 'user-id');
      expect(result).to.have.property('status', 'open');
    });

    it('should create test with price range', async () => {
      const testData = {
        title: 'Writing Test',
        description: 'Essay writing test',
        cryptocurrency: 'ETH',
        price: 0.01,
        price_max: 0.05,
        category: 'writing'
      };

      const result = await createTest('user-id', testData);

      expect(result).to.have.property('price', testData.price);
      expect(result).to.have.property('price_max', testData.price_max);
    });

    it('should throw error if price_max is less than price', async () => {
      try {
        await createTest('user-id', {
          title: 'Test',
          description: 'Description',
          cryptocurrency: 'BTC',
          price: 0.01,
          price_max: 0.005
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Maximum price must be greater than minimum price');
      }
    });
  });

  describe('getTest', () => {
    it('should throw error if test ID is missing', async () => {
      try {
        await getTest();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Test ID is required');
      }
    });

    it('should return test data', async () => {
      const testId = 'test-id-123';
      const test = await getTest(testId);

      expect(test).to.be.an('object');
      expect(test).to.have.property('id', testId);
      expect(test).to.have.property('title');
      expect(test).to.have.property('description');
      expect(test).to.have.property('cryptocurrency');
      expect(test).to.have.property('price');
      expect(test).to.have.property('status');
      expect(test).to.have.property('hirer_id');
    });

    it('should return null for non-existent test', async () => {
      const test = await getTest('non-existent-id');
      expect(test).to.be.null;
    });
  });

  describe('getTests', () => {
    it('should return array of tests', async () => {
      const tests = await getTests();

      expect(tests).to.be.an('array');
      if (tests.length > 0) {
        expect(tests[0]).to.have.property('id');
        expect(tests[0]).to.have.property('title');
        expect(tests[0]).to.have.property('status');
      }
    });

    it('should filter tests by status', async () => {
      const tests = await getTests({ status: 'open' });

      expect(tests).to.be.an('array');
      tests.forEach(test => {
        expect(test.status).to.equal('open');
      });
    });

    it('should filter tests by cryptocurrency', async () => {
      const tests = await getTests({ cryptocurrency: 'BTC' });

      expect(tests).to.be.an('array');
      tests.forEach(test => {
        expect(test.cryptocurrency).to.equal('BTC');
      });
    });

    it('should filter tests by category', async () => {
      const tests = await getTests({ category: 'mathematics' });

      expect(tests).to.be.an('array');
      tests.forEach(test => {
        expect(test.category).to.equal('mathematics');
      });
    });

    it('should support pagination', async () => {
      const page1 = await getTests({ limit: 10, offset: 0 });
      const page2 = await getTests({ limit: 10, offset: 10 });

      expect(page1).to.be.an('array');
      expect(page2).to.be.an('array');
      expect(page1.length).to.be.at.most(10);
      expect(page2.length).to.be.at.most(10);
    });
  });

  describe('updateTest', () => {
    it('should throw error if test ID is missing', async () => {
      try {
        await updateTest(null, 'user-id', {});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Test ID is required');
      }
    });

    it('should throw error if user ID is missing', async () => {
      try {
        await updateTest('test-id', null, {});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should throw error if updates object is missing', async () => {
      try {
        await updateTest('test-id', 'user-id');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Updates object is required');
      }
    });

    it('should update test successfully', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
        price: 0.002
      };

      const result = await updateTest('test-id', 'user-id', updates);

      expect(result).to.be.an('object');
      expect(result).to.have.property('title', updates.title);
      expect(result).to.have.property('description', updates.description);
      expect(result).to.have.property('price', updates.price);
    });

    it('should not allow updating protected fields', async () => {
      try {
        await updateTest('test-id', 'user-id', {
          id: 'different-id',
          hirer_id: 'different-user',
          created_at: new Date()
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Cannot update protected fields');
      }
    });

    it('should throw error if user is not the owner', async () => {
      try {
        await updateTest('test-id', 'wrong-user-id', { title: 'New Title' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Not authorized');
      }
    });
  });

  describe('deleteTest', () => {
    it('should throw error if test ID is missing', async () => {
      try {
        await deleteTest(null, 'user-id');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Test ID is required');
      }
    });

    it('should throw error if user ID is missing', async () => {
      try {
        await deleteTest('test-id', null);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should delete test successfully', async () => {
      const result = await deleteTest('test-id', 'user-id');
      expect(result).to.be.true;
    });

    it('should throw error if user is not the owner', async () => {
      try {
        await deleteTest('test-id', 'wrong-user-id');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Not authorized');
      }
    });
  });

  describe('getMyTests', () => {
    it('should throw error if user ID is missing', async () => {
      try {
        await getMyTests();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should return user\'s tests', async () => {
      const tests = await getMyTests('user-id');

      expect(tests).to.be.an('array');
      tests.forEach(test => {
        expect(test.hirer_id).to.equal('user-id');
      });
    });

    it('should filter by status', async () => {
      const tests = await getMyTests('user-id', { status: 'open' });

      expect(tests).to.be.an('array');
      tests.forEach(test => {
        expect(test.status).to.equal('open');
        expect(test.hirer_id).to.equal('user-id');
      });
    });
  });

  describe('searchTests', () => {
    it('should throw error if query is missing', async () => {
      try {
        await searchTests();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Search query is required');
      }
    });

    it('should search tests by title', async () => {
      const results = await searchTests('math');

      expect(results).to.be.an('array');
      results.forEach(test => {
        const titleMatch = test.title.toLowerCase().includes('math');
        const descMatch = test.description?.toLowerCase().includes('math');
        expect(titleMatch || descMatch).to.be.true;
      });
    });

    it('should return empty array for no matches', async () => {
      const results = await searchTests('xyznonexistent123');
      expect(results).to.be.an('array');
      expect(results).to.have.lengthOf(0);
    });
  });
});