/**
 * Homework Service
 * 
 * Service for managing homework help requests using Supabase.
 * Provides functions for creating, reading, updating, and deleting homework requests.
 */

import { getSupabaseClient } from '../supabaseClient.js';

/**
 * Valid difficulty levels
 */
const VALID_DIFFICULTY_LEVELS = [
  'elementary',
  'middle_school',
  'high_school',
  'undergraduate',
  'graduate'
];

/**
 * Valid status values
 */
const VALID_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

/**
 * Valid file types for uploads
 */
const VALID_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain'
];

/**
 * Get all subjects
 * @returns {Promise<Array>} List of subjects
 * @throws {Error} If fetch fails
 */
export async function getSubjects() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch subjects: ${error.message}`);
  }

  return data;
}

/**
 * Create a new homework request
 * @param {Object} params - Request parameters
 * @param {string} params.user_id - User ID
 * @param {string} params.subject_id - Subject ID
 * @param {string} params.title - Request title
 * @param {string} params.description - Request description
 * @param {string} params.difficulty_level - Difficulty level
 * @param {string} params.deadline - Deadline (ISO string)
 * @param {number} [params.fixed_price] - Fixed price
 * @param {number} [params.price_min] - Minimum price
 * @param {number} [params.price_max] - Maximum price
 * @returns {Promise<Object>} Created homework request
 * @throws {Error} If validation fails or creation fails
 */
export async function createHomeworkRequest({
  user_id,
  subject_id,
  title,
  description,
  difficulty_level,
  deadline,
  fixed_price,
  price_min,
  price_max
}) {
  // Validation
  if (!user_id || user_id.trim() === '') {
    throw new Error('User ID is required');
  }

  if (!subject_id || subject_id.trim() === '') {
    throw new Error('Subject ID is required');
  }

  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  if (!description || description.trim() === '') {
    throw new Error('Description is required');
  }

  if (!difficulty_level || !VALID_DIFFICULTY_LEVELS.includes(difficulty_level)) {
    throw new Error('Invalid difficulty level. Must be one of: ' + VALID_DIFFICULTY_LEVELS.join(', '));
  }

  if (!deadline) {
    throw new Error('Deadline is required');
  }

  const deadlineDate = new Date(deadline);
  if (deadlineDate <= new Date()) {
    throw new Error('Deadline must be in the future');
  }

  // Price validation
  const hasFixedPrice = fixed_price !== undefined && fixed_price !== null;
  const hasPriceRange = (price_min !== undefined && price_min !== null) && 
                        (price_max !== undefined && price_max !== null);

  if (!hasFixedPrice && !hasPriceRange) {
    throw new Error('Either fixed price or price range is required');
  }

  if (hasFixedPrice && hasPriceRange) {
    throw new Error('Cannot specify both fixed price and price range');
  }

  if (hasPriceRange && price_min > price_max) {
    throw new Error('Minimum price cannot be greater than maximum price');
  }

  const supabase = getSupabaseClient();

  const requestData = {
    user_id,
    subject_id,
    title: title.trim(),
    description: description.trim(),
    difficulty_level,
    deadline,
    status: 'open'
  };

  if (hasFixedPrice) {
    requestData.fixed_price = fixed_price;
  } else {
    requestData.price_min = price_min;
    requestData.price_max = price_max;
  }

  const { data, error } = await supabase
    .from('homework_requests')
    .insert(requestData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create homework request: ${error.message}`);
  }

  return data;
}

/**
 * Get homework requests with optional filters
 * @param {Object} [filters] - Filter options
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.difficulty_level] - Filter by difficulty
 * @param {string} [filters.subject_id] - Filter by subject
 * @param {number} [filters.limit] - Limit results
 * @returns {Promise<Array>} List of homework requests
 * @throws {Error} If fetch fails
 */
