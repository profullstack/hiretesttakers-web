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
  
  // Apply theme on mount and reactively update
  onMount(() => {
    // Initialize i18n only on client side
    initI18n();
    
    if (browser) {
      document.documentElement.classList.toggle('dark', $theme === 'dark');
    }
  });
  
  // Reactively update theme class when theme changes
  $: if (browser) {
    document.documentElement.classList.toggle('dark', $theme === 'dark');
  }
</script>

<div class="app">
  <header class="header">
    <div class="header-content">
      <h1 class="logo"><a href="/">HireTestTakers</a></h1>
      <nav class="nav">
        <a href="/">Home</a>
        <a href="/browse-tests">Browse Tests</a>
        <a href="/tools">Free Tools</a>
        <a href="/services">Services</a>
      </nav>
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
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
  }
  
  .logo a {
    color: var(--color-primary);
    text-decoration: none;
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