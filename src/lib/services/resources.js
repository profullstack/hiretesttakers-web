/**
 * Resources Service
 * Handles learning resources, sample papers, blogs, and study guides
 */

import { supabase } from '../supabaseClient.js';

/**
 * Create a new resource
 * @param {Object} resourceData - Resource data
 * @returns {Promise<Object>} Created resource
 */
export async function createResource(resourceData) {
  const { title, type, author_id } = resourceData;

  if (!title || !type || !author_id) {
    throw new Error('Title, type, and author_id are required');
  }

  const { data, error } = await supabase
    .from('resources')
    .insert([resourceData])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create resource: ${error.message}`);
  }

  return data;
}

/**
 * Get resources with optional filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} List of resources
 */
export async function getResources(filters = {}) {
  const {
    status,
    type,
    subject,
    tags,
    author_id,
    limit = 50,
    offset = 0,
    sortBy = 'created_at',
    sortOrder = 'desc'
  } = filters;

  let query = supabase.from('resources').select('*');

  // Apply filters
  if (status) {
    query = query.eq('status', status);
  }

  if (type) {
    query = query.eq('type', type);
  }

  if (subject) {
    query = query.eq('subject', subject);
  }

  if (tags && tags.length > 0) {
    query = query.contains('tags', tags);
  }

  if (author_id) {
    query = query.eq('author_id', author_id);
  }

  // Apply sorting
  if (sortBy === 'rating') {
    // Custom sorting for rating (calculated field)
    query = query.order('rating_count', { ascending: false });
  } else {
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to get resources: ${error.message}`);
  }

  return data || [];
}

/**
 * Get a resource by ID
 * @param {string} resourceId - Resource ID
 * @returns {Promise<Object|null>} Resource or null
 */
export async function getResourceById(resourceId) {
  if (!resourceId || typeof resourceId !== 'string') {
    throw new Error('Valid resource ID is required');
  }

  const { data, error } = await supabase
    .from('resources')
    .select('*')
    .eq('id', resourceId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to get resource: ${error.message}`);
  }

  return data;
}

/**
 * Update a resource
 * @param {string} resourceId - Resource ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated resource
 */
export async function updateResource(resourceId, updates) {
  if (!resourceId) {
    throw new Error('Resource ID is required');
  }

  const { data, error } = await supabase
    .from('resources')
    .update(updates)
    .eq('id', resourceId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update resource: ${error.message}`);
  }

  return data;
}

/**
 * Delete a resource
 * @param {string} resourceId - Resource ID
 * @returns {Promise<void>}
 */
export async function deleteResource(resourceId) {
  if (!resourceId) {
    throw new Error('Resource ID is required');
  }

  const { error } = await supabase
    .from('resources')
    .delete()
    .eq('id', resourceId);

  if (error) {
    throw new Error(`Failed to delete resource: ${error.message}`);
  }
}

/**
 * Search resources by query string
 * @param {string} query - Search query
 * @param {Object} filters - Additional filters
 * @returns {Promise<Array>} Matching resources
 */
export async function searchResources(query, filters = {}) {
  if (!query || typeof query !== 'string') {
    return [];
  }

  const searchTerm = query.toLowerCase();

  let dbQuery = supabase
    .from('resources')
    .select('*')
    .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

  // Apply additional filters
  if (filters.type) {
    dbQuery = dbQuery.eq('type', filters.type);
  }

  if (filters.subject) {
    dbQuery = dbQuery.eq('subject', filters.subject);
  }

  if (filters.status) {
    dbQuery = dbQuery.eq('status', filters.status);
  } else {
    // Default to published only for search
    dbQuery = dbQuery.eq('status', 'published');
  }

  const { data, error } = await dbQuery;

  if (error) {
    throw new Error(`Failed to search resources: ${error.message}`);
  }

  return data || [];
}

/**
 * Rate a resource
 * @param {Object} ratingData - Rating data
 * @returns {Promise<Object>} Created or updated rating
 */
export async function rateResource(ratingData) {
  const { resource_id, user_id, rating, review } = ratingData;

  if (!resource_id || !user_id || !rating) {
    throw new Error('Resource ID, user ID, and rating are required');
  }

  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Check if user already rated this resource
  const { data: existing } = await supabase
    .from('resource_ratings')
    .select('id')
    .eq('resource_id', resource_id)
    .eq('user_id', user_id)
    .single();

  if (existing) {
    // Update existing rating
    const { data, error } = await supabase
      .from('resource_ratings')
      .update({ rating, review })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update rating: ${error.message}`);
    }

    return data;
  } else {
    // Create new rating
    const { data, error } = await supabase
      .from('resource_ratings')
      .insert([{ resource_id, user_id, rating, review }])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create rating: ${error.message}`);
    }

    return data;
  }
}

