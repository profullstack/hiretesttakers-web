<script>
  import { onMount } from 'svelte';
  
  export let unreadCount = 0;
  
  let loading = false;
  let error = null;
  
  async function fetchUnreadCount() {
    try {
      loading = true;
      const response = await fetch('/api/notifications/unread-count');
      
      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }
      
      const data = await response.json();
      unreadCount = data.count;
    } catch (err) {
      error = err.message;
      console.error('Error fetching unread count:', err);
    } finally {
      loading = false;
    }
  }
  
  onMount(() => {
    fetchUnreadCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  });
</script>

<a href="/notifications" class="notification-bell" aria-label="Notifications">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
  
  {#if unreadCount > 0}
    <span class="badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
  {/if}
</a>

<style>
  .notification-bell {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    color: #333;
    text-decoration: none;
    transition: color 0.2s;
  }
  
  .notification-bell:hover {
    color: #007bff;
  }
  
  .notification-bell svg {
    width: 24px;
    height: 24px;
  }
  
  .badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #dc3545;
    color: white;
    font-size: 0.625rem;
    font-weight: 600;
    padding: 0.125rem 0.375rem;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    line-height: 1.2;
  }
  
  @media (max-width: 640px) {
    .notification-bell {
      padding: 0.375rem;
    }
  }
</style>