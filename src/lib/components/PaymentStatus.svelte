<script>
  /**
   * PaymentStatus Component
   * 
   * Displays payment status and details
   */
  
  import QRCode from './QRCode.svelte';
  
  export let payment = null;
  export let qrCodeUrl = '';
  
  $: statusColor = {
    pending: '#f59e0b',
    confirmed: '#10b981',
    failed: '#ef4444',
    expired: '#6b7280'
  }[payment?.status] || '#6b7280';
  
  $: statusText = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    failed: 'Failed',
    expired: 'Expired'
  }[payment?.status] || 'Unknown';
  
  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }
</script>

{#if payment}
  <div class="payment-status">
    <div class="status-header">
      <h2>Payment Status</h2>
      <span class="status-badge" style="background-color: {statusColor}">
        {statusText}
      </span>
    </div>
    
    <div class="payment-details">
      <div class="detail-row">
        <span class="label">Amount:</span>
        <span class="value">{payment.amount} {payment.cryptocurrency}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">USD Equivalent:</span>
        <span class="value">${payment.usd_equivalent?.toFixed(2)}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Commission (3%):</span>
        <span class="value">{payment.commission_amount} {payment.cryptocurrency}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Test Taker Receives:</span>
        <span class="value">{payment.test_taker_amount} {payment.cryptocurrency}</span>
      </div>
      
      <div class="detail-row">
        <span class="label">Payment Address:</span>
        <div class="address-container">
          <code class="address">{payment.payment_address}</code>
          <button 
            type="button"
            class="copy-btn"
            on:click={() => copyToClipboard(payment.payment_address)}
          >
            Copy
          </button>
        </div>
      </div>
      
      {#if payment.transaction_hash}
        <div class="detail-row">
          <span class="label">Transaction Hash:</span>
          <code class="address">{payment.transaction_hash}</code>
        </div>
      {/if}
      
      {#if payment.confirmed_at}
        <div class="detail-row">
          <span class="label">Confirmed At:</span>
          <span class="value">{new Date(payment.confirmed_at).toLocaleString()}</span>
        </div>
      {/if}
    </div>
    
    {#if qrCodeUrl && payment.status === 'pending'}
      <div class="qr-section">
        <h3>Scan to Pay</h3>
        <QRCode url={qrCodeUrl} size={256} alt="Payment QR Code" />
        <p class="qr-instructions">
          Scan this QR code with your {payment.cryptocurrency} wallet to complete the payment
        </p>
      </div>
    {/if}
  </div>
{:else}
  <div class="no-payment">
    <p>No payment information available</p>
  </div>
{/if}

<style>
  .payment-status {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .status-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .status-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #111827;
  }
  
  .status-badge {
    padding: 0.5rem 1rem;
    border-radius: 9999px;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
  }
  
  .payment-details {
    margin-bottom: 2rem;
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .detail-row:last-child {
    border-bottom: none;
  }
  
  .label {
    font-weight: 500;
    color: #6b7280;
    flex-shrink: 0;
    margin-right: 1rem;
  }
  
  .value {
    color: #111827;
    text-align: right;
  }
  
  .address-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex: 1;
  }
  
  .address {
    flex: 1;
    padding: 0.5rem;
    background: #f9fafb;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    word-break: break-all;
    color: #374151;
  }
  
  .copy-btn {
    padding: 0.5rem 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    cursor: pointer;
    white-space: nowrap;
  }
  
  .copy-btn:hover {
    background: #2563eb;
  }
  
  .qr-section {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
  }
  
  .qr-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
    color: #111827;
  }
  
  .qr-instructions {
    margin-top: 1rem;
    color: #6b7280;
    font-size: 0.875rem;
  }
  
  .no-payment {
    text-align: center;
    padding: 3rem;
    color: #6b7280;
  }
</style>