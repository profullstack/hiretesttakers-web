/**
 * Plagiarism Detection Service
 * 
 * Service for detecting plagiarism in text content using OpenAI API.
 * Provides functions for checking content, generating reports, and managing plagiarism reports.
 */

import { getSupabaseClient } from '../supabaseClient.js';
import { callOpenAI } from './openai.js';

/**
 * Analyze text for potential plagiarism using OpenAI
 * @param {string} content - Text content to analyze
 * @returns {Promise<Object>} Analysis results with similarity score and sources
 */
export async function analyzePlagiarism(content) {
  if (!content || content.trim() === '') {
    throw new Error('Content is required for plagiarism analysis');
  }

  const systemPrompt = `You are a plagiarism detection assistant. Analyze the given text and provide a detailed plagiarism report in JSON format.

Return a JSON object with:
{
  "similarity_score": <number 0-100 representing overall similarity to known sources>,
  "sources_found": <number of potential sources detected>,
  "matches": [
    {
      "text": "<matched text snippet>",
      "source": "<potential source description>",
      "similarity": <0-100>
    }
  ],
  "analysis": "<brief analysis of originality>",
  "recommendations": "<suggestions for improvement if needed>"
}

Be thorough but fair. Original work should score low (0-15%). Minor similarities are normal.`;

  const userMessage = `Analyze this text for plagiarism:\n\n${content}`;

  try {
    const response = await callOpenAI(systemPrompt, userMessage, 2000);
    const result = JSON.parse(response);
    
    // Validate the response structure
    if (typeof result.similarity_score !== 'number' || 
        typeof result.sources_found !== 'number') {
      throw new Error('Invalid response format from AI');
    }

    return result;
  } catch (error) {
    console.error('Plagiarism analysis error:', error);
    throw new Error(`Failed to analyze content: ${error.message}`);
  }
}

/**
 * Generate and save plagiarism report for an assignment
 * @param {string} jobId - Job/Assignment ID
 * @param {string} content - Content to check
 * @returns {Promise<Object>} Created plagiarism report
 */
export async function generatePlagiarismReport(jobId, content) {
  if (!jobId || jobId.trim() === '') {
    throw new Error('Job ID is required');
  }

  if (!content || content.trim() === '') {
    throw new Error('Content is required');
  }

  // Analyze content for plagiarism
  const analysis = await analyzePlagiarism(content);

  const supabase = getSupabaseClient();

  // Create report data
  const reportData = {
    job_id: jobId,
    similarity_score: Math.round(analysis.similarity_score),
    sources_found: analysis.sources_found,
    details: {
      matches: analysis.matches || [],
      analysis: analysis.analysis || '',
      recommendations: analysis.recommendations || '',
      content_length: content.length,
      word_count: content.trim().split(/\s+/).length,
      checked_at: new Date().toISOString()
    },
    archived: false
  };

  const { data, error } = await supabase
    .from('plagiarism_reports')
    .insert(reportData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save plagiarism report: ${error.message}`);
  }

  return data;
}

/**
 * Get plagiarism reports for a job
 * @param {string} jobId - Job/Assignment ID
 * @param {boolean} includeArchived - Whether to include archived reports
 * @returns {Promise<Array>} List of plagiarism reports
 */
export async function getPlagiarismReports(jobId, includeArchived = false) {
  if (!jobId || jobId.trim() === '') {
    throw new Error('Job ID is required');
  }

  const supabase = getSupabaseClient();

  let query = supabase
    .from('plagiarism_reports')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (!includeArchived) {
    query = query.eq('archived', false);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch plagiarism reports: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a single plagiarism report by ID
 * @param {string} reportId - Report ID
 * @returns {Promise<Object|null>} Plagiarism report or null
 */
export async function getPlagiarismReportById(reportId) {
  if (!reportId || reportId.trim() === '') {
    throw new Error('Report ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('plagiarism_reports')
    .select('*, jobs(title, description)')
    .eq('id', reportId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch plagiarism report: ${error.message}`);
  }

  return data;
}

/**
 * Archive a plagiarism report
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Updated report
 */
export async function archivePlagiarismReport(reportId) {
  if (!reportId || reportId.trim() === '') {
    throw new Error('Report ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('plagiarism_reports')
    .update({ archived: true })
    .eq('id', reportId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to archive plagiarism report: ${error.message}`);
  }

  return data;
}

/**
 * Unarchive a plagiarism report
 * @param {string} reportId - Report ID
 * @returns {Promise<Object>} Updated report
 */
export async function unarchivePlagiarismReport(reportId) {
  if (!reportId || reportId.trim() === '') {
    throw new Error('Report ID is required');
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('plagiarism_reports')
    .update({ archived: false })
    .eq('id', reportId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to unarchive plagiarism report: ${error.message}`);
  }

  return data;
}

/**
 * Delete a plagiarism report
 * @param {string} reportId - Report ID
 * @returns {Promise<void>}
 */
export async function deletePlagiarismReport(reportId) {
  if (!reportId || reportId.trim() === '') {
    throw new Error('Report ID is required');
  }

  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('plagiarism_reports')
    .delete()
    .eq('id', reportId);

  if (error) {
    throw new Error(`Failed to delete plagiarism report: ${error.message}`);
  }
}