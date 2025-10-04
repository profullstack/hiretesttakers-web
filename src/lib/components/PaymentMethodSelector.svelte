<script>
  /**
   * PaymentMethodSelector Component
   * 
   * Allows users to select and manage their payment methods
   */
  
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let selectedMethodId = '';
  export let loading = false;
  
  const dispatch = createEventDispatcher();
  
  let methods = [];
  let error = '';
  let showAddForm = false;
  
  // New method form
  let methodType = 'crypto_wallet';
  let cryptocurrency = 'BTC';
  let walletAddress = '';
  let paypalEmail = '';
  
  const cryptocurrencies = [
    { code: 'BTC', name: 'Bitcoin' },
    { code: 'ETH', name: 'Ethereum' },
    { code: 'DOGE', name: 'Dogecoin' },
    { code: 'SOL', name: 'Solana' }
  ];
  
  onMount(async () => {
    await loadMethods();
  });
  
  async function loadMethods() {
    try {
      const response = await fetch('/api/payments/methods');
      if (response.ok) {
        methods = await response.json();
        if (methods.length > 0 && !selectedMethodId) {
          const defaultMethod = methods.find(m => m.is_default) || methods[0];
          selectedMethodId = defaultMethod.id;
          dispatch('select', defaultMethod);
        }
      }
    } catch (err) {
      error = 'Failed to load payment methods';
    }
  }
  
  async function handleAddMethod() {
    error = '';
    loading = true;
    
    try {
      const data = {
        methodType,
        ...(methodType === 'crypto_wallet' && { cryptocurrency, walletAddress }),
        ...(methodType === 'paypal' && { paypalEmail })
      };
      
      const response = await fetch('/api/payments/methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        await loadMethods();
        showAddForm = false;
        resetForm();
      } else {
        const result = await response.json();
        error = result.error || 'Failed to add payment method';
      }
    } catch (err) {
      error = 'Failed to add payment method';
    } finally {
      loading = false;
    }
  }
  
  async function handleSetDefault(methodId) {
    try {
      const response = await fetch(`/api/payments/methods/${methodId}`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        await loadMethods();
      }
    } catch (err) {
      error = 'Failed to set default method';
    }
  }
  
  async function handleDelete(methodId) {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    
    try {
      const response = await fetch(`/api/payments/methods/${methodId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadMethods();
      }
    } catch (err) {
      error = 'Failed to delete payment method';
    }
  }
  
  function handleSelect(method) {
    selectedMethodId = method.id;
    dispatch('select', method);
  }
  
  function resetForm() {
    methodType = 'crypto_wallet';
    cryptocurrency = 'BTC';
    walletAddress = '';
    paypalEmail = '';
  }
</script>

<div class="payment-method-selector">
  <h3>Payment Methods</h3>
  
  {#if error}
    <div class="error">{error}</div>
  {/if}
  
  <div class="methods-list">
    {#each methods as method}
      <div class="method-card" class:selected={selectedMethodId === method.id}>
        <input
          type="radio"
          name="payment-method"
          value={method.id}
          checked={selectedMethodId === method.id}
          on:change={() => handleSelect(method)}
        />
        <div class="method-info">
          <div class="method-type">
            {#if method.method_type === 'crypto_wallet'}
              {method.cryptocurrency} Wallet
            {:else if method.method_type === 'paypal'}
              PayPal
            {:else}
              Bank Transfer
            {/if}
            {#if method.is_default}
              <span class="badge">Default</span>
            {/if}
          </div>
          <div class="method-details">
            {#if method.method_type === 'crypto_wallet'}
              {method.wallet_address.slice(0, 10)}...{method.wallet_address.slice(-6)}
            {:else if method.method_type === 'paypal'}
              {method.paypal_email}
            {/if}
          </div>
        </div>
        <div class="method-actions">
          {#if !method.is_default}
            <button type="button" on:click={() => handleSetDefault(method.id)} class="btn-small">
              Set Default
            </button>
          {/if}
          <button type="button" on:click={() => handleDelete(method.id)} class="btn-small btn-danger">
            Delete
          </button>
        </div>
      </div>
    {/each}
  </div>
  
  {#if !showAddForm}
    <button type="button" on:click={() => showAddForm = true} class="btn-add">
      + Add Payment Method
    </button>
  {:else}
    <form on:submit|preventDefault={handleAddMethod} class="add-form">
      <div class="form-group">
        <label for="method-type">Method Type</label>
        <select id="method-type" bind:value={methodType} required disabled={loading}>
          <option value="crypto_wallet">Crypto Wallet</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>
      
      {#if methodType === 'crypto_wallet'}
        <div class="form-group">
          <label for="cryptocurrency">Cryptocurrency</label>
          <select id="cryptocurrency" bind:value={cryptocurrency} required disabled={loading}>
            {#each cryptocurrencies as crypto}
              <option value={crypto.code}>{crypto.name} ({crypto.code})</option>
            {/each}
          </select>
        </div>
        
        <div class="form-group">
          <label for="wallet-address">Wallet Address</label>
          <input
            type="text"
            id="wallet-address"
            bind:value={walletAddress}
            placeholder="Enter wallet address"
            required
            disabled={loading}
          />
        </div>
      {:else if methodType === 'paypal'}
        <div class="form-group">
          <label for="paypal-email">PayPal Email</label>
          <input
            type="email"
            id="paypal-email"
            bind:value={paypalEmail}
            placeholder="Enter PayPal email"
            required
            disabled={loading}
          />
        </div>
      {/if}
      
      <div class="form-actions">
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Method'}
        </button>
        <button type="button" on:click={() => { showAddForm = false; resetForm(); }} disabled={loading}>
          Cancel
        </button>
      </div>
    </form>
  {/if}
</div>

<style>
  .payment-method-selector {
    max-width: 600px;
  }
  
  h3 {
    margin-bottom: 1rem;
    color: #111827;
  }
  
  .methods-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
  
  .method-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .method-card.selected {
    border-color: #3b82f6;
    background-color: #eff6ff;
  }
  
  .method-info {
    flex: 1;
  }
  
  .method-type {
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.25rem;
  }
  
  .method-details {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .badge {
    display: inline-block;
    padding: 0.125rem 0.5rem;
    background-color: #10b981;
    color: white;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    margin-left: 0.5rem;
  }
  
  .method-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .btn-small {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    background-color: white;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-small:hover {
    background-color: #f3f4f6;
  }
  
  .btn-danger {
    color: #dc2626;
    border-color: #fecaca;
  }
  
  .btn-danger:hover {
    background-color: #fee2e2;
  }
  
  .btn-add {
    width: 100%;
    padding: 0.75rem;
    background-color: #f3f4f6;
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .btn-add:hover {
    background-color: #e5e7eb;
    border-color: #9ca3af;
  }
  
  .add-form {
    padding: 1rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    background-color: #f9fafb;
  }
  
  .form-group {
    margin-bottom: 1rem;
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
  
  .form-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  button {
    flex: 1;
    padding: 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.375rem;
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
  
  button[type="button"] {
    background-color: #6b7280;
  }
  
  button[type="button"]:hover:not(:disabled) {
    background-color: #4b5563;
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