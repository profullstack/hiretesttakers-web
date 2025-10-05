<script>
  /**
   * Loading Spinner Component
   * Reusable loading indicator
   */
  
  // Props
  export let size = 'md'; // sm, md, lg, xl
  export let color = 'primary'; // primary, secondary, white, current
  export let label = 'Loading...';
</script>

<div class="spinner-container" role="status" aria-label={label}>
  <div class="spinner spinner-{size} spinner-{color}"></div>
  <span class="sr-only">{label}</span>
</div>

<style>
  .spinner-container {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  .spinner {
    border-radius: 50%;
    border-style: solid;
    border-top-color: transparent;
    animation: spin 0.6s linear infinite;
  }
  
  /* Sizes */
  .spinner-sm {
    width: 1rem;
    height: 1rem;
    border-width: 2px;
  }
  
  .spinner-md {
    width: 1.5rem;
    height: 1.5rem;
    border-width: 2px;
  }
  
  .spinner-lg {
    width: 2rem;
    height: 2rem;
    border-width: 3px;
  }
  
  .spinner-xl {
    width: 3rem;
    height: 3rem;
    border-width: 4px;
  }
  
  /* Colors */
  .spinner-primary {
    border-color: var(--color-primary);
    border-top-color: transparent;
  }
  
  .spinner-secondary {
    border-color: var(--color-text-secondary);
    border-top-color: transparent;
  }
  
  .spinner-white {
    border-color: white;
    border-top-color: transparent;
  }
  
  .spinner-current {
    border-color: currentColor;
    border-top-color: transparent;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Screen reader only text */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
</style>