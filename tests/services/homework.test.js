/**
 * Homework Service Tests
 * 
 * Tests for homework help service using Supabase.
 * Uses Mocha and Chai for testing.
 */

import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import {
  createHomeworkRequest,
  getHomeworkRequests,
  getHomeworkRequestById,
  updateHomeworkRequest,
  deleteHomeworkRequest,
  uploadHomeworkFiles,
  getSubjects,
  getHomeworkRequestsBySubject,
  getHomeworkRequestsByDifficulty
} from '../../src/lib/services/homework.js';

describe('Homework Service', () => {
  describe('getSubjects', () => {
    it('should return list of subjects', async () => {
      const subjects = await getSubjects();
      expect(subjects).to.be.an('array');
      expect(subjects.length).to.be.greaterThan(0);
      expect(subjects[0]).to.have.property('id');
      expect(subjects[0]).to.have.property('name');
    });

    it('should include default subjects', async () => {
      const subjects = await getSubjects();
      const subjectNames = subjects.map(s => s.name);
      expect(subjectNames).to.include('Mathematics');
      expect(subjectNames).to.include('Science');
      expect(subjectNames).to.include('English');
    });
  });

  describe('createHomeworkRequest', () => {
    it('should throw error if user_id is missing', async () => {
      try {
        await createHomeworkRequest({
          subject_id: 'some-id',
          title: 'Test',
          description: 'Test description',
          difficulty_level: 'high_school',
          deadline: new Date().toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('User ID is required');
      }
    });

    it('should throw error if subject_id is missing', async () => {
      try {
        await createHomeworkRequest({
          user_id: 'user-id',
          title: 'Test',
          description: 'Test description',
          difficulty_level: 'high_school',
          deadline: new Date().toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Subject ID is required');
      }
    });

    it('should throw error if title is missing', async () => {
      try {
        await createHomeworkRequest({
          user_id: 'user-id',
          subject_id: 'subject-id',
          description: 'Test description',
          difficulty_level: 'high_school',
          deadline: new Date().toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Title is required');
      }
    });

    it('should throw error if description is missing', async () => {
      try {
        await createHomeworkRequest({
          user_id: 'user-id',
          subject_id: 'subject-id',
          title: 'Test',
          difficulty_level: 'high_school',
          deadline: new Date().toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Description is required');
      }
    });

    it('should throw error if difficulty_level is invalid', async () => {
      try {
        await createHomeworkRequest({
          user_id: 'user-id',
          subject_id: 'subject-id',
          title: 'Test',
          description: 'Test description',
          difficulty_level: 'invalid',
          deadline: new Date().toISOString(),
          fixed_price: 50
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid difficulty level');
      }
    });

    it('should throw error if deadline is missing', async () => {
      try {
        await createHomeworkRequest({
          user_id: 'user-id',
          subject_id: 'subject-id',
          title: 'Test',
          description: 'Test description',
          difficulty_level: 'high_school',
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
        await createHomeworkRequest({
          user_id: 'user-id',
          subject_id: 'subject-id',
          title: 'Test',
          description: 'Test description',
          difficulty_level: 'high_school',
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
        await createHomeworkRequest({
          user_id: 'user-id',
          subject_id: 'subject-id',
          title: 'Test',
          description: 'Test description',
          difficulty_level: 'high_school',
          deadline: new Date(Date.now() + 86400000).toISOString()
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Either fixed price or price range is required');
      }
    });

    it('should throw error if both fixed_price and price range are provided', async () => {
      try {
        await createHomeworkRequest({
          user_id: 'user-id',
          subject_id: 'subject-id',
          title: 'Test',
          description: 'Test description',
          difficulty_level: 'high_school',
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
        await createHomeworkRequest({
          user_id: 'user-id',
          subject_id: 'subject-id',
          title: 'Test',
          description: 'Test description',
          difficulty_level: 'high_school',
          deadline: new Date(Date.now() + 86400000).toISOString(),
          price_min: 70,
          price_max: 30
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Minimum price cannot be greater than maximum price');
      }
    });

    it('should create homework request with fixed price', async () => {
      const result = await createHomeworkRequest({
        user_id: 'user-id',
        subject_id: 'subject-id',
        title: 'Algebra Homework',
        description: 'Need help with quadratic equations',
        difficulty_level: 'high_school',
        deadline: new Date(Date.now() + 86400000).toISOString(),
        fixed_price: 50
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('title', 'Algebra Homework');
      expect(result).to.have.property('fixed_price', 50);
      expect(result).to.have.property('status', 'open');
    });

    it('should create homework request with price range', async () => {
      const result = await createHomeworkRequest({
        user_id: 'user-id',
        subject_id: 'subject-id',
        title: 'Chemistry Lab Report',
        description: 'Need help writing lab report',
        difficulty_level: 'undergraduate',
        deadline: new Date(Date.now() + 172800000).toISOString(),
        price_min: 30,
        price_max: 70
      });

      expect(result).to.have.property('id');
      expect(result).to.have.property('price_min', 30);
      expect(result).to.have.property('price_max', 70);
      expect(result.fixed_price).to.be.null;
    });
  });

  describe('getHomeworkRequests', () => {
    it('should return list of homework requests', async () => {
      const requests = await getHomeworkRequests();
      expect(requests).to.be.an('array');
    });

    it('should filter by status', async () => {
      const requests = await getHomeworkRequests({ status: 'open' });
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.status).to.equal('open');
      });
    });

    it('should filter by difficulty level', async () => {
      const requests = await getHomeworkRequests({ difficulty_level: 'high_school' });
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.difficulty_level).to.equal('high_school');
      });
    });

    it('should limit results', async () => {
      const requests = await getHomeworkRequests({ limit: 5 });
      expect(requests).to.be.an('array');
      expect(requests.length).to.be.at.most(5);
    });
  });

  describe('getHomeworkRequestById', () => {
    it('should throw error if id is missing', async () => {
      try {
        await getHomeworkRequestById();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Homework request ID is required');
      }
    });

    it('should return homework request by id', async () => {
      const request = await getHomeworkRequestById('valid-id');
      expect(request).to.have.property('id');
      expect(request).to.have.property('title');
      expect(request).to.have.property('description');
    });

    it('should return null for non-existent id', async () => {
      const request = await getHomeworkRequestById('non-existent-id');
      expect(request).to.be.null;
    });
  });

  describe('updateHomeworkRequest', () => {
    it('should throw error if id is missing', async () => {
      try {
        await updateHomeworkRequest(null, { title: 'Updated' });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Homework request ID is required');
      }
    });

    it('should throw error if no update data provided', async () => {
      try {
        await updateHomeworkRequest('valid-id', {});
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('No update data provided');
      }
    });

    it('should update homework request title', async () => {
      const result = await updateHomeworkRequest('valid-id', {
        title: 'Updated Title'
      });
      expect(result).to.have.property('title', 'Updated Title');
    });

    it('should update homework request status', async () => {
      const result = await updateHomeworkRequest('valid-id', {
        status: 'in_progress'
      });
      expect(result).to.have.property('status', 'in_progress');
    });

    it('should throw error for invalid status', async () => {
      try {
        await updateHomeworkRequest('valid-id', {
          status: 'invalid_status'
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid status');
      }
    });
  });

  describe('deleteHomeworkRequest', () => {
    it('should throw error if id is missing', async () => {
      try {
        await deleteHomeworkRequest();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Homework request ID is required');
      }
    });

    it('should delete homework request', async () => {
      const result = await deleteHomeworkRequest('valid-id');
      expect(result).to.be.true;
    });
  });

  describe('uploadHomeworkFiles', () => {
    it('should throw error if request_id is missing', async () => {
      try {
        await uploadHomeworkFiles(null, []);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Homework request ID is required');
      }
    });

    it('should throw error if files array is empty', async () => {
      try {
        await uploadHomeworkFiles('valid-id', []);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('At least one file is required');
      }
    });

    it('should upload files successfully', async () => {
      const files = [
        {
          file_name: 'homework.pdf',
          file_path: '/uploads/homework.pdf',
          file_size: 1024,
          file_type: 'application/pdf'
        }
      ];
      const result = await uploadHomeworkFiles('valid-id', files);
      expect(result).to.be.an('array');
      expect(result[0]).to.have.property('file_name', 'homework.pdf');
    });

    it('should validate file types', async () => {
      try {
        const files = [
          {
            file_name: 'malware.exe',
            file_path: '/uploads/malware.exe',
            file_size: 1024,
            file_type: 'application/x-msdownload'
          }
        ];
        await uploadHomeworkFiles('valid-id', files);
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid file type');
      }
    });
  });

  describe('getHomeworkRequestsBySubject', () => {
    it('should throw error if subject_id is missing', async () => {
      try {
        await getHomeworkRequestsBySubject();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Subject ID is required');
      }
    });

    it('should return requests for specific subject', async () => {
      const requests = await getHomeworkRequestsBySubject('subject-id');
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.subject_id).to.equal('subject-id');
      });
    });
  });

  describe('getHomeworkRequestsByDifficulty', () => {
    it('should throw error if difficulty_level is missing', async () => {
      try {
        await getHomeworkRequestsByDifficulty();
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Difficulty level is required');
      }
    });

    it('should throw error for invalid difficulty level', async () => {
      try {
        await getHomeworkRequestsByDifficulty('invalid');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).to.include('Invalid difficulty level');
      }
    });

    it('should return requests for specific difficulty', async () => {
      const requests = await getHomeworkRequestsByDifficulty('high_school');
      expect(requests).to.be.an('array');
      requests.forEach(req => {
        expect(req.difficulty_level).to.equal('high_school');
      });
    });
  });
});