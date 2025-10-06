<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import PlagiarismReport from '$lib/components/PlagiarismReport.svelte';
  import Spinner from '$lib/components/Spinner.svelte';

  let loading = true;
  let generating = false;
  let error = '';
  let reports = [];
  let job = null;
  let includeArchived = false;
  let content = '';
  let showGenerateForm = false;

  $: jobId = $page.params.id;

  onMount(async () => {
    await loadReports();
    await loadJob();
  });

  async function loadJob() {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        job = data.job;
      }
    } catch (err) {
      console.error('Error loading job:', err);
    }
  }

  async function loadReports() {
    try {
      loading = true;
      error = '';
      const url = `/api/plagiarism-reports?jobId=${jobId}&includeArchived=${includeArchived}`;
      const response = await fetch(url);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to load reports');
      }

      const data = await response.json();
      reports = data.reports || [];
    } catch (err) {
      error = err.message;
      console.error('Error loading reports:', err);
    } finally {
      loading = false;
    }
  }

  async function generateReport() {
    if (!content.trim()) {
      error = 'Please enter content to check';
      return;
    }

    try {
      generating = true;
      error = '';

      const response = await fetch('/api/plagiarism-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, content })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate report');
      }

      content = '';
      showGenerateForm = false;
      await loadReports();
    } catch (err) {
      error = err.message;
      console.error('Error generating report:', err);
    } finally {
      generating = false;
    }
  }

  async function handleArchive(reportId) {
    try {
      const response = await fetch(`/api/plagiarism-reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: true })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to archive report');
      }

      await loadReports();
    } catch (err) {
      error = err.message;
      console.error('Error archiving report:', err);
    }
  }

  async function handleUnarchive(reportId) {
    try {
      const response = await fetch(`/api/plagiarism-reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ archived: false })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to unarchive report');
      }

      await loadReports();
    } catch (err) {
      error = err.message;
      console.error('Error unarchiving report:', err);
    }
  }

  async function handleDelete(reportId) {
    try {
      const response = await fetch(`/api/plagiarism-reports/${reportId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete report');
      }

      await loadReports();
    } catch (err) {
      error = err.message;
      console.error('Error deleting report:', err);
    }
  }

  function toggleArchived() {
    includeArchived = !includeArchived;
    loadReports();
  }
</script>

<svelte:head>
  <title>Plagiarism Reports - HireTestTakers</title>
</svelte:head>

<div class="container">
  <div class="header">
    <div class="header-content">
      <button class="back-button" on:click={() => goto(`/jobs/${jobId}`)}>
        ← Back to Job
      </button>
      <h1>Plagiarism Reports</h1>
      {#if job}
        <p class="job-title">{job.title}</p>
      {/if}
    </div>

    <div class="header-actions">
      <button class="btn-primary" on:click={() => (showGenerateForm = !showGenerateForm)}>
        {showGenerateForm ? 'Cancel' : '+ Generate New Report'}
      </button>
      <button class="btn-secondary" on:click={toggleArchived}>
        {includeArchived ? 'Hide Archived' : 'Show Archived'}
      </button>
    </div>
  </div>

  {#if error}
    <div class="error-message">
      {error}
      <button on:click={() => (error = '')}>×</button>
    </div>
  {/if}

  {#if showGenerateForm}
    <div class="generate-form">
      <h3>Generate Plagiarism Report</h3>
      <p class="form-description">
        Paste the content you want to check for plagiarism. The AI will analyze it and provide a
        detailed report.
      </p>
      <textarea
        bind:value={content}
        placeholder="Paste content here..."
        rows="10"
        disabled={generating}
      />
      <div class="form-actions">
        <button class="btn-primary" on:click={generateReport} disabled={generating || !content.trim()}>
          {generating ? 'Analyzing...' : 'Generate Report'}
        </button>
        <button class="btn-secondary" on:click={() => (showGenerateForm = false)} disabled={generating}>
          Cancel
        </button>
      </div>
    </div>
  {/if}

  {#if loading}
    <div class="loading-container">
      <Spinner />
      <p>Loading reports...</p>
    </div>
  {:else if reports.length === 0}
    <div class="empty-state">
      <p>No plagiarism reports found for this job.</p>
      {#if !showGenerateForm}
        <button class="btn-primary" on:click={() => (showGenerateForm = true)}>
          Generate First Report
        </button>
      {/if}
    </div>
  {:else}
    <div class="reports-list">
      <p class="reports-count">{reports.length} report{reports.length !== 1 ? 's' : ''} found</p>
      {#each reports as report (report.id)}
        <PlagiarismReport
          {report}
          onArchive={handleArchive}
          onUnarchive={handleUnarchive}
          onDelete={handleDelete}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .header {
    margin-bottom: 2rem;
  }

  .header-content {
    margin-bottom: 1rem;
  }

  .back-button {
    background: none;
    border: none;
    color: var(--color-primary);
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.5rem 0;
    margin-bottom: 0.5rem;
  }

  .back-button:hover {
    text-decoration: underline;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }

  .job-title {
    margin: 0;
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .error-message {
    background: var(--color-red);
    color: white;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .error-message button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 2rem;
    height: 2rem;
  }

  .generate-form {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .generate-form h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }

  .form-description {
    margin: 0 0 1rem 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    font-family: inherit;
    font-size: 0.875rem;
    resize: vertical;
    background: var(--bg-primary);
    color: var(--text-primary);
  }

  textarea:focus {
    outline: none;
    border-color: var(--color-primary);
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    color: var(--text-secondary);
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-secondary);
  }

  .empty-state p {
    margin-bottom: 1.5rem;
  }

  .reports-list {
    margin-top: 1.5rem;
  }

  .reports-count {
    margin: 0 0 1rem 0;
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--color-primary-dark);
  }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .btn-secondary:hover {
    background: var(--bg-primary);
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .header-actions {
      flex-direction: column;
    }

    .header-actions button {
      width: 100%;
    }

    .form-actions {
      flex-direction: column;
    }

    .form-actions button {
      width: 100%;
    }
  }
</style>