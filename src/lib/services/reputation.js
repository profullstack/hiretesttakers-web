import { supabase } from '../supabaseClient.js';

/**
 * Initialize user metrics for a new user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created or existing user metrics
 */
export async function initializeUserMetrics(userId) {
  // Check if metrics already exist
  const { data: existing } = await supabase
    .from('user_metrics')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing;
  }

  // Create new metrics
  const { data, error } = await supabase
    .from('user_metrics')
    .insert({
      user_id: userId,
      reputation_score: 0,
      total_services_completed: 0,
      total_earnings: 0,
      average_rating: 0,
      total_ratings: 0,
      average_response_time_minutes: 0,
      success_rate: 0,
      on_time_delivery_rate: 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get user metrics
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User metrics or null
 */
export async function getUserMetrics(userId) {
  const { data, error } = await supabase
    .from('user_metrics')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return data;
}

/**
 * Update user metrics
 * @param {string} userId - User ID
 * @param {Object} updates - Metrics to update
 * @returns {Promise<Object>} Updated metrics
 */
export async function updateUserMetrics(userId, updates) {
  // Ensure user metrics exist
  await initializeUserMetrics(userId);

  // Calculate reputation score if metrics are being updated
  const metrics = await getUserMetrics(userId);
  const updatedMetrics = { ...metrics, ...updates };

  // Calculate new reputation score
  const reputationScore = calculateReputationScoreFromMetrics(updatedMetrics);
  updates.reputation_score = reputationScore;

  const { data, error } = await supabase
    .from('user_metrics')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Calculate reputation score from metrics object
 * @param {Object} metrics - User metrics
 * @returns {number} Calculated reputation score
 */
function calculateReputationScoreFromMetrics(metrics) {
  const {
    total_services_completed = 0,
    average_rating = 0,
    success_rate = 0,
    on_time_delivery_rate = 0,
    average_response_time_minutes = 0,
  } = metrics;

  // Reputation formula (weighted scoring):
  // - Services completed: 2 points each
  // - Average rating: 100 points per star (max 500)
  // - Success rate: 3 points per percent (max 300)
  // - On-time delivery: 2 points per percent (max 200)
  // - Response time bonus: up to 100 points (faster = more points)

  let score = 0;

  // Services completed (2 points each)
  score += total_services_completed * 2;

  // Average rating (100 points per star, max 500)
  score += parseFloat(average_rating) * 100;

  // Success rate (3 points per percent, max 300)
  score += parseFloat(success_rate) * 3;

  // On-time delivery (2 points per percent, max 200)
  score += parseFloat(on_time_delivery_rate) * 2;

  // Response time bonus (faster = more points, max 100)
  if (average_response_time_minutes > 0) {
    // Under 30 min = 100 points, 30-60 min = 75 points, 60-120 min = 50 points, etc.
    if (average_response_time_minutes <= 30) {
      score += 100;
    } else if (average_response_time_minutes <= 60) {
      score += 75;
    } else if (average_response_time_minutes <= 120) {
      score += 50;
    } else if (average_response_time_minutes <= 240) {
      score += 25;
    }
  }

  return Math.round(score);
}

/**
 * Calculate reputation score for a user
 * @param {string} userId - User ID
 * @returns {Promise<number>} Reputation score
 */
export async function calculateReputationScore(userId) {
  const metrics = await getUserMetrics(userId);

  if (!metrics) {
    return 0;
  }

  return calculateReputationScoreFromMetrics(metrics);
}

/**
 * Award a badge to a user
 * @param {string} userId - User ID
 * @param {string} badgeId - Badge ID
 * @returns {Promise<Object>} Awarded badge record
 */
export async function awardBadge(userId, badgeId) {
  // Check if badge already awarded
  const { data: existing } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .eq('badge_id', badgeId)
    .single();

  if (existing) {
    return existing;
  }

  // Award new badge
  const { data, error } = await supabase
    .from('user_badges')
    .insert({
      user_id: userId,
      badge_id: badgeId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get all badges earned by a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of user badges
 */
export async function getUserBadges(userId) {
  const { data, error } = await supabase
    .from('user_badges')
    .select('*, badges(*)')
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Track expertise in a subject area
 * @param {string} userId - User ID
 * @param {string} serviceType - Service type (homework, programming, etc.)
 * @param {string} subject - Subject name
 * @param {Object} performance - Performance data (rating, earnings)
 * @returns {Promise<Object>} Updated expertise area
 */
export async function trackExpertise(userId, serviceType, subject, performance) {
  const { rating = 0, earnings = 0 } = performance;

  // Check if expertise area exists
  const { data: existing } = await supabase
    .from('expertise_areas')
    .select('*')
    .eq('user_id', userId)
    .eq('service_type', serviceType)
    .eq('subject', subject)
    .single();

  if (existing) {
    // Update existing expertise
    const newServicesCompleted = existing.services_completed + 1;
    const currentTotalRating = parseFloat(existing.average_rating) * existing.services_completed;
    const newAverageRating = (currentTotalRating + rating) / newServicesCompleted;
    const newTotalEarnings = parseFloat(existing.total_earnings) + earnings;

    const { data, error } = await supabase
      .from('expertise_areas')
      .update({
        services_completed: newServicesCompleted,
        average_rating: newAverageRating,
        total_earnings: newTotalEarnings,
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Create new expertise area
  const { data, error } = await supabase
    .from('expertise_areas')
    .insert({
      user_id: userId,
      service_type: serviceType,
      subject: subject,
      services_completed: 1,
      average_rating: rating,
      total_earnings: earnings,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Get specialists for a service type
 * @param {string} serviceType - Service type
 * @param {Object} options - Query options (limit, minServices)
 * @returns {Promise<Array>} Array of specialists
 */
export async function getSpecialists(serviceType, options = {}) {
  const { limit = 20, minServices = 5 } = options;

  const { data, error } = await supabase
    .from('expertise_areas')
    .select('*, user_metrics(*)')
    .eq('service_type', serviceType)
    .gte('services_completed', minServices)
    .order('average_rating', { ascending: false })
    .order('services_completed', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

/**
 * Get top performers
 * @param {Object} filters - Filter options (serviceType, limit)
 * @returns {Promise<Array>} Array of top performers
 */
export async function getTopPerformers(filters = {}) {
  const { serviceType, limit = 20 } = filters;

  let query = supabase
    .from('user_metrics')
    .select('*')
    .order('reputation_score', { ascending: false })
    .limit(limit);

  // If filtering by service type, join with expertise_areas
  if (serviceType) {
    const { data, error } = await supabase
      .from('expertise_areas')
      .select('user_id, user_metrics(*)')
      .eq('service_type', serviceType)
      .order('average_rating', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Extract unique users and their metrics
    const uniqueUsers = new Map();
    data?.forEach((item) => {
      if (item.user_metrics && !uniqueUsers.has(item.user_id)) {
        uniqueUsers.set(item.user_id, item.user_metrics);
      }
    });

    return Array.from(uniqueUsers.values());
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/**
 * Check user's performance and award appropriate badges
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of newly awarded badges
 */
export async function checkAndAwardBadges(userId) {
  const metrics = await getUserMetrics(userId);
  if (!metrics) return [];

  const newBadges = [];

  // Get all badges
  const { data: allBadges } = await supabase.from('badges').select('*');

  if (!allBadges) return [];

  // Get user's current badges
  const currentBadges = await getUserBadges(userId);
  const currentBadgeSlugs = new Set(currentBadges.map((b) => b.badges?.slug));

  // Check each badge criteria
  for (const badge of allBadges) {
    // Skip if already awarded
    if (currentBadgeSlugs.has(badge.slug)) continue;

    const criteria = badge.criteria;
    let shouldAward = false;

    switch (badge.slug) {
      case 'reliable':
        // 100+ completed services
        if (metrics.total_services_completed >= (criteria.total_services || 100)) {
          shouldAward = true;
        }
        break;

      case 'quick-responder':
        // Average response time under 60 minutes
        if (
          metrics.average_response_time_minutes > 0 &&
          metrics.average_response_time_minutes <= (criteria.avg_response_time_minutes || 60) &&
          metrics.total_services_completed >= 10
        ) {
          shouldAward = true;
        }
        break;

      case 'subject-master':
        // 50+ services in one subject
        const { data: expertiseAreas } = await supabase
          .from('expertise_areas')
          .select('*')
          .eq('user_id', userId)
          .gte('services_completed', criteria.services_in_subject || 50);

        if (expertiseAreas && expertiseAreas.length > 0) {
          shouldAward = true;
        }
        break;

      case 'perfect-score':
        // Check for consecutive 5-star ratings (simplified check)
        if (
          parseFloat(metrics.average_rating) >= 4.95 &&
          metrics.total_ratings >= (criteria.consecutive_five_stars || 10)
        ) {
          shouldAward = true;
        }
        break;

      case 'top-earner':
        // This would require monthly tracking - skip for now
        break;

      case 'helpful':
        // This would require review tracking - skip for now
        break;
    }

    if (shouldAward) {
      const awarded = await awardBadge(userId, badge.id);
      newBadges.push({ ...awarded, badges: badge });
    }
  }

  return newBadges;
}