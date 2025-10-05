<script>
  /**
   * Toast Notification Component
   * Displays toast notifications from the toast store
   */
  import { toast } from '$lib/stores/toast';
  import { fly } from 'svelte/transition';
  
  // Icons for different toast types
  const icons = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 6L9 17l-5-5"/>
    </svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
    info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`
  };
  
  function getToastClasses(type) {
    return `toast toast-${type}`;
  }
</script>

<div class="toast-container" role="region" aria-label="Notifications">
  {#each $toast as item (item.id)}
    <div
      class={getToastClasses(item.type)}
      role="alert"
      aria-live="polite"
      transition:fly={{ y: -20, duration: 300 }}
    >
      <div class="toast-icon">
        {@html icons[item.type]}
      </div>
      
      <div class="toast-message">
        {item.message}
      </div>
      
      <button
        type="button"
        class="toast-close"
        on:click={() => toast.remove(item.id)}
        aria-label="Close notification"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: var(--spacing-lg);
    right: var(--spacing-lg);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    max-width: 24rem;
    pointer-events: none;
  }
  
  .toast {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--color-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    border-left: 4px solid;
    pointer-events: auto;
    min-width: 20rem;
  }
  
  .toast-success {
    border-left-color: var(--color-success);
  }
  
  .toast-error {
    border-left-color: var(--color-error);
  }
  
  .toast-warning {
    border-left-color: var(--color-warning);
  }
  
  .toast-info {
    border-left-color: var(--color-info);
  }
  
  .toast-icon {
    flex-shrink: 0;
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .toast-success .toast-icon {
    color: var(--color-success);
  }
  
  .toast-error .toast-icon {
    color: var(--color-error);
  }
  
  .toast-warning .toast-icon {
    color: var(--color-warning);
  }
  
  .toast-info .toast-icon {
    color: var(--color-info);
  }
  
  .toast-icon :global(svg) {
    width: 100%;
    height: 100%;
  }
  
  .toast-message {
    flex: 1;
    font-size: 0.875rem;
    line-height: 1.5;
    color: var(--color-text);
    word-break: break-word;
  }
  
  .toast-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-xs);
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: var(--radius-md);
    color: var(--color-text-secondary);
    transition: all var(--transition-base);
  }
  
  .toast-close:hover {
    background-color: var(--color-surface-hover);
    color: var(--color-text);
  }
  
  .toast-close:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  .toast-close svg {
    width: 1rem;
    height: 1rem;
  }
  
  /* Mobile responsive */
  @media (max-width: 640px) {
    .toast-container {
      top: var(--spacing-sm);
      right: var(--spacing-sm);
      left: var(--spacing-sm);
      max-width: none;
    }
    
    .toast {
      min-width: auto;
    }
  }
  
  /* Dark mode adjustments */
  :global(.dark) .toast {
    background-color: var(--color-surface);
  }
</style>