<script>
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import UnifiedServiceCard from '$lib/components/UnifiedServiceCard.svelte';

  let services = [];
  let loading = true;
  let error = null;
  let searchQuery = '';
  let selectedType = '';
  let selectedStatus = '';

  const serviceTypes = [
    { value: '', label: $t('services.all_types') },
    { value: 'homework', label: $t('services.types.homework') },
    { value: 'programming', label: $t('services.types.programming') },
    { value: 'assignment', label: $t('services.types.assignment') },
    { value: 'test', label: $t('services.types.test') }
  ];

  const statuses = [
    { value: '', label: $t('services.all_statuses') },
    { value: 'open', label: $t('services.statuses.open') },
    { value: 'pending', label: $t('services.statuses.pending') },
    { value: 'in_progress', label: $t('services.statuses.in_progress') },
    { value: 'completed', label: $t('services.statuses.completed') }
  ];

  async function fetchServices() {
    loading = true;
    error = null;

    try {
      const params = new URLSearchParams();
      
      if (searchQuery.trim()) {
        params.append('q', searchQuery.trim());
      }
      
      if (selectedType) {
        params.append('type', selectedType);
      }
      
      if (selectedStatus) {
        params.append('status', selectedStatus);
      }

      const response = await fetch(`/api/search?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        services = result.data;
      } else {
        error = result.error || 'Failed to fetch services';
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleSearch() {
    fetchServices();
  }

  function handleFilterChange() {
    fetchServices();
  }

  onMount(() => {
    fetchServices();
  });
</script>

<svelte:head>
  <title>{$t('services.browse_title')} - HireTestTakers</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>{$t('services.browse_title')}</h1>
    <p class="subtitle">{$t('services.browse_subtitle')}</p>
  </div>

  <div class="search-section">
    <div class="search-bar">
      <input
        type="text"
        bind:value={searchQuery}
        on:keyup={(e) => e.key === 'Enter' && handleSearch()}
        placeholder={$t('services.search_placeholder')}
        class="search-input"
      />
      <button on:click={handleSearch} class="search-button">
        {$t('services.search')}
      </button>
    </div>

    <div class="filters">
      <select bind:value={selectedType} on:change={handleFilterChange} class="filter-select">
        {#each serviceTypes as type}
          <option value={type.value}>{type.label}</option>
        {/each}
      </select>

      <select bind:value={selectedStatus} on:change={handleFilterChange} class="filter-select">
        {#each statuses as status}
          <option value={status.value}>{status.label}</option>
        {/each}
      </select>
    </div>
  </div>

  {#if loading}
    <div class="loading">
      <p>{$t('common.loading')}</p>
    </div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
    </div>
  {:else if services.length === 0}
    <div class="empty">
      <p>{$t('services.no_results')}</p>
    </div>
  {:else}
    <div class="results-info">
      <p>{$t('services.results_count', { count: services.length })}</p>
    </div>

    <div class="services-grid">
      {#each services as service (service.id)}
        <UnifiedServiceCard {service} />
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

  .header {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-size: 1.125rem;
    color: #6b7280;
  }

  .search-section {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 2rem;
  }

  .search-bar {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .search-input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .search-button {
    padding: 0.75rem 2rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .search-button:hover {
    background: #2563eb;
  }

  .filters {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .filter-select {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 0.875rem;
    background: white;
    cursor: pointer;
  }

  .filter-select:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .loading,
  .error,
  .empty {
    text-align: center;
    padding: 3rem 1rem;
  }

  .error {
    color: #dc2626;
  }

  .empty {
    color: #6b7280;
  }

  .results-info {
    margin-bottom: 1rem;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .search-bar {
      flex-direction: column;
    }

    .services-grid {
      grid-template-columns: 1fr;
    }
  }
</style>