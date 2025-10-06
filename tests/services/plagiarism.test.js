/**
 * Plagiarism Service Tests
 * 
 * Tests for plagiarism detection service functions
 */

import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import * as plagiarismService from '../../src/lib/services/plagiarism.js';
import * as openaiService from '../../src/lib/services/openai.js';
import { getSupabaseClient } from '../../src/lib/supabaseClient.js';

describe('Plagiarism Service', () => {
  let supabaseStub;
  let callOpenAIStub;

  beforeEach(() => {
    // Stub Supabase client
    supabaseStub = {
      from: sinon.stub().returnsThis(),
      insert: sinon.stub().returnsThis(),
      select: sinon.stub().returnsThis(),
      eq: sinon.stub().returnsThis(),
      single: sinon.stub().returnsThis(),
      update: sinon.stub().returnsThis(),
      delete: sinon.stub().returnsThis(),
      order: sinon.stub().returnsThis()
    };

    sinon.stub({ getSupabaseClient }).getSupabaseClient.returns(supabaseStub);

    // Stub OpenAI service
    callOpenAIStub = sinon.stub(openaiService, 'callOpenAI');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('analyzePlagiarism', () => {
    it('should analyze content and return plagiarism results', async () => {
      const mockResponse = JSON.stringify({
        similarity_score: 12,
        sources_found: 1,
        matches: [
          {
            text: 'Sample matched text',
            source: 'Example source',
            similarity: 85
          }
        ],
        analysis: 'Content appears to be mostly original',
        recommendations: 'No major concerns'
      });

      callOpenAIStub.resolves(mockResponse);

      const result = await plagiarismService.analyzePlagiarism('Test content to analyze');

      expect(result).to.be.an('object');
      expect(result.similarity_score).to.equal(12);
      expect(result.sources_found).to.equal(1);
      expect(result.matches).to.be.an('array').with.lengthOf(1);
      expect(callOpenAIStub.calledOnce).to.be.true;
    });

    it('should throw error for empty content', async () => {
      try {
        await plagiarismService.analyzePlagiarism('');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Content is required');
      }
    });

    it('should handle invalid JSON response from AI', async () => {
      callOpenAIStub.resolves('Invalid JSON');

      try {
        await plagiarismService.analyzePlagiarism('Test content');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Failed to analyze content');
      }
    });
  });

  describe('generatePlagiarismReport', () => {
    it('should generate and save plagiarism report', async () => {
      const mockAnalysis = {
        similarity_score: 15,
        sources_found: 2,
        matches: [],
        analysis: 'Good originality',
        recommendations: 'None'
      };

      const mockReport = {
        id: 'report-123',
        job_id: 'job-123',
        similarity_score: 15,
        sources_found: 2,
        archived: false
      };

      callOpenAIStub.resolves(JSON.stringify(mockAnalysis));
      supabaseStub.single.resolves({ data: mockReport, error: null });

      const result = await plagiarismService.generatePlagiarismReport(
        'job-123',
        'Content to check for plagiarism'
      );

      expect(result).to.deep.equal(mockReport);
      expect(supabaseStub.from.calledWith('plagiarism_reports')).to.be.true;
      expect(supabaseStub.insert.calledOnce).to.be.true;
    });

    it('should throw error for missing job ID', async () => {
      try {
        await plagiarismService.generatePlagiarismReport('', 'content');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Job ID is required');
      }
    });

    it('should throw error for missing content', async () => {
      try {
        await plagiarismService.generatePlagiarismReport('job-123', '');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Content is required');
      }
    });

    it('should handle database errors', async () => {
      const mockAnalysis = {
        similarity_score: 10,
        sources_found: 0,
        matches: [],
        analysis: 'Original',
        recommendations: 'None'
      };

      callOpenAIStub.resolves(JSON.stringify(mockAnalysis));
      supabaseStub.single.resolves({
        data: null,
        error: { message: 'Database error' }
      });

      try {
        await plagiarismService.generatePlagiarismReport('job-123', 'content');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Failed to save plagiarism report');
      }
    });
  });

  describe('getPlagiarismReports', () => {
    it('should fetch reports for a job', async () => {
      const mockReports = [
        { id: 'report-1', job_id: 'job-123', similarity_score: 10 },
        { id: 'report-2', job_id: 'job-123', similarity_score: 15 }
      ];

      supabaseStub.order.resolves({ data: mockReports, error: null });

      const result = await plagiarismService.getPlagiarismReports('job-123');

      expect(result).to.deep.equal(mockReports);
      expect(supabaseStub.from.calledWith('plagiarism_reports')).to.be.true;
      expect(supabaseStub.eq.calledWith('job_id', 'job-123')).to.be.true;
    });

    it('should exclude archived reports by default', async () => {
      supabaseStub.order.resolves({ data: [], error: null });

      await plagiarismService.getPlagiarismReports('job-123');

      expect(supabaseStub.eq.calledWith('archived', false)).to.be.true;
    });

    it('should include archived reports when requested', async () => {
      supabaseStub.order.resolves({ data: [], error: null });

      await plagiarismService.getPlagiarismReports('job-123', true);

      expect(supabaseStub.eq.calledWith('archived', false)).to.be.false;
    });

    it('should throw error for missing job ID', async () => {
      try {
        await plagiarismService.getPlagiarismReports('');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Job ID is required');
      }
    });
  });

  describe('archivePlagiarismReport', () => {
    it('should archive a report', async () => {
      const mockReport = { id: 'report-123', archived: true };
      supabaseStub.single.resolves({ data: mockReport, error: null });

      const result = await plagiarismService.archivePlagiarismReport('report-123');

      expect(result).to.deep.equal(mockReport);
      expect(supabaseStub.update.calledWith({ archived: true })).to.be.true;
    });

    it('should throw error for missing report ID', async () => {
      try {
        await plagiarismService.archivePlagiarismReport('');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Report ID is required');
      }
    });
  });

  describe('unarchivePlagiarismReport', () => {
    it('should unarchive a report', async () => {
      const mockReport = { id: 'report-123', archived: false };
      supabaseStub.single.resolves({ data: mockReport, error: null });

      const result = await plagiarismService.unarchivePlagiarismReport('report-123');

      expect(result).to.deep.equal(mockReport);
      expect(supabaseStub.update.calledWith({ archived: false })).to.be.true;
    });
  });

  describe('deletePlagiarismReport', () => {
    it('should delete a report', async () => {
      supabaseStub.delete.resolves({ error: null });

      await plagiarismService.deletePlagiarismReport('report-123');

      expect(supabaseStub.from.calledWith('plagiarism_reports')).to.be.true;
      expect(supabaseStub.delete.calledOnce).to.be.true;
      expect(supabaseStub.eq.calledWith('id', 'report-123')).to.be.true;
    });

    it('should throw error for missing report ID', async () => {
      try {
        await plagiarismService.deletePlagiarismReport('');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Report ID is required');
      }
    });

    it('should handle database errors', async () => {
      supabaseStub.delete.resolves({ error: { message: 'Delete failed' } });

      try {
        await plagiarismService.deletePlagiarismReport('report-123');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Failed to delete plagiarism report');
      }
    });
  });
});