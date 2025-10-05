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
  <title>Payment History - HireTestTakers</title>
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
    padding: 2rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
  
  .filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .filter label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .filter select {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  
  .loading,
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }
  
  .empty-state button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    cursor: pointer;
  }
  
  .error-banner {
    padding: 1rem;
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .error-banner p {
    color: #dc2626;
    margin: 0;
  }
  
  .payments-list {
    display: grid;
    gap: 1rem;
  }
  
  .payment-card {
    background: white;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: box-shadow 0.2s;
    border: none;
    width: 100%;
    text-align: left;
  }
  
  .payment-card:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .payment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .payment-amount {
    display: flex;
    flex-direction: column;
  }
  
  .amount {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
  
  .usd {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .payment-details {
    display: grid;
    gap: 0.5rem;
  }
  
  .detail {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
  }
  
  .detail .label {
    color: #6b7280;
  }
  
  .detail .value {
    color: #111827;
    font-weight: 500;
  }
</style>