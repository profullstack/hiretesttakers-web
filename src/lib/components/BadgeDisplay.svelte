<script>
  import { _ } from '$lib/i18n/index.js';

  export let badges = [];
  export let size = 'medium'; // 'small', 'medium', 'large'
  export let maxDisplay = null; // null = show all

  $: displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges;
  $: remainingCount = maxDisplay && badges.length > maxDisplay ? badges.length - maxDisplay : 0;

  $: sizeClass = {
    small: 'w-6 h-6 text-xs',
    medium: 'w-10 h-10 text-base',
    large: 'w-16 h-16 text-2xl',
  }[size];
</script>

<div class="badge-display flex flex-wrap gap-2">
  {#each displayBadges as badge}
    <div
      class="badge-item {sizeClass} flex items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-md hover:shadow-lg transition-shadow"
      title="{badge.badges?.name || badge.name}: {badge.badges?.description || badge.description}"
    >
      <span class="badge-icon">{badge.badges?.icon || badge.icon || '🏆'}</span>
    </div>
  {/each}

  {#if remainingCount > 0}
    <div
      class="badge-item {sizeClass} flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-md"
      title="{$_('reputation.moreBadges', { count: remainingCount })}"
    >
      <span class="text-sm font-bold">+{remainingCount}</span>
    </div>
  {/if}

  {#if badges.length === 0}
    <div class="text-sm text-gray-500 dark:text-gray-400">
      {$_('reputation.noBadges')}
    </div>
  {/if}
</div>

<style>
  .badge-display {
    display: flex;
  }

  .badge-item {
    cursor: help;
  }
</style>