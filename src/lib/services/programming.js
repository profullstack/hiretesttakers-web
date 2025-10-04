/**
 * Programming Service
 * 
 * Service for managing programming help requests using Supabase.
 * Provides functions for creating, reading, updating, and deleting programming requests.
 */

import { getSupabaseClient } from '../supabaseClient.js';

/**
 * Valid project types
 */
const VALID_PROJECT_TYPES = [
  'homework',
  'debugging',
  'mini_project',
  'optimization',
  'code_review'
];

/**
 * Valid urgency levels
 */
const VALID_URGENCY_LEVELS = ['standard', 'urgent'];

/**
 * Valid status values
 */
const VALID_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'];

/**
 * Valid file types for code uploads
 */
const VALID_FILE_TYPES = [
  'text/plain',
  'text/x-python',
  'text/x-java',
  'text/x-c',
  'text/x-c++',
  'text/javascript',
  'application/javascript',
  'application/json',
  'application/xml',
  'text/html',
  'text/css',
  'application/zip',
  'application/x-zip-compressed'
];

/**
 * Get all programming languages
 * @returns {Promise<Array>} List of programming languages
 * @throws {Error} If fetch fails
 */
export async function getProgrammingLanguages() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('programming_languages')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch programming languages: ${error.message}`);
  }

  return data;
}

/**
 * Create a new programming request
 * @param {Object} params - Request parameters
 * @param {string} params.user_id - User ID
 * @param {string} params.language_id - Programming language ID
 * @param {string} params.title - Request title
 * @param {string} params.description - Request description
 * @param {string} params.project_type - Project type
 * @param {string} [params.urgency='standard'] - Urgency level
 * @param {string} params.deadline - Deadline (ISO string)
 * @param {number} [params.fixed_price] - Fixed price
 * @param {number} [params.price_min] - Minimum price
 * @param {number} [params.price_max] - Maximum price
 * @param {boolean} [params.requires_debugging=false] - Requires debugging
 * @param {boolean} [params.requires_optimization=false] - Requires optimization
 * @returns {Promise<Object>} Created programming request
 * @throws {Error} If validation fails or creation fails
 */
export async function createProgrammingRequest({
  user_id,
  language_id,
  title,
  description,
  project_type,
  urgency = 'standard',
  deadline,
  fixed_price,
  price_min,
  price_max,
  requires_debugging = false,
  requires_optimization = false
}) {
  // Validation
  if (!user_id || user_id.trim() === '') {
    throw new Error('User ID is required');
  }

  if (!language_id || language_id.trim() === '') {
    throw new Error('Language ID is required');
  }

  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  if (!description || description.trim() === '') {
    throw new Error('Description is required');
  }

  if (!project_type || !VALID_PROJECT_TYPES.includes(project_type)) {
    throw new Error('Invalid project type. Must be one of: ' + VALID_PROJECT_TYPES.join(', '));
  }

  if (urgency && !VALID_URGENCY_LEVELS.includes(urgency)) {
    throw new Error('Invalid urgency level. Must be one of: ' + VALID_URGENCY_LEVELS.join(', '));
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
    language_id,
    title: title.trim(),
    description: description.trim(),
    project_type,
    urgency,
    deadline,
    requires_debugging,
    requires_optimization,
    status: 'open'
  };

  if (hasFixedPrice) {
    requestData.fixed_price = fixed_price;
  } else {
    requestData.price_min = price_min;
    requestData.price_max = price_max;
  }

  const { data, error } = await supabase
    .from('programming_requests')
    .insert(requestData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create programming request: ${error.message}`);
  }

  return data;
}

/**
 * Get programming requests with optional filters
 * @param {Object} [filters] - Filter options
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.project_type] - Filter by project type
 * @param {string} [filters.urgency] - Filter by urgency
 * @param {string} [filters.language_id] - Filter by language
 * @param {number} [filters.limit] - Limit results
 * @returns {Promise<Array>} List of programming requests
 * @throws {Error} If fetch fails
 */
export async function getProgrammingRequests(filters = {}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('programming_requests')
    .select('*, programming_languages(name)');

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.project_type) {
    query = query.eq('project_type', filters.project_type);
  }

  if (filters.urgency) {
    query = query.eq('urgency', filters.urgency);
  }

  if (filters.language_id) {
    query = query.eq('language_id', filters.language_id);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch programming requests: ${error.message}`);
  }

  return data;
}

/**
 * Get programming request by ID
 * @param {string} id - Request ID
 * @returns {Promise<Object|null>} Programming request or null
 * @throws {Error} If validation fails or fetch fails
 */
export async function getProgrammingRequestById(id) {
  if (!id || id.trim() === '') {
    throw new Error('Programming request ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('programming_requests')
    .select('*, programming_languages(name), service_files(*)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch programming request: ${error.message}`);
  }

  return data;
}