export async function getHomeworkRequests(filters = {}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('homework_requests')
    .select('*, subjects(name)');

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.difficulty_level) {
    query = query.eq('difficulty_level', filters.difficulty_level);
  }

  if (filters.subject_id) {
    query = query.eq('subject_id', filters.subject_id);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch homework requests: ${error.message}`);
  }

  return data;
}

/**
 * Get homework request by ID
 * @param {string} id - Request ID
 * @returns {Promise<Object|null>} Homework request or null
 * @throws {Error} If validation fails or fetch fails
 */
export async function getHomeworkRequestById(id) {
  if (!id || id.trim() === '') {
    throw new Error('Homework request ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('homework_requests')
    .select('*, subjects(name), service_files(*)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch homework request: ${error.message}`);
  }

  return data;
}

/**
 * Update homework request
 * @param {string} id - Request ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated homework request
 * @throws {Error} If validation fails or update fails
 */
export async function updateHomeworkRequest(id, updates) {
  if (!id || id.trim() === '') {
    throw new Error('Homework request ID is required');
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new Error('No update data provided');
  }

  // Validate status if provided
  if (updates.status && !VALID_STATUSES.includes(updates.status)) {
    throw new Error('Invalid status. Must be one of: ' + VALID_STATUSES.join(', '));
  }

  // Validate difficulty level if provided
  if (updates.difficulty_level && !VALID_DIFFICULTY_LEVELS.includes(updates.difficulty_level)) {
    throw new Error('Invalid difficulty level. Must be one of: ' + VALID_DIFFICULTY_LEVELS.join(', '));
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('homework_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update homework request: ${error.message}`);
  }

  return data;
}

/**
 * Delete homework request
 * @param {string} id - Request ID
 * @returns {Promise<boolean>} True if successful
 * @throws {Error} If validation fails or deletion fails
 */
export async function deleteHomeworkRequest(id) {
  if (!id || id.trim() === '') {
    throw new Error('Homework request ID is required');
  }

  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('homework_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete homework request: ${error.message}`);
  }

  return true;
}

/**
 * Upload files for homework request
 * @param {string} requestId - Request ID
 * @param {Array} files - Array of file objects
 * @returns {Promise<Array>} Uploaded file records
 * @throws {Error} If validation fails or upload fails
 */
export async function uploadHomeworkFiles(requestId, files) {
  if (!requestId || requestId.trim() === '') {
    throw new Error('Homework request ID is required');
  }

  if (!files || files.length === 0) {
    throw new Error('At least one file is required');
  }

  // Validate file types
  for (const file of files) {
    if (!VALID_FILE_TYPES.includes(file.file_type)) {
      throw new Error(`Invalid file type: ${file.file_type}. Allowed types: ${VALID_FILE_TYPES.join(', ')}`);
    }
  }

  const supabase = getSupabaseClient();

  const fileRecords = files.map(file => ({
    homework_request_id: requestId,
    file_name: file.file_name,
    file_path: file.file_path,
    file_size: file.file_size,
    file_type: file.file_type
  }));

  const { data, error } = await supabase
    .from('service_files')
    .insert(fileRecords)
    .select();

  if (error) {
    throw new Error(`Failed to upload files: ${error.message}`);
  }

  return data;
}

/**
 * Get homework requests by subject
 * @param {string} subjectId - Subject ID
 * @returns {Promise<Array>} List of homework requests
 * @throws {Error} If validation fails or fetch fails
 */
export async function getHomeworkRequestsBySubject(subjectId) {
  if (!subjectId || subjectId.trim() === '') {
    throw new Error('Subject ID is required');
  }

  return getHomeworkRequests({ subject_id: subjectId });
}

/**
 * Get homework requests by difficulty level
 * @param {string} difficultyLevel - Difficulty level
 * @returns {Promise<Array>} List of homework requests
 * @throws {Error} If validation fails or fetch fails
 */
export async function getHomeworkRequestsByDifficulty(difficultyLevel) {
  if (!difficultyLevel || difficultyLevel.trim() === '') {
    throw new Error('Difficulty level is required');
  }

  if (!VALID_DIFFICULTY_LEVELS.includes(difficultyLevel)) {
    throw new Error('Invalid difficulty level. Must be one of: ' + VALID_DIFFICULTY_LEVELS.join(', '));
  }

  return getHomeworkRequests({ difficulty_level: difficultyLevel });
}