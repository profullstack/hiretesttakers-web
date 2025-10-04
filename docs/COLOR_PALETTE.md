# Color Palette

This document describes the color scheme for the HireTestTakers platform.

## Primary Colors

### Blue Palette (Primary)
- **Primary**: `#3b82f6` (Blue-500) - Main brand color, buttons, links
- **Primary Dark**: `#2563eb` (Blue-600) - Hover states
- **Primary Light**: `#60a5fa` (Blue-400) - Accents, highlights

### Gray Palette (Neutral)
- **Gray-50**: `#f9fafb` - Light backgrounds
- **Gray-100**: `#f3f4f6` - Subtle backgrounds
- **Gray-200**: `#e5e7eb` - Borders, dividers
- **Gray-300**: `#d1d5db` - Disabled states
- **Gray-400**: `#9ca3af` - Placeholder text
- **Gray-500**: `#6b7280` - Secondary text
- **Gray-600**: `#4b5563` - Body text
- **Gray-700**: `#374151` - Headings
- **Gray-800**: `#1f2937` - Dark backgrounds
- **Gray-900**: `#111827` - Darkest backgrounds

## Semantic Colors

### Success
- **Success**: `#10b981` (Green-500) - Success messages, completed states
- **Success Dark**: `#059669` (Green-600) - Hover states

### Warning
- **Warning**: `#f59e0b` (Amber-500) - Warning messages, pending states
- **Warning Dark**: `#d97706` (Amber-600) - Hover states

### Error
- **Error**: `#ef4444` (Red-500) - Error messages, destructive actions
- **Error Dark**: `#dc2626` (Red-600) - Hover states

### Info
- **Info**: `#06b6d4` (Cyan-500) - Informational messages
- **Info Dark**: `#0891b2` (Cyan-600) - Hover states

## Theme Modes

### Light Mode
- **Background**: `#ffffff` (White)
- **Surface**: `#f9fafb` (Gray-50)
- **Text Primary**: `#111827` (Gray-900)
- **Text Secondary**: `#6b7280` (Gray-500)
- **Border**: `#e5e7eb` (Gray-200)

### Dark Mode
- **Background**: `#111827` (Gray-900)
- **Surface**: `#1f2937` (Gray-800)
- **Text Primary**: `#f9fafb` (Gray-50)
- **Text Secondary**: `#9ca3af` (Gray-400)
- **Border**: `#374151` (Gray-700)

## Usage Guidelines

### Buttons
- **Primary Button**: Blue-500 background, white text
- **Secondary Button**: Gray-200 background, Gray-900 text
- **Danger Button**: Red-500 background, white text

### Links
- **Default**: Blue-500
- **Hover**: Blue-600
- **Visited**: Blue-700

### Status Indicators
- **Pending**: Amber-500
- **Accepted**: Green-500
- **Rejected**: Red-500
- **Completed**: Blue-500

## Accessibility

All color combinations meet WCAG 2.1 Level AA standards for contrast ratios:
- Normal text: 4.5:1 minimum
- Large text: 3:1 minimum
- UI components: 3:1 minimum

## Implementation

Colors are implemented using Tailwind CSS utility classes. Custom colors can be added to `tailwind.config.js` if needed.

```javascript
// Example Tailwind config
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
          light: '#60a5fa'
        }
      }
    }
  }
}