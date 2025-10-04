<script>
  import { createEventDispatcher } from 'svelte';
  
  export let categories = [];
  export let selectedType = '';
  export let selectedSubject = '';
  export let selectedCategory = '';
  export let searchQuery = '';
  
  const dispatch = createEventDispatcher();
  
  const resourceTypes = [
    { value: '', label: 'All Types' },
    { value: 'sample_paper', label: 'Sample Papers' },
    { value: 'blog_article', label: 'Blog Articles' },
    { value: 'study_guide', label: 'Study Guides' },
    { value: 'tutorial_video', label: 'Tutorial Videos' },
    { value: 'code_example', label: 'Code Examples' },
    { value: 'practice_test', label: 'Practice Tests' }
  ];
  
  const subjects = [
    { value: '', label: 'All Subjects' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Business', label: 'Business' },
    { value: 'Programming', label: 'Programming' }
  ];
  
  function handleFilterChange() {
    dispatch('filter', {
      type: selectedType,
      subject: selectedSubject,
      category: selectedCategory,
      search: searchQuery
    });
  }
  
  function handleSearch(event) {
    if (event.key === 'Enter') {
      handleFilterChange();
    }
  }
  
  function clearFilters() {
    selectedType = '';
    selectedSubject = '';
    selectedCategory = '';
    searchQuery = '';
    handleFilterChange();
  }
</script>

<div class="filters">
  <div class="search-box">
    <input
      type="text"
      bind:value={searchQuery}
      on:keypress={handleSearch}
      placeholder="Search resources..."
      class="search-input"
    />
    <button on:click={handleFilterChange} class="btn-search">Search</button>
  </div>
  
  <div class="filter-row">
    <div class="filter-group">
      <label for="type-filter">Type</label>
      <select
        id="type-filter"
        bind:value={selectedType}
        on:change={handleFilterChange}
      >
        {#each resourceTypes as type}
          <option value={type.value}>{type.label}</option>
        {/each}
      </select>
    </div>
    
    <div class="filter-group">
      <label for="subject-filter">Subject</label>
      <select
        id="subject-filter"
        bind:value={selectedSubject}
        on:change={handleFilterChange}
      >
        {#each subjects as subject}
          <option value={subject.value}>{subject.label}</option>
        {/each}
      </select>
    </div>
    
    {#if categories.length > 0}
      <div class="filter-group">
        <label for="category-filter">Category</label>
        <select
          id="category-filter"
          bind:value={selectedCategory}
          on:change={handleFilterChange}
        >
          <option value="">All Categories</option>
          {#each categories as category}
            <option value={category.id}>{category.name}</option>
          {/each}
        </select>
      </div>
    {/if}
    
    <button on:click={clearFilters} class="btn-clear">Clear Filters</button>
  </div>
</div>

<style>
  .filters {
    background: var(--card-bg, white);
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    border: 1px solid var(--border-color, #e0e0e0);
  }

  .search-box {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem;
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    font-size: 1rem;
  }

  .btn-search {
    padding: 0.75rem 1.5rem;
    background: var(--primary-color, #007bff);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .btn-search:hover {
    background: var(--primary-hover, #0056b3);
  }

  .filter-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: flex-end;
  }

  .filter-group {
    flex: 1;
    min-width: 200px;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--text-primary, #333);
  }

  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    font-size: 1rem;
    background: white;
  }

  .btn-clear {
    padding: 0.75rem 1rem;
    background: var(--bg-secondary, #f5f5f5);
    color: var(--text-primary, #333);
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
  }

  .btn-clear:hover {
    background: var(--bg-tertiary, #e8e8e8);
  }
</style>