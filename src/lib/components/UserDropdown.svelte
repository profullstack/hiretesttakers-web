<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';

  let user = null;
  let profile = null;
  let isOpen = false;
  let dropdownRef;

  // Check auth status via API
  async function checkAuthStatus() {
    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        user = data.user || null;
        
        // Load profile if user exists
        if (user) {
          await loadProfile();
        }
      } else {
        user = null;
        profile = null;
      }
    } catch (error) {
      console.error('Failed to check auth status:', error);
      user = null;
      profile = null;
    }
  }

  // Get user on mount and poll for changes
  onMount(() => {
    if (browser) {
      // Initial check
      checkAuthStatus();
      
      // Poll every 5 seconds to check auth status
      const interval = setInterval(checkAuthStatus, 5000);
      
      // Cleanup
      return () => {
        clearInterval(interval);
      };
    }
  });

  // Load user profile
  async function loadProfile() {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        profile = data.profile;
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event) {
    if (dropdownRef && !dropdownRef.contains(event.target)) {
      isOpen = false;
    }
  }

  // Toggle dropdown
  function toggleDropdown() {
    isOpen = !isOpen;
  }

  // Handle logout
  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      user = null;
      profile = null;
      isOpen = false;
      goto('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Handle navigation
  function handleNavigation(path) {
    isOpen = false;
    goto(path);
  }

  // Get user initials for avatar fallback
  function getUserInitials() {
    if (profile?.full_name) {
      const names = profile.full_name.trim().split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return names[0].charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return '?';
  }

  // Get avatar URL or null
  function getAvatarUrl() {
    return profile?.avatar_url || null;
  }

  // Add/remove click listener
  $: if (browser) {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
  }
</script>

<div class="user-dropdown" bind:this={dropdownRef}>
  {#if user}
    <!-- Logged in: Show avatar dropdown -->
    <button class="avatar-button" on:click={toggleDropdown} aria-label="User menu">
      <div class="avatar">
        {getUserInitials()}
      </div>
    </button>

    {#if isOpen}
      <div class="dropdown-menu">
        <div class="dropdown-header">
          <div class="user-email">{user.email}</div>
        </div>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item" on:click={() => handleNavigation('/settings')}>
          <span class="icon">⚙️</span>
          Settings
        </button>
        <button class="dropdown-item" on:click={() => handleNavigation('/profile')}>
          <span class="icon">👤</span>
          Profile
        </button>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item logout" on:click={handleLogout}>
          <span class="icon">🚪</span>
          Logout
        </button>
      </div>
    {/if}
  {:else}
    <!-- Not logged in: Show login link -->
    <a href="/auth/login" class="login-link">Login</a>
  {/if}
</div>

<style>
  .user-dropdown {
    position: relative;
    display: flex;
    align-items: center;
  }

  .login-link {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    transition: all var(--transition-base);
    background-color: var(--color-primary);
    color: white;
  }

  .login-link:hover {
    background-color: var(--color-primary-dark);
    transform: translateY(-1px);
  }

  .avatar-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    transition: transform var(--transition-base);
  }

  .avatar-button:hover {
    transform: scale(1.05);
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1.1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow var(--transition-base);
  }

  .avatar-button:hover .avatar {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    min-width: 200px;
    z-index: 1000;
    animation: slideDown 0.2s ease-out;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .dropdown-header {
    padding: var(--spacing-md);
  }

  .user-email {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    word-break: break-word;
  }

  .dropdown-divider {
    height: 1px;
    background-color: var(--color-border);
    margin: var(--spacing-xs) 0;
  }

  .dropdown-item {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    color: var(--color-text);
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: background-color var(--transition-base);
  }

  .dropdown-item:hover {
    background-color: var(--color-background-alt);
  }

  .dropdown-item.logout {
    color: var(--color-error);
  }

  .dropdown-item.logout:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }

  .icon {
    font-size: 1.1rem;
    width: 20px;
    display: inline-flex;
    justify-content: center;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .dropdown-menu {
      right: -8px;
      min-width: 180px;
    }

    .login-link {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: 0.875rem;
    }

    .avatar {
      width: 36px;
      height: 36px;
      font-size: 1rem;
    }
  }
</style>