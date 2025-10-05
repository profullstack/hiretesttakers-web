<script>
  import { createEventDispatcher } from 'svelte';

  export let filters = {
    status: '',
    cryptocurrency: '',
    category: '',
    difficulty: '',
    search: ''
  };

  const dispatch = createEventDispatcher();

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const cryptocurrencies = [
    { value: '', label: 'All Cryptocurrencies' },
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'DOGE', label: 'Dogecoin (DOGE)' },
    { value: 'SOL', label: 'Solana (SOL)' }
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'programming', label: 'Programming' },
    { value: 'writing', label: 'Writing' },
    { value: 'language', label: 'Language' },
    { value: 'business', label: 'Business' },
    { value: 'other', label: 'Other' }
  ];

  const difficulties = [
    { value: '', label: 'All Difficulties' },
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  function handleFilterChange() {
    dispatch('change', filters);
  }

  function handleSearch(event) {
    if (event.key === 'Enter') {
      handleFilterChange();
    }
  }

  function clearFilters() {
    filters = {
      status: '',
      cryptocurrency: '',
      category: '',
      difficulty: '',
      search: ''
    };
    handleFilterChange();
  }

  function hasActiveFilters() {
    return Object.values(filters).some(value => value !== '');
  }
</script>

<div class="test-filters">
  <div class="search-bar">
    <input
      type="text"
      bind:value={filters.search}
      on:keypress={handleSearch}
      on:blur={handleFilterChange}
      placeholder="Search tests..."
      class="search-input"
    />
    <button type="button" on:click={handleFilterChange} class="search-button">
      Search
    </button>
  </div>

  <div class="filters-grid">
    <div class="filter-group">
      <label for="status">Status</label>
      <select id="status" bind:value={filters.status} on:change={handleFilterChange}>
        {#each statuses as status}
          <option value={status.value}>{status.label}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="cryptocurrency">Cryptocurrency</label>
      <select id="cryptocurrency" bind:value={filters.cryptocurrency} on:change={handleFilterChange}>
        {#each cryptocurrencies as crypto}
          <option value={crypto.value}>{crypto.label}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="category">Category</label>
      <select id="category" bind:value={filters.category} on:change={handleFilterChange}>
        {#each categories as cat}
          <option value={cat.value}>{cat.label}</option>
        {/each}
      </select>
    </div>

    <div class="filter-group">
      <label for="difficulty">Difficulty</label>
      <select id="difficulty" bind:value={filters.difficulty} on:change={handleFilterChange}>
        {#each difficulties as diff}
          <option value={diff.value}>{diff.label}</option>
        {/each}
      </select>
    </div>
  </div>

  {#if hasActiveFilters()}
    <button type="button" on:click={clearFilters} class="clear-button">
      Clear All Filters
    </button>
  {/if}
</div>

<style>
  .test-filters {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);
  }

  .search-bar {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
  }

  .search-input {
    flex: 1;
    padding: var(--spacing-md);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    font-size: 1rem;
    background: var(--color-surface);
    color: var(--color-text);
    transition: all var(--transition-base);
  }

  .search-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  :global(.dark) .search-input:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.15);
  }

  .search-button {
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-md);
  }

  .search-button:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }

  :global(.dark) .search-button {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .search-button:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--color-text);
  }

  select {
    padding: var(--spacing-md);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    font-size: 1rem;
    background: var(--color-surface);
    color: var(--color-text);
    cursor: pointer;
    transition: all var(--transition-base);
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  :global(.dark) select:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.15);
  }

  .clear-button {
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-gray-200);
    color: var(--color-text);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-lg);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  .clear-button:hover {
    background: var(--color-gray-300);
    border-color: var(--color-border-hover);
  }

  :global(.dark) .clear-button {
    background: var(--color-gray-700);
    border-color: var(--color-gray-600);
  }

  :global(.dark) .clear-button:hover {
    background: var(--color-gray-600);
    border-color: var(--color-gray-500);
  }

  @media (max-width: 640px) {
    .test-filters {
      padding: var(--spacing-md);
    }

    .filters-grid {
      grid-template-columns: 1fr;
    }

    .search-bar {
      flex-direction: column;
    }

    .search-button {
      width: 100%;
    }
  }
</style>