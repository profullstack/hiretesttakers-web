<script>
  import { createEventDispatcher } from 'svelte';

  export let testTakerId = '';
  export let testTakerName = '';

  const dispatch = createEventDispatcher();

  let jobTitle = '';
  let jobDescription = '';
  let employmentType = 'full_time';
  let salaryMin = '';
  let salaryMax = '';
  let salaryCurrency = 'USD';
  let location = '';
  let remoteAllowed = false;
  let requirements = '';
  let benefits = '';
  let expiresAt = '';

  let loading = false;
  let error = '';

  const employmentTypes = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const currencies = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'BTC', label: 'BTC (₿)' },
    { value: 'ETH', label: 'ETH (Ξ)' }
  ];

  async function handleSubmit(event) {
    event.preventDefault();
    error = '';
    loading = true;

    try {
      const offerData = {
        test_taker_id: testTakerId,
        job_title: jobTitle,
        job_description: jobDescription,
        employment_type: employmentType,
        salary_currency: salaryCurrency,
        remote_allowed: remoteAllowed
      };

      // Add optional fields if provided
      if (salaryMin) offerData.salary_min = parseFloat(salaryMin);
      if (salaryMax) offerData.salary_max = parseFloat(salaryMax);
      if (location) offerData.location = location;
      if (requirements) offerData.requirements = requirements;
      if (benefits) offerData.benefits = benefits;
      if (expiresAt) offerData.expires_at = new Date(expiresAt).toISOString();

      const response = await fetch('/api/job-offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(offerData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job offer');
      }

      dispatch('success', data.offer);
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function handleCancel() {
    dispatch('cancel');
  }
</script>

<form on:submit={handleSubmit} class="job-offer-form">
  <h2>Make Job Offer to {testTakerName}</h2>

  {#if error}
    <div class="error-message">{error}</div>
  {/if}

  <div class="form-group">
    <label for="jobTitle">
      Job Title *
    </label>
    <input
      id="jobTitle"
      type="text"
      bind:value={jobTitle}
      required
      placeholder="e.g., Senior Software Engineer"
      maxlength="200"
    />
  </div>

  <div class="form-group">
    <label for="jobDescription">
      Job Description *
    </label>
    <textarea
      id="jobDescription"
      bind:value={jobDescription}
      required
      placeholder="Describe the role, responsibilities, and what you're looking for..."
      rows="5"
    ></textarea>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="employmentType">
        Employment Type *
      </label>
      <select id="employmentType" bind:value={employmentType} required>
        {#each employmentTypes as type}
          <option value={type.value}>{type.label}</option>
        {/each}
      </select>
    </div>

    <div class="form-group">
      <label for="salaryCurrency">
        Currency
      </label>
      <select id="salaryCurrency" bind:value={salaryCurrency}>
        {#each currencies as curr}
          <option value={curr.value}>{curr.label}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="form-row">
    <div class="form-group">
      <label for="salaryMin">
        Minimum Salary
      </label>
      <input
        id="salaryMin"
        type="number"
        bind:value={salaryMin}
        placeholder="e.g., 80000"
        min="0"
        step="1000"
      />
    </div>

    <div class="form-group">
      <label for="salaryMax">
        Maximum Salary
      </label>
      <input
        id="salaryMax"
        type="number"
        bind:value={salaryMax}
        placeholder="e.g., 120000"
        min="0"
        step="1000"
      />
    </div>
  </div>

  <div class="form-group">
    <label for="location">
      Location
    </label>
    <input
      id="location"
      type="text"
      bind:value={location}
      placeholder="e.g., San Francisco, CA or Remote"
      maxlength="200"
    />
  </div>

  <div class="form-group checkbox-group">
    <label>
      <input
        type="checkbox"
        bind:checked={remoteAllowed}
      />
      Remote work allowed
    </label>
  </div>

  <div class="form-group">
    <label for="requirements">
      Requirements
    </label>
    <textarea
      id="requirements"
      bind:value={requirements}
      placeholder="List required skills, experience, qualifications..."
      rows="4"
    ></textarea>
  </div>

  <div class="form-group">
    <label for="benefits">
      Benefits
    </label>
    <textarea
      id="benefits"
      bind:value={benefits}
      placeholder="Health insurance, 401k, vacation days, etc..."
      rows="4"
    ></textarea>
  </div>

  <div class="form-group">
    <label for="expiresAt">
      Offer Expires (Optional)
    </label>
    <input
      id="expiresAt"
      type="datetime-local"
      bind:value={expiresAt}
    />
    <small>Leave blank for no expiration</small>
  </div>

  <div class="form-actions">
    <button type="button" on:click={handleCancel} class="btn-secondary" disabled={loading}>
      Cancel
    </button>
    <button type="submit" class="btn-primary" disabled={loading}>
      {loading ? 'Sending Offer...' : 'Send Job Offer'}
    </button>
  </div>
</form>

<style>
  .job-offer-form {
    max-width: 800px;
    margin: 0 auto;
  }

  h2 {
    margin: 0 0 2rem 0;
    font-size: 1.75rem;
    font-weight: 600;
  }

  .error-message {
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: #f8d7da;
    border: 1px solid #f5c6cb;
    border-radius: 4px;
    color: #721c24;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }

  .checkbox-group input[type='checkbox'] {
    width: auto;
    cursor: pointer;
  }

  input[type='text'],
  input[type='number'],
  input[type='datetime-local'],
  textarea,
  select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
  }

  input[type='text']:focus,
  input[type='number']:focus,
  input[type='datetime-local']:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: #007bff;
  }

  textarea {
    resize: vertical;
  }

  small {
    display: block;
    margin-top: 0.25rem;
    color: #666;
    font-size: 0.875rem;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #e0e0e0;
  }

  button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-primary {
    background: #007bff;
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background: #0056b3;
  }

  .btn-secondary {
    background: #6c757d;
    color: white;
  }

  .btn-secondary:hover:not(:disabled) {
    background: #545b62;
  }

  @media (max-width: 640px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    button {
      width: 100%;
    }
  }
</style>