import { supabase } from '../supabaseClient.js';

/**
 * Milestone bonus amounts
 */
const MILESTONE_BONUSES = {
  5: 25.00,
  10: 50.00,
  25: 100.00,
  50: 250.00,
};

/**
 * Generate a unique referral code for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Referral code object
 */
export async function generateReferralCode(userId) {
  // Check if user already has a referral code
  const { data: existing } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing;
  }

  // Generate new code using database function
  const { data: codeData, error: codeError } = await supabase.rpc('generate_referral_code');

  if (codeError) throw new Error(`Failed to generate referral code: ${codeError.message}`);

  // Insert new referral code
  const { data, error } = await supabase
    .from('referral_codes')
    .insert({
      user_id: userId,
      code: codeData,
      is_active: true,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user's referral code
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Referral code object or null
 */
export async function getReferralCode(userId) {
  const { data, error } = await supabase
    .from('referral_codes')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

/**
 * Track a new referral
 * @param {string} referralCode - Referral code
 * @param {string} referredUserId - ID of the referred user
 * @returns {Promise<Object>} Referral object
 */
export async function trackReferral(referralCode, referredUserId) {
  // Validate referral code exists
  const { data: codeData, error: codeError } = await supabase
    .from('referral_codes')
    .select('user_id')
    .eq('code', referralCode)
    .eq('is_active', true)
    .single();

  if (codeError || !codeData) {
    throw new Error('Invalid referral code');
  }

  const referrerId = codeData.user_id;

  // Check for self-referral
  if (referrerId === referredUserId) {
    throw new Error('You cannot refer yourself');
  }

  // Check if user has already been referred
  const { data: existingReferral } = await supabase
    .from('referrals')
    .select('id')
    .eq('referred_id', referredUserId)
    .single();

  if (existingReferral) {
    throw new Error('This user has already been referred');
  }

  // Create referral record
  const { data, error } = await supabase
    .from('referrals')
    .insert({
      referrer_id: referrerId,
      referred_id: referredUserId,
      referral_code: referralCode,
      status: 'pending',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Complete a referral and award bonuses
 * @param {string} referralId - Referral ID
 * @returns {Promise<Object>} Updated referral object
 */
export async function completeReferral(referralId) {
  // Get referral details
  const { data: referral, error: referralError } = await supabase
    .from('referrals')
    .select('*')
    .eq('id', referralId)
    .single();

  if (referralError || !referral) {
    throw new Error('Referral not found');
  }

  // Update referral status
  const { data: updatedReferral, error: updateError } = await supabase
    .from('referrals')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', referralId)
    .select()
    .single();

  if (updateError) throw updateError;

  // Award referrer bonus
  await awardBonus(
    referral.referrer_id,
    10.00,
    'referral_bonus',
    'Referral bonus for successful referral',
    referralId
  );

  // Award referred user welcome bonus
  await awardBonus(
    referral.referred_id,
    5.00,
    'welcome_bonus',
    'Welcome bonus for joining via referral',
    referralId
  );

  // Check for milestone bonuses
  const stats = await getReferralStats(referral.referrer_id);
  const completedCount = stats.completed_referrals;

  if (MILESTONE_BONUSES[completedCount]) {
    await awardBonus(
      referral.referrer_id,
      MILESTONE_BONUSES[completedCount],
      'milestone_bonus',
      `Milestone bonus for reaching ${completedCount} referrals`
    );
  }

  return updatedReferral;
}

/**
 * Calculate bonus amount for a referral
 * @param {string} referrerId - Referrer user ID
 * @param {string} referredId - Referred user ID
 * @param {string} role - 'referrer' or 'referred'
 * @returns {Promise<Object>} Bonus details
 */
export async function calculateBonus(referrerId, referredId, role) {
  if (role === 'referrer') {
    return {
      amount: 10.00,
      type: 'referral_bonus',
      reason: 'Referral bonus',
    };
  } else if (role === 'referred') {
    return {
      amount: 5.00,
      type: 'welcome_bonus',
      reason: 'Welcome bonus',
    };
  }

  throw new Error('Invalid role specified');
}

/**
 * Award a bonus to a user
 * @param {string} userId - User ID
 * @param {number} amount - Bonus amount
 * @param {string} type - Bonus type
 * @param {string} reason - Reason for bonus
 * @param {string} referralId - Optional referral ID
 * @returns {Promise<Object>} Bonus transaction object
 */
export async function awardBonus(userId, amount, type, reason, referralId = null) {
  // Validate amount
  if (amount <= 0) {
    throw new Error('Bonus amount must be positive');
  }

  // Validate bonus type
  const validTypes = ['referral_bonus', 'welcome_bonus', 'milestone_bonus', 'tier_bonus'];
  if (!validTypes.includes(type)) {
    throw new Error('Invalid bonus type');
  }

  const { data, error } = await supabase
    .from('bonus_transactions')
    .insert({
      user_id: userId,
      amount,
      type,
      reason,
      referral_id: referralId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get referral statistics for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Referral stats object
 */
export async function getReferralStats(userId) {
  // Initialize stats if they don't exist
  const { data: existing } = await supabase
    .from('referral_stats')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing;
  }

  // Create initial stats
  const { data, error } = await supabase
    .from('referral_stats')
    .insert({
      user_id: userId,
      total_referrals: 0,
      completed_referrals: 0,
      pending_referrals: 0,
      total_bonus_earned: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get reward tier for a user based on completed referrals
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Reward tier object or null
 */
export async function getRewardTier(userId) {
  const stats = await getReferralStats(userId);
  const completedReferrals = stats.completed_referrals;

  if (completedReferrals === 0) {
    return null;
  }

  // Get appropriate tier
  const { data, error } = await supabase
    .from('reward_tiers')
    .select('*')
    .lte('min_referrals', completedReferrals)
    .or(`max_referrals.gte.${completedReferrals},max_referrals.is.null`)
    .order('min_referrals', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

/**
 * Get referral history for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options (status, limit)
 * @returns {Promise<Array>} Array of referral objects
 */
export async function getReferralHistory(userId, options = {}) {
  const { status, limit = 50 } = options;

  let query = supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Get bonus transactions for a user
 * @param {string} userId - User ID
 * @param {Object} options - Query options (type, limit)
 * @returns {Promise<Array>} Array of bonus transaction objects
 */
export async function getBonusTransactions(userId, options = {}) {
  const { type, limit = 50 } = options;

  let query = supabase
    .from('bonus_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

/**
 * Get all reward tiers
 * @returns {Promise<Array>} Array of reward tier objects
 */
export async function getRewardTiers() {
  const { data, error } = await supabase
    .from('reward_tiers')
    .select('*')
    .order('min_referrals', { ascending: true });

  if (error) throw error;
  return data || [];
}