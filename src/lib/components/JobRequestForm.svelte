<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import PriceInput from './PriceInput.svelte';

  export let assignment = null;
  export let isEdit = false;

  const dispatch = createEventDispatcher();

  let title = assignment?.title || '';
  let description = assignment?.description || '';
  let topic = assignment?.topic || '';
  let jobType = assignment?.job_type || 'homework';
  let academicLevelId = assignment?.academic_level_id || '';
  let citationStyleId = assignment?.citation_style_id || '';
  let wordCount = assignment?.word_count || 1000;
  let deadline = assignment?.deadline ? assignment.deadline.split('T')[0] : '';
  let cryptocurrency = assignment?.cryptocurrency || 'BTC';
  let price = assignment?.price || 0;
  let priceMax = assignment?.max_price || null;
  let showRange = false;
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
      const response = await fetch('/api/jobs?academic_levels=true');
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
      const response = await fetch('/api/jobs?citation_styles=true');
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
      const jobData = {
        title,
        description,
        topic,
        job_type: jobType,
        academic_level_id: academicLevelId || null,
        citation_style_id: citationStyleId || null,
        word_count: parseInt(wordCount),
        deadline: new Date(deadline).toISOString(),
        cryptocurrency,
        price: parseFloat(price),
        max_price: showRange && priceMax ? parseFloat(priceMax) : null,
        plagiarism_check_requested: plagiarismCheckRequested
      };

      const url = isEdit ? `/api/jobs/${assignment.id}` : '/api/jobs';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jobData)
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
  <h2>{isEdit ? 'Edit Job' : 'Request New Job'}</h2>

  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  <div class="form-group">
    <label for="jobType">
      Job Type *
    </label>
    <select id="jobType" bind:value={jobType} required>
      <option value="tutoring">Tutoring</option>
      <option value="programming">Programming</option>
      <option value="exercise">Exercise</option>
      <option value="homework">Homework</option>
    </select>
    <small>Need someone to take a test for you? <a href="/browse-tests/new">Post a test</a> instead.</small>
  </div>

  <div class="form-group">
    <label for="title">
      Job Title *
    </label>
    <input
      id="title"
      type="text"
      bind:value={title}
      required
      placeholder="e.g., Research Paper on Climate Change"
      maxlength="200"
    />
    <small>Brief title describing the job</small>
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
    <PriceInput
      bind:cryptocurrency
      bind:price
      bind:priceMax
      bind:showRange
      label="Budget"
      required={true}
    />
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
      {loading ? 'Saving...' : isEdit ? 'Update Job' : 'Submit Request'}
    </button>
  </div>
</form>

<style>
  .assignment-form {
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    margin: 0 0 var(--spacing-xl) 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .error-message {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
    color: var(--color-error-dark);
  }

  :global(.dark) .error-message {
    background: rgba(255, 0, 85, 0.1);
    color: var(--color-error-light);
  }

  .form-group {
    margin-bottom: var(--spacing-lg);
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
  }

  label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: var(--color-text);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    color: var(--color-text);
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
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-family: inherit;
    background: var(--color-surface);
    color: var(--color-text);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  input[type='text']:focus,
  input[type='number']:focus,
  input[type='date']:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  :global(.dark) input[type='text']:focus,
  :global(.dark) input[type='number']:focus,
  :global(.dark) input[type='date']:focus,
  :global(.dark) textarea:focus,
  :global(.dark) select:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
  }

  textarea {
    resize: vertical;
  }

  small {
    display: block;
    margin-top: var(--spacing-xs);
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }

  small a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
  }

  small a:hover {
    text-decoration: underline;
  }

  :global(.dark) small a {
    text-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }

  .form-actions {
    display: flex;
    gap: var(--spacing-md);
    justify-content: flex-end;
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-xl);
    border-top: 1px solid var(--color-border);
  }

  button {
    padding: var(--spacing-md) var(--spacing-lg);
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .btn-primary {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .btn-primary:hover:not(:disabled) {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }

  .btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-hover);
  }

  :global(.dark) .btn-secondary:hover:not(:disabled) {
    border-color: var(--color-primary);
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
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