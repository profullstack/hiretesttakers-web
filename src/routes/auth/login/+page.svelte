<script>
  /**
   * Login Page
   *
   * User login page using AuthForm component.
   */

  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import AuthForm from '$lib/components/AuthForm.svelte';

  // Get redirect URL from query params
  $: redirectTo = $page.url.searchParams.get('redirectTo') || '/';

  async function handleLogin({ email, password }) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Important: include cookies
      });

      const data = await response.json();

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Failed to log in'
        };
      }

      // Redirect to the original page or home after successful login
      setTimeout(() => {
        goto(redirectTo);
        // Force page reload to update auth state
        window.location.href = redirectTo;
      }, 500);
      
      return {
        success: true,
        message: 'Logged in successfully!'
      };
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Failed to log in'
      };
    }
  }
</script>

<svelte:head>
  <title>Log In - HireTestTakers</title>
</svelte:head>

<div class="login-page">
  <div class="container">
    <h1>Welcome Back</h1>
    <p class="subtitle">Log in to your HireTestTakers account</p>

    <AuthForm
      type="login"
      onSubmit={handleLogin}
      submitText="Log In"
      showEmailField={true}
      showPasswordField={true}
      showConfirmPassword={false}
    >
      <div slot="footer" class="footer-links">
        <p>
          <a href="/auth/reset-password">Forgot your password?</a>
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
  .login-page {
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
    .login-page {
      padding: var(--spacing-md);
    }

    h1 {
      font-size: 1.75rem;
    }
  }
</style>