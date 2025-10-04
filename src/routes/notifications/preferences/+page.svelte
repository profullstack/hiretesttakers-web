<script>
  import NotificationPreferences from '$lib/components/NotificationPreferences.svelte';
</script>

<svelte:head>
  <title>Notification Preferences - HireTestTakers</title>
</svelte:head>

<div class="preferences-page">
  <div class="back-link">
    <a href="/notifications">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Back to Notifications
    </a>
  </div>
  
  <NotificationPreferences />
</div>

<style>
  .preferences-page {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 2rem 1rem;
  }
  
  .back-link {
    max-width: 800px;
    margin: 0 auto 1rem auto;
  }
  
  .back-link a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #007bff;
    text-decoration: none;
    font-size: 0.9375rem;
    transition: color 0.2s;
  }
  
  .back-link a:hover {
    color: #0056b3;
  }
  
  @media (max-width: 640px) {
    .preferences-page {
      padding: 1rem 0;
    }
    
    .back-link {
      padding: 0 1rem;
    }
  }
</style>