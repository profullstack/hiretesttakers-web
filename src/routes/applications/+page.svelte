<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import ApplicationCard from '$lib/components/ApplicationCard.svelte';

  let applications = [];
  let loading = true;
  let error = '';

  async function loadApplications() {
    loading = true;
    error = '';

    try {
      const response = await fetch('/api/applications');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load applications');
      }

      applications = data.applications || [];
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleViewApplication(application) {
    goto(`/tests/${application.test_id}`);
  }

  onMount(() => {
    loadApplications();
  });
</script>

<svelte:head>
  <title>My Applications - HireTestTakers</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>My Applications</h1>
    <a href="/tests" class="btn-primary">Browse Tests</a>
  </header>

  {#if loading}
    <div class="loading">Loading your applications...</div>
  {:else if error}
    <div class="error-box">
      <p>{error}</p>
      <button on:click={loadApplications} class="btn-secondary">Try Again</button>
    </div>
  {:else if applications.length === 0}
    <div class="empty-state">
      <h2>No Applications Yet</h2>
      <p>You haven't applied to any tests yet. Browse available tests and start applying!</p>
      <a href="/tests" class="btn-primary">Browse Tests</a>
    </div>
  {:else}
    <div class="applications-list">
      {#each applications as application (application.id)}
        <ApplicationCard
          {application}
          testTitle="Test #{application.test_id.slice(0, 8)}"
          onView={handleViewApplication}
        />
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .btn-primary,
  .btn-secondary {
    padding: var(--spacing-md) var(--spacing-xl);
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all var(--transition-base);
    display: inline-block;
    box-shadow: var(--shadow-sm);
  }

  .btn-primary {
    background: var(--color-primary);
    color: white;
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

  .btn-secondary {
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .btn-secondary:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-border-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  .loading {
    text-align: center;
    padding: 3rem 1rem;
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  .error-box {
    text-align: center;
    padding: 2rem;
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
    color: var(--color-error-dark);
  }

  :global(.dark) .error-box {
    background: rgba(255, 0, 85, 0.1);
    color: var(--color-error-light);
  }

  .error-box p {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--color-surface);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
  }

  .empty-state h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-text);
  }

  .empty-state p {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    color: var(--color-text-secondary);
  }

  .applications-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
      text-align: center;
    }
  }
</style>