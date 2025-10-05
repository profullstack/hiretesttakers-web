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
    <a href="/tests/new" class="btn-primary">Post a New Test</a>
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
      <p><a href="/tests/new">Post your first test</a> to get started!</p>
    </div>
  {:else}
    <div class="tests-grid">
      {#each tests as test (test.id)}
        <TestCard {test} />
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
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .btn-primary {
    padding: 0.75rem 1.5rem;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  .filter-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
  }

  .filter-bar label {
    font-weight: 500;
    color: #333;
  }

  .filter-bar select {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    background: white;
    cursor: pointer;
  }

  .filter-bar select:focus {
    outline: none;
    border-color: #007bff;
  }

  .loading,
  .error,
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
  }

  .loading {
    color: #666;
  }

  .error {
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }

  .empty-state {
    color: #666;
  }

  .empty-state p {
    margin: 0.5rem 0;
  }

  .empty-state a {
    color: #007bff;
    text-decoration: none;
  }

  .empty-state a:hover {
    text-decoration: underline;
  }

  .tests-grid {
    display: grid;
    gap: 1.5rem;
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