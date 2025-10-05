/**
 * File Upload Service
 * 
 * Service for managing file uploads to Supabase Storage and tracking attachments.
 * Supports various file types including PDFs, DOCX, images, and text files.
 */

import { getSupabaseClient } from '../supabaseClient.js';

const supabase = getSupabaseClient();

const BUCKET_NAME = 'test-attachments';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

/**
 * Validate file before upload
 * @param {File} file - File to validate
 * @returns {Object} Validation result with isValid and error
 */
export function validateFile(file) {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'File type not allowed. Supported types: PDF, DOCX, DOC, XLS, XLSX, TXT, CSV, and images' 
    };
  }

  return { isValid: true };
}

/**
 * Generate unique file path for storage
 * @param {string} userId - User ID
 * @param {string} testId - Test ID
 * @param {string} fileName - Original file name
 * @returns {string} Unique file path
 */
export function generateFilePath(userId, testId, fileName) {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${userId}/${testId}/${timestamp}_${sanitizedFileName}`;
}

/**
 * Upload file to Supabase Storage
 * @param {File} file - File to upload
 * @param {string} userId - User ID
 * @param {string} testId - Test ID (optional, can be 'temp' for pre-test creation)
 * @returns {Promise<Object>} Upload result with path and publicUrl
 */
export async function uploadFile(file, userId, testId = 'temp') {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const filePath = generateFilePath(userId, testId, file.name);

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return {
    path: data.path,
    publicUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type
  };
}

/**
 * Upload multiple files
 * @param {FileList|Array<File>} files - Files to upload
 * @param {string} userId - User ID
 * @param {string} testId - Test ID
 * @returns {Promise<Array<Object>>} Array of upload results
 */
export async function uploadMultipleFiles(files, userId, testId = 'temp') {
  const fileArray = Array.from(files);
  const uploadPromises = fileArray.map(file => uploadFile(file, userId, testId));
  
  try {
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Failed to upload files: ${error.message}`);
  }
}

/**
 * Delete file from storage
 * @param {string} filePath - Path to file in storage
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteFile(filePath) {
  if (!filePath) {
    throw new Error('File path is required');
  }

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }

  return true;
}

/**
 * Create attachment record in database
 * @param {string} testId - Test ID
 * @param {Object} fileData - File data from upload
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Created attachment record
 */
export async function createAttachment(testId, fileData, userId) {
  if (!testId || testId === 'temp') {
    throw new Error('Valid test ID is required');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  const { data, error } = await supabase
    .from('test_attachments')
    .insert({
      test_id: testId,
      file_name: fileData.fileName,
      file_path: fileData.path,
      file_size: fileData.fileSize,
      file_type: fileData.fileType,
      uploaded_by: userId
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create attachment record: ${error.message}`);
  }

  return data;
}

/**
 * Get attachments for a test
 * @param {string} testId - Test ID
 * @returns {Promise<Array<Object>>} Array of attachments
 */
export async function getTestAttachments(testId) {
  if (!testId) {
    throw new Error('Test ID is required');
  }

  const { data, error } = await supabase
    .from('test_attachments')
    .select('*')
    .eq('test_id', testId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to get attachments: ${error.message}`);
  }

  return data || [];
}

/**
 * Delete attachment (both file and database record)
 * @param {string} attachmentId - Attachment ID
 * @param {string} userId - User ID (for authorization)
 * @returns {Promise<boolean>} True if deleted successfully
 */
export async function deleteAttachment(attachmentId, userId) {
  if (!attachmentId) {
    throw new Error('Attachment ID is required');
  }

  if (!userId) {
    throw new Error('User ID is required');
  }

  // Get attachment to verify ownership and get file path
  const { data: attachment, error: fetchError } = await supabase
    .from('test_attachments')
    .select('*, tests!inner(hirer_id)')
    .eq('id', attachmentId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to get attachment: ${fetchError.message}`);
  }

  if (!attachment) {
    throw new Error('Attachment not found');
  }

  // Verify user owns the test
  if (attachment.tests.hirer_id !== userId) {
    throw new Error('Not authorized to delete this attachment');
  }

  // Delete file from storage
  await deleteFile(attachment.file_path);

  // Delete database record
  const { error: deleteError } = await supabase
    .from('test_attachments')
    .delete()
    .eq('id', attachmentId);

  if (deleteError) {
    throw new Error(`Failed to delete attachment record: ${deleteError.message}`);
  }

  return true;
}

/**
 * Get public URL for a file
 * @param {string} filePath - File path in storage
 * @returns {string} Public URL
 */
export function getFileUrl(filePath) {
  if (!filePath) {
    throw new Error('File path is required');
  }

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 * @param {string} fileName - File name
 * @returns {string} File extension
 */
export function getFileExtension(fileName) {
  return fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2);
}