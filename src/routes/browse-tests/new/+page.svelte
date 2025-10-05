<script>
  import { goto } from '$app/navigation';
  import TestForm from '$lib/components/TestForm.svelte';

  function handleSuccess(event) {
    const test = event.detail;
    goto(`/tests/${test.id}`);
  }

  function handleCancel() {
    goto('/tests');
  }
</script>

<svelte:head>
  <title>Post a Test - HireTestTakers</title>
</svelte:head>

<div class="page-wrapper">
  <div class="page-header">
    <h1>Post a New Test</h1>
    <p class="subtitle">Create a test listing to find qualified test takers</p>
  </div>
  
  <div class="form-container">
    <TestForm on:success={handleSuccess} on:cancel={handleCancel} />
  </div>
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
</style>