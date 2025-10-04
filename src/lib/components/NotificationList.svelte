<script>
  import NotificationItem from './NotificationItem.svelte';
  
  export let notifications = [];
  export let onMarkAsRead = null;
  export let onMarkAllAsRead = null;
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }
  
  function groupNotificationsByDate(notifications) {
    const groups = {};
    
    notifications.forEach(notification => {
      const dateKey = formatDate(notification.created_at);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(notification);
    });
    
    return Object.entries(groups);
  }
  
  $: groupedNotifications = groupNotificationsByDate(notifications);
  $: hasUnread = notifications.some(n => !n.read);
</script>

<div class="notification-list">
  <div class="notification-header">
    <h2>Notifications</h2>
    {#if hasUnread && onMarkAllAsRead}
      <button class="mark-all-read" on:click={onMarkAllAsRead}>
        Mark all as read
      </button>
    {/if}
  </div>
  
  {#if notifications.length === 0}
    <div class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      <p>No notifications yet</p>
      <span>You'll see notifications here when you have them</span>
    </div>
  {:else}
    {#each groupedNotifications as [date, dateNotifications]}
      <div class="date-group">
        <div class="date-divider">
          <span>{date}</span>
        </div>
        
        {#each dateNotifications as notification}
          <NotificationItem 
            {notification} 
            onMarkAsRead={() => onMarkAsRead?.(notification.id)}
          />
        {/each}
      </div>
    {/each}
  {/if}
</div>

<style>
  .notification-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }
  
  .notification-header h2 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .mark-all-read {
    background: none;
    border: none;
    color: #007bff;
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    transition: color 0.2s;
  }
  
  .mark-all-read:hover {
    color: #0056b3;
    text-decoration: underline;
  }
  
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
    text-align: center;
    color: #999;
  }
  
  .empty-state svg {
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  .empty-state p {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
    font-weight: 500;
    color: #666;
  }
  
  .empty-state span {
    font-size: 0.875rem;
  }
  
  .date-group {
    margin-bottom: 1rem;
  }
  
  .date-divider {
    display: flex;
    justify-content: center;
    margin: 1rem 0 0.5rem 0;
  }
  
  .date-divider span {
    background: #f0f0f0;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #666;
    font-weight: 500;
  }
  
  @media (max-width: 640px) {
    .notification-header {
      padding: 0.75rem;
    }
    
    .notification-header h2 {
      font-size: 1.125rem;
    }
  }
</style>