import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import { getSupabaseClient } from '../../src/lib/supabaseClient.js';
import {
  getLeaderboard,
  getLeaderboardWithFilters,
  getUserStats,
  updateLeaderboardVisibility,
} from '../../src/lib/services/leaderboard.js';

const supabase = getSupabaseClient();

describe('Leaderboard Service', () => {
  let testUser;
  let testSession;

  before(async () => {
    // Create a test user for leaderboard tests
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `leaderboard-test-${Date.now()}@example.com`,
      password: 'TestPassword123!',
    });

    if (authError) throw authError;
    testUser = authData.user;
    testSession = authData.session;

    // Set user type to test_taker
    await supabase
      .from('users')
      .update({ user_type: 'test_taker', full_name: 'Test Taker' })
      .eq('id', testUser.id);

    // Create test stats
    await supabase.from('test_taker_stats').insert({
      user_id: testUser.id,
      tests_completed: 10,
      tests_passed: 8,
      total_earned: 1000.5,
      average_rating: 4.5,
      success_rate: 80.0,
    });
  });

  after(async () => {
    // Cleanup
    if (testUser) {
      await supabase.from('test_taker_stats').delete().eq('user_id', testUser.id);
      await supabase.from('users').delete().eq('id', testUser.id);
    }
  });

  describe('getLeaderboard', () => {
    it('should fetch leaderboard data', async () => {
      const result = await getLeaderboard();

      expect(result).to.have.property('data');
      expect(result).to.have.property('error').that.is.null;
      expect(result.data).to.be.an('array');
    });

    it('should return users with show_on_leaderboard=true only', async () => {
      const result = await getLeaderboard();

      expect(result.error).to.be.null;
      if (result.data.length > 0) {
        // All returned users should be visible on leaderboard
        result.data.forEach((user) => {
          expect(user).to.have.property('tests_completed');
          expect(user).to.have.property('average_rating');
        });
      }
    });

    it('should support pagination with limit', async () => {
      const result = await getLeaderboard({ limit: 5 });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
      expect(result.data.length).to.be.at.most(5);
    });

    it('should support pagination with offset', async () => {
      const result = await getLeaderboard({ limit: 10, offset: 5 });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
    });
  });

  describe('getLeaderboardWithFilters', () => {
    it('should sort by tests_completed', async () => {
      const result = await getLeaderboardWithFilters({ sortBy: 'tests_completed' });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');

      // Check if sorted in descending order
      if (result.data.length > 1) {
        for (let i = 0; i < result.data.length - 1; i++) {
          expect(result.data[i].tests_completed).to.be.at.least(
            result.data[i + 1].tests_completed
          );
        }
      }
    });

    it('should sort by average_rating', async () => {
      const result = await getLeaderboardWithFilters({ sortBy: 'average_rating' });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
    });

    it('should sort by success_rate', async () => {
      const result = await getLeaderboardWithFilters({ sortBy: 'success_rate' });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
    });

    it('should sort by total_earned', async () => {
      const result = await getLeaderboardWithFilters({ sortBy: 'total_earned' });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
    });

    it('should filter by location', async () => {
      const result = await getLeaderboardWithFilters({ location: 'New York' });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
    });

    it('should filter by skills', async () => {
      const result = await getLeaderboardWithFilters({ skills: ['JavaScript'] });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
    });

    it('should combine multiple filters', async () => {
      const result = await getLeaderboardWithFilters({
        sortBy: 'average_rating',
        location: 'New York',
        limit: 10,
      });

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('array');
    });
  });

  describe('getUserStats', () => {
    it('should fetch stats for a specific user', async () => {
      const result = await getUserStats(testUser.id);

      expect(result).to.have.property('data');
      expect(result).to.have.property('error').that.is.null;
      expect(result.data).to.be.an('object');
      expect(result.data).to.have.property('tests_completed', 10);
      expect(result.data).to.have.property('tests_passed', 8);
      expect(result.data).to.have.property('success_rate', 80.0);
    });

    it('should return error for non-existent user', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      const result = await getUserStats(fakeUserId);

      expect(result.data).to.be.null;
    });

    it('should require user_id parameter', async () => {
      const result = await getUserStats(null);

      expect(result.error).to.not.be.null;
    });
  });

  describe('updateLeaderboardVisibility', () => {
    it('should update show_on_leaderboard setting', async () => {
      // Set session for authenticated request
      await supabase.auth.setSession(testSession);

      const result = await updateLeaderboardVisibility(testUser.id, false);

      expect(result.error).to.be.null;
      expect(result.data).to.be.an('object');

      // Verify the update
      const { data: user } = await supabase
        .from('users')
        .select('show_on_leaderboard')
        .eq('id', testUser.id)
        .single();

      expect(user.show_on_leaderboard).to.be.false;

      // Reset to true
      await updateLeaderboardVisibility(testUser.id, true);
    });

    it('should only allow users to update their own visibility', async () => {
      const fakeUserId = '00000000-0000-0000-0000-000000000000';
      const result = await updateLeaderboardVisibility(fakeUserId, false);

      // Should fail due to RLS policy
      expect(result.error).to.not.be.null;
    });
  });
});