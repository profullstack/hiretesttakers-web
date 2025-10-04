<script>
  import { _ } from '$lib/i18n/index.js';

  export let metrics = {};

  $: ({
    total_services_completed = 0,
    average_rating = 0,
    success_rate = 0,
    on_time_delivery_rate = 0,
    average_response_time_minutes = 0,
    total_earnings = 0,
  } = metrics);

  function formatResponseTime(minutes) {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
</script>

<div class="performance-metrics grid grid-cols-2 md:grid-cols-3 gap-4">
  <div class="metric-card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="metric-label text-sm text-gray-600 dark:text-gray-400">
      {$_('reputation.servicesCompleted')}
    </div>
    <div class="metric-value text-2xl font-bold text-gray-900 dark:text-white">
      {total_services_completed}
    </div>
  </div>

  <div class="metric-card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="metric-label text-sm text-gray-600 dark:text-gray-400">
      {$_('reputation.averageRating')}
    </div>
    <div class="metric-value text-2xl font-bold text-yellow-600 dark:text-yellow-400">
      {parseFloat(average_rating).toFixed(1)} ⭐
    </div>
  </div>

  <div class="metric-card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="metric-label text-sm text-gray-600 dark:text-gray-400">
      {$_('reputation.successRate')}
    </div>
    <div class="metric-value text-2xl font-bold text-green-600 dark:text-green-400">
      {parseFloat(success_rate).toFixed(0)}%
    </div>
  </div>

  <div class="metric-card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="metric-label text-sm text-gray-600 dark:text-gray-400">
      {$_('reputation.onTimeDelivery')}
    </div>
    <div class="metric-value text-2xl font-bold text-blue-600 dark:text-blue-400">
      {parseFloat(on_time_delivery_rate).toFixed(0)}%
    </div>
  </div>

  <div class="metric-card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="metric-label text-sm text-gray-600 dark:text-gray-400">
      {$_('reputation.avgResponseTime')}
    </div>
    <div class="metric-value text-2xl font-bold text-purple-600 dark:text-purple-400">
      {formatResponseTime(average_response_time_minutes)}
    </div>
  </div>

  <div class="metric-card p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div class="metric-label text-sm text-gray-600 dark:text-gray-400">
      {$_('reputation.totalEarnings')}
    </div>
    <div class="metric-value text-2xl font-bold text-green-600 dark:text-green-400">
      ${parseFloat(total_earnings).toFixed(2)}
    </div>
  </div>
</div>

<style>
  .performance-metrics {
    width: 100%;
  }

  .metric-card {
    transition: transform 0.2s;
  }

  .metric-card:hover {
    transform: translateY(-2px);
  }
</style>