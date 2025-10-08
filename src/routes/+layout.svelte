<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import '../app.css';
  import { initI18n } from '$lib/i18n';
  import { theme } from '$lib/stores/theme';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';
  import UserDropdown from '$lib/components/UserDropdown.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import NavBar from '$lib/components/NavBar.svelte';
  
  let user = $state(null);
  
  // Check session status
  async function checkSession() {
    if (!browser) return;
    
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      user = data.user || null;
    } catch (err) {
      console.error('Failed to load session:', err);
      user = null;
    }
  }
  
  // Apply theme on mount and reactively update
  onMount(async () => {
    // Initialize i18n only on client side
    initI18n();
    
    if (browser) {
      document.documentElement.classList.toggle('dark', $theme === 'dark');
      
      // Initial session check
      await checkSession();
      
      // Poll for session changes every 5 seconds
      const interval = setInterval(checkSession, 5000);
      
      // Cleanup
      return () => clearInterval(interval);
    }
  });
  
  // Reactively update theme class when theme changes
  $effect(() => {
    if (browser) {
      document.documentElement.classList.toggle('dark', $theme === 'dark');
    }
  });
</script>

<div class="app">
  <header class="header">
    <div class="header-content">
      <a href="/" class="logo">
        <img src="/logo.black.svg" alt="TutorLinkup" class="logo-light" />
        <img src="/logo.white.svg" alt="TutorLinkup" class="logo-dark" />
      </a>
      <NavBar {user} />
      <div class="header-actions">
        <LanguageSelector />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </div>
  </header>
  
  <main class="main">
    <slot />
  </main>
  
  <Footer />
</div>

<style>
  :global(html) {
    transition: background-color var(--transition-slow);
  }
  
  :global(.dark) {
    color-scheme: dark;
  }
  
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  
  .header {
    background-color: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: var(--spacing-md) 0;
    transition: background-color var(--transition-base), border-color var(--transition-base);
  }
  
  .header-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    display: flex;
    align-items: center;
    height: 80px;
    text-decoration: none;
    margin: 0;
  }

  .logo img {
    height: 100%;
    width: auto;
    max-width: 400px;
    object-fit: contain;
  }

  .logo-light {
    display: block;
  }

  .logo-dark {
    display: none;
  }

  :global(.dark) .logo-light {
    display: none;
  }

  :global(.dark) .logo-dark {
    display: block;
  }
  
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
  }
  
  .nav a:hover {
    color: var(--color-primary);
  }
  
  .header-actions {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
  }
  
  .main {
    flex: 1;
    max-width: 1280px;
    width: 100%;
    margin: 0 auto;
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: var(--spacing-md);
    }
    
    .nav {
      width: 100%;
      justify-content: center;
    }
  }
</style>