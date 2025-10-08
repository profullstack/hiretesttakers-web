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
  <title>Browse Tests - TutorLinkup</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>Browse Tests</h1>
    <a href="/browse-tests/new" class="btn-primary">Post a Test</a>
  </header>

  <TestFilters {filters} on:change={handleFilterChange} />

  {#if loading}
    <div class="loading">Loading tests...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if tests.length === 0}
    <div class="empty-state">
      <p>No tests found matching your criteria.</p>
      <p>Try adjusting your filters or <a href="/browse-tests/new">post a new test</a>.</p>
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
    border-radius: var(--radius-lg);
    font-weight: 600;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-md);
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }

  :global(.dark) .btn-primary {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .btn-primary:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
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
    border-radius: var(--radius-lg);
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
    font-weight: 500;
  }

  .empty-state a:hover {
    text-decoration: underline;
    color: var(--color-primary-hover);
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