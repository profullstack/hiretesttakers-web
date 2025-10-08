<script>
  import { onMount } from 'svelte';
  import ResourceCard from '$lib/components/ResourceCard.svelte';
  import ResourceFilters from '$lib/components/ResourceFilters.svelte';
  
  let resources = [];
  let categories = [];
  let loading = true;
  let error = null;
  
  let filters = {
    type: '',
    subject: '',
    category: '',
    search: ''
  };
  
  onMount(async () => {
    await Promise.all([loadResources(), loadCategories()]);
  });
  
  async function loadResources() {
    try {
      loading = true;
      const params = new URLSearchParams();
      
      if (filters.search) {
        params.append('q', filters.search);
      }
      if (filters.type) {
        params.append('type', filters.type);
      }
      if (filters.subject) {
        params.append('subject', filters.subject);
      }
      
      const response = await fetch(`/api/resources?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to load resources');
      }
      
      resources = await response.json();
    } catch (err) {
      error = err.message;
      console.error('Error loading resources:', err);
    } finally {
      loading = false;
    }
  }
  
  async function loadCategories() {
    try {
      const response = await fetch('/api/resources/categories');
      
      if (!response.ok) {
        throw new Error('Failed to load categories');
      }
      
      categories = await response.json();
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }
  
  function handleFilter(event) {
    filters = event.detail;
    loadResources();
  }
</script>

<svelte:head>
  <title>Learning Resources - TutorLinkup</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>Learning Resources</h1>
    <p>Browse sample papers, study guides, tutorials, and more</p>
    <a href="/resources/contribute" class="btn-primary">Contribute Resource</a>
  </header>
  
  <ResourceFilters
    {categories}
    selectedType={filters.type}
    selectedSubject={filters.subject}
    selectedCategory={filters.category}
    searchQuery={filters.search}
    on:filter={handleFilter}
  />
  
  {#if loading}
    <div class="loading">
      <p>Loading resources...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>Error: {error}</p>
      <button on:click={loadResources} class="btn-secondary">Try Again</button>
    </div>
  {:else if resources.length === 0}
    <div class="empty">
      <p>No resources found matching your criteria.</p>
      <p>Try adjusting your filters or <a href="/resources/contribute">contribute a new resource</a>.</p>
    </div>
  {:else}
    <div class="resources-grid">
      {#each resources as resource (resource.id)}
        <ResourceCard {resource} />
      {/each}
    </div>
    
    <div class="results-info">
      <p>Showing {resources.length} resource{resources.length !== 1 ? 's' : ''}</p>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary, #333);
  }

  .page-header p {
    font-size: 1.125rem;
    color: var(--text-secondary, #666);
    margin-bottom: 1.5rem;
  }

  .btn-primary {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color, #007bff);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .btn-primary:hover {
    background: var(--primary-hover, #0056b3);
  }

  .loading,
  .error,
  .empty {
    text-align: center;
    padding: 3rem;
    background: var(--card-bg, white);
    border-radius: 8px;
    border: 1px solid var(--border-color, #e0e0e0);
  }

  .error {
    color: var(--error-color, #dc3545);
  }

  .btn-secondary {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: var(--bg-secondary, #f5f5f5);
    color: var(--text-primary, #333);
    border: 1px solid var(--border-color, #e0e0e0);
    border-radius: 4px;
    cursor: pointer;
  }

  .resources-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .results-info {
    text-align: center;
    padding: 1rem;
    color: var(--text-secondary, #666);
  }

  .empty a {
    color: var(--primary-color, #007bff);
    text-decoration: none;
  }

  .empty a:hover {
    text-decoration: underline;
  }
</style>