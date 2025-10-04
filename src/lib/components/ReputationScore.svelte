<script>
  import { _ } from '$lib/i18n/index.js';

  export let score = 0;
  export let size = 'medium'; // 'small', 'medium', 'large'
  export let showLabel = true;

  $: sizeClass = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
  }[size];

  $: scoreColor = getScoreColor(score);

  function getScoreColor(score) {
    if (score >= 1000) return 'text-purple-600 dark:text-purple-400';
    if (score >= 500) return 'text-blue-600 dark:text-blue-400';
    if (score >= 250) return 'text-green-600 dark:text-green-400';
    if (score >= 100) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-600 dark:text-gray-400';
  }

  function getScoreLevel(score) {
    if (score >= 1000) return 'Elite';
    if (score >= 500) return 'Expert';
    if (score >= 250) return 'Advanced';
    if (score >= 100) return 'Intermediate';
    return 'Beginner';
  }
</script>

<div class="reputation-score flex items-center gap-2">
  <div class="score-value {sizeClass} {scoreColor} font-bold">
    {score.toLocaleString()}
  </div>
  {#if showLabel}
    <div class="score-label text-sm text-gray-600 dark:text-gray-400">
      {$_('reputation.level')}: {getScoreLevel(score)}
    </div>
  {/if}
</div>

<style>
  .reputation-score {
    display: inline-flex;
  }
</style>