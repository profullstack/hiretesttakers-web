<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import JobRequestForm from '$lib/components/JobRequestForm.svelte';

  let assignment = null;
  let loading = true;
  let error = '';

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

      assignment = data.job;

      // Check if job can be edited (only pending jobs)
      if (assignment.status !== 'pending') {
        error = 'Only pending jobs can be edited';
        assignment = null;
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleSuccess() {
    goto(`/jobs/${assignmentId}`);
  }

  function handleCancel() {
    goto(`/jobs/${assignmentId}`);
  }
</script>

<svelte:head>
  <title>Edit Job - TutorLinkup</title>
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
    <JobRequestForm
      assignment={assignment}
      isEdit={true}
      on:success={handleSuccess}
      on:cancel={handleCancel}
    />
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

  .btn-secondary {
    padding: var(--spacing-md) var(--spacing-lg);
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-hover);
  }

  :global(.dark) .btn-secondary:hover {
    border-color: var(--color-primary);
    box-shadow: 0 0 5px rgba(0, 240, 255, 0.3);
  }
</style>