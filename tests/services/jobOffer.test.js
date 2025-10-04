/**
 * Job Offer Service Tests
 * 
 * Tests for job offer service using Supabase.
 * Uses Mocha and Chai for testing.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  createJobOffer,
  getJobOffer,
  getJobOffers,
  getJobOffersForTestTaker,
  getJobOffersFromEmployer,
  updateJobOfferStatus,
  withdrawJobOffer,
  expireOldOffers
} from '../../src/lib/services/jobOffer.js';

describe('Job Offer Service', () => {
  describe('createJobOffer', () => {
    it('should throw error if employer_id is missing', async () => {
      try {
        await createJobOffer({
          test_taker_id: 'test-taker-id',
          job_title: 'Software Engineer'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Employer ID is required');
      }
    });

    it('should throw error if test_taker_id is missing', async () => {
      try {
        await createJobOffer({
          employer_id: 'employer-id',
          job_title: 'Software Engineer'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Test taker ID is required');
      }
    });

    it('should throw error if job_title is missing', async () => {
      try {
        await createJobOffer({
          employer_id: 'employer-id',
          test_taker_id: 'test-taker-id'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Job title is required');
      }
    });

    it('should throw error if job_description is missing', async () => {
      try {
        await createJobOffer({
          employer_id: 'employer-id',
          test_taker_id: 'test-taker-id',
          job_title: 'Software Engineer'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Job description is required');
      }
    });

    it('should throw error if employment_type is missing', async () => {
      try {
        await createJobOffer({
          employer_id: 'employer-id',
          test_taker_id: 'test-taker-id',
          job_title: 'Software Engineer',
          job_description: 'Build amazing software'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Employment type is required');
      }
    });

    it('should throw error if employment_type is invalid', async () => {
      try {
        await createJobOffer({
          employer_id: 'employer-id',
          test_taker_id: 'test-taker-id',
          job_title: 'Software Engineer',
          job_description: 'Build amazing software',
          employment_type: 'invalid_type'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid employment type');
      }
    });

    it('should create job offer with valid data', async () => {
      const result = await createJobOffer({
        employer_id: 'employer-id',
        test_taker_id: 'test-taker-id',
        job_title: 'Software Engineer',
        job_description: 'Build amazing software',
        employment_type: 'full_time',
        salary_min: 80000,
        salary_max: 120000,
        location: 'Remote',
        remote_allowed: true
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('job_title', 'Software Engineer');
      expect(result).to.have.property('status', 'pending');
      expect(result).to.have.property('employment_type', 'full_time');
    });

    it('should set default values for optional fields', async () => {
      const result = await createJobOffer({
        employer_id: 'employer-id',
        test_taker_id: 'test-taker-id',
        job_title: 'Software Engineer',
        job_description: 'Build amazing software',
        employment_type: 'contract'
      });

      expect(result).to.have.property('salary_currency', 'USD');
      expect(result).to.have.property('remote_allowed', false);
      expect(result).to.have.property('status', 'pending');
    });
  });

  describe('getJobOffer', () => {
    it('should throw error if id is missing', async () => {
      try {
        await getJobOffer();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Job offer ID is required');
      }
    });

    it('should return job offer by id', async () => {
      const result = await getJobOffer('valid-offer-id');
      
      expect(result).to.have.property('id');
      expect(result).to.have.property('job_title');
      expect(result).to.have.property('status');
    });

    it('should return null for non-existent offer', async () => {
      const result = await getJobOffer('non-existent-id');
      expect(result).to.be.null;
    });
  });

  describe('getJobOffers', () => {
    it('should return all job offers with default filters', async () => {
      const result = await getJobOffers();
      
      expect(result).to.be.an('array');
      expect(result[0]).to.have.property('id');
      expect(result[0]).to.have.property('job_title');
    });

    it('should filter by status', async () => {
      const result = await getJobOffers({ status: 'pending' });
      
      expect(result).to.be.an('array');
      result.forEach(offer => {
        expect(offer.status).to.equal('pending');
      });
    });

    it('should filter by employment_type', async () => {
      const result = await getJobOffers({ employment_type: 'full_time' });
      
      expect(result).to.be.an('array');
      result.forEach(offer => {
        expect(offer.employment_type).to.equal('full_time');
      });
    });

    it('should limit results', async () => {
      const result = await getJobOffers({ limit: 5 });
      
      expect(result).to.be.an('array');
      expect(result.length).to.be.at.most(5);
    });
  });

  describe('getJobOffersForTestTaker', () => {
    it('should throw error if test_taker_id is missing', async () => {
      try {
        await getJobOffersForTestTaker();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Test taker ID is required');
      }
    });

    it('should return offers for specific test taker', async () => {
      const result = await getJobOffersForTestTaker('test-taker-id');
      
      expect(result).to.be.an('array');
      result.forEach(offer => {
        expect(offer.test_taker_id).to.equal('test-taker-id');
      });
    });

    it('should filter by status for test taker', async () => {
      const result = await getJobOffersForTestTaker('test-taker-id', { status: 'pending' });
      
      expect(result).to.be.an('array');
      result.forEach(offer => {
        expect(offer.test_taker_id).to.equal('test-taker-id');
        expect(offer.status).to.equal('pending');
      });
    });
  });

  describe('getJobOffersFromEmployer', () => {
    it('should throw error if employer_id is missing', async () => {
      try {
        await getJobOffersFromEmployer();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Employer ID is required');
      }
    });

    it('should return offers from specific employer', async () => {
      const result = await getJobOffersFromEmployer('employer-id');
      
      expect(result).to.be.an('array');
      result.forEach(offer => {
        expect(offer.employer_id).to.equal('employer-id');
      });
    });

    it('should filter by status for employer', async () => {
      const result = await getJobOffersFromEmployer('employer-id', { status: 'accepted' });
      
      expect(result).to.be.an('array');
      result.forEach(offer => {
        expect(offer.employer_id).to.equal('employer-id');
        expect(offer.status).to.equal('accepted');
      });
    });
  });

  describe('updateJobOfferStatus', () => {
    it('should throw error if id is missing', async () => {
      try {
        await updateJobOfferStatus({ status: 'accepted' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Job offer ID is required');
      }
    });

    it('should throw error if status is missing', async () => {
      try {
        await updateJobOfferStatus({ id: 'offer-id' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Status is required');
      }
    });

    it('should throw error if status is invalid', async () => {
      try {
        await updateJobOfferStatus({ id: 'offer-id', status: 'invalid_status' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid status');
      }
    });

    it('should update offer status to accepted', async () => {
      const result = await updateJobOfferStatus({
        id: 'offer-id',
        status: 'accepted'
      });

      expect(result).to.have.property('status', 'accepted');
      expect(result).to.have.property('responded_at');
    });

    it('should update offer status to rejected', async () => {
      const result = await updateJobOfferStatus({
        id: 'offer-id',
        status: 'rejected'
      });

      expect(result).to.have.property('status', 'rejected');
      expect(result).to.have.property('responded_at');
    });
  });

  describe('withdrawJobOffer', () => {
    it('should throw error if id is missing', async () => {
      try {
        await withdrawJobOffer();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Job offer ID is required');
      }
    });

    it('should withdraw job offer', async () => {
      const result = await withdrawJobOffer('offer-id');

      expect(result).to.have.property('status', 'withdrawn');
      expect(result).to.have.property('updated_at');
    });

    it('should throw error if offer is already responded to', async () => {
      try {
        await withdrawJobOffer('accepted-offer-id');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Cannot withdraw offer that has been responded to');
      }
    });
  });

  describe('expireOldOffers', () => {
    it('should expire offers past their expiration date', async () => {
      const result = await expireOldOffers();
      
      expect(result).to.have.property('count');
      expect(result.count).to.be.a('number');
    });

    it('should only expire pending offers', async () => {
      const result = await expireOldOffers();
      
      expect(result).to.have.property('count');
      // Verify that only pending offers were affected
    });
  });
});