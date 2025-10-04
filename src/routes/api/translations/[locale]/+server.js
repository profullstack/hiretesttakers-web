/**
 * Translation API Endpoint
 * 
 * Returns translation data for the requested locale.
 * Falls back to English if locale not found.
 */

import { json } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import { join } from 'path';

const LOCALES_DIR = join(process.cwd(), 'src/lib/i18n/locales');
const DEFAULT_LOCALE = 'en';

/**
 * GET /api/translations/[locale]
 * Returns translation data for the specified locale
 */
export async function GET({ params }) {
  const { locale } = params;
  
  try {
    // Try to load the requested locale
    const filePath = join(LOCALES_DIR, `${locale}.json`);
    const data = await readFile(filePath, 'utf-8');
    const translations = JSON.parse(data);
    
    return json({
      locale,
      translations
    });
  } catch (error) {
    // If locale not found, fall back to English
    if (locale !== DEFAULT_LOCALE) {
      try {
        const fallbackPath = join(LOCALES_DIR, `${DEFAULT_LOCALE}.json`);
        const data = await readFile(fallbackPath, 'utf-8');
        const translations = JSON.parse(data);
        
        return json({
          locale: DEFAULT_LOCALE,
          translations,
          fallback: true
        });
      } catch (fallbackError) {
        return json(
          { error: 'Translation files not found' },
          { status: 500 }
        );
      }
    }
    
    return json(
      { error: `Locale '${locale}' not found` },
      { status: 404 }
    );
  }
}