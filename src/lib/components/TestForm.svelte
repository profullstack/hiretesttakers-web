<script>
  import { createEventDispatcher } from 'svelte';
  import PriceInput from './PriceInput.svelte';

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

  let loading = false;
  let error = '';

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

      dispatch('success', data.test);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit={handleSubmit} class="test-form">
  <h2>{isEdit ? 'Edit Test' : 'Create New Test'}</h2>

  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  <div class="form-group">
    <label for="title">
      Test Title *
    </label>
    <input
      id="title"
      type="text"
      bind:value={title}
      required
      placeholder="e.g., Advanced Calculus Test"
      maxlength="200"
    />
  </div>

  <div class="form-group">
    <label for="description">
      Description *
    </label>
    <textarea
      id="description"
      bind:value={description}
      required
      placeholder="Describe what the test covers, requirements, and expectations..."
      rows="5"
    ></textarea>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="category">
        Category
      </label>
      <select id="category" bind:value={category}>
        {#each categories as cat}
          <option value={cat.value}>{cat.label}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label for="difficulty">
        Difficulty *
      </label>
      <select id="difficulty" bind:value={difficulty} required>
        {#each difficulties as diff}
          <option value={diff.value}>{diff.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="form-group">
    <PriceInput
      bind:cryptocurrency
      bind:price
      bind:priceMax
      bind:showRange
      required={true}
    />
  </div>

  <div class="form-actions">
    <button type="button" on:click={handleCancel} class="btn-secondary" disabled={loading}>
      Cancel
    </button>
    <button type="submit" class="btn-primary" disabled={loading}>
      {loading ? 'Saving...' : isEdit ? 'Update Test' : 'Create Test'}
    </button>
  </div>
</form>

<style>
  .test-form {
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    margin: 0 0 2rem 0;
    font-size: 1.75rem;
    font-weight: 600;
  }

  .error-message {
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    color: #721c24;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  input[type='text'],
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
  }

  input[type='text']:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #007bff;
  }

  textarea {
    resize: vertical;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #545b62;
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    button {
      width: 100%;
    }
  }
</style>