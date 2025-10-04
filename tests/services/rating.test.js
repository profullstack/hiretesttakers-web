import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { supabase } from '../../src/lib/supabaseClient.js';
import {
  createRating,
  getRatingsForTestTaker,
  getAverageRating,
  canRateTest,
} from '../../src/lib/services/rating.js';

describe('Rating Service', () => {
  let hirer;
  let testTaker;
  let testListing;
  let hirerSession;

  before(async () => {
    // Create hirer user
    const { data: hirerAuth, error: hirerError } = await supabase.auth.signUp({
      email: `rating-hirer-${Date.now()}@example.com`,
      password: 'TestPassword123!',
    });

    if (hirerError) throw hirerError;
    hirer = hirerAuth.user;
    hirerSession = hirerAuth.session;

    await supabase
      .from('users')
      .update({ user_type: 'hirer', full_name: 'Test Hirer' })
      .eq('id', hirer.id);

    // Create test taker user
    const { data: testTakerAuth, error: testTakerError } = await supabase.auth.signUp({
      email: `rating-taker-${Date.now()}@example.com`,
      password: 'TestPassword123!',
    });

    if (testTakerError) throw testTakerError;
    testTaker = testTakerAuth.user;

    await supabase
      .from('users')
      .update({ user_type: 'test_taker', full_name: 'Test Taker' })
      .eq('id', testTaker.id);

    // Create test stats for test taker
    await supabase.from('test_taker_stats').insert({
      user_id: testTaker.id,
      tests_completed: 5,
      tests_passed: 4,
    });

    // Create a test listing
    const { data: test, error: testError } = await supabase
      .from('tests')
      .insert({
        hirer_id: hirer.id,
        title: 'Rating Test',
        description: 'Test for rating',
        price_usd: 100,
        status: 'completed',
      })
      .select()
      .single();

    if (testError) throw testError;
    testListing = test;
  });

  after(async () => {
    // Cleanup
    if (testListing) {
      await supabase.from('ratings').delete().eq('test_id', testListing.id);
      await supabase.from('tests').delete().eq('id', testListing.id);
    }
    if (testTaker) {
      await supabase.from('test_taker_stats').delete().eq('user_id', testTaker.id);
      await supabase.from('users').delete().eq('id', testTaker.id);
    }
    if (hirer) {
      await supabase.from('users').delete().eq('id', hirer.id);
    }
  });

  describe('createRating', () => {
    it('should create a rating for a completed test', async () => {
      // Set hirer session
      await supabase.auth.setSession(hirerSession);

      const result = await createRating({
        testId: testListing.id,
        hirerId: hirer.id,
        testTakerId: testTaker.id,
        rating: 5,
        review: 'Excellent work!',
      });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('rating', 5);
      expect(result.data).to.have.property('review', 'Excellent work!');
    });

    it('should validate rating is between 1 and 5', async () => {
      await supabase.auth.setSession(hirerSession);

      const result = await createRating({
        testId: testListing.id,
        hirerId: hirer.id,
        testTakerId: testTaker.id,
        rating: 6,
        review: 'Invalid rating',
      });

      expect(result.error).to.not.be.null;
    });

    it('should require all required fields', async () => {
      await supabase.auth.setSession(hirerSession);

      const result = await createRating({
        testId: testListing.id,
        hirerId: hirer.id,
        // Missing testTakerId and rating
      });

      expect(result.error).to.not.be.null;
    });

    it('should prevent duplicate ratings for same test', async () => {
      await supabase.auth.setSession(hirerSession);

      // First rating should succeed (if not already created)
      const firstResult = await createRating({
        testId: testListing.id,
        hirerId: hirer.id,
        testTakerId: testTaker.id,
        rating: 4,
        review: 'Good work',
      });

      // Second rating should fail
      const secondResult = await createRating({
        testId: testListing.id,
        hirerId: hirer.id,
        testTakerId: testTaker.id,
        rating: 5,
        review: 'Trying to rate again',
      });

      expect(secondResult.error).to.not.be.null;
    });
  });

  describe('getRatingsForTestTaker', () => {
    it('should fetch all ratings for a test taker', async () => {
      const result = await getRatingsForTestTaker(testTaker.id);

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
      if (result.data.length > 0) {
        expect(result.data[0]).to.have.property('rating');
        expect(result.data[0]).to.have.property('test_taker_id', testTaker.id);
      }
    });

    it('should return empty array for test taker with no ratings', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      const result = await getRatingsForTestTaker(fakeUserId);

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array').that.is.empty;
    });

    it('should require test_taker_id parameter', async () => {
      const result = await getRatingsForTestTaker(null);

      expect(result.error).to.not.be.null;
    });
  });

  describe('getAverageRating', () => {
    it('should calculate average rating for a test taker', async () => {
      const result = await getAverageRating(testTaker.id);

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('average_rating');
      if (result.data.average_rating !== null) {
        expect(result.data.average_rating).to.be.a('number');
        expect(result.data.average_rating).to.be.at.least(1);
        expect(result.data.average_rating).to.be.at.most(5);
      }
    });

    it('should return null for test taker with no ratings', async () => {
      // Create a new test taker with no ratings
      const { data: newTakerAuth } = await supabase.auth.signUp({
        email: `no-ratings-${Date.now()}@example.com`,
        password: 'TestPassword123!',
      });

      await supabase
        .from('users')
        .update({ user_type: 'test_taker' })
        .eq('id', newTakerAuth.user.id);

      await supabase.from('test_taker_stats').insert({
        user_id: newTakerAuth.user.id,
      });

      const result = await getAverageRating(newTakerAuth.user.id);

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('object');
      expect(result.data.average_rating).to.be.null;

      // Cleanup
      await supabase.from('test_taker_stats').delete().eq('user_id', newTakerAuth.user.id);
      await supabase.from('users').delete().eq('id', newTakerAuth.user.id);
    });
  });

  describe('canRateTest', () => {
    it('should return true if hirer can rate the test', async () => {
      // Create a new test that hasn't been rated
      const { data: newTest } = await supabase
        .from('tests')
        .insert({
          hirer_id: hirer.id,
          title: 'Unrated Test',
          description: 'Test without rating',
          price_usd: 50,
          status: 'completed',
        })
        .select()
        .single();

      const result = await canRateTest(newTest.id, hirer.id);

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('canRate');

      // Cleanup
      await supabase.from('tests').delete().eq('id', newTest.id);
    });

    it('should return false if test already has a rating', async () => {
      const result = await canRateTest(testListing.id, hirer.id);

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('canRate');
    });

    it('should require both test_id and hirer_id', async () => {
      const result = await canRateTest(null, null);

      expect(result.error).to.not.be.null;
    });
  });
});