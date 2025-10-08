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
    padding: 2rem;
  }

  .loading {
    text-align: center;
    padding: 3rem;
    color: #666;
  }

  .error-message {
    padding: 1rem;
    margin-bottom: 1rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    color: #721c24;
  }

  .assignment-detail {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 600;
  }

  .status {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: #d1ecf1;
    color: #0c5460;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .section {
    padding: 2rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .section:last-child {
    border-bottom: none;
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .description {
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
    background: #f8f9fa;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .label {
    font-size: 0.875rem;
    color: #666;
    font-weight: 500;
  }

  .value {
    font-size: 1rem;
    color: #333;
    font-weight: 600;
  }

  .value.price {
    color: #28a745;
  }

  .submission-card,
  .revision-card,
  .quality-card {
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .scores {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .score {
    font-weight: 600;
    color: #007bff;
  }

  .score.overall {
    font-size: 1.25rem;
    color: #28a745;
  }

  .feedback {
    margin: 1rem 0 0 0;
    padding: 1rem;
    background: white;
    border-radius: 4px;
    font-style: italic;
  }

  .reports-summary {
    margin: 0 0 1rem 0;
    color: #666;
  }

  .actions {
    display: flex;
    gap: 1rem;
    padding: 2rem;
  }

  .revision-form {
    padding: 2rem;
    border-top: 1px solid #e0e0e0;
  }

  .revision-form h3 {
    margin: 0 0 1rem 0;
  }

  .revision-form textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-family: inherit;
    font-size: 1rem;
    resize: vertical;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
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

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .header {
      flex-direction: column;
      gap: 1rem;
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