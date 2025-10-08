<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import TestForm from '$lib/components/TestForm.svelte';

  let test = null;
  let loading = true;
  let error = '';

  async function loadTest() {
    loading = true;
    error = '';

    try {
      const response = await fetch(`/api/tests/${$page.params.id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load test');
      }

      test = data.test;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleSuccess(event) {
    const updatedTest = event.detail;
    goto(`/browse-tests/${updatedTest.id}`);
  }

  function handleCancel() {
    goto(`/browse-tests/${$page.params.id}`);
  }

  onMount(() => {
    loadTest();
  });
</script>

<svelte:head>
  <title>Edit Test - TutorLinkup</title>
</svelte:head>

<div class="container">
  {#if loading}
    <div class="loading">Loading test...</div>
  {:else if error}
    <div class="error">{error}</div>
  {:else if test}
    <TestForm {test} isEdit={true} on:success={handleSuccess} on:cancel={handleCancel} />
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .loading,
  .error {
    text-align: center;
    padding: 3rem 1rem;
  }

  .error {
    color: #dc3545;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
  }
</style>