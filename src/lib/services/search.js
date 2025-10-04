/**
 * Cross-Service Search
 * 
 * Unified search across all service types (homework, programming, assignments, tests)
 * without modifying existing table structures.
 */

import { getSupabaseClient } from '../supabaseClient.js';

/**
 * Valid service types
 */
const VALID_SERVICE_TYPES = ['homework', 'programming', 'assignment', 'test'];

/**
 * Search across all service types
 * @param {string} query - Search query
 * @param {Object} [filters] - Optional filters
 * @param {string} [filters.type] - Filter by service type
 * @param {string} [filters.status] - Filter by status
 * @param {number} [filters.limit] - Limit results per service type
 * @returns {Promise<Array>} Combined search results from all services
 * @throws {Error} If query is invalid
 */
export async function searchAllServices(query, filters = {}) {
  if (!query || query.trim() === '') {
    throw new Error('Search query is required');
  }

  const supabase = getSupabaseClient();
  const searchTerm = query.trim();
  const results = [];

  // If type filter is specified, only search that type
  if (filters.type) {
    if (!VALID_SERVICE_TYPES.includes(filters.type)) {
      throw new Error(`Invalid service type. Must be one of: ${VALID_SERVICE_TYPES.join(', ')}`);
    }
    const typeResults = await searchServiceType(supabase, filters.type, searchTerm, filters);
    return typeResults;
  }

  // Search all service types
  const searchPromises = VALID_SERVICE_TYPES.map(type =>
    searchServiceType(supabase, type, searchTerm, filters)
  );

  const allResults = await Promise.all(searchPromises);
  
  // Flatten and combine results
  return allResults.flat();
}

/**
 * Search a specific service type
 * @param {Object} supabase - Supabase client
 * @param {string} type - Service type
 * @param {string} searchTerm - Search term
 * @param {Object} filters - Filters
 * @returns {Promise<Array>} Search results
 */
async function searchServiceType(supabase, type, searchTerm, filters) {
  const limit = filters.limit || 50;
  let query;
  let tableName;
  let selectFields;

  switch (type) {
    case 'homework':
      tableName = 'homework_requests';
      selectFields = '*, subjects(name)';
      query = supabase
        .from(tableName)
        .select(selectFields)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      break;

    case 'programming':
      tableName = 'programming_requests';
      selectFields = '*, programming_languages(name)';
      query = supabase
        .from(tableName)
        .select(selectFields)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      break;

    case 'assignment':
      tableName = 'assignment_requests';
      selectFields = '*, academic_levels(name), citation_styles(name)';
      query = supabase
        .from(tableName)
        .select(selectFields)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,topic.ilike.%${searchTerm}%`);
      break;

    case 'test':
      tableName = 'tests';
      selectFields = '*';
      query = supabase
        .from(tableName)
        .select(selectFields)
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      break;

    default:
      return [];
  }

  // Apply status filter if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Apply limit and ordering
  query = query.order('created_at', { ascending: false }).limit(limit);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to search ${type} services: ${error.message}`);
  }

  // Add service type to each result
  return (data || []).map(item => ({
    ...item,
    service_type: type
  }));
}

/**
 * Get all services across all types
 * @param {Object} [filters] - Optional filters
 * @param {string} [filters.type] - Filter by service type
 * @param {string} [filters.status] - Filter by status
 * @param {number} [filters.limit] - Limit results per service type
 * @returns {Promise<Array>} All services
 * @throws {Error} If fetch fails
 */
export async function getAllServices(filters = {}) {
  const supabase = getSupabaseClient();
  const results = [];

  // If type filter is specified, only get that type
  if (filters.type) {
    if (!VALID_SERVICE_TYPES.includes(filters.type)) {
      throw new Error(`Invalid service type. Must be one of: ${VALID_SERVICE_TYPES.join(', ')}`);
    }
    return await getServicesByType(filters.type, filters);
  }

  // Get all service types
  const fetchPromises = VALID_SERVICE_TYPES.map(type =>
    getServicesByType(type, filters)
  );

  const allResults = await Promise.all(fetchPromises);
  
  // Flatten and combine results
  return allResults.flat();
}

/**
 * Get services by specific type
 * @param {string} type - Service type
 * @param {Object} [filters] - Optional filters
 * @param {string} [filters.status] - Filter by status
 * @param {number} [filters.limit] - Limit results
 * @returns {Promise<Array>} Services of specified type
 * @throws {Error} If type is invalid or fetch fails
 */
export async function getServicesByType(type, filters = {}) {
  if (!type || type.trim() === '') {
    throw new Error('Service type is required');
  }

  if (!VALID_SERVICE_TYPES.includes(type)) {
    throw new Error(`Invalid service type. Must be one of: ${VALID_SERVICE_TYPES.join(', ')}`);
  }

  const supabase = getSupabaseClient();
  const limit = filters.limit || 50;
  let query;
  let tableName;
  let selectFields;

  switch (type) {
    case 'homework':
      tableName = 'homework_requests';
      selectFields = '*, subjects(name)';
      break;

    case 'programming':
      tableName = 'programming_requests';
      selectFields = '*, programming_languages(name)';
      break;

    case 'assignment':
      tableName = 'assignment_requests';
      selectFields = '*, academic_levels(name), citation_styles(name)';
      break;

    case 'test':
      tableName = 'tests';
      selectFields = '*';
      break;

    default:
      throw new Error(`Invalid service type: ${type}`);
  }

  query = supabase
    .from(tableName)
    .select(selectFields);

  // Apply status filter if provided
  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  // Apply limit and ordering
  query = query.order('created_at', { ascending: false }).limit(limit);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch ${type} services: ${error.message}`);
  }

  // Add service type to each result
  return (data || []).map(item => ({
    ...item,
    service_type: type
  }));
}