/**
 * Get user's rating for a resource
 * @param {string} resourceId - Resource ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User's rating or null
 */
export async function getUserRating(resourceId, userId) {
  if (!resourceId || !userId) {
    throw new Error('Resource ID and user ID are required');
  }

  const { data, error } = await supabase
    .from('resource_ratings')
    .select('*')
    .eq('resource_id', resourceId)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Not found
    }
    throw new Error(`Failed to get user rating: ${error.message}`);
  }

  return data;
}

/**
 * Track a view for a resource
 * @param {string} resourceId - Resource ID
 * @returns {Promise<void>}
 */
export async function trackView(resourceId) {
  if (!resourceId) {
    throw new Error('Resource ID is required');
  }

  const { error } = await supabase.rpc('increment_resource_views', {
    resource_id: resourceId
  });

  if (error) {
    // Fallback to manual increment if RPC doesn't exist
    const resource = await getResourceById(resourceId);
    if (resource) {
      await updateResource(resourceId, {
        view_count: resource.view_count + 1
      });
    }
  }
}

/**
 * Track a download for a resource
 * @param {string} resourceId - Resource ID
 * @returns {Promise<void>}
 */
export async function trackDownload(resourceId) {
  if (!resourceId) {
    throw new Error('Resource ID is required');
  }

  const { error } = await supabase.rpc('increment_resource_downloads', {
    resource_id: resourceId
  });

  if (error) {
    // Fallback to manual increment if RPC doesn't exist
    const resource = await getResourceById(resourceId);
    if (resource) {
      await updateResource(resourceId, {
        download_count: resource.download_count + 1
      });
    }
  }
}

/**
 * Get user contributions
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of contributions
 */
export async function getUserContributions(userId) {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('user_contributions')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to get user contributions: ${error.message}`);
  }

  return data || [];
}

/**
 * Get all categories
 * @returns {Promise<Array>} List of categories
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('resource_categories')
    .select('*')
    .order('name');

  if (error) {
    throw new Error(`Failed to get categories: ${error.message}`);
  }

  return data || [];
}

/**
 * Add resource to category
 * @param {string} resourceId - Resource ID
 * @param {string} categoryId - Category ID
 * @returns {Promise<Object>} Category mapping
 */
export async function addResourceToCategory(resourceId, categoryId) {
  if (!resourceId || !categoryId) {
    throw new Error('Resource ID and category ID are required');
  }

  const { data, error } = await supabase
    .from('resource_category_mapping')
    .insert([{ resource_id: resourceId, category_id: categoryId }])
    .select()
    .single();

  if (error) {
    // Check if it's a duplicate key error (already exists)
    if (error.code === '23505') {
      // Return existing mapping
      const { data: existing } = await supabase
        .from('resource_category_mapping')
        .select('*')
        .eq('resource_id', resourceId)
        .eq('category_id', categoryId)
        .single();
      return existing;
    }
    throw new Error(`Failed to add resource to category: ${error.message}`);
  }

  return data;
}

/**
 * Remove resource from category
 * @param {string} resourceId - Resource ID
 * @param {string} categoryId - Category ID
 * @returns {Promise<void>}
 */
export async function removeResourceFromCategory(resourceId, categoryId) {
  if (!resourceId || !categoryId) {
    throw new Error('Resource ID and category ID are required');
  }

  const { error } = await supabase
    .from('resource_category_mapping')
    .delete()
    .eq('resource_id', resourceId)
    .eq('category_id', categoryId);

  if (error) {
    throw new Error(`Failed to remove resource from category: ${error.message}`);
  }
}

/**
 * Get resources by category
 * @param {string} categoryId - Category ID
 * @returns {Promise<Array>} List of resources
 */
export async function getResourcesByCategory(categoryId) {
  if (!categoryId) {
    throw new Error('Category ID is required');
  }

  const { data, error } = await supabase
    .from('resource_category_mapping')
    .select('resource_id, resources(*)')
    .eq('category_id', categoryId);

  if (error) {
    throw new Error(`Failed to get resources by category: ${error.message}`);
  }

  // Extract resources from the mapping
  return data?.map(item => item.resources).filter(Boolean) || [];
}

/**
 * Get resource statistics
 * @param {string} resourceId - Resource ID
 * @returns {Promise<Object>} Resource statistics
 */
export async function getResourceStats(resourceId) {
  if (!resourceId) {
    throw new Error('Resource ID is required');
  }

  const resource = await getResourceById(resourceId);

  if (!resource) {
    throw new Error('Resource not found');
  }

  const averageRating = resource.rating_count > 0
    ? resource.rating_sum / resource.rating_count
    : 0;

  return {
    view_count: resource.view_count,
    download_count: resource.download_count,
    rating_count: resource.rating_count,
    average_rating: averageRating
  };
}