<script>
  /**
   * Signup Page
   * 
   * User registration page using AuthForm component.
   */

  import { goto } from '$app/navigation';
  import AuthForm from '$lib/components/AuthForm.svelte';

  async function handleSignup({ email, password }) {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Redirect to login or home after successful signup
      setTimeout(() => {
        goto('/auth/login');
      }, 1500);
      
      return {
        success: true,
        message: 'Account created successfully! Redirecting to login...'
      };
    }

    return {
      success: false,
      error: data.error || 'Failed to create account'
    };
  }
</script>

<svelte:head>
  <title>Sign Up - TutorLinkup</title>
</svelte:head>

<div class="signup-page">
  <div class="container">
    <h1>Create Account</h1>
    <p class="subtitle">Join TutorLinkup and start earning or hiring today</p>

    <AuthForm
      type="signup"
      onSubmit={handleSignup}
      submitText="Sign Up"
      showEmailField={true}
      showPasswordField={true}
      showConfirmPassword={true}
    >
      <div slot="footer" class="footer-links">
        <p>
          Already have an account?
          <a href="/auth/login">Log in</a>
        </p>
      </div>
    </AuthForm>
  </div>
</div>

<style>
  .signup-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-bg);
    padding: var(--spacing-xl);
  }

  .container {
    width: 100%;
    max-width: 500px;
    background: var(--color-surface);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    padding: var(--spacing-xl);
    border: 1px solid var(--color-border);
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .subtitle {
    text-align: center;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
  }

  .footer-links {
    margin-top: var(--spacing-lg);
    text-align: center;
    color: var(--color-text-secondary);
  }

  .footer-links p {
    margin: var(--spacing-sm) 0;
  }

  .footer-links a {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color var(--transition-base);
  }

  .footer-links a:hover {
    color: var(--color-primary-hover);
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .signup-page {
      padding: var(--spacing-md);
    }

    h1 {
      font-size: 1.75rem;
    }
  }
</style>