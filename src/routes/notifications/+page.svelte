<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import NotificationList from '$lib/components/NotificationList.svelte';
  
  let notifications = [];
  let loading = true;
  let error = null;
  let filter = 'all'; // 'all', 'unread', 'read'
  
  async function fetchNotifications() {
    try {
      loading = true;
      const params = new URLSearchParams();
      
      if (filter === 'unread') {
        params.append('read', 'false');
      } else if (filter === 'read') {
        params.append('read', 'true');
      }
      
      const response = await fetch(`/api/notifications?${params.toString()}`);
      
      if (response.status === 401) {
        goto('/auth/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      notifications = data.notifications;
    } catch (err) {
      error = err.message;
      console.error('Error fetching notifications:', err);
    } finally {
      loading = false;
    }
  }
  
  async function markAsRead(notificationId) {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      // Update local state
      notifications = notifications.map(n => 
        n.id === notificationId ? { ...n, read: true, read_at: new Date().toISOString() } : n
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }
  
  async function markAllAsRead() {
    try {
      const response = await fetch('/api/notifications/mark-all-read', {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      // Update local state
      notifications = notifications.map(n => ({ 
        ...n, 
        read: true, 
        read_at: new Date().toISOString() 
      }));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  }
  
  function handleFilterChange(newFilter) {
    filter = newFilter;
    fetchNotifications();
  }
  
  onMount(() => {
    fetchNotifications();
  });
</script>

<svelte:head>
  <title>Notifications - HireTestTakers</title>
</svelte:head>

<div class="notifications-page">
  <div class="page-header">
    <h1>Notifications</h1>
    <a href="/notifications/preferences" class="settings-link">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 6v6m5.2-13.2l-4.2 4.2m0 6l4.2 4.2M23 12h-6m-6 0H1m18.2 5.2l-4.2-4.2m0-6l4.2-4.2"></path>
      </svg>
      Settings
    </a>
  </div>
  
  <div class="filter-tabs">
    <button 
      class="filter-tab {filter === 'all' ? 'active' : ''}"
      on:click={() => handleFilterChange('all')}
    >
      All
    </button>
    <button 
      class="filter-tab {filter === 'unread' ? 'active' : ''}"
      on:click={() => handleFilterChange('unread')}
    >
      Unread
    </button>
    <button 
      class="filter-tab {filter === 'read' ? 'active' : ''}"
      on:click={() => handleFilterChange('read')}
    >
      Read
    </button>
  </div>
  
  <div class="notifications-container">
    {#if loading}
      <div class="loading">Loading notifications...</div>
    {:else if error}
      <div class="error">Error: {error}</div>
    {:else}
      <NotificationList 
        {notifications} 
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
      />
    {/if}
  </div>
</div>

<style>
  .notifications-page {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .page-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }
  
  .settings-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #007bff;
    text-decoration: none;
    font-size: 0.9375rem;
    transition: color 0.2s;
  }
  
  .settings-link:hover {
    color: #0056b3;
  }
  
  .filter-tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #e0e0e0;
  }
  
  .filter-tab {
    background: none;
    border: none;
    padding: 0.75rem 1.5rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #666;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all 0.2s;
  }
  
  .filter-tab:hover {
    color: #333;
  }
  
  .filter-tab.active {
    color: #007bff;
    border-bottom-color: #007bff;
  }
  
  .notifications-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .loading,
  .error {
    padding: 3rem 1rem;
    text-align: center;
    color: #666;
  }
  
  .error {
    color: #dc3545;
  }
  
  @media (max-width: 640px) {
    .notifications-page {
      padding: 1rem 0;
    }
    
    .page-header {
      padding: 0 1rem;
      margin-bottom: 1rem;
    }
    
    .page-header h1 {
      font-size: 1.5rem;
    }
    
    .filter-tabs {
      padding: 0 1rem;
    }
    
    .filter-tab {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
  }
</style>