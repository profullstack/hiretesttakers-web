<script>
  import { onMount } from 'svelte';
  import TestCard from '$lib/components/TestCard.svelte';
  import TestFilters from '$lib/components/TestFilters.svelte';

  let tests = [];
  let loading = true;
  let error = '';
  let filters = {
    status: 'open',
    cryptocurrency: '',
    category: '',
    difficulty: '',
    search: ''
  };

  async function loadTests() {
    loading = true;
    error = '';

    try {
      const params = new URLSearchParams();
      
      if (filters.search) {
        params.append('q', filters.search);
      }
      if (filters.status) {
        params.append('status', filters.status);
      }
      if (filters.cryptocurrency) {
        params.append('cryptocurrency', filters.cryptocurrency);
      }
      if (filters.category) {
        params.append('category', filters.category);
      }
      if (filters.difficulty) {
        params.append('difficulty', filters.difficulty);
      }

      const response = await fetch(`/api/tests?${params.toString()}`);
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

  function handleFilterChange(event) {
    filters = event.detail;
    loadTests();
  }

  onMount(() => {
    loadTests();
  });
</script>

<svelte:head>
  <title>Browse Tests - HireTestTakers</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>Browse Tests</h1>
    <a href="/tests/new" class="btn-primary">Post a Test</a>
  </header>

  <TestFilters {filters} on:change={handleFilterChange} />

  {#if loading}
    <div class="loading">Loading tests...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if tests.length === 0}
    <div class="empty-state">
      <p>No tests found matching your criteria.</p>
      <p>Try adjusting your filters or <a href="/tests/new">post a new test</a>.</p>
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
  }
</style>