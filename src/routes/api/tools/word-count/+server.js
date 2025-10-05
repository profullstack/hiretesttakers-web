import { json } from '@sveltejs/kit';
import { countWords } from '$lib/services/tools.js';

export async function POST({ request }) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return json({ error: 'Text is required' }, { status: 400 });
    }

    const stats = countWords(text);

    return json({
      ...stats,
      success: true
    });
  } catch (error) {
    console.error('Word Count API Error:', error);
    return json({ error: error.message || 'Failed to count words' }, { status: 500 });
  }
}