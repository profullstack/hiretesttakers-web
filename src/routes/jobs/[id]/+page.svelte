<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let assignment = null;
  let loading = true;
  let error = '';
  let submitting = false;
  let revisionNotes = '';
  let showRevisionForm = false;

  $: assignmentId = $page.params.id;

  onMount(async () => {
    await loadAssignment();
  });

  async function loadAssignment() {
    loading = true;
    error = '';

    try {
      const response = await fetch(`/api/jobs/${assignmentId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load assignment');
      }

      assignment = data.assignment;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleRequestRevision() {
    if (!revisionNotes.trim()) {
      alert('Please provide revision notes');
      return;
    }

    submitting = true;
    try {
      const response = await fetch(`/api/jobs/${assignmentId}/revisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: revisionNotes })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request revision');
      }

      alert('Revision requested successfully');
      revisionNotes = '';
      showRevisionForm = false;
      await loadAssignment();
    } catch (err) {
      alert(err.message);
    } finally {
      submitting = false;
    }
  }

  async function generateQualityReport() {
    try {
      const response = await fetch(`/api/jobs/${assignmentId}/quality-report`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quality report');
      }

      alert(`Quality Report Generated!\nGrammar: ${data.report.grammar_score}%\nCitation: ${data.report.citation_score}%\nContent: ${data.report.content_quality_score}%\nOverall: ${data.report.overall_score}%`);
      await loadAssignment();
    } catch (err) {
      alert(err.message);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function formatStatus(status) {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
</script>

<svelte:head>
  <title>{assignment?.title || 'Job'} - TutorLinkup</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">Loading job...</div>
  {:else if error}
    <div class="error-message">{error}</div>
    <button on:click={() => goto('/jobs')} class="btn-secondary">
      Back to Jobs
    </button>
  {:else if assignment}
    <div class="assignment-detail">
      <div class="header">
        <div>
          <h1>{assignment.title}</h1>
          <span class="status">{formatStatus(assignment.status)}</span>
        </div>
        <button on:click={() => goto('/jobs')} class="btn-secondary">
          Back to List
        </button>
      </div>

      <div class="section">
        <h2>Topic</h2>
        <p>{assignment.topic}</p>
      </div>

      <div class="section">
        <h2>Description & Requirements</h2>
        <p class="description">{assignment.description}</p>
      </div>

      <div class="details-grid">
        <div class="detail-item">
          <span class="label">Word Count:</span>
          <span class="value">{assignment.word_count.toLocaleString()}</span>
        </div>

        {#if assignment.academic_levels}
          <div class="detail-item">
            <span class="label">Academic Level:</span>
            <span class="value">{assignment.academic_levels.name}</span>
          </div>
        {/if}

        {#if assignment.citation_styles}
          <div class="detail-item">
            <span class="label">Citation Style:</span>
            <span class="value">{assignment.citation_styles.name}</span>
          </div>
        {/if}

        <div class="detail-item">
          <span class="label">Deadline:</span>
          <span class="value">{formatDate(assignment.deadline)}</span>
        </div>

        <div class="detail-item">
          <span class="label">Price:</span>
          <span class="value price">${assignment.price.toFixed(2)}</span>
        </div>

        <div class="detail-item">
          <span class="label">Plagiarism Check:</span>
          <span class="value">{assignment.plagiarism_check_requested ? 'Yes' : 'No'}</span>
        </div>

        <div class="detail-item">
          <span class="label">Created:</span>
          <span class="value">{formatDate(assignment.created_at)}</span>
        </div>
      </div>

      {#if assignment.assignment_submissions && assignment.assignment_submissions.length > 0}
        <div class="section">
          <h2>Submissions</h2>
          {#each assignment.assignment_submissions as submission}
            <div class="submission-card">
              <p><strong>Submitted:</strong> {formatDate(submission.submitted_at)}</p>
              <p><strong>Word Count:</strong> {submission.word_count.toLocaleString()}</p>
              {#if submission.file_url}
                <a href={submission.file_url} target="_blank" class="btn-primary">Download File</a>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      {#if assignment.assignment_revisions && assignment.assignment_revisions.length > 0}
        <div class="section">
          <h2>Revisions</h2>
          {#each assignment.assignment_revisions as revision}
            <div class="revision-card">
              <p><strong>Status:</strong> {formatStatus(revision.status)}</p>
              <p><strong>Notes:</strong> {revision.notes}</p>
              <p><strong>Requested:</strong> {formatDate(revision.created_at)}</p>
            </div>
          {/each}
        </div>
      {/if}

      {#if assignment.quality_reports && assignment.quality_reports.length > 0}
        <div class="section">
          <h2>Quality Reports</h2>
          {#each assignment.quality_reports as report}
            <div class="quality-card">
              <div class="scores">
                <div class="score-item">
                  <span>Grammar:</span>
                  <span class="score">{report.grammar_score}%</span>
                </div>
                <div class="score-item">
                  <span>Citation:</span>
                  <span class="score">{report.citation_score}%</span>
                </div>
                <div class="score-item">
                  <span>Content:</span>
                  <span class="score">{report.content_quality_score}%</span>
                </div>
                <div class="score-item">
                  <span>Overall:</span>
                  <span class="score overall">{report.overall_score}%</span>
                </div>
              </div>
              {#if report.feedback}
                <p class="feedback">{report.feedback}</p>
              {/if}
            </div>
          {/each}
        </div>
      {/if}

      {#if assignment.plagiarism_reports && assignment.plagiarism_reports.length > 0}
        <div class="section">
          <h2>Plagiarism Reports</h2>
          <p class="reports-summary">
            {assignment.plagiarism_reports.length} report{assignment.plagiarism_reports.length !== 1 ? 's' : ''} available
          </p>
          <button on:click={() => goto(`/jobs/${assignmentId}/plagiarism-reports`)} class="btn-primary">
            View All Plagiarism Reports
          </button>
        </div>
      {/if}

      <div class="actions">
        {#if assignment.status === 'submitted'}
          {#if !showRevisionForm}
            <button on:click={() => showRevisionForm = true} class="btn-primary">
              Request Revision
            </button>
          {/if}
          <button on:click={generateQualityReport} class="btn-secondary">
            Generate Quality Report
          </button>
        {/if}
        {#if assignment.plagiarism_check_requested}
          <button on:click={() => goto(`/jobs/${assignmentId}/plagiarism-reports`)} class="btn-secondary">
            📋 Plagiarism Reports
          </button>
        {/if}
      </div>

      {#if showRevisionForm}
        <div class="revision-form">
          <h3>Request Revision</h3>
          <textarea
            bind:value={revisionNotes}
            placeholder="Describe what needs to be revised..."
            rows="4"
          ></textarea>
          <div class="form-actions">
            <button on:click={() => showRevisionForm = false} class="btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button on:click={handleRequestRevision} class="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Revision Request'}
            </button>
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--spacing-xl);
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }

  .loading {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--color-text-secondary);
    font-size: 1.125rem;
  }

  .error-message {
    padding: var(--spacing-lg);
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

  .assignment-detail {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
  }

  :global(.dark) .assignment-detail {
    box-shadow: var(--shadow-lg);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: var(--spacing-xl);
    border-bottom: 1px solid var(--color-border);
  }

  h1 {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: 2rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .status {
    display: inline-block;
    padding: var(--spacing-xs) var(--spacing-md);
    background: rgba(91, 127, 232, 0.15);
    color: var(--color-primary);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
  }

  :global(.dark) .status {
    background: rgba(0, 240, 255, 0.2);
    color: var(--color-primary);
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }

  .section {
    padding: var(--spacing-xl);
    border-bottom: 1px solid var(--color-border);
  }

  .section:last-child {
    border-bottom: none;
  }

  h2 {
    margin: 0 0 var(--spacing-md) 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .description {
    line-height: 1.6;
    color: var(--color-text);
    white-space: pre-wrap;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-md);
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .label {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
    font-weight: 500;
  }

  .value {
    font-size: 1rem;
    color: var(--color-text);
    font-weight: 600;
  }

  .value.price {
    color: var(--color-success);
  }

  :global(.dark) .value.price {
    text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
  }

  .submission-card,
  .revision-card,
  .quality-card {
    padding: var(--spacing-md);
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
  }

  :global(.dark) .submission-card,
  :global(.dark) .revision-card,
  :global(.dark) .quality-card {
    box-shadow: var(--shadow-sm);
  }

  .scores {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  .score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-text-secondary);
  }

  .score {
    font-weight: 600;
    color: var(--color-primary);
  }

  :global(.dark) .score {
    text-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }

  .score.overall {
    font-size: 1.25rem;
    color: var(--color-success);
  }

  :global(.dark) .score.overall {
    text-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
  }

  .feedback {
    margin: var(--spacing-md) 0 0 0;
    padding: var(--spacing-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-style: italic;
    color: var(--color-text-secondary);
  }

  .reports-summary {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text-secondary);
  }

  .actions {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-xl);
    flex-wrap: wrap;
  }

  .revision-form {
    padding: var(--spacing-xl);
    border-top: 1px solid var(--color-border);
    background: var(--color-bg-secondary);
  }

  .revision-form h3 {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text);
  }

  .revision-form textarea {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
    background: var(--color-surface);
    color: var(--color-text);
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }

  .revision-form textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  :global(.dark) .revision-form textarea:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
  }

  .form-actions {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
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

  @media (max-width: 768px) {
    .container {
      padding: var(--spacing-md);
    }

    .header {
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .details-grid {
      grid-template-columns: 1fr;
    }

    .actions {
      flex-direction: column;
    }

    button {
      width: 100%;
    }
  }
</style>