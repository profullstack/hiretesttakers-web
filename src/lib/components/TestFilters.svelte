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
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .search-bar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #007bff;
  }

  .search-button {
    padding: 0.75rem 1.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .search-button:hover {
    background: #0056b3;
  }

  .filters-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
  }

  label {
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.875rem;
    color: #333;
  }

  select {
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    background: white;
    cursor: pointer;
  }

  select:focus {
    outline: none;
    border-color: #007bff;
  }

  .clear-button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .clear-button:hover {
    background: #545b62;
  }

  @media (max-width: 640px) {
    .test-filters {
      padding: 1rem;
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