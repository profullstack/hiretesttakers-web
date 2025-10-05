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
    background: var(--color-surface);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-lg);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    align-items: start;
    border: 1px solid var(--color-border);
  }

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  label {
    font-weight: 600;
    color: var(--color-text);
    font-size: 0.875rem;
  }

  select,
  input[type='text'] {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    width: 100%;
    background: var(--color-bg);
    color: var(--color-text);
    transition: all var(--transition-base);
  }

  select:focus,
  input[type='text']:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(91, 127, 232, 0.1);
  }

  :global(.dark) select:focus,
  :global(.dark) input[type='text']:focus {
    box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.2);
  }

  .skill-input-wrapper {
    display: flex;
    gap: var(--spacing-sm);
  }

  .add-skill-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 0.875rem;
    white-space: nowrap;
    transition: all var(--transition-base);
    box-shadow: var(--shadow-sm);
  }

  .add-skill-btn:hover {
    background: var(--color-primary-hover);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }

  :global(.dark) .add-skill-btn {
    box-shadow: var(--glow-primary);
  }

  :global(.dark) .add-skill-btn:hover {
    box-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
  }

  .selected-skills {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
  }

  .skill-tag {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-xs);
    background: var(--color-bg-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }

  .remove-skill {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 0;
    font-size: 1.25rem;
    line-height: 1;
    margin-left: var(--spacing-xs);
    transition: color var(--transition-base);
  }

  .remove-skill:hover {
    color: var(--color-error);
  }

  .filter-actions {
    display: flex;
    align-items: flex-end;
  }

  .reset-btn {
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-bg-secondary);
    color: var(--color-text);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    cursor: pointer;
    font-size: 0.875rem;
    transition: all var(--transition-base);
  }

  .reset-btn:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  @media (max-width: 768px) {
    .filters {
      grid-template-columns: 1fr;
    }
  }
</style>