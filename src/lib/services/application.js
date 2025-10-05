/**
 * Application Service
 * 
 * Service for managing test applications using Supabase.
 * Handles CRUD operations for applications.
 */

import { getSupabaseClient } from '../supabaseClient.js';

const VALID_STATUSES = ['pending', 'approved', 'rejected', 'hired'];

/**
 * Create a new application
 *
 * @param {Object} params - Application parameters
 * @param {string} params.test_id - Test ID
 * @param {string} params.test_taker_id - Test taker user ID
 * @param {string} [params.application_message] - Optional application message
 * @param {Object} [params.supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object>} Created application
 * @throws {Error} If validation fails or creation fails
 */
export async function createApplication({ test_id, test_taker_id, application_message, supabase }) {
  if (!test_id || test_id.trim() === '') {
    throw new Error('Test ID is required');
  }

  if (!test_taker_id || test_taker_id.trim() === '') {
    throw new Error('Test taker ID is required');
  }

  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('applications')
    .insert({
      test_id,
      test_taker_id,
      application_message: application_message || null,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('You have already applied to this test');
    }
    throw new Error(`Failed to create application: ${error.message}`);
  }

  return data;
}

/**
 * Get application by ID
 *
 * @param {string} id - Application ID
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object|null>} Application or null if not found
 * @throws {Error} If id is missing
 */
export async function getApplicationById(id, supabase) {
  if (!id || id.trim() === '') {
    throw new Error('Application ID is required');
  }

  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to get application: ${error.message}`);
  }

  return data;
}

/**
 * Get all applications for a test
 *
 * @param {string} test_id - Test ID
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Array>} Array of applications
 * @throws {Error} If test_id is missing
 */
export async function getApplicationsByTestId(test_id, supabase) {
  if (!test_id || test_id.trim() === '') {
    throw new Error('Test ID is required');
  }

  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('applications')
    .select('*')
    .eq('test_id', test_id)
    .order('applied_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get applications: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all applications by a user
 *
 * @param {string} user_id - User ID
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Array>} Array of applications
 * @throws {Error} If user_id is missing
 */
export async function getApplicationsByUserId(user_id, supabase) {
  if (!user_id || user_id.trim() === '') {
    throw new Error('User ID is required');
  }

  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('applications')
    .select('*')
    .eq('test_taker_id', user_id)
    .order('applied_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get applications: ${error.message}`);
  }

  return data || [];
}

/**
 * Update application status
 *
 * @param {Object} params - Update parameters
 * @param {string} params.id - Application ID
 * @param {string} params.status - New status (pending, approved, rejected, hired)
 * @param {Object} [params.supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<Object>} Updated application
 * @throws {Error} If validation fails or update fails
 */
export async function updateApplicationStatus({ id, status, supabase }) {
  if (!id || id.trim() === '') {
    throw new Error('Application ID is required');
  }

  if (!status || status.trim() === '') {
    throw new Error('Status is required');
  }

  if (!VALID_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const client = supabase || getSupabaseClient();

  const { data, error } = await client
    .from('applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update application: ${error.message}`);
  }

  return data;
}

/**
 * Delete an application
 *
 * @param {string} id - Application ID
 * @param {Object} [supabase] - Optional Supabase client (for server-side use)
 * @returns {Promise<boolean>} True if deleted, false if not found
 * @throws {Error} If id is missing or deletion fails
 */
export async function deleteApplication(id, supabase) {
  if (!id || id.trim() === '') {
    throw new Error('Application ID is required');
  }

  const client = supabase || getSupabaseClient();

  const { error } = await client
    .from('applications')
    .delete()
    .eq('id', id);

  if (error) {
    if (error.code === 'PGRST116') {
      return false;
    }
    throw new Error(`Failed to delete application: ${error.message}`);
  }

  return true;
}