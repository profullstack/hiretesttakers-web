/**
 * Assignment Service Tests
 *
 * Tests for assignment writing service using Supabase.
 * Uses Vitest for testing.
 */

import { describe, it, expect } from 'vitest';
import {
  createAssignmentRequest,
  getAssignmentRequests,
  getAssignmentRequestById,
  submitAssignment,
  requestRevision,
  generateQualityReport,
  checkPlagiarism,
  getAcademicLevels,
  getCitationStyles
} from '../../src/lib/services/assignment.js';

describe('Assignment Service', () => {
  describe('getAcademicLevels', () => {
    it('should return list of academic levels', async () => {
      const levels = await getAcademicLevels();
      expect(Array.isArray(levels)).toBe(true);
      expect(levels.length).toBeGreaterThan(0);
      expect(levels[0]).toHaveProperty('id');
      expect(levels[0]).toHaveProperty('name');
    });

    it('should include default academic levels', async () => {
      const levels = await getAcademicLevels();
      const levelNames = levels.map(l => l.name);
      expect(levelNames).toContain('High School');
      expect(levelNames).toContain('Undergraduate');
      expect(levelNames).toContain('Graduate');
      expect(levelNames).toContain('Doctoral');
    });
  });

  describe('getCitationStyles', () => {
    it('should return list of citation styles', async () => {
      const styles = await getCitationStyles();
      expect(Array.isArray(styles)).toBe(true);
      expect(styles.length).toBeGreaterThan(0);
      expect(styles[0]).toHaveProperty('id');
      expect(styles[0]).toHaveProperty('name');
    });

    it('should include default citation styles', async () => {
      const styles = await getCitationStyles();
      const styleNames = styles.map(s => s.name);
      expect(styleNames).toContain('APA');
      expect(styleNames).toContain('MLA');
      expect(styleNames).toContain('Chicago');
      expect(styleNames).toContain('Harvard');
    });
  });

  describe('createAssignmentRequest', () => {
    it('should throw error if user_id is missing', async () => {
      await expect(createAssignmentRequest({
        title: 'Test Assignment',
        description: 'Test description',
        topic: 'Test topic',
        word_count: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        price: 50
      })).rejects.toThrow('User ID is required');
    });

    it('should throw error if title is missing', async () => {
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        description: 'Test description',
        topic: 'Test topic',
        word_count: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        price: 50
      })).rejects.toThrow('Title is required');
    });

    it('should throw error if description is missing', async () => {
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        title: 'Test Assignment',
        topic: 'Test topic',
        word_count: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        price: 50
      })).rejects.toThrow('Description is required');
    });

    it('should throw error if topic is missing', async () => {
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        title: 'Test Assignment',
        description: 'Test description',
        word_count: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        price: 50
      })).rejects.toThrow('Topic is required');
    });

    it('should throw error if word_count is missing', async () => {
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        title: 'Test Assignment',
        description: 'Test description',
        topic: 'Test topic',
        deadline: new Date(Date.now() + 86400000).toISOString(),
        price: 50
      })).rejects.toThrow('Word count is required');
    });

    it('should throw error if word_count is not positive', async () => {
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        title: 'Test Assignment',
        description: 'Test description',
        topic: 'Test topic',
        word_count: 0,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        price: 50
      })).rejects.toThrow('Word count must be positive');
    });

    it('should throw error if deadline is missing', async () => {
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        title: 'Test Assignment',
        description: 'Test description',
        topic: 'Test topic',
        word_count: 1000,
        price: 50
      })).rejects.toThrow('Deadline is required');
    });

    it('should throw error if deadline is in the past', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        title: 'Test Assignment',
        description: 'Test description',
        topic: 'Test topic',
        word_count: 1000,
        deadline: pastDate.toISOString(),
        price: 50
      })).rejects.toThrow('Deadline must be in the future');
    });

    it('should throw error if price is missing', async () => {
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        title: 'Test Assignment',
        description: 'Test description',
        topic: 'Test topic',
        word_count: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString()
      })).rejects.toThrow('Price is required');
    });

    it('should throw error if price is negative', async () => {
      await expect(createAssignmentRequest({
        user_id: 'user-id',
        title: 'Test Assignment',
        description: 'Test description',
        topic: 'Test topic',
        word_count: 1000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        price: -10
      })).rejects.toThrow('Price must be non-negative');
    });

    it('should create assignment request successfully', async () => {
      const result = await createAssignmentRequest({
        user_id: 'user-id',
        title: 'Research Paper on Climate Change',
        description: 'Need a comprehensive research paper',
        topic: 'Climate Change Impact',
        word_count: 2000,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        price: 100
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('title', 'Research Paper on Climate Change');
      expect(result).toHaveProperty('word_count', 2000);
      expect(result).toHaveProperty('price', 100);
      expect(result).toHaveProperty('status', 'pending');
    });

    it('should create assignment with academic level and citation style', async () => {
      const result = await createAssignmentRequest({
        user_id: 'user-id',
        title: 'Essay on Shakespeare',
        description: 'Literary analysis essay',
        topic: 'Hamlet Analysis',
        academic_level_id: 'level-id',
        citation_style_id: 'style-id',
        word_count: 1500,
        deadline: new Date(Date.now() + 172800000).toISOString(),
        price: 75,
        plagiarism_check_requested: true
      });

      expect(result).toHaveProperty('academic_level_id', 'level-id');
      expect(result).toHaveProperty('citation_style_id', 'style-id');
      expect(result).toHaveProperty('plagiarism_check_requested', true);
    });
  });

  describe('getAssignmentRequests', () => {
    it('should return list of assignment requests', async () => {
      const requests = await getAssignmentRequests();
      expect(Array.isArray(requests)).toBe(true);
    });

    it('should filter by status', async () => {
      const requests = await getAssignmentRequests({ status: 'pending' });
      expect(Array.isArray(requests)).toBe(true);
      requests.forEach(req => {
        expect(req.status).toBe('pending');
      });
    });

    it('should filter by user_id', async () => {
      const requests = await getAssignmentRequests({ user_id: 'user-id' });
      expect(Array.isArray(requests)).toBe(true);
      requests.forEach(req => {
        expect(req.user_id).toBe('user-id');
      });
    });

    it('should limit results', async () => {
      const requests = await getAssignmentRequests({ limit: 5 });
      expect(Array.isArray(requests)).toBe(true);
      expect(requests.length).toBeLessThanOrEqual(5);
    });
  });

  describe('getAssignmentRequestById', () => {
    it('should throw error if id is missing', async () => {
      await expect(getAssignmentRequestById())
        .rejects.toThrow('Assignment request ID is required');
    });

    it('should return assignment request by id', async () => {
      const request = await getAssignmentRequestById('valid-id');
      expect(request).toHaveProperty('id');
      expect(request).toHaveProperty('title');
      expect(request).toHaveProperty('description');
    });

    it('should return null for non-existent id', async () => {
      const request = await getAssignmentRequestById('non-existent-id');
      expect(request).toBeNull();
    });
  });

  describe('submitAssignment', () => {
    it('should throw error if request_id is missing', async () => {
      await expect(submitAssignment(null, {
        content: 'Assignment content',
        submitted_by: 'user-id'
      })).rejects.toThrow('Assignment request ID is required');
    });

    it('should throw error if content is missing', async () => {
      await expect(submitAssignment('request-id', {
        submitted_by: 'user-id'
      })).rejects.toThrow('Content is required');
    });

    it('should throw error if submitted_by is missing', async () => {
      await expect(submitAssignment('request-id', {
        content: 'Assignment content'
      })).rejects.toThrow('Submitted by user ID is required');
    });

    it('should submit assignment successfully', async () => {
      const result = await submitAssignment('request-id', {
        content: 'This is the completed assignment content...',
        submitted_by: 'tutor-id',
        file_url: 'https://example.com/assignment.pdf'
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('assignment_request_id', 'request-id');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('word_count');
    });

    it('should calculate word count from content', async () => {
      const content = 'This is a test assignment with exactly ten words here.';
      const result = await submitAssignment('request-id', {
        content,
        submitted_by: 'tutor-id'
      });

      expect(result).toHaveProperty('word_count');
      expect(result.word_count).toBeGreaterThan(0);
    });
  });

  describe('requestRevision', () => {
    it('should throw error if request_id is missing', async () => {
      await expect(requestRevision(null, {
        requested_by: 'user-id',
        notes: 'Please fix grammar'
      })).rejects.toThrow('Assignment request ID is required');
    });

    it('should throw error if requested_by is missing', async () => {
      await expect(requestRevision('request-id', {
        notes: 'Please fix grammar'
      })).rejects.toThrow('Requested by user ID is required');
    });

    it('should throw error if notes are missing', async () => {
      await expect(requestRevision('request-id', {
        requested_by: 'user-id'
      })).rejects.toThrow('Revision notes are required');
    });

    it('should create revision request successfully', async () => {
      const result = await requestRevision('request-id', {
        requested_by: 'user-id',
        notes: 'Please improve the introduction and add more citations'
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('assignment_request_id', 'request-id');
      expect(result).toHaveProperty('notes');
      expect(result).toHaveProperty('status', 'pending');
    });
  });

  describe('generateQualityReport', () => {
    it('should throw error if request_id is missing', async () => {
      await expect(generateQualityReport())
        .rejects.toThrow('Assignment request ID is required');
    });

    it('should generate quality report successfully', async () => {
      const result = await generateQualityReport('request-id');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('assignment_request_id', 'request-id');
      expect(result).toHaveProperty('grammar_score');
      expect(result).toHaveProperty('citation_score');
      expect(result).toHaveProperty('content_quality_score');
      expect(result).toHaveProperty('overall_score');
    });

    it('should have scores between 0 and 100', async () => {
      const result = await generateQualityReport('request-id');

      expect(result.grammar_score).toBeGreaterThanOrEqual(0);
      expect(result.grammar_score).toBeLessThanOrEqual(100);
      expect(result.citation_score).toBeGreaterThanOrEqual(0);
      expect(result.citation_score).toBeLessThanOrEqual(100);
      expect(result.content_quality_score).toBeGreaterThanOrEqual(0);
      expect(result.content_quality_score).toBeLessThanOrEqual(100);
      expect(result.overall_score).toBeGreaterThanOrEqual(0);
      expect(result.overall_score).toBeLessThanOrEqual(100);
    });
  });

  describe('checkPlagiarism', () => {
    it('should throw error if request_id is missing', async () => {
      await expect(checkPlagiarism(null, 'content'))
        .rejects.toThrow('Assignment request ID is required');
    });

    it('should throw error if content is missing', async () => {
      await expect(checkPlagiarism('request-id', ''))
        .rejects.toThrow('Content is required');
    });

    it('should check plagiarism successfully', async () => {
      const result = await checkPlagiarism('request-id', 'This is test content for plagiarism check');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('assignment_request_id', 'request-id');
      expect(result).toHaveProperty('similarity_score');
      expect(result).toHaveProperty('sources_found');
    });

    it('should have similarity score between 0 and 100', async () => {
      const result = await checkPlagiarism('request-id', 'Test content');

      expect(result.similarity_score).toBeGreaterThanOrEqual(0);
      expect(result.similarity_score).toBeLessThanOrEqual(100);
    });

    it('should have non-negative sources found', async () => {
      const result = await checkPlagiarism('request-id', 'Test content');

      expect(result.sources_found).toBeGreaterThanOrEqual(0);
    });
  });
});