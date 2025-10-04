/**
 * Programming Service Tests
 * 
 * Tests for programming help service using Supabase.
 * Uses Mocha and Chai for testing.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  createProgrammingRequest,
  getProgrammingRequests,
  getProgrammingRequestById,
  updateProgrammingRequest,
  deleteProgrammingRequest,
  submitCode,
  getCodeSubmission,
  getProgrammingLanguages,
  getProgrammingRequestsByLanguage,
  getProgrammingRequestsByProjectType
} from '../../src/lib/services/programming.js';

describe('Programming Service', () => {
  describe('getProgrammingLanguages', () => {
    it('should return list of programming languages', async () => {
      const languages = await getProgrammingLanguages();
      expect(languages).to.be.an('array');
      expect(languages.length).to.be.greaterThan(0);
      expect(languages[0]).to.have.property('id');
      expect(languages[0]).to.have.property('name');
    });

    it('should include default programming languages', async () => {
      const languages = await getProgrammingLanguages();
      const languageNames = languages.map(l => l.name);
      expect(languageNames).to.include('Python');
      expect(languageNames).to.include('JavaScript');
      expect(languageNames).to.include('Java');
    });
  });

  describe('createProgrammingRequest', () => {
    it('should throw error if user_id is missing', async () => {
      try {
        await createProgrammingRequest({
          language_id: 'some-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'homework',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should throw error if language_id is missing', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'homework',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Language ID is required');
      }
    });

    it('should throw error if title is missing', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          description: 'Test description',
          project_type: 'homework',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Title is required');
      }
    });

    it('should throw error if description is missing', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          title: 'Test',
          project_type: 'homework',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Description is required');
      }
    });

    it('should throw error if project_type is invalid', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'invalid',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid project type');
      }
    });

    it('should throw error if deadline is missing', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'homework',
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Deadline is required');
      }
    });

    it('should throw error if deadline is in the past', async () => {
      try {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 1);
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'homework',
          deadline: pastDate.toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Deadline must be in the future');
      }
    });

    it('should throw error if neither fixed_price nor price range is provided', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'homework',
          deadline: new Date(Date.now() + 86400000).toISOString()
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Either fixed price or price range is required');
      }
    });

    it('should throw error if both fixed_price and price range are provided', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'homework',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          fixed_price: 50,
          price_min: 30,
          price_max: 70
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Cannot specify both fixed price and price range');
      }
    });

    it('should throw error if price_min is greater than price_max', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'homework',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          price_min: 70,
          price_max: 30
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Minimum price cannot be greater than maximum price');
      }
    });

    it('should throw error for invalid urgency level', async () => {
      try {
        await createProgrammingRequest({
          user_id: 'user-id',
          language_id: 'language-id',
          title: 'Test',
          description: 'Test description',
          project_type: 'homework',
          urgency: 'invalid',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid urgency level');
      }
    });

    it('should create programming request with fixed price', async () => {
      const result = await createProgrammingRequest({
        user_id: 'user-id',
        language_id: 'language-id',
        title: 'Python Debugging Help',
        description: 'Need help debugging my Python script',
        project_type: 'debugging',
        deadline: new Date(Date.now() + 86400000).toISOString(),
        fixed_price: 75
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('title', 'Python Debugging Help');
      expect(result).to.have.property('fixed_price', 75);
      expect(result).to.have.property('status', 'open');
      expect(result).to.have.property('project_type', 'debugging');
    });

    it('should create programming request with price range', async () => {
      const result = await createProgrammingRequest({
        user_id: 'user-id',
        language_id: 'language-id',
        title: 'Java Mini Project',
        description: 'Need help building a simple Java application',
        project_type: 'mini_project',
        urgency: 'urgent',
        deadline: new Date(Date.now() + 172800000).toISOString(),
        price_min: 100,
        price_max: 200
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('price_min', 100);
      expect(result).to.have.property('price_max', 200);
      expect(result).to.have.property('urgency', 'urgent');
      expect(result.fixed_price).to.be.null;
    });

    it('should create request with debugging and optimization flags', async () => {
      const result = await createProgrammingRequest({
        user_id: 'user-id',
        language_id: 'language-id',
        title: 'Code Review and Optimization',
        description: 'Need code review and performance optimization',
        project_type: 'code_review',
        requires_debugging: true,
        requires_optimization: true,
        deadline: new Date(Date.now() + 86400000).toISOString(),
        fixed_price: 150
      });

      expect(result).to.have.property('requires_debugging', true);
      expect(result).to.have.property('requires_optimization', true);
    });
  });

  describe('getProgrammingRequests', () => {
    it('should return list of programming requests', async () => {
      const requests = await getProgrammingRequests();
      expect(requests).to.be.an('array');
    });

    it('should filter by status', async () => {
      const requests = await getProgrammingRequests({ status: 'open' });
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.status).to.equal('open');
      });
    });

    it('should filter by project type', async () => {
      const requests = await getProgrammingRequests({ project_type: 'debugging' });
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.project_type).to.equal('debugging');
      });
    });

    it('should filter by urgency', async () => {
      const requests = await getProgrammingRequests({ urgency: 'urgent' });
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.urgency).to.equal('urgent');
      });
    });

    it('should limit results', async () => {
      const requests = await getProgrammingRequests({ limit: 5 });
      expect(requests).to.be.an('array');
      expect(requests.length).to.be.at.most(5);
    });
  });

  describe('getProgrammingRequestById', () => {
    it('should throw error if id is missing', async () => {
      try {
        await getProgrammingRequestById();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Programming request ID is required');
      }
    });

    it('should return programming request by id', async () => {
      const request = await getProgrammingRequestById('valid-id');
      expect(request).to.have.property('id');
      expect(request).to.have.property('title');
      expect(request).to.have.property('description');
    });

    it('should return null for non-existent id', async () => {
      const request = await getProgrammingRequestById('non-existent-id');
      expect(request).to.be.null;
    });
  });

  describe('updateProgrammingRequest', () => {
    it('should throw error if id is missing', async () => {
      try {
        await updateProgrammingRequest(null, { title: 'Updated' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Programming request ID is required');
      }
    });

    it('should throw error if no update data provided', async () => {
      try {
        await updateProgrammingRequest('valid-id', {});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('No update data provided');
      }
    });

    it('should update programming request title', async () => {
      const result = await updateProgrammingRequest('valid-id', {
        title: 'Updated Title'
      });
      expect(result).to.have.property('title', 'Updated Title');
    });

    it('should update programming request status', async () => {
      const result = await updateProgrammingRequest('valid-id', {
        status: 'in_progress'
      });
      expect(result).to.have.property('status', 'in_progress');
    });

    it('should throw error for invalid status', async () => {
      try {
        await updateProgrammingRequest('valid-id', {
          status: 'invalid_status'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid status');
      }
    });
  });

  describe('deleteProgrammingRequest', () => {
    it('should throw error if id is missing', async () => {
      try {
        await deleteProgrammingRequest();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Programming request ID is required');
      }
    });

    it('should delete programming request', async () => {
      const result = await deleteProgrammingRequest('valid-id');
      expect(result).to.be.true;
    });
  });

  describe('submitCode', () => {
    it('should throw error if request_id is missing', async () => {
      try {
        await submitCode(null, 'user-id', 'code content');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Programming request ID is required');
      }
    });

    it('should throw error if submitted_by is missing', async () => {
      try {
        await submitCode('request-id', null, 'code content');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should throw error if code_content is missing', async () => {
      try {
        await submitCode('request-id', 'user-id', '');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Code content is required');
      }
    });

    it('should submit code successfully', async () => {
      const result = await submitCode('request-id', 'user-id', 'console.log("Hello World");');
      expect(result).to.have.property('id');
      expect(result).to.have.property('code_content');
      expect(result).to.have.property('programming_request_id', 'request-id');
    });

    it('should submit code with annotations', async () => {
      const annotations = {
        line_comments: {
          1: 'This is the main function',
          5: 'Fixed the bug here'
        }
      };
      const result = await submitCode(
        'request-id',
        'user-id',
        'def main():\n    print("Hello")',
        annotations
      );
      expect(result).to.have.property('annotations');
      expect(result.annotations).to.deep.equal(annotations);
    });

    it('should submit code with quality score', async () => {
      const result = await submitCode(
        'request-id',
        'user-id',
        'clean code here',
        null,
        95
      );
      expect(result).to.have.property('quality_score', 95);
    });

    it('should throw error for invalid quality score', async () => {
      try {
        await submitCode('request-id', 'user-id', 'code', null, 150);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Quality score must be between 0 and 100');
      }
    });
  });

  describe('getCodeSubmission', () => {
    it('should throw error if request_id is missing', async () => {
      try {
        await getCodeSubmission();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Programming request ID is required');
      }
    });

    it('should return code submission for request', async () => {
      const submission = await getCodeSubmission('request-id');
      expect(submission).to.have.property('code_content');
      expect(submission).to.have.property('programming_request_id');
    });

    it('should return null if no submission exists', async () => {
      const submission = await getCodeSubmission('non-existent-request');
      expect(submission).to.be.null;
    });
  });

  describe('getProgrammingRequestsByLanguage', () => {
    it('should throw error if language_id is missing', async () => {
      try {
        await getProgrammingRequestsByLanguage();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Language ID is required');
      }
    });

    it('should return requests for specific language', async () => {
      const requests = await getProgrammingRequestsByLanguage('language-id');
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.language_id).to.equal('language-id');
      });
    });
  });

  describe('getProgrammingRequestsByProjectType', () => {
    it('should throw error if project_type is missing', async () => {
      try {
        await getProgrammingRequestsByProjectType();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Project type is required');
      }
    });

    it('should throw error for invalid project type', async () => {
      try {
        await getProgrammingRequestsByProjectType('invalid');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid project type');
      }
    });

    it('should return requests for specific project type', async () => {
      const requests = await getProgrammingRequestsByProjectType('debugging');
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.project_type).to.equal('debugging');
      });
    });
  });
});