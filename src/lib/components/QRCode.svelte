<script>
  /**
   * QRCode Component
   * 
   * Displays a QR code for cryptocurrency payment address
   */
  
  export let url = '';
  export let size = 256;
  export let alt = 'QR Code';
</script>

<div class="qr-code">
  {#if url}
    <img 
      src={url} 
      {alt}
      width={size}
      height={size}
      class="qr-image"
    />
  {:else}
    <div class="qr-placeholder" style="width: {size}px; height: {size}px;">
      <p>QR Code not available</p>
    </div>
  {/if}
</div>

<style>
  .qr-code {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .qr-image {
    border: 2px solid #e5e7eb;
    border-radius: 0.5rem;
    background: white;
    padding: 0.5rem;
  }

  .qr-placeholder {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #d1d5db;
    border-radius: 0.5rem;
    background: #f9fafb;
  }

  .qr-placeholder p {
    color: #6b7280;
    font-size: 0.875rem;
  }
</style>