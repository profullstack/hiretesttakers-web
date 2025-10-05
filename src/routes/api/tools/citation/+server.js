import { json } from '@sveltejs/kit';
import {
  generateHarvardCitation,
  generateAPACitation,
  generateMLACitation,
  generateChicagoCitation
} from '$lib/services/tools.js';

export async function POST({ request }) {
  try {
    const { style, source } = await request.json();

    if (!style || !source) {
      return json({ error: 'Citation style and source information are required' }, { status: 400 });
    }

    const validStyles = ['harvard', 'apa', 'mla', 'chicago'];
    if (!validStyles.includes(style.toLowerCase())) {
      return json(
        { error: `Invalid citation style. Must be one of: ${validStyles.join(', ')}` },
        { status: 400 }
      );
    }

    let citation;
    switch (style.toLowerCase()) {
      case 'harvard':
        citation = generateHarvardCitation(source);
        break;
      case 'apa':
        citation = generateAPACitation(source);
        break;
      case 'mla':
        citation = generateMLACitation(source);
        break;
      case 'chicago':
        citation = generateChicagoCitation(source);
        break;
    }

    return json({
      style,
      citation,
      source,
      success: true
    });
  } catch (error) {
    console.error('Citation Generator API Error:', error);
    return json({ error: error.message || 'Failed to generate citation' }, { status: 500 });
  }
}