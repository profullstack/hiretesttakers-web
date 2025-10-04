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
    />
    <small class="help-text">
      Introduce yourself and explain why you're interested in this test.
    </small>
  </div>

  <div class="button-group">
    <button type="submit" class="btn btn-primary" disabled={loading}>
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
    border-radius: 0.375rem;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: border-color 0.2s;
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

  .help-text {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .button-group {
    display: flex;
    gap: 1rem;
  }

  .btn {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background-color: #4b5563;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .alert {
    padding: 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }

  .alert-error {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .alert-success {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }
</style>