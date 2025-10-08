<script>
  import { goto } from '$app/navigation';
  import JobRequestForm from '$lib/components/JobRequestForm.svelte';

  function handleSuccess(event) {
    const job = event.detail;
    goto(`/jobs/${job.id}`);
  }

  function handleCancel() {
    goto('/jobs');
  }
</script>

<svelte:head>
  <title>Request New Job - TutorLinkup</title>
</svelte:head>

<div class="container">
  <JobRequestForm on:success={handleSuccess} on:cancel={handleCancel} />
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