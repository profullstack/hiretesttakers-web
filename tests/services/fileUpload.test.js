/**
 * File Upload Service Tests
 * 
 * Tests for file upload functionality using Mocha and Chai
 */

import { expect } from 'chai';
import {
  validateFile,
  generateFilePath,
  formatFileSize,
  getFileExtension
} from '../../src/lib/services/fileUpload.js';

describe('File Upload Service', () => {
  describe('validateFile', () => {
    it('should return error when no file is provided', () => {
      const result = validateFile(null);
      expect(result.isValid).to.be.false;
      expect(result.error).to.equal('No file provided');
    });

    it('should return error when file size exceeds maximum', () => {
      const largeFile = {
        size: 11 * 1024 * 1024, // 11MB
        type: 'application/pdf'
      };
      const result = validateFile(largeFile);
      expect(result.isValid).to.be.false;
      expect(result.error).to.include('exceeds maximum');
    });

    it('should return error when file type is not allowed', () => {
      const invalidFile = {
        size: 1024,
        type: 'application/x-executable'
      };
      const result = validateFile(invalidFile);
      expect(result.isValid).to.be.false;
      expect(result.error).to.include('not allowed');
    });

    it('should validate PDF files', () => {
      const pdfFile = {
        size: 1024 * 1024, // 1MB
        type: 'application/pdf'
      };
      const result = validateFile(pdfFile);
      expect(result.isValid).to.be.true;
    });

    it('should validate DOCX files', () => {
      const docxFile = {
        size: 1024 * 1024,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
      const result = validateFile(docxFile);
      expect(result.isValid).to.be.true;
    });

    it('should validate image files', () => {
      const imageFile = {
        size: 1024 * 1024,
        type: 'image/jpeg'
      };
      const result = validateFile(imageFile);
      expect(result.isValid).to.be.true;
    });

    it('should validate text files', () => {
      const textFile = {
        size: 1024,
        type: 'text/plain'
      };
      const result = validateFile(textFile);
      expect(result.isValid).to.be.true;
    });
  });

  describe('generateFilePath', () => {
    it('should generate a unique file path', () => {
      const userId = 'user123';
      const testId = 'test456';
      const fileName = 'document.pdf';

      const path = generateFilePath(userId, testId, fileName);

      expect(path).to.include(userId);
      expect(path).to.include(testId);
      expect(path).to.include('document.pdf');
    });

    it('should sanitize file names with special characters', () => {
      const userId = 'user123';
      const testId = 'test456';
      const fileName = 'my document (1).pdf';

      const path = generateFilePath(userId, testId, fileName);

      expect(path).to.include('my_document__1_.pdf');
    });

    it('should include timestamp in path', () => {
      const userId = 'user123';
      const testId = 'test456';
      const fileName = 'document.pdf';

      const path1 = generateFilePath(userId, testId, fileName);
      const path2 = generateFilePath(userId, testId, fileName);

      // Paths should be different due to timestamp
      expect(path1).to.not.equal(path2);
    });
  });

  describe('formatFileSize', () => {
    it('should format 0 bytes', () => {
      expect(formatFileSize(0)).to.equal('0 Bytes');
    });

    it('should format bytes', () => {
      expect(formatFileSize(500)).to.equal('500 Bytes');
    });

    it('should format kilobytes', () => {
      expect(formatFileSize(1024)).to.equal('1 KB');
      expect(formatFileSize(1536)).to.equal('1.5 KB');
    });

    it('should format megabytes', () => {
      expect(formatFileSize(1024 * 1024)).to.equal('1 MB');
      expect(formatFileSize(1.5 * 1024 * 1024)).to.equal('1.5 MB');
    });

    it('should format gigabytes', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).to.equal('1 GB');
    });

    it('should round to 2 decimal places', () => {
      expect(formatFileSize(1234567)).to.equal('1.18 MB');
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('document.pdf')).to.equal('pdf');
      expect(getFileExtension('image.jpg')).to.equal('jpg');
      expect(getFileExtension('data.csv')).to.equal('csv');
    });

    it('should handle files with multiple dots', () => {
      expect(getFileExtension('my.document.pdf')).to.equal('pdf');
    });

    it('should handle files without extension', () => {
      expect(getFileExtension('README')).to.equal('');
    });

    it('should handle hidden files', () => {
      expect(getFileExtension('.gitignore')).to.equal('gitignore');
    });
  });
});