import { getSupabaseClient } from '../supabaseClient.js';

const supabase = getSupabaseClient();

/**
 * Get leaderboard data with pagination
 * @param {Object} options - Query options
 * @param {number} options.limit - Number of results to return
 * @param {number} options.offset - Number of results to skip
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getLeaderboard({ limit = 50, offset = 0 } = {}) {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .range(offset, offset + limit - 1);

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get leaderboard with filters and sorting
 * @param {Object} options - Filter and sort options
 * @param {string} options.sortBy - Field to sort by (tests_completed, average_rating, success_rate, total_earned)
 * @param {string} options.location - Filter by location
 * @param {Array<string>} options.skills - Filter by skills
 * @param {number} options.limit - Number of results
 * @param {number} options.offset - Offset for pagination
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getLeaderboardWithFilters({
  sortBy = 'tests_completed',
  location = null,
  skills = null,
  limit = 50,
  offset = 0,
} = {}) {
  try {
    let query = supabase.from('leaderboard').select('*');

    // Apply location filter
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Apply skills filter
    if (skills && Array.isArray(skills) && skills.length > 0) {
      query = query.contains('skills', skills);
    }

    // Apply sorting
    const validSortFields = ['tests_completed', 'average_rating', 'success_rate', 'total_earned'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'tests_completed';
    query = query.order(sortField, { ascending: false, nullsLast: true });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get stats for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getUserStats(userId) {
  try {
    if (!userId) {
      return { data: null, error: new Error('User ID is required') };
    }

    const { data, error } = await supabase
      .from('test_taker_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Update leaderboard visibility for a user
 * @param {string} userId - User ID
 * @param {boolean} showOnLeaderboard - Whether to show on leaderboard
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateLeaderboardVisibility(userId, showOnLeaderboard) {
  try {
    if (!userId) {
      return { data: null, error: new Error('User ID is required') };
    }

    if (typeof showOnLeaderboard !== 'boolean') {
      return { data: null, error: new Error('showOnLeaderboard must be a boolean') };
    }

    const { data, error } = await supabase
      .from('users')
      .update({ show_on_leaderboard: showOnLeaderboard })
      .eq('id', userId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get user profile with stats for leaderboard display
 * @param {string} userId - User ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getUserLeaderboardProfile(userId) {
  try {
    if (!userId) {
      return { data: null, error: new Error('User ID is required') };
    }

    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('id', userId)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}