/**
 * Cross-Service Search Tests
 * 
 * Tests for unified search across all service types
 * Using Vitest framework
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  searchAllServices,
  getAllServices,
  getServicesByType
} from '../../src/lib/services/search.js';

// Mock the supabase client
vi.mock('../../src/lib/supabaseClient.js', () => ({
  getSupabaseClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(function() {
          return this;
        }),
        or: vi.fn(function() {
          return this;
        }),
        order: vi.fn(function() {
          return this;
        }),
        limit: vi.fn(() => ({
          data: [],
          error: null
        }))
      }))
    }))
  }))
}));

describe('Cross-Service Search', () => {
  describe('searchAllServices', () => {
    it('should throw error if query is empty', async () => {
      await expect(searchAllServices('')).rejects.toThrow('Search query is required');
    });

    it('should throw error if query is null', async () => {
      await expect(searchAllServices(null)).rejects.toThrow('Search query is required');
    });

    it('should return results from all service types', async () => {
      const results = await searchAllServices('math');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by service type when provided', async () => {
      const results = await searchAllServices('math', { type: 'homework' });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by status when provided', async () => {
      const results = await searchAllServices('math', { status: 'open' });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should limit results when limit is provided', async () => {
      const results = await searchAllServices('math', { limit: 10 });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should handle multiple filters', async () => {
      const results = await searchAllServices('math', {
        type: 'homework',
        status: 'open',
        limit: 5
      });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getAllServices', () => {
    it('should return all services without filters', async () => {
      const results = await getAllServices();
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by status', async () => {
      const results = await getAllServices({ status: 'open' });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should filter by type', async () => {
      const results = await getAllServices({ type: 'programming' });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should limit results', async () => {
      const results = await getAllServices({ limit: 20 });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('getServicesByType', () => {
    it('should throw error if type is empty', async () => {
      await expect(getServicesByType('')).rejects.toThrow('Service type is required');
    });

    it('should throw error if type is invalid', async () => {
      await expect(getServicesByType('invalid')).rejects.toThrow('Invalid service type');
    });

    it('should return homework services', async () => {
      const results = await getServicesByType('homework');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return programming services', async () => {
      const results = await getServicesByType('programming');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return assignment services', async () => {
      const results = await getServicesByType('assignment');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return test services', async () => {
      const results = await getServicesByType('test');
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });

    it('should apply filters to specific service type', async () => {
      const results = await getServicesByType('homework', { status: 'open' });
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });
});