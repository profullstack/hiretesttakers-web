<script>
  /**
   * Reusable Modal/Dialog Component
   * Accessible modal with backdrop and keyboard support
   */
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  // Props
  export let open = false;
  export let title = '';
  export let size = 'md'; // sm, md, lg, xl, full
  export let closeOnBackdrop = true;
  export let closeOnEscape = true;
  export let showClose = true;
  
  let modalElement;
  let previousActiveElement;
  
  // Handle escape key
  function handleKeydown(event) {
    if (event.key === 'Escape' && closeOnEscape && open) {
      close();
    }
  }
  
  // Handle backdrop click
  function handleBackdropClick(event) {
    if (event.target === event.currentTarget && closeOnBackdrop) {
      close();
    }
  }
  
  // Close modal
  function close() {
    dispatch('close');
    open = false;
  }
  
  // Focus trap
  function trapFocus(event) {
    if (!modalElement) return;
    
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.key === 'Tab') {
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }
  
  // Lifecycle
  $: if (open) {
    previousActiveElement = document.activeElement;
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    setTimeout(() => {
      const focusableElements = modalElement?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      focusableElements?.[0]?.focus();
    }, 100);
  } else {
    document.body.style.overflow = '';
    previousActiveElement?.focus();
  }
  
  onMount(() => {
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keydown', trapFocus);
  });
  
  onDestroy(() => {
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('keydown', trapFocus);
    document.body.style.overflow = '';
  });
  
  $: modalClasses = [
    'modal-content',
    `modal-${size}`
  ].filter(Boolean).join(' ');
</script>

{#if open}
  <div 
    class="modal-backdrop" 
    on:click={handleBackdropClick}
    role="presentation"
  >
    <div
      bind:this={modalElement}
      class={modalClasses}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : null}
    >
      {#if title || showClose}
        <div class="modal-header">
          {#if title}
            <h2 id="modal-title" class="modal-title">{title}</h2>
          {/if}
          
          {#if showClose}
            <button
              type="button"
              class="modal-close"
              on:click={close}
              aria-label="Close modal"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          {/if}
        </div>
      {/if}
      
      <div class="modal-body">
        <slot />
      </div>
      
      {#if $$slots.footer}
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-md);
    z-index: 1000;
    animation: fadeIn var(--transition-base);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .modal-content {
    background-color: var(--color-bg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    animation: slideUp var(--transition-base);
    width: 100%;
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  /* Sizes */
  .modal-sm {
    max-width: 24rem;
  }
  
  .modal-md {
    max-width: 32rem;
  }
  
  .modal-lg {
    max-width: 48rem;
  }
  
  .modal-xl {
    max-width: 64rem;
  }
  
  .modal-full {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--color-border);
    gap: var(--spacing-md);
  }
  
  .modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0;
  }
  
  .modal-close {
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
    flex-shrink: 0;
  }
  
  .modal-close:hover {
    background-color: var(--color-surface-hover);
    color: var(--color-text);
  }
  
  .modal-close:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  
  .modal-close svg {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .modal-body {
    padding: var(--spacing-lg);
    overflow-y: auto;
    flex: 1;
  }
  
  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border-top: 1px solid var(--color-border);
  }
  
  /* Dark mode adjustments */
  :global(.dark) .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.7);
  }
  
  /* Mobile responsive */
  @media (max-width: 640px) {
    .modal-backdrop {
      padding: var(--spacing-sm);
    }
    
    .modal-content {
      max-height: 95vh;
    }
    
    .modal-header,
    .modal-body,
    .modal-footer {
      padding: var(--spacing-md);
    }
  }
</style>