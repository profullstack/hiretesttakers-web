<script>
  /**
   * Reset Password Page
   * 
   * Password reset request page using AuthForm component.
   */

  import { goto } from '$app/navigation';
  import AuthForm from '$lib/components/AuthForm.svelte';

  async function handleResetPassword({ email }) {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (data.success) {
      setTimeout(() => {
        goto('/auth/login');
      }, 2000);
      
      return {
        success: true,
        message: 'Password reset email sent! Check your inbox.'
      };
    }

    return {
      success: false,
      error: data.error || 'Failed to send reset email'
    };
  }
</script>

<svelte:head>
  <title>Reset Password - HireTestTakers</title>
</svelte:head>

<div class="reset-page">
  <div class="container">
    <h1>Reset Password</h1>
    <p class="subtitle">Enter your email to receive a password reset link</p>

    <AuthForm
      type="reset"
      onSubmit={handleResetPassword}
      submitText="Send Reset Link"
      showEmailField={true}
      showPasswordField={false}
      showConfirmPassword={false}
    >
      <div slot="footer" class="footer-links">
        <p>
          Remember your password?
          <a href="/auth/login">Log in</a>
        </p>
        <p>
          Don't have an account?
          <a href="/auth/signup">Sign up</a>
        </p>
      </div>
    </AuthForm>
  </div>
</div>

<style>
  .reset-page {
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
    .reset-page {
      padding: var(--spacing-md);
    }

    h1 {
      font-size: 1.75rem;
    }
  }
</style>