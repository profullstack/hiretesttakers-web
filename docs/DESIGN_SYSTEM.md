# Design System Documentation

## Overview

This document describes the design system for TutorLinkup.com, including components, color palette, spacing, typography, and usage guidelines.

## Color Palette

See [`COLOR_PALETTE.md`](./COLOR_PALETTE.md) and [`modern-color-palette.png`](./modern-color-palette.png) for the complete color system.

### Primary Colors
- **Primary**: `#3A6FF8` - Main brand color
- **Primary Hover**: `#2450C7` - Hover state
- **Primary Light**: `#82A9FB` - Light variant
- **Primary Dark**: `#2450C7` - Dark variant

### Semantic Colors
- **Success**: `#15C77E` - Success states
- **Error**: `#F14646` - Error states
- **Warning**: `#F7B322` - Warning states
- **Info**: `#0AB6C9` - Info states

### Neutral Colors
Light mode uses cool grays from `#F8FAFC` (lightest) to `#121521` (darkest).
Dark mode inverts these values for optimal contrast.

## Components

### Button (`Button.svelte`)

Reusable button component with multiple variants and states.

**Props:**
- `variant`: `'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'` (default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg'` (default: `'md'`)
- `disabled`: `boolean` (default: `false`)
- `loading`: `boolean` (default: `false`)
- `fullWidth`: `boolean` (default: `false`)
- `type`: `'button' | 'submit' | 'reset'` (default: `'button'`)
- `href`: `string | null` - If provided, renders as link
- `ariaLabel`: `string | null`

**Usage:**
```svelte
<script>
  import Button from '$lib/components/Button.svelte';
</script>

<Button variant="primary" on:click={handleClick}>
  Click Me
</Button>

<Button variant="outline" size="sm" loading>
  Loading...
</Button>

<Button variant="danger" disabled>
  Disabled
</Button>
```

**Accessibility:**
- Proper ARIA labels
- Focus visible states
- Keyboard navigation support
- Loading state with aria-busy

---

### Input (`Input.svelte`)

Reusable input component supporting multiple types.

**Props:**
- `type`: `'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'` (default: `'text'`)
- `value`: `string` (default: `''`)
- `placeholder`: `string`
- `label`: `string`
- `error`: `string`
- `disabled`: `boolean`
- `required`: `boolean`
- `readonly`: `boolean`
- `helperText`: `string`
- `fullWidth`: `boolean`

**Usage:**
```svelte
<script>
  import Input from '$lib/components/Input.svelte';
  
  let email = '';
  let emailError = '';
</script>

<Input
  type="email"
  label="Email Address"
  bind:value={email}
  error={emailError}
  required
  fullWidth
  helperText="We'll never share your email"
/>
```

**Accessibility:**
- Proper label association
- Error announcements with role="alert"
- Required field indicators
- Helper text descriptions

---

### Select (`Select.svelte`)

Reusable select/dropdown component.

**Props:**
- `value`: `string` (default: `''`)
- `options`: `Array<string | {value, label}>` (default: `[]`)
- `placeholder`: `string`
- `label`: `string`
- `error`: `string`
- `disabled`: `boolean`
- `required`: `boolean`
- `multiple`: `boolean` (static)
- `helperText`: `string`
- `fullWidth`: `boolean`

**Usage:**
```svelte
<script>
  import Select from '$lib/components/Select.svelte';
  
  let country = '';
  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' }
  ];
</script>

<Select
  label="Country"
  bind:value={country}
  options={countries}
  placeholder="Select a country"
  required
  fullWidth
/>
```

---

### Modal (`Modal.svelte`)

Accessible modal/dialog component with focus trap.

**Props:**
- `open`: `boolean` (default: `false`)
- `title`: `string`
- `size`: `'sm' | 'md' | 'lg' | 'xl' | 'full'` (default: `'md'`)
- `closeOnBackdrop`: `boolean` (default: `true`)
- `closeOnEscape`: `boolean` (default: `true`)
- `showClose`: `boolean` (default: `true`)

**Events:**
- `close`: Fired when modal is closed

**Usage:**
```svelte
<script>
  import Modal from '$lib/components/Modal.svelte';
  import Button from '$lib/components/Button.svelte';
  
  let showModal = false;
</script>

<Button on:click={() => showModal = true}>
  Open Modal
</Button>

<Modal
  bind:open={showModal}
  title="Confirm Action"
  size="md"
  on:close={() => showModal = false}
>
  <p>Are you sure you want to proceed?</p>
  
  <svelte:fragment slot="footer">
    <Button variant="secondary" on:click={() => showModal = false}>
      Cancel
    </Button>
    <Button variant="primary" on:click={handleConfirm}>
      Confirm
    </Button>
  </svelte:fragment>
</Modal>
```

**Accessibility:**
- Focus trap within modal
- Escape key to close
- Backdrop click to close
- Proper ARIA attributes
- Body scroll lock when open

---

### Toast (`Toast.svelte` + `toast.js` store)

Toast notification system with auto-dismiss.

**Store Methods:**
- `toast.success(message, duration?)`: Show success toast
- `toast.error(message, duration?)`: Show error toast
- `toast.warning(message, duration?)`: Show warning toast
- `toast.info(message, duration?)`: Show info toast
- `toast.add(options)`: Add custom toast
- `toast.remove(id)`: Remove specific toast
- `toast.clear()`: Clear all toasts

**Usage:**
```svelte
<script>
  import Toast from '$lib/components/Toast.svelte';
  import { toast } from '$lib/stores/toast';
  
  function handleSuccess() {
    toast.success('Operation completed successfully!');
  }
  
  function handleError() {
    toast.error('Something went wrong', 0); // 0 = no auto-dismiss
  }
</script>

<!-- Add once in root layout -->
<Toast />

<button on:click={handleSuccess}>Show Success</button>
<button on:click={handleError}>Show Error</button>
```

**Features:**
- Auto-dismiss with configurable duration
- Multiple toast types (success, error, warning, info)
- Stacked notifications
- Manual dismiss
- Accessible announcements

---

### Spinner (`Spinner.svelte`)

Loading spinner component.

**Props:**
- `size`: `'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
- `color`: `'primary' | 'secondary' | 'white' | 'current'` (default: `'primary'`)
- `label`: `string` (default: `'Loading...'`)

**Usage:**
```svelte
<script>
  import Spinner from '$lib/components/Spinner.svelte';
</script>

<Spinner size="lg" color="primary" />

<!-- In a button -->
<button disabled>
  <Spinner size="sm" color="white" />
  Loading...
</button>
```

---

### Pagination (`Pagination.svelte`)

Pagination component with keyboard navigation.

**Props:**
- `currentPage`: `number` (default: `1`)
- `totalPages`: `number` (default: `1`)
- `maxVisible`: `number` (default: `7`)
- `showFirstLast`: `boolean` (default: `true`)
- `showPrevNext`: `boolean` (default: `true`)

**Events:**
- `change`: Fired when page changes, detail: `{ page }`

**Usage:**
```svelte
<script>
  import Pagination from '$lib/components/Pagination.svelte';
  
  let currentPage = 1;
  const totalPages = 10;
  
  function handlePageChange(event) {
    currentPage = event.detail.page;
    // Fetch new data
  }
</script>

<Pagination
  {currentPage}
  {totalPages}
  on:change={handlePageChange}
/>
```

---

### Table (`Table.svelte`)

Responsive table with sorting support.

**Props:**
- `columns`: `Array<{key, label, sortable}>` (default: `[]`)
- `data`: `Array<Object>` (default: `[]`)
- `sortKey`: `string | null`
- `sortDirection`: `'asc' | 'desc'` (default: `'asc'`)
- `striped`: `boolean` (default: `false`)
- `hoverable`: `boolean` (default: `true`)
- `bordered`: `boolean` (default: `false`)
- `compact`: `boolean` (default: `false`)

**Events:**
- `sort`: Fired when column is sorted, detail: `{ key, direction }`

**Usage:**
```svelte
<script>
  import Table from '$lib/components/Table.svelte';
  
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: false }
  ];
  
  let data = [
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' }
  ];
  
  let sortKey = null;
  let sortDirection = 'asc';
  
  function handleSort(event) {
    sortKey = event.detail.key;
    sortDirection = event.detail.direction;
    // Sort data
  }
