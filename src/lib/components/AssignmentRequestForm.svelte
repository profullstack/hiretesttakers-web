<script>
  import { createEventDispatcher, onMount } from 'svelte';

  export let assignment = null;
  export let isEdit = false;

  const dispatch = createEventDispatcher();

  let title = assignment?.title || '';
  let description = assignment?.description || '';
  let topic = assignment?.topic || '';
  let academicLevelId = assignment?.academic_level_id || '';
  let citationStyleId = assignment?.citation_style_id || '';
  let wordCount = assignment?.word_count || 1000;
  let deadline = assignment?.deadline ? assignment.deadline.split('T')[0] : '';
  let price = assignment?.price || 0;
  let plagiarismCheckRequested = assignment?.plagiarism_check_requested || false;

  let academicLevels = [];
  let citationStyles = [];
  let loading = false;
  let error = '';

  onMount(async () => {
    await loadAcademicLevels();
    await loadCitationStyles();
  });

  async function loadAcademicLevels() {
    try {
      const response = await fetch('/api/assignments?academic_levels=true');
      const data = await response.json();
      if (response.ok) {
        academicLevels = data.academic_levels;
      }
    } catch (err) {
      console.error('Failed to load academic levels:', err);
    }
  }

  async function loadCitationStyles() {
    try {
      const response = await fetch('/api/assignments?citation_styles=true');
      const data = await response.json();
      if (response.ok) {
        citationStyles = data.citation_styles;
      }
    } catch (err) {
      console.error('Failed to load citation styles:', err);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    error = '';
    loading = true;

    try {
      const assignmentData = {
        title,
        description,
        topic,
        academic_level_id: academicLevelId || null,
        citation_style_id: citationStyleId || null,
        word_count: parseInt(wordCount),
        deadline: new Date(deadline).toISOString(),
        price: parseFloat(price),
        plagiarism_check_requested: plagiarismCheckRequested
      };

      const url = isEdit ? `/api/assignments/${assignment.id}` : '/api/assignments';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save assignment');
      }

      dispatch('success', data.request);
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

<form on:submit={handleSubmit} class="assignment-form">
  <h2>{isEdit ? 'Edit Assignment' : 'Request Assignment Writing'}</h2>

  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  <div class="form-group">
    <label for="title">
      Assignment Title *
    </label>
    <input
      id="title"
      type="text"
      bind:value={title}
      required
      placeholder="e.g., Research Paper on Climate Change"
      maxlength="200"
    />
  </div>

  <div class="form-group">
    <label for="topic">
      Topic *
    </label>
    <input
      id="topic"
      type="text"
      bind:value={topic}
      required
      placeholder="e.g., Impact of Climate Change on Biodiversity"
      maxlength="200"
    />
  </div>

  <div class="form-group">
    <label for="description">
      Description & Requirements *
    </label>
    <textarea
      id="description"
      bind:value={description}
      required
      placeholder="Describe the assignment requirements, formatting guidelines, sources needed, etc..."
      rows="6"
    ></textarea>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="academicLevel">
        Academic Level
      </label>
      <select id="academicLevel" bind:value={academicLevelId}>
        <option value="">Select level (optional)</option>
        {#each academicLevels as level}
          <option value={level.id}>{level.name}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label for="citationStyle">
        Citation Style
      </label>
      <select id="citationStyle" bind:value={citationStyleId}>
        <option value="">Select style (optional)</option>
        {#each citationStyles as style}
          <option value={style.id}>{style.name}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="wordCount">
        Word Count *
      </label>
      <input
        id="wordCount"
        type="number"
        bind:value={wordCount}
        required
        min="100"
        max="50000"
        step="100"
      />
    </div>

    <div class="form-group">
      <label for="deadline">
        Deadline *
      </label>
      <input
        id="deadline"
        type="date"
        bind:value={deadline}
        required
        min={new Date().toISOString().split('T')[0]}
      />
    </div>
  </div>

  <div class="form-group">
    <label for="price">
      Price (USD) *
    </label>
    <input
      id="price"
      type="number"
      bind:value={price}
      required
      min="0"
      step="0.01"
      placeholder="0.00"
    />
    <small>Set your budget for this assignment</small>
  </div>

  <div class="form-group">
    <label class="checkbox-label">
      <input
        type="checkbox"
        bind:checked={plagiarismCheckRequested}
      />
      Request plagiarism check report
    </label>
  </div>

  <div class="form-actions">
    <button type="button" on:click={handleCancel} class="btn-secondary" disabled={loading}>
      Cancel
    </button>
    <button type="submit" class="btn-primary" disabled={loading}>
      {loading ? 'Saving...' : isEdit ? 'Update Assignment' : 'Submit Request'}
    </button>
  </div>
</form>

<style>
  .assignment-form {
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

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .checkbox-label input[type='checkbox'] {
    width: auto;
    cursor: pointer;
  }

  input[type='text'],
  input[type='number'],
  input[type='date'],
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
  input[type='number']:focus,
  input[type='date']:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #007bff;
  }

  textarea {
    resize: vertical;
  }

  small {
    display: block;
    margin-top: 0.25rem;
    color: #666;
    font-size: 0.875rem;
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