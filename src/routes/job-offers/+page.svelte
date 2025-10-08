<script>
  import { onMount } from 'svelte';
  import JobOfferCard from '$lib/components/JobOfferCard.svelte';

  let offers = [];
  let loading = true;
  let error = '';
  let view = 'received'; // 'received' or 'sent'
  let statusFilter = '';

  async function loadOffers() {
    loading = true;
    error = '';

    try {
      const params = new URLSearchParams({ view });
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/job-offers?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load job offers');
      }

      offers = data.offers || [];
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleViewChange(newView) {
    view = newView;
    loadOffers();
  }

  function handleFilterChange() {
    loadOffers();
  }

  onMount(() => {
    loadOffers();
  });
</script>

<svelte:head>
  <title>Job Offers - TutorLinkup</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>Job Offers</h1>
    <p>Manage your job offers and opportunities</p>
  </header>

  <div class="view-tabs">
    <button
      class="tab {view === 'received' ? 'active' : ''}"
      on:click={() => handleViewChange('received')}
    >
      Received Offers
    </button>
    <button
      class="tab {view === 'sent' ? 'active' : ''}"
      on:click={() => handleViewChange('sent')}
    >
      Sent Offers
    </button>
  </div>

  <div class="filters">
    <select bind:value={statusFilter} on:change={handleFilterChange}>
      <option value="">All Statuses</option>
      <option value="pending">Pending</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
      <option value="withdrawn">Withdrawn</option>
      <option value="expired">Expired</option>
    </select>
  </div>

  {#if loading}
    <div class="loading">Loading job offers...</div>
  {:else if error}
    <div class="error-message">{error}</div>
  {:else if offers.length === 0}
    <div class="empty-state">
      <p>No job offers found.</p>
      {#if view === 'received'}
        <p>When employers make you job offers, they will appear here.</p>
      {:else}
        <p>You haven't sent any job offers yet. Visit the leaderboard to find talented test takers!</p>
        <a href="/leaderboard" class="btn-primary">Browse Leaderboard</a>
      {/if}
    </div>
  {:else}
    <div class="offers-grid">
      {#each offers as offer (offer.id)}
        <JobOfferCard {offer} viewType={view} />
      {/each}
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
    margin-bottom: 2rem;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .page-header p {
    margin: 0;
    color: #666;
    font-size: 1.125rem;
  }

  .view-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .tab {
    padding: 0.75rem 1.5rem;
    border: none;
    background: none;
    font-size: 1rem;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
  }

  .tab:hover {
    color: #007bff;
  }

  .tab.active {
    color: #007bff;
    border-bottom-color: #007bff;
  }

  .filters {
    margin-bottom: 2rem;
  }

  select {
    padding: 0.5rem 1rem;
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

  .loading {
    text-align: center;
    padding: 3rem;
    color: #666;
    font-size: 1.125rem;
  }

  .error-message {
    padding: 1rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    color: #721c24;
    margin-bottom: 1.5rem;
  }

  .empty-state {
    text-align: center;
    padding: 3rem;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .empty-state p {
    margin: 0 0 1rem 0;
    color: #666;
    font-size: 1.125rem;
  }

  .empty-state p:last-of-type {
    margin-bottom: 1.5rem;
  }

  .btn-primary {
    display: inline-block;
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

  .offers-grid {
    display: grid;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    h1 {
      font-size: 1.5rem;
    }

    .view-tabs {
      overflow-x: auto;
    }

    .tab {
      white-space: nowrap;
    }
  }
</style>