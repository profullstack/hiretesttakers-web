<script>
  import { createEventDispatcher } from 'svelte';

  export let isOpen = false;
  export let type = 'job'; // 'job' or 'test'
  export let title = '';
  export let loading = false;

  const dispatch = createEventDispatcher();

  let applicationNote = '';
  let error = '';

  function handleClose() {
    if (!loading) {
      applicationNote = '';
      error = '';
      dispatch('close');
    }
  }

  async function handleSubmit() {
    error = '';
    
    if (!applicationNote.trim()) {
      error = 'Please add a note about why you\'re a good fit for this ' + type;
      return;
    }

    dispatch('submit', { note: applicationNote });
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && !loading) {
      handleClose();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
  <div class="modal-overlay" on:click={handleClose} on:keydown={handleKeydown} role="button" tabindex="-1">
    <div class="modal-content" on:click|stopPropagation on:keydown|stopPropagation role="dialog" tabindex="-1">
      <div class="modal-header">
        <h2>Apply for {type === 'job' ? 'Job' : 'Test'}</h2>
        <button class="close-button" on:click={handleClose} disabled={loading} aria-label="Close">
          ×
        </button>
      </div>

      <div class="modal-body">
        <h3>{title}</h3>
        
        <form on:submit|preventDefault={handleSubmit}>
          <div class="form-group">
            <label for="application-note">
              Why are you a good fit for this {type}? *
            </label>
            <textarea
              id="application-note"
              bind:value={applicationNote}
              placeholder="Tell us about your relevant experience and why you're interested in this {type}..."
              rows="6"
              disabled={loading}
              required
            />
          </div>

          {#if error}
            <div class="error-message">{error}</div>
          {/if}

          <div class="modal-actions">
            <button type="button" class="btn-secondary" on:click={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" class="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    max-width: 600px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 2rem;
    line-height: 1;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover:not(:disabled) {
    color: #111827;
  }

  .close-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-body h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    color: #374151;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }

  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
  }

  textarea:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  textarea:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  .error-message {
    padding: 0.75rem;
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    color: #dc2626;
    margin-bottom: 1rem;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    font-size: 1rem;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .btn-primary:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }

  .btn-secondary {
    background-color: #f3f4f6;
    color: #374151;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #e5e7eb;
  }

  .btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    .modal-content {
      max-width: 100%;
      margin: 0;
      border-radius: 0;
      max-height: 100vh;
    }

    .modal-actions {
      flex-direction: column-reverse;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
    }
  }
</style>