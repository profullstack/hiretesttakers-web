<script>
  export let notification;
  export let onMarkAsRead = null;
  
  function formatTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
  
  function getNotificationIcon(type) {
    const icons = {
      application_received: '📝',
      application_approved: '✅',
      application_rejected: '❌',
      service_completed: '🎉',
      payment_received: '💰',
      payment_sent: '💸',
      new_message: '💬',
      rating_received: '⭐',
      revision_requested: '🔄',
      job_offer_received: '💼',
      referral_bonus_earned: '🎁'
    };
    
    return icons[type] || '🔔';
  }
  
  async function handleMarkAsRead() {
    if (onMarkAsRead && !notification.read) {
      await onMarkAsRead();
    }
  }
</script>

<div 
  class="notification-item {notification.read ? 'read' : 'unread'}"
  on:click={handleMarkAsRead}
  role="button"
  tabindex="0"
  on:keydown={(e) => e.key === 'Enter' && handleMarkAsRead()}
>
  <div class="notification-icon">
    {getNotificationIcon(notification.notification_types?.name)}
  </div>
  
  <div class="notification-content">
    <div class="notification-title">{notification.title}</div>
    <div class="notification-message">{notification.message}</div>
    <div class="notification-time">{formatTime(notification.created_at)}</div>
  </div>
  
  {#if !notification.read}
    <div class="unread-indicator"></div>
  {/if}
</div>

<style>
  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
    cursor: pointer;
    transition: background-color 0.2s;
    position: relative;
  }
  
  .notification-item:hover {
    background-color: #f8f9fa;
  }
  
  .notification-item.unread {
    background-color: #f0f7ff;
  }
  
  .notification-item.unread:hover {
    background-color: #e6f2ff;
  }
  
  .notification-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f0f0;
    border-radius: 50%;
  }
  
  .notification-content {
    flex: 1;
    min-width: 0;
  }
  
  .notification-title {
    font-weight: 600;
    font-size: 0.9375rem;
    margin-bottom: 0.25rem;
    color: #333;
  }
  
  .notification-message {
    font-size: 0.875rem;
    color: #666;
    line-height: 1.4;
    margin-bottom: 0.25rem;
    word-wrap: break-word;
  }
  
  .notification-time {
    font-size: 0.75rem;
    color: #999;
  }
  
  .unread-indicator {
    width: 8px;
    height: 8px;
    background: #007bff;
    border-radius: 50%;
    flex-shrink: 0;
    margin-top: 0.5rem;
  }
  
  @media (max-width: 640px) {
    .notification-item {
      padding: 0.75rem;
      gap: 0.5rem;
    }
    
    .notification-icon {
      width: 36px;
      height: 36px;
      font-size: 1.25rem;
    }
    
    .notification-title {
      font-size: 0.875rem;
    }
    
    .notification-message {
      font-size: 0.8125rem;
    }
  }
</style>