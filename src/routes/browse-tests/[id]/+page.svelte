<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  let test = null;
  let loading = true;
  let error = '';
  let usdValue = 0;
  let usdValueMax = 0;
  let isOwner = false;

  async function loadTest() {
    loading = true;
    error = '';

    try {
      const response = await fetch(`/api/tests/${$page.params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load test');
      }

      test = data.test;
      
      // Calculate USD values using API
      try {
        const rateResponse = await fetch(`/api/exchange-rate/${test.cryptocurrency}`);
        const rateData = await rateResponse.json();
        
        if (rateResponse.ok && rateData.success) {
          const rate = rateData.rate;
          usdValue = (test.price * rate).toFixed(2);
          if (test.price_max) {
            usdValueMax = (test.price_max * rate).toFixed(2);
          }
        }
      } catch (err) {
        console.error('Failed to fetch exchange rate:', err);
      }

      // Check if current user is owner (would need session check)
      // isOwner = session?.user?.id === test.hirer_id;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this test?')) {
      return;
    }

    try {
      const response = await fetch(`/api/tests/${test.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete test');
      }

      goto('/browse-tests/my-tests');
    } catch (err) {
      alert(err.message);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function getStatusClass(status) {
    const statusClasses = {
      open: 'status-open',
      in_progress: 'status-in-progress',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || '';
  }

  function getStatusLabel(status) {
    const labels = {
      open: 'Open',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  }

  onMount(() => {
    loadTest();
  });
</script>

<svelte:head>
  <title>{test ? test.title : 'Test Details'} - HireTestTakers</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">Loading test details...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if test}
    <article class="test-details">
      <header class="test-header">
        <div class="header-content">
          <h1>{test.title}</h1>
          <span class="status {getStatusClass(test.status)}">
            {getStatusLabel(test.status)}
          </span>
        </div>
        {#if isOwner}
          <div class="actions">
            <a href="/browse-tests/{test.id}/edit" class="btn-secondary">Edit</a>
            <button on:click={handleDelete} class="btn-danger">Delete</button>
          </div>
        {/if}
      </header>

      <div class="test-meta">
        <div class="meta-item">
          <strong>Posted:</strong> {formatDate(test.created_at)}
        </div>
        {#if test.category}
          <div class="meta-item">
            <strong>Category:</strong> {test.category}
          </div>
        {/if}
        {#if test.difficulty}
          <div class="meta-item">
            <strong>Difficulty:</strong> {test.difficulty}
          </div>
        {/if}
      </div>

      <section class="description">
        <h2>Description</h2>
        <p>{test.description}</p>
      </section>

      <section class="price-section">
        <h2>Payment</h2>
        <div class="price-info">
          <div class="crypto-price">
            {test.price} {test.cryptocurrency}
            {#if test.price_max}
              - {test.price_max} {test.cryptocurrency}
            {/if}
          </div>
          {#if usdValue > 0}
            <div class="usd-price">
              ≈ ${usdValue}
              {#if usdValueMax > 0}
                - ${usdValueMax}
              {/if}
              USD
            </div>
          {/if}
        </div>
      </section>

      {#if test.status === 'open'}
        <div class="apply-section">
          <a href="/browse-tests/{test.id}/apply" class="btn-primary">Apply for this Test</a>
        </div>
      {/if}
    </article>
  {/if}
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .loading,
  .error {
    text-align: center;
    padding: 3rem 1rem;
  }

  .error {
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }

  .test-details {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 2rem;
  }

  .test-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #e0e0e0;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: #333;
  }

  .status {
    padding: 0.5rem 1rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-open {
    background: #d4edda;
    color: #155724;
  }

  .status-in-progress {
    background: #fff3cd;
    color: #856404;
  }

  .status-completed {
    background: #d1ecf1;
    color: #0c5460;
  }

  .status-cancelled {
    background: #f8d7da;
    color: #721c24;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .test-meta {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    font-size: 0.875rem;
    color: #666;
  }

  .meta-item strong {
    color: #333;
  }

  section {
    margin-bottom: 2rem;
  }

  h2 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
  }

  .description p {
    margin: 0;
    line-height: 1.6;
    color: #666;
    white-space: pre-wrap;
  }

  .price-info {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
  }

  .crypto-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #007bff;
    margin-bottom: 0.5rem;
  }

  .usd-price {
    font-size: 1.125rem;
    color: #666;
  }

  .apply-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #e0e0e0;
    text-align: center;
  }

  .btn-primary,
  .btn-secondary,
  .btn-danger {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.2s;
    display: inline-block;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover {
    background: #545b62;
  }

  .btn-danger {
    background: #dc3545;
    color: white;
  }

  .btn-danger:hover {
    background: #c82333;
  }

  @media (max-width: 640px) {
    .container {
      padding: 1rem;
    }

    .test-details {
      padding: 1.5rem;
    }

    .header-content {
      flex-direction: column;
    }

    .test-meta {
      flex-direction: column;
      gap: 0.5rem;
    }

    .actions {
      flex-direction: column;
    }

    .btn-primary,
    .btn-secondary,
    .btn-danger {
      width: 100%;
    }
  }
</style>