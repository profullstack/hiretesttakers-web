/**
 * Job Offer Service
 * 
 * Service for managing job offers between employers and test takers.
 * Provides functions for creating, retrieving, and updating job offers.
 */

import { getSupabaseClient } from '../supabaseClient.js';

/**
 * Valid employment types
 */
const VALID_EMPLOYMENT_TYPES = ['full_time', 'part_time', 'contract', 'freelance'];

/**
 * Valid job offer statuses
 */
const VALID_STATUSES = ['pending', 'accepted', 'rejected', 'withdrawn', 'expired'];

/**
 * Create a new job offer
 * @param {Object} params - Job offer parameters
 * @param {string} params.employer_id - Employer user ID
 * @param {string} params.test_taker_id - Test taker user ID
 * @param {string} params.job_title - Job title
 * @param {string} params.job_description - Job description
 * @param {string} params.employment_type - Employment type (full_time, part_time, contract, freelance)
 * @param {number} [params.salary_min] - Minimum salary
 * @param {number} [params.salary_max] - Maximum salary
 * @param {string} [params.salary_currency='USD'] - Salary currency
 * @param {string} [params.location] - Job location
 * @param {boolean} [params.remote_allowed=false] - Whether remote work is allowed
 * @param {string} [params.requirements] - Job requirements
 * @param {string} [params.benefits] - Job benefits
 * @param {string} [params.expires_at] - Expiration date
 * @returns {Promise<Object>} Created job offer
 * @throws {Error} If validation fails or creation fails
 */
export async function createJobOffer({
  employer_id,
  test_taker_id,
  job_title,
  job_description,
  employment_type,
  salary_min,
  salary_max,
  salary_currency = 'USD',
  location,
  remote_allowed = false,
  requirements,
  benefits,
  expires_at
}) {
  // Validation
  if (!employer_id || employer_id.trim() === '') {
    throw new Error('Employer ID is required');
  }

  if (!test_taker_id || test_taker_id.trim() === '') {
    throw new Error('Test taker ID is required');
  }

  if (!job_title || job_title.trim() === '') {
    throw new Error('Job title is required');
  }

  if (!job_description || job_description.trim() === '') {
    throw new Error('Job description is required');
  }

  if (!employment_type || employment_type.trim() === '') {
    throw new Error('Employment type is required');
  }

  if (!VALID_EMPLOYMENT_TYPES.includes(employment_type)) {
    throw new Error(`Invalid employment type. Must be one of: ${VALID_EMPLOYMENT_TYPES.join(', ')}`);
  }

  const supabase = getSupabaseClient();

  const offerData = {
    employer_id,
    test_taker_id,
    job_title: job_title.trim(),
    job_description: job_description.trim(),
    employment_type,
    salary_currency,
    remote_allowed
  };

  // Add optional fields if provided
  if (salary_min !== undefined) offerData.salary_min = salary_min;
  if (salary_max !== undefined) offerData.salary_max = salary_max;
  if (location) offerData.location = location.trim();
  if (requirements) offerData.requirements = requirements.trim();
  if (benefits) offerData.benefits = benefits.trim();
  if (expires_at) offerData.expires_at = expires_at;

  const { data, error } = await supabase
    .from('job_offers')
    .insert(offerData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Get a single job offer by ID
 * @param {string} id - Job offer ID
 * @returns {Promise<Object|null>} Job offer or null if not found
 * @throws {Error} If validation fails
 */
export async function getJobOffer(id) {
  if (!id || id.trim() === '') {
    throw new Error('Job offer ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('job_offers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(error.message);
  }

  return data;
}

/**
 * Get all job offers with optional filters
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.employment_type] - Filter by employment type
 * @param {number} [filters.limit=50] - Maximum number of results
 * @returns {Promise<Array>} Array of job offers
 */
export async function getJobOffers(filters = {}) {
  const supabase = getSupabaseClient();
  const { status, employment_type, limit = 50 } = filters;

  let query = supabase
    .from('job_offers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  if (employment_type) {
    query = query.eq('employment_type', employment_type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Get job offers for a specific test taker
 * @param {string} test_taker_id - Test taker user ID
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.status] - Filter by status
 * @param {number} [filters.limit=50] - Maximum number of results
 * @returns {Promise<Array>} Array of job offers
 * @throws {Error} If validation fails
 */
export async function getJobOffersForTestTaker(test_taker_id, filters = {}) {
  if (!test_taker_id || test_taker_id.trim() === '') {
    throw new Error('Test taker ID is required');
  }

  const supabase = getSupabaseClient();
  const { status, limit = 50 } = filters;

  let query = supabase
    .from('job_offers')
    .select('*')
    .eq('test_taker_id', test_taker_id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Get job offers from a specific employer
 * @param {string} employer_id - Employer user ID
 * @param {Object} [filters={}] - Filter options
 * @param {string} [filters.status] - Filter by status
 * @param {number} [filters.limit=50] - Maximum number of results
 * @returns {Promise<Array>} Array of job offers
 * @throws {Error} If validation fails
 */
export async function getJobOffersFromEmployer(employer_id, filters = {}) {
  if (!employer_id || employer_id.trim() === '') {
    throw new Error('Employer ID is required');
  }

  const supabase = getSupabaseClient();
  const { status, limit = 50 } = filters;

  let query = supabase
    .from('job_offers')
    .select('*')
    .eq('employer_id', employer_id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

/**
 * Update job offer status (accept/reject)
 * @param {Object} params - Update parameters
 * @param {string} params.id - Job offer ID
 * @param {string} params.status - New status (accepted, rejected)
 * @returns {Promise<Object>} Updated job offer
 * @throws {Error} If validation fails or update fails
 */
export async function updateJobOfferStatus({ id, status }) {
  if (!id || id.trim() === '') {
    throw new Error('Job offer ID is required');
  }

  if (!status || status.trim() === '') {
    throw new Error('Status is required');
  }

  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('job_offers')
    .update({
      status,
      responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Withdraw a job offer (employer only)
 * @param {string} id - Job offer ID
 * @returns {Promise<Object>} Updated job offer
 * @throws {Error} If validation fails or withdrawal fails
 */
export async function withdrawJobOffer(id) {
  if (!id || id.trim() === '') {
    throw new Error('Job offer ID is required');
  }

  const supabase = getSupabaseClient();

  // First check if offer has been responded to
  const { data: existingOffer, error: fetchError } = await supabase
    .from('job_offers')
    .select('status, responded_at')
    .eq('id', id)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (existingOffer.responded_at) {
    throw new Error('Cannot withdraw offer that has been responded to');
  }

  const { data, error } = await supabase
    .from('job_offers')
    .update({
      status: 'withdrawn',
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Expire old job offers
 * Calls the database function to expire offers past their expiration date
 * @returns {Promise<Object>} Result with count of expired offers
 */
export async function expireOldOffers() {
  const supabase = getSupabaseClient();

  // Call the database function
  const { error } = await supabase.rpc('expire_old_job_offers');

  if (error) {
    throw new Error(error.message);
  }

  // Get count of expired offers
  const { data, error: countError } = await supabase
    .from('job_offers')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'expired');

  if (countError) {
    throw new Error(countError.message);
  }

  return {
    count: data?.length || 0
  };
}