<script>
  import { onMount } from 'svelte';
  import TestCard from '$lib/components/TestCard.svelte';

  let tests = [];
  let loading = true;
  let error = '';
  let statusFilter = '';

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  async function loadMyTests() {
    loading = true;
    error = '';

    try {
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/tests/my-tests?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load tests');
      }

      tests = data.tests;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleFilterChange() {
    loadMyTests();
  }

  onMount(() => {
    loadMyTests();
  });
</script>

<svelte:head>
  <title>My Tests - HireTestTakers</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>My Tests</h1>
    <a href="/browse-tests/new" class="btn-primary">Post a New Test</a>
  </header>

  <div class="filter-bar">
    <label for="status">Filter by Status:</label>
    <select id="status" bind:value={statusFilter} on:change={handleFilterChange}>
      {#each statuses as status}
        <option value={status.value}>{status.label}</option>
      {/each}
    </select>
  </div>

  {#if loading}
    <div class="loading">Loading your tests...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if tests.length === 0}
    <div class="empty-state">
      <p>You haven't posted any tests yet.</p>
      <p><a href="/browse-tests/new">Post your first test</a> to get started!</p>
    </div>
  {:else}
    <div class="tests-grid">
      {#each tests as test (test.id)}
        <TestCard {test} showEditIcon={true} />
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
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .btn-primary {
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

  .filter-bar {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: 2rem;
    padding: var(--spacing-md);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .filter-bar label {
    font-weight: 500;
    color: var(--color-text);
  }

  .filter-bar select {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    background: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    transition: border-color var(--transition-fast);
  }

  .filter-bar select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  :global(.dark) .filter-bar select:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
  }

  .loading,
  .error,
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
  }

  .loading {
    color: var(--color-text-secondary);
  }

  .error {
    color: var(--color-error-dark);
    background: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
  }

  :global(.dark) .error {
    background: rgba(255, 0, 85, 0.1);
    color: var(--color-error-light);
  }

  .empty-state {
    color: var(--color-text-secondary);
  }

  .empty-state p {
    margin: 0.5rem 0;
  }

  .empty-state a {
    color: var(--color-primary);
    text-decoration: none;
  }

  .empty-state a:hover {
    text-decoration: underline;
  }

  .tests-grid {
    display: grid;
    gap: var(--spacing-lg);
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

    .btn-primary {
      width: 100%;
      text-align: center;
    }

    .filter-bar {
      flex-direction: column;
      align-items: flex-start;
    }

    .filter-bar select {
      width: 100%;
    }
  }
</style>