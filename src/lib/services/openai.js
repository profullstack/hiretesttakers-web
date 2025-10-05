import { OPENAI_API_KEY } from '$env/static/private';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

/**
 * Call OpenAI API with a system prompt and user message
 * @param {string} systemPrompt - The system instruction
 * @param {string} userMessage - The user's input
 * @param {number} maxTokens - Maximum tokens for response
 * @returns {Promise<string>} The AI response
 */
export async function callOpenAI(systemPrompt, userMessage, maxTokens = 1000) {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to process request: ${error.message}`);
  }
}

/**
 * Paraphrase text using OpenAI
 * @param {string} text - Text to paraphrase
 * @returns {Promise<string>} Paraphrased text
 */
export async function paraphraseText(text) {
  const systemPrompt =
    'You are a professional paraphrasing assistant. Rewrite the given text in a completely different way while maintaining the original meaning. Use different sentence structures, synonyms, and phrasing.';
  return callOpenAI(systemPrompt, text, 1500);
}

/**
 * Check grammar and provide corrections
 * @param {string} text - Text to check
 * @returns {Promise<object>} Grammar check results with corrections
 */
export async function checkGrammar(text) {
  const systemPrompt =
    'You are a grammar checking assistant. Analyze the text for grammatical errors, spelling mistakes, and punctuation issues. Return a JSON object with: { "hasErrors": boolean, "corrections": [{ "original": string, "corrected": string, "explanation": string }], "correctedText": string }';
  const response = await callOpenAI(systemPrompt, text, 2000);

  try {
    return JSON.parse(response);
  } catch {
    return {
      hasErrors: false,
      corrections: [],
      correctedText: text
    };
  }
}

/**
 * Summarize PDF text content
 * @param {string} text - Text to summarize
 * @returns {Promise<string>} Summary
 */
export async function summarizeText(text) {
  const systemPrompt =
    'You are a professional summarization assistant. Create a concise, well-structured summary of the given text, capturing all key points and main ideas.';
  return callOpenAI(systemPrompt, text, 1000);
}

/**
 * Generate essay content on a topic
 * @param {string} topic - Essay topic
 * @param {number} wordCount - Desired word count
 * @returns {Promise<string>} Generated essay
 */
export async function generateEssay(topic, wordCount = 500) {
  const systemPrompt = `You are an academic essay writing assistant. Write a well-structured essay of approximately ${wordCount} words on the given topic. Include an introduction, body paragraphs with supporting arguments, and a conclusion.`;
  return callOpenAI(systemPrompt, topic, Math.ceil(wordCount * 1.5));
}