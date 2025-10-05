# Dark Mode Styling Guidelines

## Overview

This document provides guidelines for implementing dark mode compatible styling across the HireTestTakers application. All pages should use CSS variables from the centralized theme system to ensure consistent dark mode support.

## Theme System

The application uses a centralized theme system defined in [`static/styles/theme.css`](../static/styles/theme.css) with CSS variables for colors, spacing, shadows, and other design tokens.

### Light Mode (Default)
- Subtle, clean, professional design
- Soft colors with good contrast
- Traditional shadows

### Dark Mode (Neon Theme)
- Neon-inspired cyberpunk aesthetics
- Vibrant glows and neon colors
- Enhanced visual effects

## CSS Variables Reference

### Colors

#### Primary Colors
```css
var(--color-primary)        /* Main brand color */
var(--color-primary-hover)  /* Hover state */
var(--color-primary-light)  /* Light variant */
var(--color-primary-dark)   /* Dark variant */
```

#### Semantic Colors
```css
var(--color-success)        /* Success states */
var(--color-error)          /* Error states */
var(--color-warning)        /* Warning states */
var(--color-info)           /* Info states */
```

#### Background Colors
```css
var(--color-bg)             /* Main background */
var(--color-bg-secondary)   /* Secondary background */
var(--color-bg-tertiary)    /* Tertiary background */
var(--color-surface)        /* Card/surface background */
var(--color-surface-hover)  /* Surface hover state */
```

#### Text Colors
```css
var(--color-text)           /* Primary text */
var(--color-text-secondary) /* Secondary text */
var(--color-text-tertiary)  /* Tertiary text */
```

#### Border Colors
```css
var(--color-border)         /* Default border */
var(--color-border-hover)   /* Border hover state */
```

### Spacing
```css
var(--spacing-xs)    /* 0.25rem */
var(--spacing-sm)    /* 0.5rem */
var(--spacing-md)    /* 1rem */
var(--spacing-lg)    /* 1.5rem */
var(--spacing-xl)    /* 2rem */
var(--spacing-2xl)   /* 3rem */
```

### Border Radius
```css
var(--radius-sm)     /* 0.25rem */
var(--radius-md)     /* 0.375rem */
var(--radius-lg)     /* 0.5rem */
var(--radius-xl)     /* 0.75rem */
var(--radius-full)   /* 9999px - for pills/circles */
```

### Shadows
```css
var(--shadow-sm)     /* Small shadow */
var(--shadow-md)     /* Medium shadow */
var(--shadow-lg)     /* Large shadow */
var(--shadow-xl)     /* Extra large shadow */
```

### Transitions
```css
var(--transition-fast)  /* 150ms ease */
var(--transition-base)  /* 200ms ease */
var(--transition-slow)  /* 300ms ease */
```

### Glow Effects (Dark Mode Only)
```css
var(--glow-primary)   /* Primary neon glow */
var(--glow-success)   /* Success neon glow */
var(--glow-error)     /* Error neon glow */
var(--glow-warning)   /* Warning neon glow */
var(--glow-info)      /* Info neon glow */
```

## Centralized Form Styles

The theme system includes centralized form styling classes that should be used across the application:

### Form Containers
```html
<div class="form-container">
  <!-- Form content -->
</div>
```

### Form Groups
```html
<div class="form-group">
  <label for="input-id">Label</label>
  <input type="text" id="input-id" class="form-input" />
</div>
```

### Buttons
```html
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary Action</button>
<button class="btn-success">Success Action</button>
<button class="btn-error">Error Action</button>
<button class="btn-warning">Warning Action</button>
```

### Alerts
```html
<div class="alert alert-success">Success message</div>
<div class="alert alert-error">Error message</div>
<div class="alert alert-warning">Warning message</div>
<div class="alert alert-info">Info message</div>
```

### Cards/Sections
```html
<div class="card">
  <!-- Card content -->
</div>
```

### Tags/Badges
```html
<span class="tag">Tag Label</span>
<span class="badge">Badge Label</span>
```

## Migration Guide

### Step 1: Replace Hardcoded Colors

**Before:**
```css
.my-element {
  background: #ffffff;
  color: #333333;
  border: 1px solid #e5e7eb;
}
```

**After:**
```css
.my-element {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
```

### Step 2: Replace Hardcoded Spacing

**Before:**
```css
.my-element {
  padding: 1rem;
  margin-bottom: 1.5rem;
}
```

**After:**
```css
.my-element {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}
```

### Step 3: Add Dark Mode Specific Styles

For styles that need to be different in dark mode, use the `:global(.dark)` selector:

```css
.my-element {
  background: var(--color-surface);
  box-shadow: var(--shadow-md);
}

:global(.dark) .my-element {
  box-shadow: var(--glow-primary);
}
```

### Step 4: Use Centralized Classes

Replace custom button/form styles with centralized classes:

**Before:**
```html
<button style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem;">
  Submit
</button>
```

**After:**
```html
<button class="btn-primary">
  Submit
</button>
```

## Common Patterns

### Form with Validation
```html
<form class="form-container">
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" class="form-input" />
    {#if error}
      <p class="error-text">{error}</p>
    {/if}
  </div>
  
  <button type="submit" class="btn-primary">Submit</button>
</form>
```

### Card with Actions
```html
<div class="card">
  <h2>Card Title</h2>
  <p class="help-text">Card description</p>
  
  <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-lg);">
    <button class="btn-primary">Primary</button>
    <button class="btn-secondary">Secondary</button>
  </div>
</div>
```

### Status Badges
```html
<span class="tag">Active</span>
```

With custom colors for specific states:
```css
.status-pending {
  background: rgba(255, 215, 0, 0.2);
  color: var(--color-warning);
}

:global(.dark) .status-pending {
  box-shadow: 0 0 5px rgba(255, 215, 0, 0.3);
}
```

## Testing Dark Mode

1. **Toggle Dark Mode**: Use the theme toggle in the navigation bar
2. **Check Contrast**: Ensure text is readable in both modes
3. **Verify Interactions**: Test hover states, focus states, and active states
4. **Check Forms**: Ensure form inputs are visible and usable
5. **Review Alerts**: Verify alert messages are clearly visible

## Best Practices

1. **Always use CSS variables** - Never hardcode colors, spacing, or other design tokens
2. **Test in both modes** - Always verify your changes work in light and dark mode
3. **Use semantic colors** - Use success/error/warning colors appropriately
4. **Maintain consistency** - Use centralized classes when available
5. **Add transitions** - Use `var(--transition-base)` for smooth state changes
6. **Consider accessibility** - Ensure sufficient contrast in both modes
7. **Use glow effects sparingly** - In dark mode, use neon glows for emphasis only

## Running Database Migrations

### Local Development

If you're using Supabase locally:

```bash
# Start Supabase locally
npx supabase start

# Run migrations
npx supabase db push

# Or apply a specific migration
npx supabase migration up
```

### Production

Migrations are automatically applied when you push to your Supabase project:

```bash
# Link to your project
npx supabase link --project-ref your-project-ref

# Push migrations
npx supabase db push
```

### Manual Migration

If you need to run migrations manually:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy the migration SQL from `supabase/migrations/`
4. Execute the SQL in the editor

## Resources

- [Theme CSS File](../static/styles/theme.css)
- [Global App CSS](../src/app.css)
- [Color Palette Documentation](./COLOR_PALETTE.md)
- [Design System](./DESIGN_SYSTEM.md)

## Support

For questions or issues with dark mode styling, please refer to this guide or consult the development team.