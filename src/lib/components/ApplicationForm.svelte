<script>
  /**
   * ApplicationForm Component
   *
   * Form for test takers to apply to a test.
   * Handles application submission with optional message.
   */

  export let testId = '';
  export let onSubmit = async () => {};
  export let onCancel = () => {};

  let applicationMessage = '';
  let loading = false;
  let error = '';
  let success = '';

  async function handleSubmit(event) {
    event.preventDefault();
    error = '';
    success = '';

    if (!testId) {
      error = 'Test ID is required';
      return;
    }

    loading = true;

    try {
      const result = await onSubmit({ 
        test_id: testId, 
        application_message: applicationMessage 
      });
      
      if (result?.success) {
        success = result.message || 'Application submitted successfully!';
        applicationMessage = '';
      } else if (result?.error) {
        error = result.error;
      }
    } catch (err) {
      error = err.message || 'Failed to submit application';
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit={handleSubmit} class="application-form">
  {#if error}
    <div class="alert alert-error" role="alert">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="alert alert-success" role="alert">
      {success}
    </div>
  {/if}

  <div class="form-group">
    <label for="application-message">Application Message (Optional)</label>
    <textarea
      id="application-message"
      bind:value={applicationMessage}
      placeholder="Tell the hirer why you're a good fit for this test..."
      rows="5"
      disabled={loading}
    ></textarea>
    <small class="help-text">
      Introduce yourself and explain why you're interested in this test.
    </small>
  </div>

  <div class="button-group">
    <button type="submit" class="btn btn-success" disabled={loading}>
      {loading ? 'Submitting...' : 'Submit Application'}
    </button>
    
    {#if onCancel}
      <button type="button" class="btn btn-secondary" on:click={onCancel} disabled={loading}>
        Cancel
      </button>
    {/if}
  </div>
</form>

<style>
  .application-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: var(--color-text);
  }

  textarea {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-family: inherit;
    background: var(--color-surface);
    color: var(--color-text);
    resize: vertical;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  :global(.dark) textarea:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
  }

  textarea:disabled {
    background-color: var(--color-bg-secondary);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .help-text {
    display: block;
    margin-top: var(--spacing-xs);
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .button-group {
    display: flex;
    gap: var(--spacing-md);
  }

  .btn {
    flex: 1;
    padding: var(--spacing-md) var(--spacing-lg);
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .btn-success {
    background: var(--color-success);
    color: white;
  }

  .btn-success:hover:not(:disabled) {
    background: var(--color-success-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .btn-success {
    box-shadow: var(--glow-success);
  }

  :global(.dark) .btn-success:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(0, 255, 136, 0.6), 0 0 30px rgba(0, 255, 136, 0.4);
  }

  .btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .alert {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
    border: 1px solid transparent;
  }

  .alert-error {
    background: var(--color-error-light);
    color: var(--color-error-dark);
    border-color: var(--color-error);
  }

  :global(.dark) .alert-error {
    background: rgba(255, 0, 85, 0.1);
    color: var(--color-error-light);
  }

  .alert-success {
    background: var(--color-success-light);
    color: var(--color-success-dark);
    border-color: var(--color-success);
  }

  :global(.dark) .alert-success {
    background: rgba(0, 255, 136, 0.1);
    color: var(--color-success-light);
  }
</style>