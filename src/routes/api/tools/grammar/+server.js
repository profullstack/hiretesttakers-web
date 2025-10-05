import { json } from '@sveltejs/kit';
import { checkGrammar } from '$lib/services/openai.js';

export async function POST({ request }) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return json({ error: 'Text is required' }, { status: 400 });
    }

    if (text.length > 5000) {
      return json({ error: 'Text is too long (max 5000 characters)' }, { status: 400 });
    }

    const result = await checkGrammar(text);

    return json({
      original: text,
      ...result,
      success: true
    });
  } catch (error) {
    console.error('Grammar Check API Error:', error);
    return json({ error: error.message || 'Failed to check grammar' }, { status: 500 });
  }
}