<script>
  /**
   * Reusable Select Component
   * Supports single and multi-select
   */
  
  // Props
  export let value = '';
  export let options = []; // Array of {value, label} or simple strings
  export let placeholder = 'Select an option';
  export let label = '';
  export let error = '';
  export let disabled = false;
  export let required = false;
  export let multiple = false;
  export let id = null;
  export let name = null;
  export let ariaLabel = null;
  export let helperText = '';
  export let fullWidth = false;
  
  // Generate unique ID if not provided
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  // Normalize options to always have {value, label} format
  $: normalizedOptions = options.map(opt => 
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );
  
  // Compute classes
  $: containerClasses = [
    'select-container',
    fullWidth && 'select-full-width',
    error && 'select-has-error'
  ].filter(Boolean).join(' ');
  
  $: selectClasses = [
    'select',
    error && 'select-error',
    disabled && 'select-disabled'
  ].filter(Boolean).join(' ');
</script>

<div class={containerClasses}>
  {#if label}
    <label for={selectId} class="select-label">
      {label}
      {#if required}
        <span class="select-required" aria-label="required">*</span>
      {/if}
    </label>
  {/if}
  
  <div class="select-wrapper">
    {#if multiple}
      <select
        id={selectId}
        {name}
        class={selectClasses}
        bind:value
        {disabled}
        {required}
        multiple
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : null}
        on:change
        on:focus
        on:blur
      >
        {#each normalizedOptions as option}
          <option value={option.value}>
            {option.label}
          </option>
        {/each}
      </select>
    {:else}
      <select
        id={selectId}
        {name}
        class={selectClasses}
        bind:value
        {disabled}
        {required}
        aria-label={ariaLabel || label}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : null}
        on:change
        on:focus
        on:blur
      >
        {#if placeholder}
          <option value="" disabled selected={!value}>
            {placeholder}
          </option>
        {/if}
        
        {#each normalizedOptions as option}
          <option value={option.value}>
            {option.label}
          </option>
        {/each}
      </select>
      
      <svg class="select-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    {/if}
  </div>
  
  {#if helperText && !error}
    <p id="{selectId}-helper" class="select-helper">
      {helperText}
    </p>
  {/if}
  
  {#if error}
    <p id="{selectId}-error" class="select-error-text" role="alert">
      {error}
    </p>
  {/if}
</div>

<style>
  .select-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .select-full-width {
    width: 100%;
  }
  
  .select-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--color-text);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  .select-required {
    color: var(--color-error);
  }
  
  .select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .select {
    padding: var(--spacing-sm) var(--spacing-md);
    padding-right: 2.5rem;
    font-size: 1rem;
    line-height: 1.5rem;
    color: var(--color-text);
    background-color: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
    font-family: inherit;
    width: 100%;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }
  
  .select:hover:not(:disabled) {
    border-color: var(--color-border-hover);
  }
  
  .select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(58, 111, 248, 0.1);
  }
  
  .select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-bg-secondary);
  }
  
  .select-error {
    border-color: var(--color-error);
  }
  
  .select-error:focus {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(241, 70, 70, 0.1);
  }
  
  .select-icon {
    position: absolute;
    right: var(--spacing-md);
    width: 1.25rem;
    height: 1.25rem;
    color: var(--color-text-secondary);
    pointer-events: none;
  }
  
  .select:disabled + .select-icon {
    opacity: 0.5;
  }
  
  .select-helper {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0;
  }
  
  .select-error-text {
    font-size: 0.875rem;
    color: var(--color-error);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
  
  /* Multi-select specific styles */
  .select[multiple] {
    padding-right: var(--spacing-md);
    min-height: 8rem;
  }
  
  .select[multiple] option {
    padding: var(--spacing-xs) var(--spacing-sm);
  }
  
  /* Placeholder option styling */
  .select option[disabled] {
    color: var(--color-text-tertiary);
  }
  
  /* Dark mode adjustments */
  :global(.dark) .select {
    background-color: var(--color-surface);
  }
  
  :global(.dark) .select:disabled {
    background-color: var(--color-bg-tertiary);
  }
</style>