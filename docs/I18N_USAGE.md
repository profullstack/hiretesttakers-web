# Internationalization (i18n) Usage Guide

This document explains how to use the translation system in the TutorLinkup platform.

## Overview

The platform uses an API-based translation system that:
- Loads translations dynamically from the server
- Supports 6 languages: English, Spanish, German, Arabic, Chinese, Japanese
- Falls back to English if a translation is missing
- Stores user's language preference in localStorage

## Architecture

```
Client Request → API Endpoint → JSON Files → Client Store → Components
```

### Components

1. **API Endpoint**: `/api/translations/[locale]` - Serves translation JSON files
2. **i18n Store**: `src/lib/i18n/index.js` - Manages translations and locale
3. **Translation Files**: `src/lib/i18n/locales/*.json` - Contains all translations
4. **Components**: Use `$_` function to access translations

## Usage in Components

### Basic Usage

```svelte
<script>
  import { _ } from '$lib/i18n';
</script>

<h1>{$_('nav.home')}</h1>
<button>{$_('common.save')}</button>
<p>{$_('auth.emailRequired')}</p>
```

### With Parameters

```svelte
<script>
  import { _ } from '$lib/i18n';
  let username = 'John';
</script>

<!-- Translation: "Welcome, {name}!" -->
<p>{$_('welcome.message', { name: username })}</p>
```

### In JavaScript

```javascript
import { t } from '$lib/i18n';

const message = t('common.loading');
const greeting = t('welcome.message', { name: 'John' });
```

## Translation Keys Structure

All translations follow a hierarchical structure:

```json
{
  "common": {
    "loading": "Loading...",
    "save": "Save"
  },
  "nav": {
    "home": "Home",
    "profile": "Profile"
  },
  "auth": {
    "email": "Email",
    "password": "Password"
  }
}
```

Access with dot notation: `common.loading`, `nav.home`, `auth.email`

## Available Translation Categories

### common
General UI elements: loading, error, success, buttons

### nav
Navigation items: home, tests, applications, messages, etc.

### auth
Authentication: email, password, login, signup, etc.

### test
Test-related: title, description, price, deadline, etc.

### application
Application status and actions

### message
Messaging system

### payment
Payment-related translations

### profile
User profile fields

### leaderboard
Leaderboard UI

### theme
Theme switcher

### language
Language selector

## Adding New Translations

### 1. Add to English (en.json)

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my feature"
  }
}
```

### 2. Add to Other Languages

Repeat for: `ar.json`, `zh.json`, `ja.json`, `de.json`, `es.json`

### 3. Use in Components

```svelte
<h2>{$_('myFeature.title')}</h2>
<p>{$_('myFeature.description')}</p>
```

## Language Switching

Users can switch languages using the `LanguageSelector` component in the header.

```svelte
<script>
  import { locale } from '$lib/i18n';
  
  function changeToSpanish() {
    locale.set('es');
  }
</script>
```

## Best Practices

### 1. Always Use Translation Keys

❌ **Bad:**
```svelte
<button>Save</button>
```

✅ **Good:**
```svelte
<button>{$_('common.save')}</button>
```

### 2. Use Descriptive Keys

❌ **Bad:**
```json
{
  "btn1": "Submit",
  "txt2": "Enter email"
}
```

✅ **Good:**
```json
{
  "common": {
    "submit": "Submit"
  },
  "auth": {
    "enterEmail": "Enter email"
  }
}
```

### 3. Group Related Translations

```json
{
  "test": {
    "create": "Create Test",
    "edit": "Edit Test",
    "delete": "Delete Test",
    "list": "Test List"
  }
}
```

### 4. Use Parameters for Dynamic Content

```json
{
  "welcome": "Welcome, {name}!",
  "itemCount": "You have {count} items"
}
```

```svelte
<p>{$_('welcome', { name: $user.name })}</p>
<p>{$_('itemCount', { count: items.length })}</p>
```

## RTL Support

Arabic is a right-to-left language. The system automatically handles text direction:

```css
/* Automatically applied when locale is 'ar' */
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

## Loading States

Show loading indicator while translations load:

```svelte
<script>
  import { isLoading } from '$lib/i18n';
</script>

{#if $isLoading}
  <p>Loading translations...</p>
{:else}
  <h1>{$_('nav.home')}</h1>
{/if}
```

## Testing Translations

```javascript
import { describe, it, expect } from 'vitest';
import { t } from '$lib/i18n';

describe('Translations', () => {
  it('should return correct translation', () => {
    const result = t('common.save');
    expect(result).toBe('Save');
  });
  
  it('should handle parameters', () => {
    const result = t('welcome', { name: 'John' });
    expect(result).toBe('Welcome, John!');
  });
});
```

## API Endpoint

### GET /api/translations/[locale]

Returns translation data for the specified locale.

**Response:**
```json
{
  "locale": "en",
  "translations": {
    "common": { ... },
    "nav": { ... }
  }
}
```

**Fallback Response (if locale not found):**
```json
{
  "locale": "en",
  "translations": { ... },
  "fallback": true
}
```

## Supported Locales

| Code | Language | Native Name |
|------|----------|-------------|
| en   | English  | English     |
| es   | Spanish  | Español     |
| de   | German   | Deutsch     |
| ar   | Arabic   | العربية     |
| zh   | Chinese  | 中文        |
| ja   | Japanese | 日本語      |

## Migration from Hardcoded Text

To migrate existing components:

1. Find all hardcoded text
2. Add translation keys to `en.json`
3. Replace text with `$_('key')`
4. Translate to other languages
5. Test all languages

Example:

```svelte
<!-- Before -->
<button>Save Changes</button>

<!-- After -->
<button>{$_('common.saveChanges')}</button>
```

## Troubleshooting

### Translation Not Showing

1. Check if key exists in `en.json`
2. Verify correct dot notation
3. Check browser console for errors
4. Ensure i18n is initialized in layout

### Wrong Language Displayed

1. Check localStorage for saved locale
2. Clear browser cache
3. Verify API endpoint returns correct data

### Missing Translations

If a translation is missing, the system will:
1. Return the translation key itself
2. Fall back to English if available
3. Log a warning in console (development only)