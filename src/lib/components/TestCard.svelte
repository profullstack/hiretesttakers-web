<script>
  import { onMount } from 'svelte';

  export let test;

  let usdValue = 0;
  let usdValueMax = 0;

  async function calculateUsdValues() {
    try {
      const response = await fetch(`/api/exchange-rate/${test.cryptocurrency}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch exchange rate');
      }
      
      const rate = data.rate;
      usdValue = (test.price * rate).toFixed(2);
      if (test.price_max) {
        usdValueMax = (test.price_max * rate).toFixed(2);
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
    calculateUsdValues();
  });
</script>

<article class="test-card">
  <div class="test-header">
    <h3>
      <a href="/tests/{test.id}">{test.title}</a>
    </h3>
    <span class="status {getStatusClass(test.status)}">
      {getStatusLabel(test.status)}
    </span>
  </div>

  <p class="test-description">{test.description}</p>

  <div class="test-meta">
    {#if test.category}
      <span class="meta-item">
        <strong>Category:</strong> {test.category}
      </span>
    {/if}
    {#if test.difficulty}
      <span class="meta-item">
        <strong>Difficulty:</strong> {test.difficulty}
      </span>
    {/if}
  </div>

  <div class="test-footer">
    <div class="price-info">
      <span class="crypto-price">
        {test.price} {test.cryptocurrency}
        {#if test.price_max}
          - {test.price_max} {test.cryptocurrency}
        {/if}
      </span>
      {#if usdValue > 0}
        <span class="usd-price">
          ≈ ${usdValue}
          {#if usdValueMax > 0}
            - ${usdValueMax}
          {/if}
          USD
        </span>
      {/if}
    </div>
    <span class="date">Posted {formatDate(test.created_at)}</span>
  </div>
</article>

<style>
  .test-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    background: white;
    transition: box-shadow 0.2s;
  }

  .test-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .test-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  h3 a {
    color: #333;
    text-decoration: none;
  }

  h3 a:hover {
    color: #007bff;
  }

  .status {
    padding: 0.25rem 0.75rem;
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

  .test-description {
    margin: 0 0 1rem 0;
    color: #666;
    line-height: 1.5;
  }

  .test-meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .meta-item {
    color: #666;
  }

  .meta-item strong {
    color: #333;
  }

  .test-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  .price-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .crypto-price {
    font-size: 1.125rem;
    font-weight: 600;
    color: #007bff;
  }

  .usd-price {
    font-size: 0.875rem;
    color: #666;
  }

  .date {
    font-size: 0.875rem;
    color: #999;
  }

  @media (max-width: 640px) {
    .test-card {
      padding: 1rem;
    }

    .test-header {
      flex-direction: column;
    }

    .test-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .test-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>