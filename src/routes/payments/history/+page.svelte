<script>
  /**
   * Payment History Page
   * 
   * Displays all payments for the current user
   */
  
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  let payments = [];
  let loading = true;
  let error = '';
  let statusFilter = '';
  
  async function fetchPayments() {
    loading = true;
    error = '';
    
    try {
      const url = new URL('/api/payments', window.location.origin);
      if (statusFilter) {
        url.searchParams.set('status', statusFilter);
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch payments');
      }
      
      payments = await response.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  function viewPayment(paymentId) {
    goto(`/payments/${paymentId}/status`);
  }
  
  function getStatusColor(status) {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      failed: '#ef4444',
      expired: '#6b7280'
    };
    return colors[status] || '#6b7280';
  }
  
  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  onMount(() => {
    fetchPayments();
  });
  
  $: if (statusFilter !== undefined) {
    fetchPayments();
  }
</script>

<svelte:head>
  <title>Payment History - TutorLinkup</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>Payment History</h1>
    
    <div class="filter">
      <label for="status-filter">Filter by status:</label>
      <select id="status-filter" bind:value={statusFilter}>
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="failed">Failed</option>
        <option value="expired">Expired</option>
      </select>
    </div>
  </div>
  
  {#if loading}
    <div class="loading">
      <p>Loading payment history...</p>
    </div>
  {:else if error}
    <div class="error-banner">
      <p>{error}</p>
    </div>
  {:else if payments.length === 0}
    <div class="empty-state">
      <p>No payments found</p>
      {#if statusFilter}
        <button on:click={() => statusFilter = ''}>Clear filter</button>
      {/if}
    </div>
  {:else}
    <div class="payments-list">
      {#each payments as payment}
        <button
          class="payment-card"
          on:click={() => viewPayment(payment.id)}
          type="button"
        >
          <div class="payment-header">
            <div class="payment-amount">
              <span class="amount">{payment.amount} {payment.cryptocurrency}</span>
              <span class="usd">${payment.usd_equivalent?.toFixed(2)}</span>
            </div>
            <span 
              class="status-badge" 
              style="background-color: {getStatusColor(payment.status)}"
            >
              {payment.status}
            </span>
          </div>
          
          <div class="payment-details">
            <div class="detail">
              <span class="label">Test Taker Amount:</span>
              <span class="value">{payment.test_taker_amount} {payment.cryptocurrency}</span>
            </div>
            <div class="detail">
              <span class="label">Commission:</span>
              <span class="value">{payment.commission_amount} {payment.cryptocurrency}</span>
            </div>
            <div class="detail">
              <span class="label">Created:</span>
              <span class="value">{formatDate(payment.created_at)}</span>
            </div>
            {#if payment.confirmed_at}
              <div class="detail">
                <span class="label">Confirmed:</span>
                <span class="value">{formatDate(payment.confirmed_at)}</span>
              </div>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1000px;
    margin: 0 auto;
    padding: var(--spacing-xl);
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--color-border);
    flex-wrap: wrap;
    gap: var(--spacing-md);
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0;
  }
  
  .filter {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .filter label {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .filter select {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    background: var(--color-surface);
    color: var(--color-text);
    transition: all var(--transition-base);
  }
  
  .filter select:hover {
    border-color: var(--color-primary);
  }
  
  .filter select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }
  
  :global(.dark) .filter select:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
  }
  
  .loading,
  .empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--color-text-secondary);
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
  }
  
  .empty-state button {
    margin-top: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-lg);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }
  
  .empty-state button:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
  
  :global(.dark) .empty-state button {
    box-shadow: var(--glow-primary);
  }
  
  :global(.dark) .empty-state button:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.4);
  }
  
  .error-banner {
    padding: var(--spacing-lg);
    background-color: var(--color-error-light);
    border: 1px solid var(--color-error);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-xl);
  }
  
  :global(.dark) .error-banner {
    background: rgba(255, 0, 85, 0.1);
  }
  
  .error-banner p {
    color: var(--color-error-dark);
    margin: 0;
  }
  
  :global(.dark) .error-banner p {
    color: var(--color-error-light);
  }
  
  .payments-list {
    display: grid;
    gap: var(--spacing-md);
  }
  
  .payment-card {
    background: var(--color-surface);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all var(--transition-base);
    width: 100%;
    text-align: left;
  }
  
  .payment-card:hover {
    box-shadow: var(--shadow-lg);
    border-color: var(--color-primary);
  }
  
  :global(.dark) .payment-card:hover {
    box-shadow: var(--glow-primary);
  }
  
  .payment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
  }
  
  .payment-amount {
    display: flex;
    flex-direction: column;
  }
  
  .amount {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }
  
  .usd {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }
  
  .status-badge {
    padding: var(--spacing-sm) var(--spacing-lg);
    border-radius: var(--radius-full);
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .payment-details {
    display: grid;
    gap: var(--spacing-sm);
  }
  
  .detail {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }
  
  .detail .label {
    color: var(--color-text-secondary);
  }
  
  .detail .value {
    color: var(--color-text);
    font-weight: 500;
  }
</style>