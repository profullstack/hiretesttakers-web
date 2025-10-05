<script>
  /**
   * Reusable Input Component
   * Supports multiple types and states
   */
  
  // Props
  export let type = 'text'; // text, email, password, number, tel, url, search
  export let value = '';
  export let placeholder = '';
  export let label = '';
  export let error = '';
  export let disabled = false;
  export let required = false;
  export let readonly = false;
  export let autocomplete = null;
  export let min = null;
  export let max = null;
  export let step = null;
  export let pattern = null;
  export let id = null;
  export let name = null;
  export let ariaLabel = null;
  export let helperText = '';
  export let fullWidth = false;
  
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Compute classes
  $: containerClasses = [
    'input-container',
    fullWidth && 'input-full-width',
    error && 'input-has-error'
  ].filter(Boolean).join(' ');
  
  $: inputClasses = [
    'input',
    error && 'input-error',
    disabled && 'input-disabled'
  ].filter(Boolean).join(' ');
</script>

<div class={containerClasses}>
  {#if label}
    <label for={inputId} class="input-label">
      {label}
      {#if required}
        <span class="input-required" aria-label="required">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    {type}
    id={inputId}
    {name}
    class={inputClasses}
    bind:value
    {placeholder}
    {disabled}
    {required}
    {readonly}
    {autocomplete}
    {min}
    {max}
    {step}
    {pattern}
    aria-label={ariaLabel || label}
    aria-invalid={!!error}
    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : null}
    on:input
    on:change
    on:focus
    on:blur
    on:keydown
    on:keyup
  />
  
  {#if helperText && !error}
    <p id="{inputId}-helper" class="input-helper">
      {helperText}
    </p>
  {/if}
  
  {#if error}
    <p id="{inputId}-error" class="input-error-text" role="alert">
      {error}
    </p>
  {/if}
</div>

<style>
  .input-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .input-full-width {
    width: 100%;
  }
  
  .input-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  .input-required {
    color: var(--color-error);
  }
  
  .input {
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 1rem;
    line-height: 1.5rem;
    color: var(--color-text);
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
    font-family: inherit;
    width: 100%;
  }
  
  .input:hover:not(:disabled):not(:read-only) {
    border-color: var(--color-border-hover);
  }
  
  .input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(58, 111, 248, 0.1);
  }
  
  .input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-bg-secondary);
  }
  
  .input:read-only {
    background-color: var(--color-bg-secondary);
    cursor: default;
  }
  
  .input-error {
    border-color: var(--color-error);
  }
  
  .input-error:focus {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(241, 70, 70, 0.1);
  }
  
  .input-helper {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }
  
  .input-error-text {
    font-size: 0.875rem;
    color: var(--color-error);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  /* Number input specific styles */
  input[type="number"] {
    -moz-appearance: textfield;
  }
  
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  /* Search input specific styles */
  input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }
  
  /* Placeholder styles */
  .input::placeholder {
    color: var(--color-text-tertiary);
    opacity: 1;
  }
  
  /* Dark mode adjustments */
  :global(.dark) .input {
    background-color: var(--color-surface);
  }
  
  :global(.dark) .input:disabled,
  :global(.dark) .input:read-only {
    background-color: var(--color-bg-tertiary);
  }
</style>