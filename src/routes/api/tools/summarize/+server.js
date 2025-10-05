import { json } from '@sveltejs/kit';
import { summarizeText } from '$lib/services/openai.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function POST({ request }) {
  try {
    const contentType = request.headers.get('content-type');
    let text = '';

    // Handle PDF file upload
    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof File)) {
        return json({ error: 'PDF file is required' }, { status: 400 });
      }

      if (!file.name.toLowerCase().endsWith('.pdf')) {
        return json({ error: 'Only PDF files are supported' }, { status: 400 });
      }

      if (file.size > 10 * 1024 * 1024) {
        return json({ error: 'File size must be less than 10MB' }, { status: 400 });
      }

      // Convert file to buffer and extract text
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdfParse(buffer);
      text = pdfData.text;

      if (!text || text.trim().length === 0) {
        return json({ error: 'Could not extract text from PDF' }, { status: 400 });
      }
    } else {
      // Handle plain text input
      const body = await request.json();
      text = body.text;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return json({ error: 'Text is required' }, { status: 400 });
      }
    }

    if (text.length > 50000) {
      return json({ error: 'Text is too long (max 50000 characters)' }, { status: 400 });
    }

    const summary = await summarizeText(text);

    return json({
      summary,
      originalLength: text.length,
      success: true
    });
  } catch (error) {
    console.error('Summarize API Error:', error);
    return json({ error: error.message || 'Failed to summarize text' }, { status: 500 });
  }
}