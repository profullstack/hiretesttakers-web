import { json } from '@sveltejs/kit';
import { summarizeText } from '$lib/services/openai.js';

export async function POST({ request }) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return json({ error: 'Text is required' }, { status: 400 });
    }

    if (text.length > 10000) {
      return json({ error: 'Text is too long (max 10000 characters)' }, { status: 400 });
    }

    const summary = await summarizeText(text);

    return json({
      original: text,
      summary,
      success: true
    });
  } catch (error) {
    console.error('Summarize API Error:', error);
    return json({ error: error.message || 'Failed to summarize text' }, { status: 500 });
  }
}