import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import {
  calculateReputationScore,
  getUserMetrics,
  awardBadge,
  getUserBadges,
  trackExpertise,
  getTopPerformers,
  getSpecialists,
  initializeUserMetrics,
  updateUserMetrics,
  checkAndAwardBadges,
} from '../../src/lib/services/reputation.js';
import { supabase } from '../../src/lib/supabaseClient.js';

describe('Reputation Service', () => {
  let testUserId;
  let testBadgeId;

  beforeEach(async () => {
    // Create a test user for testing
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: `test-reputation-${Date.now()}@example.com`,
      password: 'testpassword123',
    });

    if (userError) throw userError;
    testUserId = userData.user.id;

    // Get a badge ID for testing
    const { data: badgeData } = await supabase
      .from('badges')
      .select('id')
      .eq('slug', 'reliable')
      .single();

    testBadgeId = badgeData?.id;
  });

  afterEach(async () => {
    // Clean up test data
    if (testUserId) {
      await supabase.from('user_metrics').delete().eq('user_id', testUserId);
      await supabase.from('user_badges').delete().eq('user_id', testUserId);
      await supabase.from('expertise_areas').delete().eq('user_id', testUserId);
      await supabase.auth.admin.deleteUser(testUserId);
    }
  });

  describe('initializeUserMetrics', () => {
    it('should create initial metrics for a new user', async () => {
      const result = await initializeUserMetrics(testUserId);

      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testUserId);
      expect(result.reputation_score).to.equal(0);
      expect(result.total_services_completed).to.equal(0);
      expect(result.total_earnings).to.equal('0.00');
    });

    it('should not create duplicate metrics for existing user', async () => {
      await initializeUserMetrics(testUserId);
      const result = await initializeUserMetrics(testUserId);

      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testUserId);
    });
  });

  describe('getUserMetrics', () => {
    it('should retrieve user metrics', async () => {
      await initializeUserMetrics(testUserId);
      const metrics = await getUserMetrics(testUserId);

      expect(metrics).to.be.an('object');
      expect(metrics.user_id).to.equal(testUserId);
      expect(metrics).to.have.property('reputation_score');
      expect(metrics).to.have.property('total_services_completed');
      expect(metrics).to.have.property('average_rating');
    });

    it('should return null for non-existent user', async () => {
      const metrics = await getUserMetrics('00000000-0000-0000-0000-000000000000');
      expect(metrics).to.be.null;
    });
  });

  describe('updateUserMetrics', () => {
    it('should update user metrics correctly', async () => {
      await initializeUserMetrics(testUserId);

      const updates = {
        total_services_completed: 5,
        total_earnings: 250.50,
        average_rating: 4.5,
        total_ratings: 5,
      };

      const result = await updateUserMetrics(testUserId, updates);

      expect(result).to.be.an('object');
      expect(result.total_services_completed).to.equal(5);
      expect(parseFloat(result.total_earnings)).to.equal(250.50);
      expect(parseFloat(result.average_rating)).to.equal(4.5);
    });

    it('should calculate reputation score based on metrics', async () => {
      await initializeUserMetrics(testUserId);

      const updates = {
        total_services_completed: 50,
        average_rating: 4.8,
        success_rate: 95,
        on_time_delivery_rate: 90,
      };

      const result = await updateUserMetrics(testUserId, updates);
      expect(result.reputation_score).to.be.greaterThan(0);
    });
  });

  describe('calculateReputationScore', () => {
    it('should calculate reputation score based on performance metrics', async () => {
      await initializeUserMetrics(testUserId);

      await updateUserMetrics(testUserId, {
        total_services_completed: 100,
        average_rating: 4.9,
        success_rate: 98,
        on_time_delivery_rate: 95,
        average_response_time_minutes: 30,
      });

      const score = await calculateReputationScore(testUserId);

      expect(score).to.be.a('number');
      expect(score).to.be.greaterThan(0);
    });

    it('should return 0 for user with no metrics', async () => {
      const score = await calculateReputationScore('00000000-0000-0000-0000-000000000000');
      expect(score).to.equal(0);
    });

    it('should weight different factors appropriately', async () => {
      await initializeUserMetrics(testUserId);

      // High rating, low completion
      await updateUserMetrics(testUserId, {
        total_services_completed: 5,
        average_rating: 5.0,
        success_rate: 100,
      });

      const lowScore = await calculateReputationScore(testUserId);

      // High rating, high completion
      await updateUserMetrics(testUserId, {
        total_services_completed: 100,
        average_rating: 5.0,
        success_rate: 100,
      });

      const highScore = await calculateReputationScore(testUserId);

      expect(highScore).to.be.greaterThan(lowScore);
    });
  });

  describe('awardBadge', () => {
    it('should award a badge to a user', async () => {
      if (!testBadgeId) {
        this.skip();
        return;
      }

      const result = await awardBadge(testUserId, testBadgeId);

      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testUserId);
      expect(result.badge_id).to.equal(testBadgeId);
      expect(result).to.have.property('earned_at');
    });

    it('should not award duplicate badges', async () => {
      if (!testBadgeId) {
        this.skip();
        return;
      }

      await awardBadge(testUserId, testBadgeId);
      const result = await awardBadge(testUserId, testBadgeId);

      // Should return existing badge, not create duplicate
      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testUserId);
    });
  });

  describe('getUserBadges', () => {
    it('should retrieve all badges for a user', async () => {
      if (!testBadgeId) {
        this.skip();
        return;
      }

      await awardBadge(testUserId, testBadgeId);
      const badges = await getUserBadges(testUserId);

      expect(badges).to.be.an('array');
      expect(badges.length).to.be.greaterThan(0);
      expect(badges[0]).to.have.property('badge_id');
      expect(badges[0]).to.have.property('earned_at');
    });

    it('should return empty array for user with no badges', async () => {
      const badges = await getUserBadges(testUserId);
      expect(badges).to.be.an('array');
      expect(badges.length).to.equal(0);
    });
  });

  describe('trackExpertise', () => {
    it('should create expertise area for new subject', async () => {
      const result = await trackExpertise(testUserId, 'programming', 'JavaScript', {
        rating: 5.0,
        earnings: 50.00,
      });

      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testUserId);
      expect(result.service_type).to.equal('programming');
      expect(result.subject).to.equal('JavaScript');
      expect(result.services_completed).to.equal(1);
    });

    it('should update existing expertise area', async () => {
      await trackExpertise(testUserId, 'programming', 'JavaScript', {
        rating: 5.0,
        earnings: 50.00,
      });

      const result = await trackExpertise(testUserId, 'programming', 'JavaScript', {
        rating: 4.5,
        earnings: 75.00,
      });

      expect(result.services_completed).to.equal(2);
      expect(parseFloat(result.total_earnings)).to.equal(125.00);
    });

    it('should calculate average rating correctly', async () => {
      await trackExpertise(testUserId, 'homework', 'Mathematics', {
        rating: 5.0,
        earnings: 30.00,
      });

      await trackExpertise(testUserId, 'homework', 'Mathematics', {
        rating: 4.0,
        earnings: 30.00,
      });

      const result = await trackExpertise(testUserId, 'homework', 'Mathematics', {
        rating: 4.5,
        earnings: 30.00,
      });

      // Average of 5.0, 4.0, 4.5 = 4.5
      expect(parseFloat(result.average_rating)).to.be.closeTo(4.5, 0.1);
    });
  });

  describe('getSpecialists', () => {
    it('should retrieve specialists for a service type', async () => {
      await initializeUserMetrics(testUserId);
      await trackExpertise(testUserId, 'programming', 'Python', {
        rating: 5.0,
        earnings: 100.00,
      });

      const specialists = await getSpecialists('programming');

      expect(specialists).to.be.an('array');
      // May include other users, so just check structure
      if (specialists.length > 0) {
        expect(specialists[0]).to.have.property('user_id');
        expect(specialists[0]).to.have.property('service_type');
      }
    });

    it('should return empty array for service type with no specialists', async () => {
      const specialists = await getSpecialists('nonexistent-type');
      expect(specialists).to.be.an('array');
    });
  });

  describe('getTopPerformers', () => {
    it('should retrieve top performers by reputation score', async () => {
      await initializeUserMetrics(testUserId);
      await updateUserMetrics(testUserId, {
        total_services_completed: 50,
        average_rating: 4.8,
        reputation_score: 500,
      });

      const topPerformers = await getTopPerformers({ limit: 10 });

      expect(topPerformers).to.be.an('array');
      if (topPerformers.length > 0) {
        expect(topPerformers[0]).to.have.property('user_id');
        expect(topPerformers[0]).to.have.property('reputation_score');
      }
    });

    it('should filter by service type', async () => {
      await initializeUserMetrics(testUserId);
      await trackExpertise(testUserId, 'homework', 'Physics', {
        rating: 5.0,
        earnings: 100.00,
      });

      const topPerformers = await getTopPerformers({
        serviceType: 'homework',
        limit: 10,
      });

      expect(topPerformers).to.be.an('array');
    });

    it('should respect limit parameter', async () => {
      const topPerformers = await getTopPerformers({ limit: 5 });

      expect(topPerformers).to.be.an('array');
      expect(topPerformers.length).to.be.at.most(5);
    });
  });

  describe('checkAndAwardBadges', () => {
    it('should award "reliable" badge for 100+ services', async () => {
      await initializeUserMetrics(testUserId);
      await updateUserMetrics(testUserId, {
        total_services_completed: 100,
      });

      const badges = await checkAndAwardBadges(testUserId);

      expect(badges).to.be.an('array');
      const reliableBadge = badges.find((b) => b.slug === 'reliable');
      expect(reliableBadge).to.exist;
    });

    it('should award "quick-responder" badge for fast response time', async () => {
      await initializeUserMetrics(testUserId);
      await updateUserMetrics(testUserId, {
        average_response_time_minutes: 45,
        total_services_completed: 10,
      });

      const badges = await checkAndAwardBadges(testUserId);

      expect(badges).to.be.an('array');
      const quickBadge = badges.find((b) => b.slug === 'quick-responder');
      expect(quickBadge).to.exist;
    });

    it('should award "subject-master" badge for 50+ services in one subject', async () => {
      await initializeUserMetrics(testUserId);

      // Track 50 services in one subject
      for (let i = 0; i < 50; i++) {
        await trackExpertise(testUserId, 'programming', 'JavaScript', {
          rating: 5.0,
          earnings: 50.00,
        });
      }

      const badges = await checkAndAwardBadges(testUserId);

      expect(badges).to.be.an('array');
      const masterBadge = badges.find((b) => b.slug === 'subject-master');
      expect(masterBadge).to.exist;
    });

    it('should not award badges if criteria not met', async () => {
      await initializeUserMetrics(testUserId);
      await updateUserMetrics(testUserId, {
        total_services_completed: 5,
      });

      const badges = await checkAndAwardBadges(testUserId);

      expect(badges).to.be.an('array');
      expect(badges.length).to.equal(0);
    });
  });
});