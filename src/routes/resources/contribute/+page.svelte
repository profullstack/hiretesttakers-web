<script>
  import { goto } from '$app/navigation';
  import ResourceForm from '$lib/components/ResourceForm.svelte';
  
  let submitting = false;
  let error = null;
  
  async function handleSubmit(event) {
    const data = event.detail;
    
    try {
      submitting = true;
      error = null;
      
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create resource');
      }
      
      const resource = await response.json();
      
      // Redirect to the new resource
      goto(`/resources/${resource.id}`);
    } catch (err) {
      error = err.message;
      console.error('Error creating resource:', err);
    } finally {
      submitting = false;
    }
  }
  
  function handleCancel() {
    goto('/resources');
  }
</script>

<svelte:head>
  <title>Contribute Resource - TutorLinkup</title>
</svelte:head>

<div class="container">
  <header class="page-header">
    <h1>Contribute a Resource</h1>
    <p>Share your knowledge with the community</p>
  </header>
  
  {#if error}
    <div class="error-banner">
      <p>Error: {error}</p>
    </div>
  {/if}
  
  {#if submitting}
    <div class="loading">
      <p>Creating resource...</p>
    </div>
  {:else}
    <ResourceForm
      on:submit={handleSubmit}
      on:cancel={handleCancel}
    />
  {/if}
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .page-header h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: var(--text-primary, #333);
  }

  .page-header p {
    font-size: 1.125rem;
    color: var(--text-secondary, #666);
  }

  .error-banner {
    padding: 1rem;
    margin-bottom: 2rem;
    background: #fee;
    border: 1px solid var(--error-color, #dc3545);
    border-radius: 4px;
    color: var(--error-color, #dc3545);
  }

  .loading {
    text-align: center;
    padding: 3rem;
  }
</style>