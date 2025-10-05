<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import TestForm from '$lib/components/TestForm.svelte';

  let isAuthenticated = false;
  let loading = true;

  onMount(async () => {
    // Check if user is authenticated
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        isAuthenticated = !!data.user;
        
        if (!isAuthenticated) {
          goto('/auth/login?redirectTo=/browse-tests/new');
        }
      } else {
        goto('/auth/login?redirectTo=/browse-tests/new');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      goto('/auth/login?redirectTo=/browse-tests/new');
    } finally {
      loading = false;
    }
  });

  function handleSuccess(event) {
    const test = event.detail;
    goto(`/browse-tests/${test.id}`);
  }

  function handleCancel() {
    goto('/browse-tests');
  }
</script>

<svelte:head>
  <title>Post a Test - HireTestTakers</title>
</svelte:head>

<div class="page-wrapper">
  {#if loading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Checking authentication...</p>
    </div>
  {:else if isAuthenticated}
    <div class="page-header">
      <h1>Post a New Test</h1>
      <p class="subtitle">Create a test listing to find qualified test takers</p>
    </div>
    
    <div class="form-container">
      <TestForm on:success={handleSuccess} on:cancel={handleCancel} />
    </div>
  {/if}
</div>

<style>
  .page-wrapper {
    min-height: calc(100vh - 200px);
    background: var(--color-bg);
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  .page-header {
    max-width: 800px;
    margin: 0 auto var(--spacing-2xl);
    text-align: center;
  }

  .page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 var(--spacing-sm);
    letter-spacing: -0.02em;
  }

  .subtitle {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin: 0;
  }

  .form-container {
    max-width: 800px;
    margin: 0 auto;
    background: var(--color-surface);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    padding: var(--spacing-2xl);
    border: 1px solid var(--color-border);
  }

  @media (max-width: 768px) {
    .page-wrapper {
      padding: var(--spacing-xl) var(--spacing-sm);
    }

    .page-header h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .form-container {
      padding: var(--spacing-xl);
      border-radius: var(--radius-lg);
    }
  }

  @media (max-width: 480px) {
    .page-header h1 {
      font-size: 1.75rem;
    }

    .form-container {
      padding: var(--spacing-lg);
    }
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: var(--spacing-md);
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-border);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading p {
    color: var(--color-text-secondary);
  }
</style>