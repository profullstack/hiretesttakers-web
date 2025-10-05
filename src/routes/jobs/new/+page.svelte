<script>
  import { goto } from '$app/navigation';
  import AssignmentRequestForm from '$lib/components/AssignmentRequestForm.svelte';

  function handleSuccess(event) {
    const job = event.detail;
    goto(`/jobs/${job.id}`);
  }

  function handleCancel() {
    goto('/jobs');
  }
</script>

<svelte:head>
  <title>Request New Job - HireTestTakers</title>
</svelte:head>

<div class="container">
  <AssignmentRequestForm on:success={handleSuccess} on:cancel={handleCancel} />
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }
  }
</style>