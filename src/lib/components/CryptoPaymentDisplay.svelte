<script>
  /**
   * CryptoPaymentDisplay Component
   * 
   * Displays comprehensive cryptocurrency payment information including:
   * - QR code for easy scanning
   * - Payment address (with copy functionality)
   * - Cryptocurrency amount
   * - USD equivalent
   * - Commission breakdown
   */
  
  import QRCode from './QRCode.svelte';
  import { formatCryptoAmount } from '$lib/utils/commission.js';
  
  export let paymentAddress = '';
  export let amount = 0;
  export let cryptocurrency = 'BTC';
  export let usdEquivalent = 0;
  export let exchangeRate = 0;
  export let qrCodeUrl = '';
  export let testTakerAmount = 0;
  export let commissionAmount = 0;
  export let showBreakdown = true;
  
  let copied = false;
  
  // Format currency
  const formatUSD = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Copy address to clipboard
  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(paymentAddress);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  }
  
  // Calculate percentages
  const testTakerPercentage = testTakerAmount > 0 ? ((testTakerAmount / amount) * 100).toFixed(0) : 97;
  const commissionPercentage = commissionAmount > 0 ? ((commissionAmount / amount) * 100).toFixed(0) : 3;
</script>

<div class="payment-display">
  <!-- QR Code Section -->
  <div class="qr-section">
    <h3>Scan to Pay</h3>
    <QRCode url={qrCodeUrl} size={256} alt="Payment QR Code" />
    <p class="qr-hint">Scan with your {cryptocurrency} wallet</p>
  </div>
  
  <!-- Payment Details Section -->
  <div class="details-section">
    <!-- Amount -->
    <div class="detail-card primary">
      <div class="detail-label">Total Amount</div>
      <div class="detail-value large">
        {formatCryptoAmount(amount, cryptocurrency)}
      </div>
      <div class="detail-secondary">
        ≈ {formatUSD(usdEquivalent)}
      </div>
    </div>
    
    <!-- Payment Address -->
    <div class="detail-card">
      <div class="detail-label">Payment Address</div>
      <div class="address-container">
        <code class="address">{paymentAddress}</code>
        <button 
          class="copy-btn" 
          on:click={copyAddress}
          aria-label="Copy address"
        >
          {#if copied}
            ✓ Copied
          {:else}
            📋 Copy
          {/if}
        </button>
      </div>
    </div>
    
    <!-- Exchange Rate -->
    <div class="detail-card">
      <div class="detail-label">Current Exchange Rate</div>
      <div class="detail-value">
        1 {cryptocurrency} = {formatUSD(exchangeRate)}
      </div>
    </div>
    
    <!-- Breakdown -->
    {#if showBreakdown && testTakerAmount > 0}
      <div class="breakdown-card">
        <h4>Payment Breakdown</h4>
        <div class="breakdown-item">
          <span class="breakdown-label">
            Test Taker ({testTakerPercentage}%)
          </span>
          <span class="breakdown-value">
            {formatCryptoAmount(testTakerAmount, cryptocurrency)}
          </span>
        </div>
        <div class="breakdown-item">
          <span class="breakdown-label">
            Platform Fee ({commissionPercentage}%)
          </span>
          <span class="breakdown-value">
            {formatCryptoAmount(commissionAmount, cryptocurrency)}
          </span>
        </div>
        <div class="breakdown-divider"></div>
        <div class="breakdown-item total">
          <span class="breakdown-label">Total</span>
          <span class="breakdown-value">
            {formatCryptoAmount(amount, cryptocurrency)}
          </span>
        </div>
      </div>
    {/if}
    
    <!-- Important Notes -->
    <div class="notes-card">
      <h4>⚠️ Important</h4>
      <ul>
        <li>Send <strong>exactly</strong> {formatCryptoAmount(amount, cryptocurrency)}</li>
        <li>Payment will be automatically split between test taker and platform</li>
        <li>Confirmation typically takes 10-30 minutes</li>
        <li>Do not close this page until payment is confirmed</li>
      </ul>
    </div>
  </div>
</div>

<style>
  .payment-display {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem;
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .payment-display {
      grid-template-columns: 1fr;
      gap: 1.5rem;
      padding: 1.5rem;
    }
  }
  
  /* QR Section */
  .qr-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 0.75rem;
    color: white;
  }
  
  .qr-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .qr-hint {
    margin-top: 1rem;
    font-size: 0.875rem;
    opacity: 0.9;
  }
  
  /* Details Section */
  .details-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .detail-card {
    padding: 1.25rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }
  
  .detail-card.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
  }
  
  .detail-label {
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    opacity: 0.8;
  }
  
  .detail-value {
    font-size: 1.25rem;
    font-weight: 600;
    word-break: break-all;
  }
  
  .detail-value.large {
    font-size: 1.75rem;
  }
  
  .detail-secondary {
    margin-top: 0.5rem;
    font-size: 1rem;
    opacity: 0.9;
  }
  
  /* Address Container */
  .address-container {
    display: flex;
    gap: 0.75rem;
    align-items: center;
  }
  
  .address {
    flex: 1;
    padding: 0.75rem;
    background: white;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    word-break: break-all;
    font-family: 'Courier New', monospace;
  }
  
  .copy-btn {
    padding: 0.75rem 1rem;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
  }
  
  .copy-btn:hover {
    background: #5568d3;
  }
  
  .copy-btn:active {
    transform: scale(0.98);
  }
  
  /* Breakdown Card */
  .breakdown-card {
    padding: 1.25rem;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }
  
  .breakdown-card h4 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }
  
  .breakdown-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem 0;
    font-size: 0.875rem;
  }
  
  .breakdown-item.total {
    font-weight: 600;
    font-size: 1rem;
    color: #111827;
  }
  
  .breakdown-label {
    color: #6b7280;
  }
  
  .breakdown-value {
    color: #111827;
    font-weight: 500;
  }
  
  .breakdown-divider {
    height: 1px;
    background: #e5e7eb;
    margin: 0.5rem 0;
  }
  
  /* Notes Card */
  .notes-card {
    padding: 1.25rem;
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 0.5rem;
  }
  
  .notes-card h4 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #92400e;
  }
  
  .notes-card ul {
    margin: 0;
    padding-left: 1.25rem;
    color: #78350f;
  }
  
  .notes-card li {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
  }
  
  .notes-card li:last-child {
    margin-bottom: 0;
  }
  
  .notes-card strong {
    font-weight: 600;
    color: #92400e;
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .payment-display {
      background: #1f2937;
    }
    
    .detail-card {
      background: #374151;
      border-color: #4b5563;
    }
    
    .detail-label {
      color: #d1d5db;
    }
    
    .detail-value {
      color: #f9fafb;
    }
    
    .address {
      background: #1f2937;
      border-color: #4b5563;
      color: #f9fafb;
    }
    
    .breakdown-card {
      background: #374151;
      border-color: #4b5563;
    }
    
    .breakdown-card h4 {
      color: #f9fafb;
    }
    
    .breakdown-label {
      color: #d1d5db;
    }
    
    .breakdown-value {
      color: #f9fafb;
    }
    
    .breakdown-divider {
      background: #4b5563;
    }
  }
</style>