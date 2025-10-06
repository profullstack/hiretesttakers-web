<script>
  /**
   * Payment Initiation Page
   *
   * Allows hirer to initiate payment for a completed test with CryptAPI integration.
   * Displays QR code, payment address, amount, and USD exchange rate.
   */
  
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import PaymentForm from '$lib/components/PaymentForm.svelte';
  import CryptoPaymentDisplay from '$lib/components/CryptoPaymentDisplay.svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  
  let loading = false;
  let error = '';
  let payment = null;
  
  const testId = $page.params.testId;
  
  async function handlePaymentSubmit(event) {
    loading = true;
    error = '';
    
    try {
      const response = await fetch('/api/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          testId,
          ...event.detail
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to initiate payment');
      }
      
      const data = await response.json();
      payment = data.payment;
      
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }
  
  function handleBackToForm() {
    payment = null;
    error = '';
  }
</script>

<svelte:head>
  <title>Initiate Payment - HireTestTakers</title>
</svelte:head>

<div class="container">
  <div class="header">
    <h1>
      {#if payment}
        Payment Details
      {:else}
        Initiate Payment
      {/if}
    </h1>
    {#if payment}
      <button class="back-btn" on:click={handleBackToForm}>
        ← Back to Form
      </button>
    {/if}
  </div>
  
  {#if error}
    <div class="error-banner">
      <p>{error}</p>
      <button class="dismiss-btn" on:click={() => error = ''}>×</button>
    </div>
  {/if}
  
  {#if loading}
    <div class="loading-container">
      <Spinner />
      <p>Creating payment address...</p>
    </div>
  {:else if !payment}
    <div class="form-container">
      <p class="description">
        Enter the payment details to generate a cryptocurrency payment address.
        The test taker will receive 97% of the payment after a 3% platform commission.
      </p>
      
      <PaymentForm
        {testId}
        {loading}
        on:submit={handlePaymentSubmit}
      />
    </div>
  {:else}
    <CryptoPaymentDisplay
      paymentAddress={payment.paymentAddress}
      amount={payment.amount}
      cryptocurrency={payment.cryptocurrency}
      usdEquivalent={payment.usdEquivalent}
      exchangeRate={payment.exchangeRate}
      qrCodeUrl={payment.qrCodeUrl}
      testTakerAmount={payment.testTakerAmount}
      commissionAmount={payment.commissionAmount}
      showBreakdown={true}
    />
    
    <div class="status-info">
      <h3>Payment Status</h3>
      <div class="status-badge pending">
        {payment.status}
      </div>
      <p class="status-text">
        Waiting for payment confirmation. This page will automatically update when payment is received.
      </p>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1.5rem;
  }
  
  .description {
    color: #6b7280;
    margin-bottom: 2rem;
    line-height: 1.6;
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
  
  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
</style>