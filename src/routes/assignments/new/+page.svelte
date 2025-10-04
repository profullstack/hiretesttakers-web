<script>
  import { goto } from '$app/navigation';
  import AssignmentRequestForm from '$lib/components/AssignmentRequestForm.svelte';

  function handleSuccess(event) {
    const assignment = event.detail;
    goto(`/assignments/${assignment.id}`);
  }

  function handleCancel() {
    goto('/assignments');
  }
</script>

<svelte:head>
  <title>Request New Assignment - HireTestTakers</title>
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