import { json } from '@sveltejs/kit';
import { generateEssay } from '$lib/services/openai.js';

export async function POST({ request }) {
  try {
    const { topic, wordCount } = await request.json();

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return json({ error: 'Topic is required' }, { status: 400 });
    }

    const targetWordCount = wordCount && !isNaN(wordCount) ? parseInt(wordCount) : 500;

    if (targetWordCount < 100 || targetWordCount > 2000) {
      return json({ error: 'Word count must be between 100 and 2000' }, { status: 400 });
    }

    const essay = await generateEssay(topic, targetWordCount);

    return json({
      topic,
      essay,
      wordCount: targetWordCount,
      success: true
    });
  } catch (error) {
    console.error('Essay Generator API Error:', error);
    return json({ error: error.message || 'Failed to generate essay' }, { status: 500 });
  }
}