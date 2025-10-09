<script>
  export let user = null;
  
  let workDropdownOpen = false;
  let resourcesDropdownOpen = false;
  
  function toggleWorkDropdown() {
    workDropdownOpen = !workDropdownOpen;
    resourcesDropdownOpen = false;
  }
  
  function toggleResourcesDropdown() {
    resourcesDropdownOpen = !resourcesDropdownOpen;
    workDropdownOpen = false;
  }
  
  function closeDropdowns() {
    workDropdownOpen = false;
    resourcesDropdownOpen = false;
  }
</script>

<nav class="nav">
  <a href="/" on:click={closeDropdowns}>Home</a>
  <a href="/browse-tests" on:click={closeDropdowns}>Tests</a>
  <a href="/browse-jobs" on:click={closeDropdowns}>Jobs</a>
  
  {#if user}
    <div class="nav-dropdown">
      <button class="nav-dropdown-toggle" on:click={toggleWorkDropdown}>
        My Work ▾
      </button>
      {#if workDropdownOpen}
        <div class="nav-dropdown-menu">
          <a href="/browse-tests/my-tests" on:click={closeDropdowns}>My Tests</a>
          <a href="/applications" on:click={closeDropdowns}>Applications</a>
          <a href="/jobs" on:click={closeDropdowns}>My Jobs</a>
          <a href="/messages" on:click={closeDropdowns}>Messages</a>
          <a href="/notifications" on:click={closeDropdowns}>Notifications</a>
          <a href="/payments/history" on:click={closeDropdowns}>Payment History</a>
        </div>
      {/if}
    </div>
  {/if}
  
  <a href="/leaderboard" on:click={closeDropdowns}>Leaderboard</a>
  
  <div class="nav-dropdown">
    <button class="nav-dropdown-toggle" on:click={toggleResourcesDropdown}>
      Resources ▾
    </button>
    {#if resourcesDropdownOpen}
      <div class="nav-dropdown-menu">
        <a href="/tools" on:click={closeDropdowns}>Free Tools</a>
        <a href="/services" on:click={closeDropdowns}>Services</a>
      </div>
    {/if}
  </div>
</nav>

<style>
  .nav {
    display: flex;
    gap: var(--spacing-lg);
    align-items: center;
  }
  
  .nav a {
    color: var(--color-text);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-base);
    white-space: nowrap;
  }
  
  .nav a:hover {
    color: var(--color-primary);
  }
  
  .nav-dropdown {
    position: relative;
  }
  
  .nav-dropdown-toggle {
    background: none;
    border: none;
    color: var(--color-text);
    font-weight: 500;
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    transition: color var(--transition-base);
    white-space: nowrap;
  }
  
  .nav-dropdown-toggle:hover {
    color: var(--color-primary);
  }
  
  .nav-dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
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
  
  .nav-dropdown-menu a {
    display: block;
    padding: var(--spacing-sm) var(--spacing-md);
    color: var(--color-text);
    text-decoration: none;
    transition: background-color var(--transition-base);
  }
  
  .nav-dropdown-menu a:hover {
    background-color: var(--color-bg-secondary);
    color: var(--color-primary);
  }
  
  .nav-dropdown-menu a:first-child {
    border-radius: var(--radius-md) var(--radius-md) 0 0;
  }
  
  .nav-dropdown-menu a:last-child {
    border-radius: 0 0 var(--radius-md) var(--radius-md);
  }
  
  @media (max-width: 768px) {
    .nav {
      flex-wrap: wrap;
      justify-content: center;
      gap: var(--spacing-md);
    }
    
    .nav-dropdown-menu {
      left: 50%;
      transform: translateX(-50%);
    }
  }
</style>