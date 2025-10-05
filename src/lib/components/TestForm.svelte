<script>
  import { createEventDispatcher } from 'svelte';
  import PriceInput from './PriceInput.svelte';
  import FileUpload from './FileUpload.svelte';

  export let test = null;
  export let isEdit = false;

  const dispatch = createEventDispatcher();

  let title = test?.title || '';
  let description = test?.description || '';
  let category = test?.category || '';
  let difficulty = test?.difficulty || 'medium';
  let cryptocurrency = test?.cryptocurrency || 'BTC';
  let price = test?.price || 0;
  let priceMax = test?.price_max || null;
  let showRange = !!test?.price_max;
  let files = [];

  let loading = false;
  let error = '';
  let uploadProgress = '';

  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'programming', label: 'Programming' },
    { value: 'writing', label: 'Writing' },
    { value: 'language', label: 'Language' },
    { value: 'business', label: 'Business' },
    { value: 'other', label: 'Other' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    error = '';
    uploadProgress = '';
    loading = true;

    try {
      const testData = {
        title,
        description,
        category: category || null,
        difficulty,
        cryptocurrency,
        price: parseFloat(price),
        price_max: showRange && priceMax ? parseFloat(priceMax) : null
      };

      const url = isEdit ? `/api/tests/${test.id}` : '/api/tests';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save test');
      }

      const createdTest = data.test;

      // Upload files if any
      if (files.length > 0) {
        uploadProgress = `Uploading ${files.length} file(s)...`;

        for (let i = 0; i < files.length; i++) {
          uploadProgress = `Uploading file ${i + 1} of ${files.length}...`;
          
          const formData = new FormData();
          formData.append('file', files[i]);

          const uploadResponse = await fetch(`/api/tests/${createdTest.id}/attachments`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
          });

          if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.json();
            throw new Error(`File upload failed: ${uploadError.error}`);
          }
        }
      }

      dispatch('success', createdTest);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
      uploadProgress = '';
    }
  }

  function handleFilesChange(event) {
    files = event.detail;
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit={handleSubmit} class="test-form">
  {#if error}
    <div class="error-message">
      <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span>{error}</span>
    </div>
  {/if}

  <div class="form-section">
    <h3 class="section-title">Basic Information</h3>
    
    <div class="form-group">
      <label for="title">
        Test Title <span class="required">*</span>
      </label>
      <input
        id="title"
        type="text"
        bind:value={title}
        required
        placeholder="e.g., Advanced Calculus Test"
        maxlength="200"
        class="form-input"
      />
      <p class="field-hint">Choose a clear, descriptive title for your test</p>
    </div>

    <div class="form-group">
      <label for="description">
        Description <span class="required">*</span>
      </label>
      <textarea
        id="description"
        bind:value={description}
        required
        placeholder="Describe what the test covers, requirements, and expectations..."
        rows="6"
        class="form-input"
      ></textarea>
      <p class="field-hint">Provide detailed information about the test content and requirements</p>
    </div>
  </div>

  <div class="form-section">
    <h3 class="section-title">Test Details</h3>
    
    <div class="form-row">
      <div class="form-group">
        <label for="category">
          Category
        </label>
        <select id="category" bind:value={category} class="form-input">
          {#each categories as cat}
            <option value={cat.value}>{cat.label}</option>
          {/each}
        </select>
      </div>

      <div class="form-group">
        <label for="difficulty">
          Difficulty <span class="required">*</span>
        </label>
        <select id="difficulty" bind:value={difficulty} required class="form-input">
          {#each difficulties as diff}
            <option value={diff.value}>{diff.label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="form-section">
    <h3 class="section-title">Payment</h3>
    
    <div class="form-group">
      <PriceInput
        bind:cryptocurrency
        bind:price
        bind:priceMax
        bind:showRange
        required={true}
      />
    </div>
  </div>

  <div class="form-section">
    <h3 class="section-title">Attachments (Optional)</h3>
    <p class="section-description">
      Upload supporting materials like notes, PDFs, or reference documents
    </p>
    
    <div class="form-group">
      <FileUpload
        bind:files
        on:change={handleFilesChange}
        disabled={loading}
        maxFiles={5}
      />
    </div>
  </div>

  <div class="form-actions">
    <button type="button" on:click={handleCancel} class="btn btn-secondary" disabled={loading}>
      Cancel
    </button>
    <button type="submit" class="btn btn-primary" disabled={loading}>
      {#if loading}
        <span class="spinner"></span>
        <span>{uploadProgress || 'Saving...'}</span>
      {:else}
        <span>{isEdit ? 'Update Test' : 'Create Test'}</span>
      {/if}
    </button>
  </div>
</form>

<style>
  .test-form {
    width: 100%;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-lg);
    color: var(--color-error-dark);
    font-size: 0.9375rem;
    animation: slideIn 0.3s ease-out;
  }

  .error-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .form-section {
    margin-bottom: var(--spacing-2xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--color-border);
  }

  .form-section:last-of-type {
    border-bottom: none;
    padding-bottom: 0;
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm);
    letter-spacing: -0.01em;
  }

  .section-description {
    font-size: 0.9375rem;
    color: var(--color-text-secondary);
    margin: 0 0 var(--spacing-lg);
    line-height: 1.5;
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-group:last-child {
    margin-bottom: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
  }

  label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    font-size: 0.9375rem;
    color: var(--color-text);
    letter-spacing: 0.01em;
  }

  .required {
    color: var(--color-error);
  }

  .form-input,
  input[type='text'],
  textarea,
  select {
    width: 100%;
    padding: var(--spacing-md);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    font-size: 1rem;
    font-family: inherit;
    color: var(--color-text);
    background: var(--color-surface);
    transition: all var(--transition-base);
  }

  .form-input:hover,
  input[type='text']:hover,
  textarea:hover,
  select:hover {
    border-color: var(--color-border-hover);
  }

  .form-input:focus,
  input[type='text']:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  textarea {
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
  }

  .field-hint {
    margin: var(--spacing-xs) 0 0;
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    line-height: 1.4;
  }

  .form-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    margin-top: var(--spacing-2xl);
    padding-top: var(--spacing-xl);
    border-top: 2px solid var(--color-border);
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: var(--radius-lg);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    letter-spacing: 0.01em;
    min-width: 140px;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-md);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }

  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-secondary {
    background: var(--color-gray-200);
    color: var(--color-text);
    border: 2px solid var(--color-border);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--color-gray-300);
    border-color: var(--color-border-hover);
  }

  .spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Dark mode enhancements */
  :global(.dark) .form-input:focus,
  :global(.dark) input[type='text']:focus,
  :global(.dark) textarea:focus,
  :global(.dark) select:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.15);
  }

  :global(.dark) .btn-primary {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }

  /* Dark mode: Better contrast for secondary button */
  :global(.dark) .btn-secondary {
    background: var(--color-gray-700);
    color: var(--color-text);
    border-color: var(--color-gray-600);
  }

  :global(.dark) .btn-secondary:hover:not(:disabled) {
    background: var(--color-gray-600);
    border-color: var(--color-gray-500);
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .section-title {
      font-size: 1.125rem;
    }
  }

  @media (max-width: 640px) {
    .form-actions {
      flex-direction: column-reverse;
    }

    .btn {
      width: 100%;
      min-width: unset;
    }

    .form-section {
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-lg);
    }
  }
</style>