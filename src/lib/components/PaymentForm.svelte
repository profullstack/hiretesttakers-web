<script>
  /**
   * PaymentForm Component
   * 
   * Form for initiating a cryptocurrency payment
   */
  
  import { createEventDispatcher } from 'svelte';
  
  export let testId = '';
  export let testTakerId = '';
  export let amount = 0;
  export let loading = false;
  
  const dispatch = createEventDispatcher();
  
  let cryptocurrency = 'BTC';
  let testTakerWallet = '';
  let error = '';
  
  const cryptocurrencies = [
    { code: 'BTC', name: 'Bitcoin' },
    { code: 'ETH', name: 'Ethereum' },
    { code: 'DOGE', name: 'Dogecoin' },
    { code: 'SOL', name: 'Solana' }
  ];
  
  async function handleSubmit() {
    error = '';
    
    if (!testTakerWallet.trim()) {
      error = 'Wallet address is required';
      return;
    }
    
    dispatch('submit', {
      testId,
      testTakerId,
      amount,
      cryptocurrency,
      testTakerWallet: testTakerWallet.trim()
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="payment-form">
  <div class="form-group">
    <label for="amount">Amount (USD)</label>
    <input
      type="number"
      id="amount"
      bind:value={amount}
      min="0.01"
      step="0.01"
      required
      disabled={loading}
    />
  </div>
  
  <div class="form-group">
    <label for="cryptocurrency">Cryptocurrency</label>
    <select
      id="cryptocurrency"
      bind:value={cryptocurrency}
      required
      disabled={loading}
    >
      {#each cryptocurrencies as crypto}
        <option value={crypto.code}>{crypto.name} ({crypto.code})</option>
      {/each}
    </select>
  </div>
  
  <div class="form-group">
    <label for="wallet">Test Taker Wallet Address</label>
    <input
      type="text"
      id="wallet"
      bind:value={testTakerWallet}
      placeholder="Enter wallet address"
      required
      disabled={loading}
    />
    <small>The wallet address where the test taker will receive payment (97% after 3% commission)</small>
  </div>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  <button type="submit" disabled={loading}>
    {loading ? 'Processing...' : 'Generate Payment Address'}
  </button>
</form>

<style>
  .payment-form {
    max-width: 500px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }
  
  input,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
  }
  
  input:focus,
  select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  input:disabled,
  select:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }
  
  small {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  button {
    width: 100%;
    padding: 0.75rem 1.5rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  button:hover:not(:disabled) {
    background-color: #2563eb;
  }
  
  button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
  
  .error {
    padding: 0.75rem;
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    border-radius: 0.375rem;
    color: #dc2626;
    margin-bottom: 1rem;
  }
</style>