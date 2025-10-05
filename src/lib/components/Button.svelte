<script>
  /**
   * Reusable Button Component
   * Supports multiple variants, sizes, and states
   */
  
  // Props
  export let variant = 'primary'; // primary, secondary, outline, danger, ghost
  export let size = 'md'; // sm, md, lg
  export let disabled = false;
  export let loading = false;
  export let fullWidth = false;
  export let type = 'button'; // button, submit, reset
  export let href = null; // If provided, renders as link
  export let ariaLabel = null;
  
  // Compute classes
  $: classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    disabled && 'btn-disabled'
  ].filter(Boolean).join(' ');
  
  $: isDisabled = disabled || loading;
</script>

{#if href && !isDisabled}
  <a
    {href}
    class={classes}
    aria-label={ariaLabel}
    role="button"
    on:click
  >
    {#if loading}
      <span class="btn-spinner" aria-hidden="true"></span>
    {/if}
    <slot />
  </a>
{:else}
  <button
    {type}
    class={classes}
    disabled={isDisabled}
    aria-label={ariaLabel}
    aria-busy={loading}
    on:click
  >
    {#if loading}
      <span class="btn-spinner" aria-hidden="true"></span>
    {/if}
    <slot />
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    border: 1px solid transparent;
    cursor: pointer;
    transition: all var(--transition-base);
    text-decoration: none;
    font-family: inherit;
    white-space: nowrap;
  }
  
  /* Sizes */
  .btn-sm {
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .btn-md {
    padding: var(--spacing-sm) var(--spacing-lg);
    font-size: 1rem;
    line-height: 1.5rem;
  }
  
  .btn-lg {
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: 1.125rem;
    line-height: 1.75rem;
  }
  
  /* Primary Variant */
  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  
  .btn-primary:hover:not(.btn-disabled):not(.btn-loading) {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  .btn-primary:active:not(.btn-disabled):not(.btn-loading) {
    transform: translateY(0);
  }
  
  /* Secondary Variant */
  .btn-secondary {
    background-color: var(--color-gray-100);
    color: var(--color-text);
    border-color: var(--color-gray-200);
  }
  
  .btn-secondary:hover:not(.btn-disabled):not(.btn-loading) {
    background-color: var(--color-gray-200);
    border-color: var(--color-gray-300);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
  
  /* Outline Variant */
  .btn-outline {
    background-color: transparent;
    color: var(--color-primary);
    border-color: var(--color-primary);
  }
  
  .btn-outline:hover:not(.btn-disabled):not(.btn-loading) {
    background-color: var(--color-primary);
    color: white;
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }
  
  /* Danger Variant */
  .btn-danger {
    background-color: var(--color-error);
    color: white;
    border-color: var(--color-error);
  }
  
  .btn-danger:hover:not(.btn-disabled):not(.btn-loading) {
    background-color: var(--color-error-hover);
    border-color: var(--color-error-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  /* Ghost Variant */
  .btn-ghost {
    background-color: transparent;
    color: var(--color-text);
    border-color: transparent;
  }
  
  .btn-ghost:hover:not(.btn-disabled):not(.btn-loading) {
    background-color: var(--color-surface-hover);
  }
  
  /* States */
  .btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
  
  .btn-loading {
    cursor: wait;
    position: relative;
  }
  
  .btn-loading > :not(.btn-spinner) {
    opacity: 0.6;
  }
  
  .btn-full-width {
    width: 100%;
  }
  
  /* Loading Spinner */
  .btn-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Focus styles for accessibility */
  .btn:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  /* Dark mode adjustments */
  :global(.dark) .btn-secondary {
    background-color: var(--color-gray-700);
    border-color: var(--color-gray-600);
  }
  
  :global(.dark) .btn-secondary:hover:not(.btn-disabled):not(.btn-loading) {
    background-color: var(--color-gray-600);
    border-color: var(--color-gray-500);
  }
</style>