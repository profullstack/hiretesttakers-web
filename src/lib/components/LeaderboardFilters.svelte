<script>
  export let sortBy = 'tests_completed';
  export let location = '';
  export let skills = [];
  export let onFilterChange = () => {};

  const sortOptions = [
    { value: 'tests_completed', label: 'Tests Completed' },
    { value: 'success_rate', label: 'Success Rate' },
    { value: 'average_rating', label: 'Average Rating' },
    { value: 'total_earned', label: 'Total Earned' },
  ];

  let skillInput = '';

  const handleSortChange = (event) => {
    sortBy = event.target.value;
    onFilterChange({ sortBy, location, skills });
  };

  const handleLocationChange = (event) => {
    location = event.target.value;
    onFilterChange({ sortBy, location, skills });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      skills = [...skills, skillInput.trim()];
      skillInput = '';
      onFilterChange({ sortBy, location, skills });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    skills = skills.filter((s) => s !== skillToRemove);
    onFilterChange({ sortBy, location, skills });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }
  };

  const handleReset = () => {
    sortBy = 'tests_completed';
    location = '';
    skills = [];
    skillInput = '';
    onFilterChange({ sortBy, location, skills });
  };
</script>

<div class="filters">
  <div class="filter-group">
    <label for="sort-by">Sort By</label>
    <select id="sort-by" bind:value={sortBy} on:change={handleSortChange}>
      {#each sortOptions as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="filter-group">
    <label for="location">Location</label>
    <input
      id="location"
      type="text"
      bind:value={location}
      on:input={handleLocationChange}
      placeholder="Filter by location..."
    />
  </div>

  <div class="filter-group">
    <label for="skills">Skills</label>
    <div class="skill-input-wrapper">
      <input
        id="skills"
        type="text"
        bind:value={skillInput}
        on:keypress={handleKeyPress}
        placeholder="Add skill and press Enter..."
      />
      <button type="button" on:click={handleAddSkill} class="add-skill-btn">Add</button>
    </div>
    {#if skills.length > 0}
      <div class="selected-skills">
        {#each skills as skill}
          <span class="skill-tag">
            {skill}
            <button type="button" on:click={() => handleRemoveSkill(skill)} class="remove-skill">
              ×
            </button>
          </span>
        {/each}
      </div>
    {/if}
  </div>

  <div class="filter-actions">
    <button type="button" on:click={handleReset} class="reset-btn">Reset Filters</button>
  </div>
</div>

<style>
  .filters {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    align-items: start;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  label {
    font-weight: 600;
    color: #495057;
    font-size: 0.875rem;
  }

  select,
  input[type='text'] {
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
    font-size: 0.875rem;
    width: 100%;
  }

  select:focus,
  input[type='text']:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  .skill-input-wrapper {
    display: flex;
    gap: 8px;
  }

  .add-skill-btn {
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    white-space: nowrap;
  }

  .add-skill-btn:hover {
    background: #0056b3;
  }

  .selected-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 8px;
  }

  .skill-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #e9ecef;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    color: #495057;
  }

  .remove-skill {
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    font-size: 1.25rem;
    line-height: 1;
    margin-left: 4px;
  }

  .remove-skill:hover {
    color: #dc3545;
  }

  .filter-actions {
    display: flex;
    align-items: flex-end;
  }

  .reset-btn {
    padding: 8px 16px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
  }

  .reset-btn:hover {
    background: #5a6268;
  }

  @media (max-width: 768px) {
    .filters {
      grid-template-columns: 1fr;
    }
  }
</style>