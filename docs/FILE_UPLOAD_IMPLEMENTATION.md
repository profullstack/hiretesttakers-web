# File Upload Implementation

## Overview
This document describes the file upload functionality added to the test creation form at `/browse-tests/new`. Users can now upload supporting materials (notes, PDFs, DOCX, etc.) when posting a test.

## Components Created

### 1. Database Migration (`supabase/migrations/20251005100000_test_attachments.sql`)
- Created `test_attachments` table to store file metadata
- Created `test-attachments` storage bucket in Supabase Storage
- Implemented Row Level Security (RLS) policies for secure access
- Added indexes for performance optimization

**Table Schema:**
```sql
test_attachments (
  id UUID PRIMARY KEY,
  test_id UUID REFERENCES tests(id),
  file_name TEXT,
  file_path TEXT,
  file_size BIGINT,
  file_type TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ
)
```

### 2. File Upload Service (`src/lib/services/fileUpload.js`)
Comprehensive service module for handling file operations:

**Key Functions:**
- `validateFile(file)` - Validates file size and type
- `uploadFile(file, userId, testId)` - Uploads file to Supabase Storage
- `uploadMultipleFiles(files, userId, testId)` - Batch upload support
- `createAttachment(testId, fileData, userId)` - Creates database record
- `getTestAttachments(testId)` - Retrieves attachments for a test
- `deleteAttachment(attachmentId, userId)` - Removes file and record
- `formatFileSize(bytes)` - Formats file size for display
- `getFileExtension(fileName)` - Extracts file extension

**File Restrictions:**
- Maximum file size: 10MB per file
- Allowed types: PDF, DOCX, DOC, XLS, XLSX, TXT, CSV, JPEG, PNG, GIF, WEBP
- Maximum 5 files per test

### 3. FileUpload Component (`src/lib/components/FileUpload.svelte`)
Reusable Svelte component with drag-and-drop support:

**Features:**
- Drag and drop file upload
- Click to browse files
- Visual file list with icons
- File size display
- Remove file functionality
- Error handling and validation
- Responsive design
- Dark mode support

**Props:**
- `files` - Array of selected files (bindable)
- `maxFiles` - Maximum number of files (default: 5)
- `disabled` - Disable upload functionality

**Events:**
- `change` - Emitted when files are added or removed

### 4. Updated TestForm Component (`src/lib/components/TestForm.svelte`)
Enhanced test creation form with file upload:

**Changes:**
- Added FileUpload component integration
- Implemented file upload after test creation
- Added upload progress indicator
- Handles file upload errors gracefully
- Maintains existing form functionality

**Upload Flow:**
1. User fills out test form
2. User selects files (optional)
3. Form submits and creates test
4. Files are uploaded to Supabase Storage
5. Attachment records are created in database
6. User is redirected to test page

### 5. Enhanced Test Service (`src/lib/services/test.js`)
Added new function for retrieving tests with attachments:

**New Function:**
- `getTestWithAttachments(testId)` - Fetches test with related attachments using Supabase join

### 6. Test Suite (`tests/services/fileUpload.test.js`)
Comprehensive test coverage using Mocha and Chai:

**Test Coverage:**
- File validation (size, type)
- File path generation
- File size formatting
- File extension extraction
- Edge cases and error handling

## Usage

### In Test Creation Form
```svelte
<FileUpload
  bind:files
  on:change={handleFilesChange}
  disabled={loading}
  maxFiles={5}
/>
```

### Uploading Files
```javascript
import { uploadFile, createAttachment } from '$lib/services/fileUpload.js';

// Upload file
const fileData = await uploadFile(file, userId, testId);

// Create database record
await createAttachment(testId, fileData, userId);
```

### Retrieving Attachments
```javascript
import { getTestAttachments } from '$lib/services/fileUpload.js';

const attachments = await getTestAttachments(testId);
```

### Getting Test with Attachments
```javascript
import { getTestWithAttachments } from '$lib/services/test.js';

const test = await getTestWithAttachments(testId);
// test.test_attachments contains array of attachments
```

## Security

### Row Level Security (RLS)
- Public read access for attachments of open tests
- Only test owners can upload attachments
- Only test owners can delete their attachments
- Authenticated users required for all write operations

### Storage Policies
- Public read access to test-attachments bucket
- Authenticated users can upload files
- Users can only delete their own files

### File Validation
- Server-side file type validation
- File size limits enforced
- Sanitized file names to prevent path traversal

## Database Migration

To apply the migration:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration file
psql -h your-db-host -U postgres -d your-db -f supabase/migrations/20251005100000_test_attachments.sql
```

## Testing

Run the test suite:

```bash
# Run all tests
pnpm test

# Run file upload tests only
pnpm test tests/services/fileUpload.test.js
```

## Future Enhancements

Potential improvements for future iterations:

1. **File Preview** - Add preview functionality for images and PDFs
2. **Virus Scanning** - Integrate virus scanning for uploaded files
3. **Compression** - Automatic image compression for large files
4. **Progress Tracking** - Real-time upload progress for large files
5. **Bulk Operations** - Batch delete and download functionality
6. **File Versioning** - Support for updating/replacing files
7. **Access Control** - Fine-grained permissions for file access
8. **CDN Integration** - Use CDN for faster file delivery

## Troubleshooting

### Files Not Uploading
- Check Supabase Storage bucket exists
- Verify user authentication
- Check file size and type restrictions
- Review browser console for errors

### Permission Errors
- Ensure RLS policies are applied
- Verify user owns the test
- Check Supabase Storage policies

### Display Issues
- Clear browser cache
- Check CSS variable definitions
- Verify component imports

## API Reference

See [`src/lib/services/fileUpload.js`](../src/lib/services/fileUpload.js) for complete API documentation.

## Related Files

- Migration: `supabase/migrations/20251005100000_test_attachments.sql`
- Service: `src/lib/services/fileUpload.js`
- Component: `src/lib/components/FileUpload.svelte`
- Form: `src/lib/components/TestForm.svelte`
- Tests: `tests/services/fileUpload.test.js`