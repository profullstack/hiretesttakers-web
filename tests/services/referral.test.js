import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import {
  generateReferralCode,
  getReferralCode,
  trackReferral,
  calculateBonus,
  awardBonus,
  getReferralStats,
  getRewardTier,
  getReferralHistory,
  completeReferral,
  getBonusTransactions,
} from '../../src/lib/services/referral.js';
import { supabase } from '../../src/lib/supabaseClient.js';

describe('Referral Service', () => {
  let testReferrerId;
  let testReferredId;
  let testReferralCode;

  beforeEach(async () => {
    // Create test referrer user
    const { data: referrerData, error: referrerError } = await supabase.auth.signUp({
      email: `test-referrer-${Date.now()}@example.com`,
      password: 'testpassword123',
    });

    if (referrerError) throw referrerError;
    testReferrerId = referrerData.user.id;

    // Create test referred user
    const { data: referredData, error: referredError } = await supabase.auth.signUp({
      email: `test-referred-${Date.now()}@example.com`,
      password: 'testpassword123',
    });

    if (referredError) throw referredError;
    testReferredId = referredData.user.id;
  });

  afterEach(async () => {
    // Clean up test data
    if (testReferrerId) {
      await supabase.from('referral_codes').delete().eq('user_id', testReferrerId);
      await supabase.from('referrals').delete().eq('referrer_id', testReferrerId);
      await supabase.from('bonus_transactions').delete().eq('user_id', testReferrerId);
      await supabase.from('referral_stats').delete().eq('user_id', testReferrerId);
      await supabase.auth.admin.deleteUser(testReferrerId);
    }

    if (testReferredId) {
      await supabase.from('referrals').delete().eq('referred_id', testReferredId);
      await supabase.from('bonus_transactions').delete().eq('user_id', testReferredId);
      await supabase.from('referral_stats').delete().eq('user_id', testReferredId);
      await supabase.auth.admin.deleteUser(testReferredId);
    }
  });

  describe('generateReferralCode', () => {
    it('should generate a unique referral code for a user', async () => {
      const result = await generateReferralCode(testReferrerId);

      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testReferrerId);
      expect(result.code).to.be.a('string');
      expect(result.code.length).to.be.greaterThan(0);
      expect(result.is_active).to.be.true;

      testReferralCode = result.code;
    });

    it('should return existing code if user already has one', async () => {
      const first = await generateReferralCode(testReferrerId);
      const second = await generateReferralCode(testReferrerId);

      expect(first.code).to.equal(second.code);
      expect(first.id).to.equal(second.id);
    });

    it('should generate unique codes for different users', async () => {
      const code1 = await generateReferralCode(testReferrerId);
      const code2 = await generateReferralCode(testReferredId);

      expect(code1.code).to.not.equal(code2.code);
    });
  });

  describe('getReferralCode', () => {
    it('should retrieve user referral code', async () => {
      await generateReferralCode(testReferrerId);
      const result = await getReferralCode(testReferrerId);

      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testReferrerId);
      expect(result.code).to.be.a('string');
    });

    it('should return null for user without referral code', async () => {
      const result = await getReferralCode(testReferredId);
      expect(result).to.be.null;
    });
  });

  describe('trackReferral', () => {
    beforeEach(async () => {
      const code = await generateReferralCode(testReferrerId);
      testReferralCode = code.code;
    });

    it('should track a new referral', async () => {
      const result = await trackReferral(testReferralCode, testReferredId);

      expect(result).to.be.an('object');
      expect(result.referrer_id).to.equal(testReferrerId);
      expect(result.referred_id).to.equal(testReferredId);
      expect(result.referral_code).to.equal(testReferralCode);
      expect(result.status).to.equal('pending');
    });

    it('should throw error for invalid referral code', async () => {
      try {
        await trackReferral('INVALID123', testReferredId);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Invalid referral code');
      }
    });

    it('should throw error for self-referral', async () => {
      try {
        await trackReferral(testReferralCode, testReferrerId);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('cannot refer yourself');
      }
    });

    it('should throw error if user already referred', async () => {
      await trackReferral(testReferralCode, testReferredId);

      try {
        await trackReferral(testReferralCode, testReferredId);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('already been referred');
      }
    });
  });

  describe('completeReferral', () => {
    let referralId;

    beforeEach(async () => {
      const code = await generateReferralCode(testReferrerId);
      testReferralCode = code.code;
      const referral = await trackReferral(testReferralCode, testReferredId);
      referralId = referral.id;
    });

    it('should complete a pending referral', async () => {
      const result = await completeReferral(referralId);

      expect(result).to.be.an('object');
      expect(result.status).to.equal('completed');
      expect(result.completed_at).to.not.be.null;
    });

    it('should award bonuses when completing referral', async () => {
      await completeReferral(referralId);

      // Check referrer bonus
      const referrerBonuses = await getBonusTransactions(testReferrerId);
      expect(referrerBonuses).to.be.an('array');
      expect(referrerBonuses.length).to.be.greaterThan(0);

      const referralBonus = referrerBonuses.find((b) => b.type === 'referral_bonus');
      expect(referralBonus).to.exist;
      expect(parseFloat(referralBonus.amount)).to.equal(10.00);

      // Check referred user welcome bonus
      const referredBonuses = await getBonusTransactions(testReferredId);
      expect(referredBonuses).to.be.an('array');
      expect(referredBonuses.length).to.be.greaterThan(0);

      const welcomeBonus = referredBonuses.find((b) => b.type === 'welcome_bonus');
      expect(welcomeBonus).to.exist;
      expect(parseFloat(welcomeBonus.amount)).to.equal(5.00);
    });

    it('should throw error for non-existent referral', async () => {
      try {
        await completeReferral('00000000-0000-0000-0000-000000000000');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('not found');
      }
    });
  });

  describe('calculateBonus', () => {
    it('should calculate referrer bonus correctly', async () => {
      const bonus = await calculateBonus(testReferrerId, testReferredId, 'referrer');

      expect(bonus).to.be.an('object');
      expect(bonus.amount).to.equal(10.00);
      expect(bonus.type).to.equal('referral_bonus');
    });

    it('should calculate referred user bonus correctly', async () => {
      const bonus = await calculateBonus(testReferrerId, testReferredId, 'referred');

      expect(bonus).to.be.an('object');
      expect(bonus.amount).to.equal(5.00);
      expect(bonus.type).to.equal('welcome_bonus');
    });
  });

  describe('awardBonus', () => {
    it('should award bonus to user', async () => {
      const result = await awardBonus(testReferrerId, 25.00, 'milestone_bonus', 'Reached 5 referrals');

      expect(result).to.be.an('object');
      expect(result.user_id).to.equal(testReferrerId);
      expect(parseFloat(result.amount)).to.equal(25.00);
      expect(result.type).to.equal('milestone_bonus');
      expect(result.reason).to.equal('Reached 5 referrals');
    });

    it('should throw error for invalid amount', async () => {
      try {
        await awardBonus(testReferrerId, -10, 'referral_bonus', 'Invalid');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('must be positive');
      }
    });

    it('should throw error for invalid bonus type', async () => {
      try {
        await awardBonus(testReferrerId, 10, 'invalid_type', 'Test');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Invalid bonus type');
      }
    });
  });

  describe('getReferralStats', () => {
    beforeEach(async () => {
      const code = await generateReferralCode(testReferrerId);
      testReferralCode = code.code;
    });

    it('should return initial stats for new user', async () => {
      const stats = await getReferralStats(testReferrerId);

      expect(stats).to.be.an('object');
      expect(stats.user_id).to.equal(testReferrerId);
      expect(stats.total_referrals).to.equal(0);
      expect(stats.completed_referrals).to.equal(0);
      expect(stats.pending_referrals).to.equal(0);
      expect(parseFloat(stats.total_bonus_earned)).to.equal(0);
    });

    it('should update stats after tracking referral', async () => {
      await trackReferral(testReferralCode, testReferredId);
      const stats = await getReferralStats(testReferrerId);

      expect(stats.total_referrals).to.equal(1);
      expect(stats.pending_referrals).to.equal(1);
      expect(stats.completed_referrals).to.equal(0);
    });

    it('should update stats after completing referral', async () => {
      const referral = await trackReferral(testReferralCode, testReferredId);
      await completeReferral(referral.id);

      const stats = await getReferralStats(testReferrerId);

      expect(stats.total_referrals).to.equal(1);
      expect(stats.completed_referrals).to.equal(1);
      expect(stats.pending_referrals).to.equal(0);
      expect(parseFloat(stats.total_bonus_earned)).to.be.greaterThan(0);
    });
  });

  describe('getRewardTier', () => {
    it('should return null for user with no referrals', async () => {
      const tier = await getRewardTier(testReferrerId);
      expect(tier).to.be.null;
    });

    it('should return Bronze tier for 1-5 completed referrals', async () => {
      // Simulate 3 completed referrals
      await supabase.from('referral_stats').upsert({
        user_id: testReferrerId,
        completed_referrals: 3,
      });

      const tier = await getRewardTier(testReferrerId);

      expect(tier).to.be.an('object');
      expect(tier.slug).to.equal('bronze');
      expect(parseFloat(tier.bonus_percentage)).to.equal(5.00);
    });

    it('should return Silver tier for 6-15 completed referrals', async () => {
      await supabase.from('referral_stats').upsert({
        user_id: testReferrerId,
        completed_referrals: 10,
      });

      const tier = await getRewardTier(testReferrerId);

      expect(tier).to.be.an('object');
      expect(tier.slug).to.equal('silver');
      expect(parseFloat(tier.bonus_percentage)).to.equal(10.00);
    });

    it('should return Gold tier for 16-30 completed referrals', async () => {
      await supabase.from('referral_stats').upsert({
        user_id: testReferrerId,
        completed_referrals: 20,
      });

      const tier = await getRewardTier(testReferrerId);

      expect(tier).to.be.an('object');
      expect(tier.slug).to.equal('gold');
      expect(parseFloat(tier.bonus_percentage)).to.equal(15.00);
    });

    it('should return Platinum tier for 31+ completed referrals', async () => {
      await supabase.from('referral_stats').upsert({
        user_id: testReferrerId,
        completed_referrals: 50,
      });

      const tier = await getRewardTier(testReferrerId);

      expect(tier).to.be.an('object');
      expect(tier.slug).to.equal('platinum');
      expect(parseFloat(tier.bonus_percentage)).to.equal(20.00);
    });
  });

  describe('getReferralHistory', () => {
    beforeEach(async () => {
      const code = await generateReferralCode(testReferrerId);
      testReferralCode = code.code;
    });

    it('should return empty array for user with no referrals', async () => {
      const history = await getReferralHistory(testReferrerId);

      expect(history).to.be.an('array');
      expect(history.length).to.equal(0);
    });

    it('should return referral history for user', async () => {
      await trackReferral(testReferralCode, testReferredId);
      const history = await getReferralHistory(testReferrerId);

      expect(history).to.be.an('array');
      expect(history.length).to.equal(1);
      expect(history[0].referrer_id).to.equal(testReferrerId);
      expect(history[0].referred_id).to.equal(testReferredId);
    });

    it('should filter by status', async () => {
      await trackReferral(testReferralCode, testReferredId);
      
      const pending = await getReferralHistory(testReferrerId, { status: 'pending' });
      expect(pending.length).to.equal(1);

      const completed = await getReferralHistory(testReferrerId, { status: 'completed' });
      expect(completed.length).to.equal(0);
    });

    it('should respect limit parameter', async () => {
      // Create multiple referrals
      for (let i = 0; i < 3; i++) {
        const { data: newUser } = await supabase.auth.signUp({
          email: `test-ref-${Date.now()}-${i}@example.com`,
          password: 'testpassword123',
        });
        await trackReferral(testReferralCode, newUser.user.id);
      }

      const history = await getReferralHistory(testReferrerId, { limit: 2 });
      expect(history.length).to.be.at.most(2);
    });
  });

  describe('getBonusTransactions', () => {
    it('should return empty array for user with no bonuses', async () => {
      const transactions = await getBonusTransactions(testReferrerId);

      expect(transactions).to.be.an('array');
      expect(transactions.length).to.equal(0);
    });

    it('should return bonus transactions for user', async () => {
      await awardBonus(testReferrerId, 10.00, 'referral_bonus', 'Test bonus');
      const transactions = await getBonusTransactions(testReferrerId);

      expect(transactions).to.be.an('array');
      expect(transactions.length).to.equal(1);
      expect(transactions[0].user_id).to.equal(testReferrerId);
      expect(parseFloat(transactions[0].amount)).to.equal(10.00);
    });

    it('should filter by bonus type', async () => {
      await awardBonus(testReferrerId, 10.00, 'referral_bonus', 'Referral');
      await awardBonus(testReferrerId, 25.00, 'milestone_bonus', 'Milestone');

      const referralBonuses = await getBonusTransactions(testReferrerId, { type: 'referral_bonus' });
      expect(referralBonuses.length).to.equal(1);
      expect(referralBonuses[0].type).to.equal('referral_bonus');

      const milestoneBonuses = await getBonusTransactions(testReferrerId, { type: 'milestone_bonus' });
      expect(milestoneBonuses.length).to.equal(1);
      expect(milestoneBonuses[0].type).to.equal('milestone_bonus');
    });

    it('should respect limit parameter', async () => {
      for (let i = 0; i < 5; i++) {
        await awardBonus(testReferrerId, 10.00, 'referral_bonus', `Bonus ${i}`);
      }

      const transactions = await getBonusTransactions(testReferrerId, { limit: 3 });
      expect(transactions.length).to.be.at.most(3);
    });
  });

  describe('Milestone bonuses', () => {
    beforeEach(async () => {
      const code = await generateReferralCode(testReferrerId);
      testReferralCode = code.code;
    });

    it('should award milestone bonus at 5 referrals', async () => {
      // Create and complete 5 referrals
      for (let i = 0; i < 5; i++) {
        const { data: newUser } = await supabase.auth.signUp({
          email: `test-milestone-${Date.now()}-${i}@example.com`,
          password: 'testpassword123',
        });
        const referral = await trackReferral(testReferralCode, newUser.user.id);
        await completeReferral(referral.id);
      }

      const bonuses = await getBonusTransactions(testReferrerId, { type: 'milestone_bonus' });
      const milestone5 = bonuses.find((b) => b.reason?.includes('5 referrals'));
      
      expect(milestone5).to.exist;
    });
  });
});