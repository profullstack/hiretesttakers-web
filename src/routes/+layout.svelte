<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import '../app.css';
  import { initI18n } from '$lib/i18n';
  import { theme } from '$lib/stores/theme';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import LanguageSelector from '$lib/components/LanguageSelector.svelte';
  
  // Initialize i18n
  initI18n();
  
  // Apply theme on mount
  onMount(() => {
    if (browser) {
      document.documentElement.classList.toggle('dark', $theme === 'dark');
    }
  });
</script>

<div class="app">
  <header class="header">
    <div class="header-content">
      <h1 class="logo">HireTestTakers</h1>
      <div class="header-actions">
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </div>
  </header>
  
  <main class="main">
    <slot />
  </main>
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
    color: var(--color-primary);
    margin: 0;
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
</style>