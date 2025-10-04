<script>
  import { locale } from '$lib/i18n';
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];
  
  function changeLanguage(code) {
    locale.set(code);
  }
</script>

<div class="language-selector">
  <select
    value={$locale}
    on:change={(e) => changeLanguage(e.target.value)}
    class="select"
    aria-label="Select language"
  >
    {#each languages as lang}
      <option value={lang.code}>
        {lang.flag} {lang.name}
      </option>
    {/each}
  </select>
</div>

<style>
  .language-selector {
    display: inline-block;
  }
  
  .select {
    padding: var(--spacing-sm) 2rem var(--spacing-sm) 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background-color: var(--color-bg);
    color: var(--color-text);
    font-size: 0.875rem;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
    background-position: right var(--spacing-sm) center;
    background-repeat: no-repeat;
    background-size: 1.5em 1.5em;
    transition: border-color var(--transition-fast);
  }
  
  .select:hover {
    border-color: var(--color-border-hover);
  }
  
  .select:focus {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-color: var(--color-primary);
  }
</style>