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
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    background: var(--color-surface);
    transition: all var(--transition-base);
  }

  .test-card:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-border-hover);
  }

  .test-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  h3 a {
    color: var(--color-text);
    text-decoration: none;
    transition: color var(--transition-base);
  }

  h3 a:hover {
    color: var(--color-primary);
  }

  .status {
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-open {
    background: var(--color-success-light);
    color: var(--color-success-dark);
  }

  .status-in-progress {
    background: var(--color-warning-light);
    color: var(--color-warning-dark);
  }

  .status-completed {
    background: var(--color-info-light);
    color: var(--color-info-dark);
  }

  .status-cancelled {
    background: var(--color-error-light);
    color: var(--color-error-dark);
  }

  .test-description {
    margin: 0 0 var(--spacing-md) 0;
    color: var(--color-text-secondary);
    line-height: 1.5;
  }

  .test-meta {
    display: flex;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-md);
    font-size: 0.875rem;
  }

  .meta-item {
    color: var(--color-text-secondary);
  }

  .meta-item strong {
    color: var(--color-text);
  }

  .test-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
  }

  .price-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .crypto-price {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--color-primary);
  }

  .usd-price {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }

  .date {
    font-size: 0.875rem;
    color: var(--color-text-tertiary);
  }

  @media (max-width: 640px) {
    .test-card {
      padding: var(--spacing-md);
    }

    .test-header {
      flex-direction: column;
    }

    .test-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }

    .test-meta {
      flex-direction: column;
      gap: var(--spacing-sm);
    }
  }
</style>