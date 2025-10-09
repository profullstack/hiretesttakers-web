/**
 * Job Service
 * 
 * Service for managing job writing requests using Supabase.
 * Provides functions for creating, reading, updating jobs, submissions, revisions, and quality reports.
 */

import { getSupabaseClient } from '../supabaseClient.js';

/**
 * Valid status values for job requests
 */
const VALID_STATUSES = [
  'pending',
  'assigned',
  'in_progress',
  'submitted',
  'revision_requested',
  'completed',
  'cancelled'
];

/**
 * Get all academic levels
 * @returns {Promise<Array>} List of academic levels
 * @throws {Error} If fetch fails
 */
export async function getAcademicLevels() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('academic_levels')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch academic levels: ${error.message}`);
  }

  return data;
}

/**
 * Get all citation styles
 * @returns {Promise<Array>} List of citation styles
 * @throws {Error} If fetch fails
 */
export async function getCitationStyles() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('citation_styles')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to fetch citation styles: ${error.message}`);
  }

  return data;
}

/**
 * Create a new job request
 * @param {Object} params - Request parameters
 * @param {string} params.user_id - User ID
 * @param {string} params.title - Job title
 * @param {string} params.description - Job description
 * @param {string} params.topic - Job topic
 * @param {string} [params.academic_level_id] - Academic level ID
 * @param {string} [params.citation_style_id] - Citation style ID
 * @param {number} params.word_count - Word count
 * @param {string} params.deadline - Deadline (ISO string)
 * @param {number} params.price - Price
 * @param {boolean} [params.plagiarism_check_requested] - Whether plagiarism check is requested
 * @returns {Promise<Object>} Created job request
 * @throws {Error} If validation fails or creation fails
 */
export async function createJobRequest({
  user_id,
  title,
  description,
  topic,
  academic_level_id,
  citation_style_id,
  word_count,
  deadline,
  price,
  plagiarism_check_requested = false
}) {
  // Validation
  if (!user_id || user_id.trim() === '') {
    throw new Error('User ID is required');
  }

  if (!title || title.trim() === '') {
    throw new Error('Title is required');
  }

  if (!description || description.trim() === '') {
    throw new Error('Description is required');
  }

  if (!topic || topic.trim() === '') {
    throw new Error('Topic is required');
  }

  if (!word_count) {
    throw new Error('Word count is required');
  }

  if (word_count <= 0) {
    throw new Error('Word count must be positive');
  }

  if (!deadline) {
    throw new Error('Deadline is required');
  }

  const deadlineDate = new Date(deadline);
  if (deadlineDate <= new Date()) {
    throw new Error('Deadline must be in the future');
  }

  if (price === undefined || price === null) {
    throw new Error('Price is required');
  }

  if (price < 0) {
    throw new Error('Price must be non-negative');
  }

  const supabase = getSupabaseClient();

  const requestData = {
    user_id,
    title: title.trim(),
    description: description.trim(),
    topic: topic.trim(),
    word_count,
    deadline,
    price,
    status: 'pending',
    plagiarism_check_requested
  };

  if (academic_level_id) {
    requestData.academic_level_id = academic_level_id;
  }

  if (citation_style_id) {
    requestData.citation_style_id = citation_style_id;
  }

  const { data, error } = await supabase
    .from('jobs')
    .insert(requestData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create job: ${error.message}`);
  }

  return data;
}

/**
 * Get job requests with optional filters
 * @param {Object} [filters] - Filter options
 * @param {string} [filters.status] - Filter by status
 * @param {string} [filters.user_id] - Filter by user
 * @param {string} [filters.assigned_to] - Filter by assigned user
 * @param {number} [filters.limit] - Limit results
 * @returns {Promise<Array>} List of job requests
 * @throws {Error} If fetch fails
 */
export async function getJobRequests(filters = {}) {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('jobs')
    .select('*, academic_levels(name), citation_styles(name)');

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.user_id) {
    query = query.eq('user_id', filters.user_id);
  }

  if (filters.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch job requests: ${error.message}`);
  }

  return data;
}

/**
 * Get job request by ID
 * @param {string} id - Request ID
 * @returns {Promise<Object|null>} Job request or null
 * @throws {Error} If validation fails or fetch fails
 */
