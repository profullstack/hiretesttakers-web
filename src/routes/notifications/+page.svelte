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
  <title>Notifications - TutorLinkup</title>
</svelte:head>

<div class="notifications-page">
  <div class="page-header">
    <h1>Notifications</h1>
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
    padding: var(--spacing-xl) var(--spacing-md);
    background: var(--color-bg);
    min-height: calc(100vh - 200px);
  }
  
  .page-header {
    margin-bottom: var(--spacing-xl);
  }
  
  .page-header h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
  }
  
  .filter-tabs {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
    border-bottom: 2px solid var(--color-border);
  }
  
  .filter-tab {
    background: none;
    border: none;
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    cursor: pointer;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    transition: all var(--transition-base);
  }
  
  .filter-tab:hover {
    color: var(--color-text);
  }
  
  .filter-tab.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }
  
  .notifications-container {
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--color-border);
    overflow: hidden;
  }
  
  .loading,
  .error {
    padding: var(--spacing-2xl) var(--spacing-md);
    text-align: center;
    color: var(--color-text-secondary);
  }
  
  .error {
    color: var(--color-error);
  }
  
  @media (max-width: 640px) {
    .notifications-page {
      padding: var(--spacing-md) 0;
    }
    
    .page-header {
      padding: 0 var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }
    
    .page-header h1 {
      font-size: 1.5rem;
    }
    
    .filter-tabs {
      padding: 0 var(--spacing-md);
    }
    
    .filter-tab {
      padding: var(--spacing-sm) var(--spacing-lg);
      font-size: 0.875rem;
    }
  }
</style>