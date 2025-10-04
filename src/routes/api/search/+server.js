/**
 * Unified Search API
 * 
 * GET /api/search - Search across all service types
 * GET /api/search?q=query&type=homework&status=open&limit=20
 */

import { json } from '@sveltejs/kit';
import { searchAllServices, getAllServices } from '$lib/services/search.js';

/**
 * GET /api/search
 * Search across all services or get all services
 */
export async function GET({ url }) {
  try {
    const query = url.searchParams.get('q');
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const limitParam = url.searchParams.get('limit');
    
    const filters = {};
    
    if (type) {
      filters.type = type;
    }
    
    if (status) {
      filters.status = status;
    }
    
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (!isNaN(limit) && limit > 0) {
        filters.limit = limit;
      }
    }

    let results;
    
    if (query) {
      // Search with query
      results = await searchAllServices(query, filters);
    } else {
      // Get all services (browse mode)
      results = await getAllServices(filters);
    }

    return json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    console.error('Search API error:', error);
    return json(
      {
        success: false,
        error: error.message
      },
      { status: 400 }
    );
  }
}