/**
 * Update programming request
 * @param {string} id - Request ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated programming request
 * @throws {Error} If validation fails or update fails
 */
export async function updateProgrammingRequest(id, updates) {
  if (!id || id.trim() === '') {
    throw new Error('Programming request ID is required');
  }

  if (!updates || Object.keys(updates).length === 0) {
    throw new Error('No update data provided');
  }

  // Validate status if provided
  if (updates.status && !VALID_STATUSES.includes(updates.status)) {
    throw new Error('Invalid status. Must be one of: ' + VALID_STATUSES.join(', '));
  }

  // Validate project type if provided
  if (updates.project_type && !VALID_PROJECT_TYPES.includes(updates.project_type)) {
    throw new Error('Invalid project type. Must be one of: ' + VALID_PROJECT_TYPES.join(', '));
  }

  // Validate urgency if provided
  if (updates.urgency && !VALID_URGENCY_LEVELS.includes(updates.urgency)) {
    throw new Error('Invalid urgency level. Must be one of: ' + VALID_URGENCY_LEVELS.join(', '));
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('programming_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update programming request: ${error.message}`);
  }

  return data;
}

/**
 * Delete programming request
 * @param {string} id - Request ID
 * @returns {Promise<boolean>} True if successful
 * @throws {Error} If validation fails or deletion fails
 */
export async function deleteProgrammingRequest(id) {
  if (!id || id.trim() === '') {
    throw new Error('Programming request ID is required');
  }

  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('programming_requests')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete programming request: ${error.message}`);
  }

  return true;
}

/**
 * Submit code for a programming request
 * @param {string} requestId - Programming request ID
 * @param {string} submittedBy - User ID of submitter
 * @param {string} codeContent - Code content
 * @param {Object} [annotations] - Code annotations (optional)
 * @param {number} [qualityScore] - Quality score 0-100 (optional)
 * @param {string} [notes] - Additional notes (optional)
 * @returns {Promise<Object>} Code submission record
 * @throws {Error} If validation fails or submission fails
 */
export async function submitCode(requestId, submittedBy, codeContent, annotations = null, qualityScore = null, notes = null) {
  if (!requestId || requestId.trim() === '') {
    throw new Error('Programming request ID is required');
  }

  if (!submittedBy || submittedBy.trim() === '') {
    throw new Error('User ID is required');
  }

  if (!codeContent || codeContent.trim() === '') {
    throw new Error('Code content is required');
  }

  if (qualityScore !== null && (qualityScore < 0 || qualityScore > 100)) {
    throw new Error('Quality score must be between 0 and 100');
  }

  const supabase = getSupabaseClient();

  const submissionData = {
    programming_request_id: requestId,
    submitted_by: submittedBy,
    code_content: codeContent.trim(),
    annotations,
    quality_score: qualityScore,
    notes
  };

  const { data, error } = await supabase
    .from('code_submissions')
    .insert(submissionData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit code: ${error.message}`);
  }

  return data;
}

/**
 * Get code submission for a programming request
 * @param {string} requestId - Programming request ID
 * @returns {Promise<Object|null>} Code submission or null
 * @throws {Error} If validation fails or fetch fails
 */
export async function getCodeSubmission(requestId) {
  if (!requestId || requestId.trim() === '') {
    throw new Error('Programming request ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('code_submissions')
    .select('*')
    .eq('programming_request_id', requestId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch code submission: ${error.message}`);
  }

  return data;
}

/**
 * Upload files for programming request
 * @param {string} requestId - Request ID
 * @param {Array} files - Array of file objects
 * @returns {Promise<Array>} Uploaded file records
 * @throws {Error} If validation fails or upload fails
 */
export async function uploadProgrammingFiles(requestId, files) {
  if (!requestId || requestId.trim() === '') {
    throw new Error('Programming request ID is required');
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
    programming_request_id: requestId,
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
 * Get programming requests by language
 * @param {string} languageId - Language ID
 * @returns {Promise<Array>} List of programming requests
 * @throws {Error} If validation fails or fetch fails
 */
export async function getProgrammingRequestsByLanguage(languageId) {
  if (!languageId || languageId.trim() === '') {
    throw new Error('Language ID is required');
  }

  return getProgrammingRequests({ language_id: languageId });
}

/**
 * Get programming requests by project type
 * @param {string} projectType - Project type
 * @returns {Promise<Array>} List of programming requests
 * @throws {Error} If validation fails or fetch fails
 */
export async function getProgrammingRequestsByProjectType(projectType) {
  if (!projectType || projectType.trim() === '') {
    throw new Error('Project type is required');
  }

  if (!VALID_PROJECT_TYPES.includes(projectType)) {
    throw new Error('Invalid project type. Must be one of: ' + VALID_PROJECT_TYPES.join(', '));
  }

  return getProgrammingRequests({ project_type: projectType });
}