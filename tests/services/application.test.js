/**
 * Application Service Tests
 * 
 * Tests for application service using Supabase.
 * Uses Mocha and Chai for testing.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  createApplication,
  getApplicationById,
  getApplicationsByTestId,
  getApplicationsByUserId,
  updateApplicationStatus,
  deleteApplication
} from '../../src/lib/services/application.js';

describe('Application Service', () => {
  describe('createApplication', () => {
    it('should throw error if test_id is missing', async () => {
      try {
        await createApplication({ test_taker_id: 'user-123' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Test ID is required');
      }
    });

    it('should throw error if test_taker_id is missing', async () => {
      try {
        await createApplication({ test_id: 'test-123' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Test taker ID is required');
      }
    });

    it('should create application with valid data', async () => {
      const result = await createApplication({
        test_id: 'test-123',
        test_taker_id: 'user-123',
        application_message: 'I am interested in this test'
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('test_id', 'test-123');
      expect(result).to.have.property('test_taker_id', 'user-123');
      expect(result).to.have.property('status', 'pending');
      expect(result).to.have.property('application_message', 'I am interested in this test');
    });

    it('should create application without message', async () => {
      const result = await createApplication({
        test_id: 'test-456',
        test_taker_id: 'user-456'
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('test_id', 'test-456');
      expect(result).to.have.property('test_taker_id', 'user-456');
      expect(result).to.have.property('status', 'pending');
    });

    it('should throw error for duplicate application', async () => {
      try {
        await createApplication({
          test_id: 'test-123',
          test_taker_id: 'user-123'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('already applied');
      }
    });
  });

  describe('getApplicationById', () => {
    it('should throw error if id is missing', async () => {
      try {
        await getApplicationById();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Application ID is required');
      }
    });

    it('should return null for non-existent application', async () => {
      const result = await getApplicationById('non-existent-id');
      expect(result).to.be.null;
    });

    it('should return application by id', async () => {
      const result = await getApplicationById('app-123');
      
      expect(result).to.not.be.null;
      expect(result).to.have.property('id', 'app-123');
      expect(result).to.have.property('test_id');
      expect(result).to.have.property('test_taker_id');
      expect(result).to.have.property('status');
    });
  });

  describe('getApplicationsByTestId', () => {
    it('should throw error if test_id is missing', async () => {
      try {
        await getApplicationsByTestId();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Test ID is required');
      }
    });

    it('should return empty array for test with no applications', async () => {
      const result = await getApplicationsByTestId('test-no-apps');
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(0);
    });

    it('should return all applications for a test', async () => {
      const result = await getApplicationsByTestId('test-123');
      
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      result.forEach(app => {
        expect(app).to.have.property('test_id', 'test-123');
        expect(app).to.have.property('test_taker_id');
        expect(app).to.have.property('status');
      });
    });
  });

  describe('getApplicationsByUserId', () => {
    it('should throw error if user_id is missing', async () => {
      try {
        await getApplicationsByUserId();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should return empty array for user with no applications', async () => {
      const result = await getApplicationsByUserId('user-no-apps');
      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(0);
    });

    it('should return all applications for a user', async () => {
      const result = await getApplicationsByUserId('user-123');
      
      expect(result).to.be.an('array');
      expect(result.length).to.be.greaterThan(0);
      result.forEach(app => {
        expect(app).to.have.property('test_taker_id', 'user-123');
        expect(app).to.have.property('test_id');
        expect(app).to.have.property('status');
      });
    });
  });

  describe('updateApplicationStatus', () => {
    it('should throw error if id is missing', async () => {
      try {
        await updateApplicationStatus({ status: 'approved' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Application ID is required');
      }
    });

    it('should throw error if status is missing', async () => {
      try {
        await updateApplicationStatus({ id: 'app-123' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Status is required');
      }
    });

    it('should throw error for invalid status', async () => {
      try {
        await updateApplicationStatus({ 
          id: 'app-123', 
          status: 'invalid-status' 
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid status');
      }
    });

    it('should update application status to approved', async () => {
      const result = await updateApplicationStatus({
        id: 'app-123',
        status: 'approved'
      });

      expect(result).to.have.property('id', 'app-123');
      expect(result).to.have.property('status', 'approved');
    });

    it('should update application status to rejected', async () => {
      const result = await updateApplicationStatus({
        id: 'app-456',
        status: 'rejected'
      });

      expect(result).to.have.property('id', 'app-456');
      expect(result).to.have.property('status', 'rejected');
    });

    it('should update application status to hired', async () => {
      const result = await updateApplicationStatus({
        id: 'app-789',
        status: 'hired'
      });

      expect(result).to.have.property('id', 'app-789');
      expect(result).to.have.property('status', 'hired');
    });
  });

  describe('deleteApplication', () => {
    it('should throw error if id is missing', async () => {
      try {
        await deleteApplication();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Application ID is required');
      }
    });

    it('should return false for non-existent application', async () => {
      const result = await deleteApplication('non-existent-id');
      expect(result).to.be.false;
    });

    it('should delete application successfully', async () => {
      const result = await deleteApplication('app-to-delete');
      expect(result).to.be.true;
    });
  });
});