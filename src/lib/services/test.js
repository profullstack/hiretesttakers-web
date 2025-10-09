/**
 * Test Service
 * 
 * Service for managing test listings with CRUD operations.
 * Supports cryptocurrency payments (BTC, ETH, DOGE, SOL).
 */

import { getSupabaseClient } from '../supabaseClient.js';

const VALID_CRYPTOCURRENCIES = ['BTC', 'ETH', 'DOGE', 'SOL'];
const PROTECTED_FIELDS = ['id', 'hirer_id', 'created_at'];

/**
 * Create a new test listing
 * @param {string} userId - The ID of the user creating the test
 * @param {Object} testData - Test data
 * @param {Object} supabaseClient - Optional Supabase client (uses default if not provided)
 * @returns {Promise<Object>} Created test object
 */
export async function createTest(userId, testData, supabaseClient = null) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!testData?.title) {
    throw new Error('Title is required');
  }

  if (!testData?.description) {
    throw new Error('Description is required');
  }

  if (!testData?.cryptocurrency) {
    throw new Error('Cryptocurrency is required');
  }

  if (!VALID_CRYPTOCURRENCIES.includes(testData.cryptocurrency)) {
    throw new Error(`Invalid cryptocurrency. Must be one of: ${VALID_CRYPTOCURRENCIES.join(', ')}`);
  }

  if (testData.price === undefined || testData.price === null) {
    throw new Error('Price is required');
  }

  if (testData.price <= 0) {
    throw new Error('Price must be greater than zero');
  }

  if (testData.price_max !== undefined && testData.price_max !== null) {
    if (testData.price_max <= testData.price) {
      throw new Error('Maximum price must be greater than minimum price');
    }
  }

  const client = supabaseClient || getSupabaseClient();

  // Ensure user profile exists before creating test
  const { data: userProfile, error: userError } = await client
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (userError || !userProfile) {
    throw new Error('User profile not found. Please complete your profile setup before creating a test.');
  }

  const { data, error} = await client
    .from('tests')
    .insert({
      hirer_id: userId,
      title: testData.title,
      description: testData.description,
      cryptocurrency: testData.cryptocurrency,
      price: testData.price,
      price_max: testData.price_max || null,
      category: testData.category || null,
      difficulty: testData.difficulty || null,
      status: 'open'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create test: ${error.message}`);
  }

  return data;
}

/**
 * Get a test by ID
 * @param {string} testId - Test ID
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object|null>} Test object or null
 */
export async function getTest(testId, supabase) {
  if (!testId) {
    throw new Error('Test ID is required');
  }

  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('tests')
    .select('*')
    .eq('id', testId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get test: ${error.message}`);
  }

  return data;
}

/**
 * Get tests with optional filters
 * @param {Object} filters - Filter options
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Array>} Array of tests
 */
export async function getTests(filters = {}, supabase) {
  const client = supabase || getSupabaseClient();

  let query = client
    .from('tests')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.cryptocurrency) {
    query = query.eq('cryptocurrency', filters.cryptocurrency);
  }

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get tests: ${error.message}`);
  }

  return data || [];
}

/**
 * Update a test
 * @param {string} testId - Test ID
 * @param {string} userId - User ID (must be owner)
 * @param {Object} updates - Fields to update
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object>} Updated test object
 */
export async function updateTest(testId, userId, updates, supabase) {
  if (!testId) {
    throw new Error('Test ID is required');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  if (!updates || typeof updates !== 'object') {
    throw new Error('Updates object is required');
  }

  // Check for protected fields
  const protectedFieldsInUpdates = PROTECTED_FIELDS.filter(field => field in updates);
  if (protectedFieldsInUpdates.length > 0) {
    throw new Error(`Cannot update protected fields: ${protectedFieldsInUpdates.join(', ')}`);
  }

  const client = supabase || getSupabaseClient();

  // Verify ownership
  const existingTest = await getTest(testId, client);
  if (!existingTest) {
    throw new Error('Test not found');
  }

  if (existingTest.hirer_id !== userId) {
    throw new Error('Not authorized to update this test');
  }

  const { data, error } = await client
    .from('tests')
    .update(updates)
    .eq('id', testId)
    .eq('hirer_id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update test: ${error.message}`);
  }

  return data;
}

/**
 * Delete a test
 * @param {string} testId - Test ID
 * @param {string} userId - User ID (must be owner)
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteTest(testId, userId, supabase) {
  if (!testId) {
    throw new Error('Test ID is required');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  const client = supabase || getSupabaseClient();

  // Verify ownership
  const existingTest = await getTest(testId, client);
  if (!existingTest) {
    throw new Error('Test not found');
  }

  if (existingTest.hirer_id !== userId) {
    throw new Error('Not authorized to delete this test');
  }

  const { error } = await client
    .from('tests')
    .delete()
    .eq('id', testId)
    .eq('hirer_id', userId);

  if (error) {
    throw new Error(`Failed to delete test: ${error.message}`);
  }

  return true;
}

/**
 * Get tests created by a specific user
 * @param {string} userId - User ID
 * @param {Object} filters - Optional filters
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Array>} Array of user's tests
 */
export async function getMyTests(userId, filters = {}, supabase) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const client = supabase || getSupabaseClient();

  let query = client
    .from('tests')
    .select('*')
    .eq('hirer_id', userId)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get user tests: ${error.message}`);
  }

  return data || [];
}

/**
 * Search tests by title or description
 * @param {string} query - Search query
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Array>} Array of matching tests
 */
export async function searchTests(query, supabase) {
  if (!query) {
    throw new Error('Search query is required');
  }

  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('tests')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('status', 'open')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to search tests: ${error.message}`);
  }

  return data || [];
}

/**
 * Get test with attachments
 * @param {string} testId - Test ID
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object|null>} Test object with attachments or null
 */
export async function getTestWithAttachments(testId, supabase) {
  if (!testId) {
    throw new Error('Test ID is required');
  }

  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('tests')
    .select(`
      *,
      test_attachments (
        id,
        file_name,
        file_path,
        file_size,
        file_type,
        created_at
      )
    `)
    .eq('id', testId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get test with attachments: ${error.message}`);
  }

  return data;
}