export async function getJobRequestById(id) {
  if (!id || id.trim() === '') {
    throw new Error('Job request ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error} = await supabase
    .from('jobs')
    .select(`
      *,
      academic_levels(name),
      citation_styles(name),
      job_submissions(*),
      job_revisions(*),
      quality_reports(*),
      plagiarism_reports(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch job request: ${error.message}`);
  }

  return data;
}

/**
 * Update a job request
 * @param {string} id - Job request ID
 * @param {Object} updates - Fields to update
 * @param {string} [updates.title] - Job title
 * @param {string} [updates.description] - Job description
 * @param {string} [updates.topic] - Job topic
 * @param {string} [updates.academic_level_id] - Academic level ID
 * @param {string} [updates.citation_style_id] - Citation style ID
 * @param {number} [updates.word_count] - Word count
 * @param {string} [updates.deadline] - Deadline (ISO string)
 * @param {number} [updates.price] - Price
 * @param {number} [updates.max_price] - Maximum price for range
 * @param {string} [updates.cryptocurrency] - Cryptocurrency type
 * @param {string} [updates.job_type] - Job type
 * @param {boolean} [updates.plagiarism_check_requested] - Whether plagiarism check is requested
 * @returns {Promise<Object>} Updated job request
 * @throws {Error} If validation fails or update fails
 */
export async function updateJobRequest(id, updates) {
  if (!id || id.trim() === '') {
    throw new Error('Job request ID is required');
  }

  // Validation for provided fields
  if (updates.title !== undefined && (!updates.title || updates.title.trim() === '')) {
    throw new Error('Title cannot be empty');
  }

  if (updates.description !== undefined && (!updates.description || updates.description.trim() === '')) {
    throw new Error('Description cannot be empty');
  }

  if (updates.topic !== undefined && (!updates.topic || updates.topic.trim() === '')) {
    throw new Error('Topic cannot be empty');
  }

  if (updates.word_count !== undefined && updates.word_count <= 0) {
    throw new Error('Word count must be positive');
  }

  if (updates.deadline !== undefined) {
    const deadlineDate = new Date(updates.deadline);
    if (deadlineDate <= new Date()) {
      throw new Error('Deadline must be in the future');
    }
  }

  if (updates.price !== undefined && updates.price < 0) {
    throw new Error('Price must be non-negative');
  }

  const supabase = getSupabaseClient();

  // First check if job exists and is in pending status
  const { data: existingJob, error: fetchError } = await supabase
    .from('jobs')
    .select('status')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Failed to fetch job request: ${fetchError.message}`);
  }

  if (!existingJob) {
    throw new Error('Job request not found');
  }

  if (existingJob.status !== 'pending') {
    throw new Error('Only pending jobs can be edited');
  }

  // Prepare update data
  const updateData = {};
  
  if (updates.title !== undefined) updateData.title = updates.title.trim();
  if (updates.description !== undefined) updateData.description = updates.description.trim();
  if (updates.topic !== undefined) updateData.topic = updates.topic.trim();
  if (updates.word_count !== undefined) updateData.word_count = updates.word_count;
  if (updates.deadline !== undefined) updateData.deadline = updates.deadline;
  if (updates.price !== undefined) updateData.price = updates.price;
  if (updates.max_price !== undefined) updateData.max_price = updates.max_price;
  if (updates.cryptocurrency !== undefined) updateData.cryptocurrency = updates.cryptocurrency;
  if (updates.job_type !== undefined) updateData.job_type = updates.job_type;
  if (updates.plagiarism_check_requested !== undefined) updateData.plagiarism_check_requested = updates.plagiarism_check_requested;
  if (updates.academic_level_id !== undefined) updateData.academic_level_id = updates.academic_level_id || null;
  if (updates.citation_style_id !== undefined) updateData.citation_style_id = updates.citation_style_id || null;

  const { data, error } = await supabase
    .from('jobs')
    .update(updateData)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to update job request: ${error.message}`);
  }

  if (!data) {
    throw new Error('Job request not found after update');
  }

  return data;
}

/**
 * Submit job for a request
 * @param {string} requestId - Job request ID
 * @param {Object} params - Submission parameters
 * @param {string} params.content - Job content
 * @param {string} params.submitted_by - User ID of submitter
 * @param {string} [params.file_url] - URL to uploaded file
 * @returns {Promise<Object>} Created submission
 * @throws {Error} If validation fails or creation fails
 */
