/**
 * i18n Configuration
 * 
 * Client-side internationalization using API-based translations
 * Supports: English, Arabic, Chinese, Japanese, German, Spanish
 */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const DEFAULT_LOCALE = 'en';
const STORAGE_KEY = 'locale';

// Store for current locale
export const locale = writable(DEFAULT_LOCALE);

// Store for translations
export const translations = writable({});

// Store for loading state
export const isLoading = writable(false);

/**
 * Get initial locale from localStorage or browser
 */
function getInitialLocale() {
  if (!browser) return DEFAULT_LOCALE;
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  
  const browserLang = navigator.language.split('-')[0];
  const supported = ['en', 'ar', 'zh', 'ja', 'de', 'es'];
  
  return supported.includes(browserLang) ? browserLang : DEFAULT_LOCALE;
}

/**
 * Load translations from API
 */
async function loadTranslations(localeCode) {
  isLoading.set(true);
  
  try {
    const response = await fetch(`/api/translations/${localeCode}`);
    const data = await response.json();
    
    if (data.translations) {
      translations.set(data.translations);
      if (browser) {
        localStorage.setItem(STORAGE_KEY, data.locale);
      }
    }
  } catch (error) {
    console.error('Failed to load translations:', error);
    // Fall back to English
    if (localeCode !== DEFAULT_LOCALE) {
      await loadTranslations(DEFAULT_LOCALE);
    }
  } finally {
    isLoading.set(false);
  }
}

/**
 * Initialize i18n
 */
export function initI18n() {
  const initialLocale = getInitialLocale();
  locale.set(initialLocale);
  loadTranslations(initialLocale);
  
  // Subscribe to locale changes
  locale.subscribe((newLocale) => {
    if (browser && newLocale) {
      loadTranslations(newLocale);
    }
  });
}

/**
 * Translation function
 * Gets nested value from translations object using dot notation
 * 
 * @param {string} key - Translation key (e.g., 'common.loading')
 * @param {Object} params - Optional parameters for interpolation
 * @returns {string} Translated text or key if not found
 */
export function t(key, params = {}) {
  let current = null;
  
  translations.subscribe(value => {
    current = value;
  })();
  
  const keys = key.split('.');
  let value = current;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  // Handle parameter interpolation
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }
  
  return value;
}

/**
 * Reactive translation store
 * Use this in Svelte components with $_ syntax
 */
export const _ = derived(
  [translations, locale],
  ([$translations]) => {
    return (key, params = {}) => {
      const keys = key.split('.');
      let value = $translations;
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key;
        }
      }
      
      if (typeof value === 'string' && Object.keys(params).length > 0) {
        return value.replace(/\{(\w+)\}/g, (match, param) => {
          return params[param] !== undefined ? params[param] : match;
        });
      }
      
      return value;
    };
  }
);