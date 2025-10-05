<script>
  import { onMount } from 'svelte';

  export let cryptocurrency = 'BTC';
  export let price = 0;
  export let priceMax = null;
  export let showRange = false;
  export let label = 'Price';
  export let required = false;

  let usdValue = 0;
  let usdValueMax = 0;
  let exchangeRate = 0;
  let loading = false;
  let error = '';

  const cryptocurrencies = [
    { value: 'BTC', label: 'Bitcoin (BTC)' },
    { value: 'ETH', label: 'Ethereum (ETH)' },
    { value: 'DOGE', label: 'Dogecoin (DOGE)' },
    { value: 'SOL', label: 'Solana (SOL)' }
  ];

  async function updateExchangeRate() {
    if (!cryptocurrency) return;
    
    loading = true;
    error = '';
    
    try {
      const response = await fetch(`/api/exchange-rate/${cryptocurrency}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch exchange rate');
      }
      
      exchangeRate = data.rate;
      calculateUsdValue();
    } catch (err) {
      error = 'Failed to fetch exchange rate';
      console.error(err);
    } finally {
      loading = false;
    }
  }

  function calculateUsdValue() {
    if (exchangeRate && price) {
      usdValue = (price * exchangeRate).toFixed(2);
    } else {
      usdValue = 0;
    }

    if (exchangeRate && priceMax) {
      usdValueMax = (priceMax * exchangeRate).toFixed(2);
    } else {
      usdValueMax = 0;
    }
  }

  function handlePriceChange() {
    calculateUsdValue();
  }

  function handleCryptoChange() {
    updateExchangeRate();
  }

  onMount(() => {
    updateExchangeRate();
  });
</script>

<div class="price-input">
  <label for="cryptocurrency">
    Cryptocurrency {required ? '*' : ''}
  </label>
  <select
    id="cryptocurrency"
    bind:value={cryptocurrency}
    on:change={handleCryptoChange}
    {required}
  >
    {#each cryptocurrencies as crypto}
      <option value={crypto.value}>{crypto.label}</option>
    {/each}
  </select>

  <div class="price-fields">
    <div class="price-field">
      <label for="price">
        {showRange ? 'Minimum Price' : label} ({cryptocurrency}) {required ? '*' : ''}
      </label>
      <input
        id="price"
        type="number"
        step="0.00000001"
        min="0"
        bind:value={price}
        on:input={handlePriceChange}
        {required}
        placeholder="0.001"
      />
      {#if usdValue > 0}
        <span class="usd-value">≈ ${usdValue} USD</span>
      {/if}
    </div>

    {#if showRange}
      <div class="price-field">
        <label for="priceMax">
          Maximum Price ({cryptocurrency})
        </label>
        <input
          id="priceMax"
          type="number"
          step="0.00000001"
          min={price || 0}
          bind:value={priceMax}
          on:input={handlePriceChange}
          placeholder="0.005"
        />
        {#if usdValueMax > 0}
          <span class="usd-value">≈ ${usdValueMax} USD</span>
        {/if}
      </div>
    {/if}
  </div>

  <label class="checkbox-label">
    <input type="checkbox" bind:checked={showRange} />
    Offer price range
  </label>

  {#if loading}
    <p class="info">Loading exchange rate...</p>
  {/if}

  {#if error}
    <p class="error">{error}</p>
  {/if}
</div>

<style>
  .price-input {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  select,
  input[type='number'] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  select:focus,
  input[type='number']:focus {
    outline: none;
    border-color: #007bff;
  }

  .price-fields {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .price-field {
    flex: 1;
    min-width: 200px;
  }

  .usd-value {
    display: block;
    margin-top: 0.25rem;
    font-size: 0.875rem;
    color: #666;
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-weight: normal;
  }

  .checkbox-label input[type='checkbox'] {
    width: auto;
    cursor: pointer;
  }

  .info {
    margin: 0;
    font-size: 0.875rem;
    color: #666;
  }

  .error {
    margin: 0;
    font-size: 0.875rem;
    color: #dc3545;
  }
</style>