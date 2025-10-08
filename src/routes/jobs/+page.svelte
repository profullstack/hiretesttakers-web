<script>
  import { onMount } from 'svelte';
  import JobCard from '$lib/components/JobCard.svelte';

  let jobs = [];
  let loading = true;
  let error = '';
  let statusFilter = '';

  onMount(async () => {
    await loadJobs();
  });

  async function loadJobs() {
    loading = true;
    error = '';

    try {
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/jobs?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load jobs');
      }

      jobs = data.requests;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleFilterChange() {
    loadJobs();
  }
</script>

<svelte:head>
  <title>Jobs - TutorLinkup</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>My Jobs</h1>
    <a href="/jobs/new" class="btn-primary">
      Request New Job
    </a>
  </div>

  <div class="filters">
    <label for="status">Filter by Status:</label>
    <select id="status" bind:value={statusFilter} on:change={handleFilterChange}>
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="assigned">Assigned</option>
      <option value="in_progress">In Progress</option>
      <option value="submitted">Submitted</option>
      <option value="revision_requested">Revision Requested</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  </div>

  {#if loading}
    <div class="loading">Loading jobs...</div>
  {:else if error}
    <div class="error-message">{error}</div>
  {:else if jobs.length === 0}
    <div class="empty-state">
      <p>No jobs found.</p>
      <a href="/jobs/new" class="btn-primary">Create Your First Job Request</a>
    </div>
  {:else}
    <div class="jobs-grid">
      {#each jobs as job (job.id)}
        <JobCard job={job} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl);
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--color-border);
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .btn-primary {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    text-decoration: none;
    border-radius: var(--radius-md);
    font-weight: 500;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .btn-primary {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .btn-primary:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }

  .filters {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
  }

  .filters label {
    font-weight: 500;
    color: var(--color-text);
  }

  .filters select {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    background: var(--color-bg);
    color: var(--color-text);
    transition: all var(--transition-base);
  }

  .filters select:hover {
    border-color: var(--color-primary);
  }

  .filters select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  :global(.dark) .filters select:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
  }

  .loading {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--color-text-secondary);
    font-size: 1.125rem;
  }

  .error-message {
    padding: var(--spacing-lg);
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
    color: var(--color-error-dark);
  }

  :global(.dark) .error-message {
    background: rgba(255, 0, 85, 0.1);
    color: var(--color-error-light);
  }

  .empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--color-surface);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
  }

  .empty-state p {
    margin: 0 0 var(--spacing-xl) 0;
    color: var(--color-text-secondary);
    font-size: 1.125rem;
  }

  .jobs-grid {
    display: grid;
    gap: var(--spacing-xl);
  }

  @media (max-width: 768px) {
    .container {
      padding: var(--spacing-md);
    }

    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .btn-primary {
      width: 100%;
      text-align: center;
    }

    .filters {
      flex-direction: column;
      align-items: flex-start;
    }

    .filters select {
      width: 100%;
    }
  }
</style>