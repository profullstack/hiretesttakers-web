# Color Palette

This document describes the **modernized** color scheme for the TutorLinkup platform (optimized for accessibility and clean light/dark themes).

## Primary Colors

### Primary (Modern Blue)

* **Primary**: `#3A6FF8` – Main brand color, buttons, links
* **Primary Dark**: `#2450C7` – Hover states
* **Primary Light**: `#82A9FB` – Accents, highlights

### Gray Palette (Neutral, cool)

* **Gray-50**: `#F8FAFC` – Light backgrounds
* **Gray-100**: `#F1F4F9` – Subtle backgrounds
* **Gray-200**: `#E3E8F0` – Borders, dividers
* **Gray-300**: `#CBD2DE` – Disabled states
* **Gray-400**: `#98A1B2` – Placeholder text
* **Gray-500**: `#677184` – Secondary text
* **Gray-600**: `#4C5569` – Body text
* **Gray-700**: `#363E52` – Headings
* **Gray-800**: `#1E2435` – Dark backgrounds
* **Gray-900**: `#121521` – Darkest backgrounds

## Semantic Colors

### Success

* **Success**: `#15C77E` – Success messages, completed states
* **Success Dark**: `#09915A` – Hover states

### Warning

* **Warning**: `#F7B322` – Warning messages, pending states
* **Warning Dark**: `#C8840F` – Hover states

### Error

* **Error**: `#F14646` – Error messages, destructive actions
* **Error Dark**: `#C72A2A` – Hover states

### Info

* **Info**: `#0AB6C9` – Informational messages
* **Info Dark**: `#078A99` – Hover states

## Theme Modes

### Light Mode

* **Background**: `#FFFFFF`
* **Surface**: `#F8FAFC` (Gray-50)
* **Text Primary**: `#121521` (Gray-900)
* **Text Secondary**: `#677184` (Gray-500)
* **Border**: `#E3E8F0` (Gray-200)

### Dark Mode

* **Background**: `#121521` (Gray-900)
* **Surface**: `#1E2435` (Gray-800)
* **Text Primary**: `#F8FAFC` (Gray-50)
* **Text Secondary**: `#98A1B2` (Gray-400)
* **Border**: `#363E52` (Gray-700)

## Usage Guidelines

### Buttons

* **Primary Button**: `#3A6FF8` background, white text; hover `#2450C7`
* **Secondary Button**: `#E3E8F0` background, `#121521` text
* **Danger Button**: `#F14646` background, white text; hover `#C72A2A`

### Links

* **Default**: `#3A6FF8`
* **Hover/Visited**: `#2450C7`

### Status Indicators

* **Pending**: `#F7B322`
* **Accepted**: `#15C77E`
* **Rejected**: `#F14646`
* **Completed**: `#3A6FF8`

## Accessibility

Colors were chosen to meet WCAG 2.1 Level AA contrast ratios where applicable:

* Normal text: 4.5:1 minimum
* Large text (≥18pt or ≥14pt bold): 3:1 minimum
* UI components/graphics: 3:1 minimum

## Implementation

Colors can be implemented via Tailwind CSS utility classes. Add custom tokens to `tailwind.config.js`:

```javascript
// tailwind.config.js (excerpt)
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3A6FF8',
          dark: '#2450C7',
          light: '#82A9FB',
        },
        success: {
          DEFAULT: '#15C77E',
          dark: '#09915A',
        },
        warning: {
          DEFAULT: '#F7B322',
          dark: '#C8840F',
        },
        error: {
          DEFAULT: '#F14646',
          dark: '#C72A2A',
        },
        info: {
          DEFAULT: '#0AB6C9',
          dark: '#078A99',
        },
        // Optional: map neutrals if you want utility names
        neutral: {
          50:  '#F8FAFC',
          100: '#F1F4F9',
          200: '#E3E8F0',
          300: '#CBD2DE',
          400: '#98A1B2',
          500: '#677184',
          600: '#4C5569',
          700: '#363E52',
          800: '#1E2435',
          900: '#121521',
        },
      }
    }
  }
}
```

> Tip: For light/dark theming, pair these with `@media (prefers-color-scheme)` or a `.dark` class strategy (`darkMode: 'class'` in Tailwind).
