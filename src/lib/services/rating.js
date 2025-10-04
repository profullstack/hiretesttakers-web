import { getSupabaseClient } from '../supabaseClient.js';

const supabase = getSupabaseClient();

/**
 * Create a rating for a completed test
 * @param {Object} ratingData - Rating data
 * @param {string} ratingData.testId - Test ID
 * @param {string} ratingData.hirerId - Hirer ID
 * @param {string} ratingData.testTakerId - Test taker ID
 * @param {number} ratingData.rating - Rating (1-5)
 * @param {string} ratingData.review - Optional review text
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function createRating({ testId, hirerId, testTakerId, rating, review = null }) {
  try {
    // Validate required fields
    if (!testId || !hirerId || !testTakerId || !rating) {
      return {
        data: null,
        error: new Error('testId, hirerId, testTakerId, and rating are required'),
      };
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return {
        data: null,
        error: new Error('Rating must be between 1 and 5'),
      };
    }

    const { data, error } = await supabase
      .from('ratings')
      .insert({
        test_id: testId,
        hirer_id: hirerId,
        test_taker_id: testTakerId,
        rating,
        review,
      })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get all ratings for a test taker
 * @param {string} testTakerId - Test taker ID
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getRatingsForTestTaker(testTakerId) {
  try {
    if (!testTakerId) {
      return { data: null, error: new Error('Test taker ID is required') };
    }

    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('test_taker_id', testTakerId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get average rating for a test taker
 * @param {string} testTakerId - Test taker ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getAverageRating(testTakerId) {
  try {
    if (!testTakerId) {
      return { data: null, error: new Error('Test taker ID is required') };
    }

    const { data, error } = await supabase
      .from('test_taker_stats')
      .select('average_rating')
      .eq('user_id', testTakerId)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Check if a hirer can rate a specific test
 * @param {string} testId - Test ID
 * @param {string} hirerId - Hirer ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function canRateTest(testId, hirerId) {
  try {
    if (!testId || !hirerId) {
      return { data: null, error: new Error('Test ID and hirer ID are required') };
    }

    // Check if test exists and belongs to hirer
    const { data: test, error: testError } = await supabase
      .from('tests')
      .select('id, hirer_id, status')
      .eq('id', testId)
      .eq('hirer_id', hirerId)
      .single();

    if (testError || !test) {
      return { data: { canRate: false, reason: 'Test not found or not owned by hirer' }, error: null };
    }

    // Check if test is completed
    if (test.status !== 'completed') {
      return { data: { canRate: false, reason: 'Test is not completed' }, error: null };
    }

    // Check if rating already exists
    const { data: existingRating, error: ratingError } = await supabase
      .from('ratings')
      .select('id')
      .eq('test_id', testId)
      .single();

    if (existingRating) {
      return { data: { canRate: false, reason: 'Test already rated' }, error: null };
    }

    return { data: { canRate: true }, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Get rating for a specific test
 * @param {string} testId - Test ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getRatingForTest(testId) {
  try {
    if (!testId) {
      return { data: null, error: new Error('Test ID is required') };
    }

    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('test_id', testId)
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Update a rating
 * @param {string} ratingId - Rating ID
 * @param {Object} updates - Fields to update
 * @param {number} updates.rating - New rating (1-5)
 * @param {string} updates.review - New review text
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateRating(ratingId, { rating, review }) {
  try {
    if (!ratingId) {
      return { data: null, error: new Error('Rating ID is required') };
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return { data: null, error: new Error('Rating must be between 1 and 5') };
    }

    const updates = {};
    if (rating !== undefined) updates.rating = rating;
    if (review !== undefined) updates.review = review;

    const { data, error } = await supabase
      .from('ratings')
      .update(updates)
      .eq('id', ratingId)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}