</script>

<Table
  {columns}
  {data}
  {sortKey}
  {sortDirection}
  striped
  hoverable
  on:sort={handleSort}
>
  <svelte:fragment slot="empty">
    No users found
  </svelte:fragment>
</Table>
```

---

## Existing Components

The following components already exist in the project:

- `ThemeToggle.svelte` - Light/dark theme switcher
- `LanguageSelector.svelte` - Language selection dropdown
- `BadgeDisplay.svelte` - Badge/tag display
- `AvatarUpload.svelte` - Avatar image upload
- Various Card components (TestCard, ResourceCard, etc.)
- Form components (AuthForm, TestForm, etc.)
- Notification components (NotificationBell, NotificationList, etc.)

## Design Tokens

### Spacing Scale
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### Border Radius
```css
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-full: 9999px;   /* Fully rounded */
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Transitions
```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
```

## Accessibility Guidelines

All components follow WCAG 2.1 Level AA standards:

1. **Keyboard Navigation**: All interactive elements are keyboard accessible
2. **Focus Indicators**: Clear focus states on all focusable elements
3. **ARIA Labels**: Proper ARIA attributes for screen readers
4. **Color Contrast**: Minimum 4.5:1 contrast ratio for text
5. **Semantic HTML**: Use of proper HTML5 semantic elements
6. **Error Handling**: Clear error messages with role="alert"

## Responsive Design

All components are mobile-first and responsive:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Components automatically adapt to screen size with appropriate breakpoints.

## Dark Mode

All components support dark mode through CSS variables. The theme is controlled by the `theme` store and applies the `.dark` class to the root element.

## Best Practices

1. **Use CSS Variables**: Always use design tokens instead of hardcoded values
2. **Consistent Spacing**: Use the spacing scale for margins and padding
3. **Semantic Colors**: Use semantic color names (success, error, etc.) instead of specific colors
4. **Accessibility First**: Always include proper ARIA labels and keyboard support
5. **Mobile First**: Design for mobile, then enhance for larger screens
6. **Component Composition**: Build complex UIs by composing simple components

## Future Enhancements

Components that could be added in the future:

- Sidebar navigation component
- File upload with drag-and-drop
- Code editor integration
- Rich text editor
- Date picker
- Autocomplete/Combobox
- Tabs component
- Accordion component
- Tooltip component
- Progress bar
- Skeleton loaders

---

For questions or contributions, please refer to the main README.md or open an issue.