<script>
  import { onMount } from 'svelte';
  
  let preferences = [];
  let loading = true;
  let error = null;
  let saving = false;
  
  async function fetchPreferences() {
    try {
      loading = true;
      const response = await fetch('/api/notifications/preferences');
      
      if (!response.ok) {
        throw new Error('Failed to fetch preferences');
      }
      
      const data = await response.json();
      preferences = data.preferences;
    } catch (err) {
      error = err.message;
      console.error('Error fetching preferences:', err);
    } finally {
      loading = false;
    }
  }
  
  async function updatePreference(preference, field, value) {
    try {
      saving = true;
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: preference.notification_types.name,
          [field]: value
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update preference');
      }
      
      // Update local state
      const index = preferences.findIndex(p => p.id === preference.id);
      if (index !== -1) {
        preferences[index][field] = value;
        preferences = [...preferences];
      }
    } catch (err) {
      error = err.message;
      console.error('Error updating preference:', err);
    } finally {
      saving = false;
    }
  }
  
  function getCategoryLabel(category) {
    const labels = {
      application: 'Applications',
      payment: 'Payments',
      message: 'Messages',
      rating: 'Ratings',
      system: 'System'
    };
    return labels[category] || category;
  }
  
  function getTypeLabel(name) {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  onMount(() => {
    fetchPreferences();
  });
  
  $: groupedPreferences = preferences.reduce((acc, pref) => {
    const category = pref.notification_types?.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(pref);
    return acc;
  }, {});
</script>

<div class="notification-preferences">
  <h2>Notification Preferences</h2>
  <p class="description">Choose how you want to be notified about different events</p>
  
  {#if loading}
    <div class="loading">Loading preferences...</div>
  {:else if error}
    <div class="error">Error: {error}</div>
  {:else}
    <div class="preferences-list">
      {#each Object.entries(groupedPreferences) as [category, categoryPrefs]}
        <div class="category-section">
          <h3>{getCategoryLabel(category)}</h3>
          
          {#each categoryPrefs as preference}
            <div class="preference-item">
              <div class="preference-info">
                <div class="preference-name">
                  {getTypeLabel(preference.notification_types?.name)}
                </div>
                <div class="preference-description">
                  {preference.notification_types?.description || ''}
                </div>
              </div>
              
              <div class="preference-toggles">
                <label class="toggle">
                  <input
                    type="checkbox"
                    checked={preference.in_app_enabled}
                    on:change={(e) => updatePreference(preference, 'in_app_enabled', e.target.checked)}
                    disabled={saving}
                  />
                  <span>In-App</span>
                </label>
                
                <label class="toggle">
                  <input
                    type="checkbox"
                    checked={preference.email_enabled}
                    on:change={(e) => updatePreference(preference, 'email_enabled', e.target.checked)}
                    disabled={saving}
                  />
                  <span>Email</span>
                </label>
                
                <label class="toggle">
                  <input
                    type="checkbox"
                    checked={preference.push_enabled}
                    on:change={(e) => updatePreference(preference, 'push_enabled', e.target.checked)}
                    disabled={saving}
                  />
                  <span>Push</span>
                </label>
              </div>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .notification-preferences {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .description {
    margin: 0 0 2rem 0;
    color: #666;
    font-size: 0.9375rem;
  }
  
  .loading,
  .error {
    padding: 2rem;
    text-align: center;
    color: #666;
  }
  
  .error {
    color: #dc3545;
  }
  
  .preferences-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .category-section h3 {
    margin: 0 0 1rem 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #333;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e0e0e0;
  }
  
  .preference-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 0.75rem;
  }
  
  .preference-info {
    flex: 1;
    min-width: 0;
    margin-right: 1rem;
  }
  
  .preference-name {
    font-weight: 500;
    font-size: 0.9375rem;
    color: #333;
    margin-bottom: 0.25rem;
  }
  
  .preference-description {
    font-size: 0.8125rem;
    color: #666;
  }
  
  .preference-toggles {
    display: flex;
    gap: 1rem;
    flex-shrink: 0;
  }
  
  .toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
  }
  
  .toggle input[type="checkbox"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
  }
  
  .toggle span {
    font-size: 0.75rem;
    color: #666;
  }
  
  .toggle input[type="checkbox"]:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    .notification-preferences {
      padding: 1rem;
    }
    
    .preference-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .preference-info {
      margin-right: 0;
    }
    
    .preference-toggles {
      width: 100%;
      justify-content: space-around;
    }
  }
</style>