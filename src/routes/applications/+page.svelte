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
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #e5e7eb;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
  }

  .btn-primary,
  .btn-secondary {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s;
    display: inline-block;
  }

  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background-color: #2563eb;
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #4b5563;
  }

  .loading {
    text-align: center;
    padding: 3rem 1rem;
    font-size: 1.125rem;
    color: #6b7280;
  }

  .error-box {
    text-align: center;
    padding: 2rem;
    background: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    color: #991b1b;
  }

  .error-box p {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
  }

  .empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: #f9fafb;
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
  }

  .empty-state h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
  }

  .empty-state p {
    margin: 0 0 1.5rem 0;
    font-size: 1.125rem;
    color: #6b7280;
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