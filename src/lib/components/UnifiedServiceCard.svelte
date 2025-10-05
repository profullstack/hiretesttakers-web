<script>
  import { t } from '$lib/i18n';

  export let service;

  // Get service type label
  const getServiceTypeLabel = (type) => {
    const labels = {
      homework: $t('services.types.homework'),
      programming: $t('services.types.programming'),
      assignment: $t('services.types.assignment'),
      test: $t('services.types.test')
    };
    return labels[type] || type;
  };

  // Get service type color
  const getServiceTypeColor = (type) => {
    const colors = {
      homework: 'bg-blue-100 text-blue-800',
      programming: 'bg-green-100 text-green-800',
      assignment: 'bg-purple-100 text-purple-800',
      test: 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      assigned: 'bg-blue-100 text-blue-800',
      submitted: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get service link
  const getServiceLink = (service) => {
    const { service_type, id } = service;
    const links = {
      homework: `/homework/${id}`,
      programming: `/programming/${id}`,
      assignment: `/assignments/${id}`,
      test: `/browse-tests//${id}`
    };
    return links[service_type] || '#';
  };

  // Format price
  const formatPrice = (service) => {
    if (service.fixed_price) {
      return `$${service.fixed_price}`;
    }
    if (service.price_min && service.price_max) {
      return `$${service.price_min} - $${service.price_max}`;
    }
    if (service.price) {
      return `$${service.price}`;
    }
    return $t('services.price_negotiable');
  };

  // Format deadline
  const formatDeadline = (deadline) => {
    if (!deadline) return '';
    const date = new Date(deadline);
    return date.toLocaleDateString();
  };
</script>

<div class="service-card">
  <div class="card-header">
    <div class="badges">
      <span class="badge {getServiceTypeColor(service.service_type)}">
        {getServiceTypeLabel(service.service_type)}
      </span>
      <span class="badge {getStatusColor(service.status)}">
        {service.status}
      </span>
    </div>
  </div>

  <h3 class="title">
    <a href={getServiceLink(service)}>{service.title}</a>
  </h3>

  <p class="description">{service.description?.substring(0, 150)}...</p>

  <div class="meta">
    <div class="meta-item">
      <span class="label">{$t('services.price')}:</span>
      <span class="value">{formatPrice(service)}</span>
    </div>
    {#if service.deadline}
      <div class="meta-item">
        <span class="label">{$t('services.deadline')}:</span>
        <span class="value">{formatDeadline(service.deadline)}</span>
      </div>
    {/if}
  </div>

  <div class="actions">
    <a href={getServiceLink(service)} class="btn-primary">
      {$t('services.view_details')}
    </a>
  </div>
</div>

<style>
  .service-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1.5rem;
    transition: box-shadow 0.2s;
  }

  .service-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .badge {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  .title a {
    color: #1f2937;
    text-decoration: none;
  }

  .title a:hover {
    color: #3b82f6;
  }

  .description {
    color: #6b7280;
    margin-bottom: 1rem;
    line-height: 1.5;
  }

  .meta {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    gap: 0.5rem;
  }

  .label {
    color: #6b7280;
    font-size: 0.875rem;
  }

  .value {
    color: #1f2937;
    font-weight: 500;
    font-size: 0.875rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    transition: background 0.2s;
  }

  .btn-primary:hover {
    background: #2563eb;
  }
</style>