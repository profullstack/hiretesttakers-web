<script>
  /**
   * AuthForm Component
   *
   * Reusable authentication form for signup, login, and password reset.
   * Handles form submission and displays errors.
   */

  export let onSubmit = async () => {};
  export let submitText = 'Submit';
  export let showEmailField = true;
  export let showPasswordField = true;
  export let showConfirmPassword = false;

  let email = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';
  let success = '';

  async function handleSubmit(event) {
    event.preventDefault();
    error = '';
    success = '';

    // Validation
    if (showEmailField && !email) {
      error = 'Email is required';
      return;
    }

    if (showPasswordField && !password) {
      error = 'Password is required';
      return;
    }

    if (showConfirmPassword && password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    if (showPasswordField && password.length < 6) {
      error = 'Password must be at least 6 characters';
      return;
    }

    loading = true;

    try {
      const result = await onSubmit({ email, password });
      
      if (result?.success) {
        success = result.message || 'Success!';
        // Clear form on success
        email = '';
        password = '';
        confirmPassword = '';
      } else if (result?.error) {
        error = result.error;
      }
    } catch (err) {
      error = err.message || 'An error occurred';
    } finally {
      loading = false;
    }
  }
</script>

<form on:submit={handleSubmit} class="auth-form">
  {#if error}
    <div class="alert alert-error" role="alert">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="alert alert-success" role="alert">
      {success}
    </div>
  {/if}

  {#if showEmailField}
    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="Enter your email"
        required
        disabled={loading}
      />
    </div>
  {/if}

  {#if showPasswordField}
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        placeholder="Enter your password"
        required
        disabled={loading}
        minlength="6"
      />
    </div>
  {/if}

  {#if showConfirmPassword}
    <div class="form-group">
      <label for="confirm-password">Confirm Password</label>
      <input
        id="confirm-password"
        type="password"
        bind:value={confirmPassword}
        placeholder="Confirm your password"
        required
        disabled={loading}
        minlength="6"
      />
    </div>
  {/if}

  <button type="submit" class="btn btn-primary" disabled={loading}>
    {loading ? 'Loading...' : submitText}
  </button>

  <slot name="footer" />
</form>

<style>
  .auth-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 2rem;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 1rem;
    transition: border-color 0.2s;
  }

  input:focus {
    outline: none;
    border-color: var(--color-primary, #007bff);
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }

  input:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
  }

  .btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 0.375rem;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background-color: var(--color-primary, #007bff);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover, #0056b3);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .alert {
    padding: 0.75rem;
    border-radius: 0.375rem;
    margin-bottom: 1rem;
  }

  .alert-error {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  }

  .alert-success {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }
</style>