export async function submitJob(requestId, { content, submitted_by, file_url }) {
  if (!requestId || requestId.trim() === '') {
    throw new Error('Job request ID is required');
  }

  if (!content || content.trim() === '') {
    throw new Error('Content is required');
  }

  if (!submitted_by || submitted_by.trim() === '') {
    throw new Error('Submitted by user ID is required');
  }

  // Calculate word count
  const wordCount = content.trim().split(/\s+/).length;

  const supabase = getSupabaseClient();

  const submissionData = {
    job_id: requestId,
    content: content.trim(),
    word_count: wordCount,
    submitted_by
  };

  if (file_url) {
    submissionData.file_url = file_url;
  }

  const { data, error } = await supabase
    .from('job_submissions')
    .insert(submissionData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to submit job: ${error.message}`);
  }

  // Update job request status to submitted
  await supabase
    .from('jobs')
    .update({ status: 'submitted' })
    .eq('id', requestId);

  return data;
}

/**
 * Request revision for an job
 * @param {string} requestId - Job request ID
 * @param {Object} params - Revision parameters
 * @param {string} params.requested_by - User ID of requester
 * @param {string} params.notes - Revision notes
 * @returns {Promise<Object>} Created revision request
 * @throws {Error} If validation fails or creation fails
 */
export async function requestRevision(requestId, { requested_by, notes }) {
  if (!requestId || requestId.trim() === '') {
    throw new Error('Job request ID is required');
  }

  if (!requested_by || requested_by.trim() === '') {
    throw new Error('Requested by user ID is required');
  }

  if (!notes || notes.trim() === '') {
    throw new Error('Revision notes are required');
  }

  const supabase = getSupabaseClient();

  const revisionData = {
    job_id: requestId,
    requested_by,
    notes: notes.trim(),
    status: 'pending'
  };

  const { data, error } = await supabase
    .from('job_revisions')
    .insert(revisionData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to request revision: ${error.message}`);
  }

  // Update job request status to revision_requested
  await supabase
    .from('jobs')
    .update({ status: 'revision_requested' })
    .eq('id', requestId);

  return data;
}

/**
 * Generate quality report for an job
 * @param {string} requestId - Job request ID
 * @returns {Promise<Object>} Generated quality report
 * @throws {Error} If validation fails or creation fails
 */
export async function generateQualityReport(requestId) {
  if (!requestId || requestId.trim() === '') {
    throw new Error('Job request ID is required');
  }

  // In a real implementation, this would analyze the job content
  // For now, we'll generate mock scores
  const grammarScore = Math.floor(Math.random() * 21) + 80; // 80-100
  const citationScore = Math.floor(Math.random() * 21) + 80; // 80-100
  const contentQualityScore = Math.floor(Math.random() * 21) + 80; // 80-100
  const overallScore = Math.floor((grammarScore + citationScore + contentQualityScore) / 3);

  const supabase = getSupabaseClient();

  const reportData = {
    job_id: requestId,
    grammar_score: grammarScore,
    citation_score: citationScore,
    content_quality_score: contentQualityScore,
    overall_score: overallScore,
    feedback: 'Quality analysis completed. Overall performance is excellent.'
  };

  const { data, error } = await supabase
    .from('quality_reports')
    .insert(reportData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to generate quality report: ${error.message}`);
  }

  return data;
}

/**
 * Check plagiarism for job content
 * @param {string} requestId - Job request ID
 * @param {string} content - Content to check
 * @returns {Promise<Object>} Plagiarism report
 * @throws {Error} If validation fails or creation fails
 */
export async function checkPlagiarism(requestId, content) {
  if (!requestId || requestId.trim() === '') {
    throw new Error('Job request ID is required');
  }

  if (!content || content.trim() === '') {
    throw new Error('Content is required');
  }

  // In a real implementation, this would use an external plagiarism detection API
  // For now, we'll generate a mock report
  const similarityScore = Math.floor(Math.random() * 15); // 0-14% similarity
  const sourcesFound = Math.floor(Math.random() * 3); // 0-2 sources

  const supabase = getSupabaseClient();

  const reportData = {
    job_id: requestId,
    similarity_score: similarityScore,
    sources_found: sourcesFound,
    details: {
      checked_at: new Date().toISOString(),
      content_length: content.length,
      word_count: content.trim().split(/\s+/).length
    }
  };

  const { data, error } = await supabase
    .from('plagiarism_reports')
    .insert(reportData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to check plagiarism: ${error.message}`);
  }

  return data;
}