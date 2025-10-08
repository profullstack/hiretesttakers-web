<script>
  /**
   * Payment Status Page
   * 
   * Displays current status of a payment with auto-refresh
   */
  
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import PaymentStatus from '$lib/components/PaymentStatus.svelte';
  
  let payment = null;
  let loading = true;
  let error = '';
  let refreshInterval;
  
  const paymentId = $page.params.id;
  
  async function fetchPaymentStatus() {
    try {
      const response = await fetch(`/api/payments/${paymentId}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to fetch payment status');
      }
      
      payment = await response.json();
      
      // Stop auto-refresh if payment is confirmed or failed
      if (payment.status === 'confirmed' || payment.status === 'failed') {
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }
      }
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    fetchPaymentStatus();
    
    // Auto-refresh every 10 seconds for pending payments
    refreshInterval = setInterval(() => {
      if (payment?.status === 'pending') {
        fetchPaymentStatus();
      }
    }, 10000);
  });
  
  onDestroy(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  });
</script>

<svelte:head>
  <title>Payment Status - TutorLinkup</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>Payment Status</h1>
    {#if payment?.status === 'pending'}
      <span class="auto-refresh">Auto-refreshing every 10 seconds</span>
    {/if}
  </div>
  
  {#if loading}
    <div class="loading">
      <p>Loading payment status...</p>
    </div>
  {:else if error}
    <div class="error-banner">
      <p>{error}</p>
    </div>
  {:else}
    <PaymentStatus {payment} qrCodeUrl={payment?.qrCodeUrl || ''} />
    
    {#if payment?.status === 'pending'}
      <div class="pending-notice">
        <h3>⏳ Waiting for Payment</h3>
        <p>
          Send exactly <strong>{payment.amount} {payment.cryptocurrency}</strong> to the address above.
          The payment will be automatically confirmed once the transaction is detected on the blockchain.
        </p>
      </div>
    {:else if payment?.status === 'confirmed'}
      <div class="success-notice">
        <h3>✅ Payment Confirmed</h3>
        <p>
          The payment has been successfully confirmed. The test taker will receive their payment shortly.
        </p>
      </div>
    {:else if payment?.status === 'failed'}
      <div class="error-notice">
        <h3>❌ Payment Failed</h3>
        <p>
          The payment could not be processed. Please contact support for assistance.
        </p>
      </div>
    {/if}
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
  
  .auto-refresh {
    font-size: 0.875rem;
    color: #6b7280;
    font-style: italic;
  }
  
  .loading {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
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
  
  .pending-notice,
  .success-notice,
  .error-notice {
    margin-top: 2rem;
    padding: 1.5rem;
    border-radius: 0.5rem;
  }
  
  .pending-notice {
    background-color: #fef3c7;
    border: 1px solid #fde68a;
  }
  
  .pending-notice h3 {
    color: #92400e;
    margin: 0 0 0.5rem 0;
  }
  
  .pending-notice p {
    color: #78350f;
    margin: 0;
    line-height: 1.6;
  }
  
  .success-notice {
    background-color: #d1fae5;
    border: 1px solid #a7f3d0;
  }
  
  .success-notice h3 {
    color: #065f46;
    margin: 0 0 0.5rem 0;
  }
  
  .success-notice p {
    color: #047857;
    margin: 0;
    line-height: 1.6;
  }
  
  .error-notice {
    background-color: #fee2e2;
    border: 1px solid #fecaca;
  }
  
  .error-notice h3 {
    color: #991b1b;
    margin: 0 0 0.5rem 0;
  }
  
  .error-notice p {
    color: #dc2626;
    margin: 0;
    line-height: 1.6;
  }
</style>