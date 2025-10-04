/**
 * Theme Store
 * 
 * Manages light/dark theme state with localStorage persistence
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const THEME_KEY = 'theme';
const LIGHT = 'light';
const DARK = 'dark';

/**
 * Get initial theme from localStorage or system preference
 */
function getInitialTheme() {
  if (!browser) return LIGHT;
  
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === LIGHT || stored === DARK) {
    return stored;
  }
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return DARK;
  }
  
  return LIGHT;
}

/**
 * Create theme store
 */
function createThemeStore() {
  const { subscribe, set } = writable(getInitialTheme());
  
  return {
    subscribe,
    toggle: () => {
      const newTheme = getInitialTheme() === LIGHT ? DARK : LIGHT;
      if (browser) {
        localStorage.setItem(THEME_KEY, newTheme);
        document.documentElement.classList.toggle('dark', newTheme === DARK);
      }
      set(newTheme);
    },
    set: (theme) => {
      if (theme !== LIGHT && theme !== DARK) return;
      if (browser) {
        localStorage.setItem(THEME_KEY, theme);
        document.documentElement.classList.toggle('dark', theme === DARK);
      }
      set(theme);
    }
  };
}

export const theme = createThemeStore();
export { LIGHT, DARK };