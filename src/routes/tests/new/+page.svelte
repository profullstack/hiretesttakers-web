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

<div class="container">
  <TestForm on:success={handleSuccess} on:cancel={handleCancel} />
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
</style>