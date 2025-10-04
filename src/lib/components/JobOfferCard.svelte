<script>
  export let offer;
  export let viewType = 'received'; // 'received' or 'sent'

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function getStatusClass(status) {
    const statusClasses = {
      pending: 'status-pending',
      accepted: 'status-accepted',
      rejected: 'status-rejected',
      withdrawn: 'status-withdrawn',
      expired: 'status-expired'
    };
    return statusClasses[status] || '';
  }

  function getStatusLabel(status) {
    const labels = {
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
      withdrawn: 'Withdrawn',
      expired: 'Expired'
    };
    return labels[status] || status;
  }

  function getEmploymentTypeLabel(type) {
    const labels = {
      full_time: 'Full Time',
      part_time: 'Part Time',
      contract: 'Contract',
      freelance: 'Freelance'
    };
    return labels[type] || type;
  }

  function formatSalary() {
    if (!offer.salary_min && !offer.salary_max) return null;
    
    const currency = offer.salary_currency || 'USD';
    if (offer.salary_min && offer.salary_max) {
      return `${currency} ${offer.salary_min.toLocaleString()} - ${offer.salary_max.toLocaleString()}`;
    }
    if (offer.salary_min) {
      return `${currency} ${offer.salary_min.toLocaleString()}+`;
    }
    return `Up to ${currency} ${offer.salary_max.toLocaleString()}`;
  }
</script>

<article class="job-offer-card">
  <div class="offer-header">
    <h3>
      <a href="/job-offers/{offer.id}">{offer.job_title}</a>
    </h3>
    <span class="status {getStatusClass(offer.status)}">
      {getStatusLabel(offer.status)}
    </span>
  </div>

  <p class="offer-description">{offer.job_description}</p>

  <div class="offer-meta">
    <span class="meta-item">
      <strong>Type:</strong> {getEmploymentTypeLabel(offer.employment_type)}
    </span>
    {#if offer.location}
      <span class="meta-item">
        <strong>Location:</strong> {offer.location}
      </span>
    {/if}
    {#if offer.remote_allowed}
      <span class="meta-item remote-badge">
        🌐 Remote OK
      </span>
    {/if}
  </div>

  <div class="offer-footer">
    <div class="salary-info">
      {#if formatSalary()}
        <span class="salary">{formatSalary()}</span>
      {/if}
    </div>
    <div class="dates">
      <span class="date">Sent {formatDate(offer.created_at)}</span>
      {#if offer.expires_at}
        <span class="expiry">Expires {formatDate(offer.expires_at)}</span>
      {/if}
    </div>
  </div>
</article>

<style>
  .job-offer-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    background: white;
    transition: box-shadow 0.2s;
  }

  .job-offer-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .offer-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  h3 a {
    color: #333;
    text-decoration: none;
  }

  h3 a:hover {
    color: #007bff;
  }

  .status {
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.875rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-accepted {
    background: #d4edda;
    color: #155724;
  }

  .status-rejected {
    background: #f8d7da;
    color: #721c24;
  }

  .status-withdrawn {
    background: #e2e3e5;
    color: #383d41;
  }

  .status-expired {
    background: #f8d7da;
    color: #721c24;
  }

  .offer-description {
    margin: 0 0 1rem 0;
    color: #666;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .offer-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
  }

  .meta-item {
    color: #666;
  }

  .meta-item strong {
    color: #333;
  }

  .remote-badge {
    background: #e7f3ff;
    color: #0066cc;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 500;
  }

  .offer-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }

  .salary-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .salary {
    font-size: 1.125rem;
    font-weight: 600;
    color: #28a745;
  }

  .dates {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
    font-size: 0.875rem;
  }

  .date {
    color: #999;
  }

  .expiry {
    color: #dc3545;
    font-weight: 500;
  }

  @media (max-width: 640px) {
    .job-offer-card {
      padding: 1rem;
    }

    .offer-header {
      flex-direction: column;
    }

    .offer-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .dates {
      align-items: flex-start;
    }

    .offer-meta {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>