<script>
  /**
   * Login Page
   * 
   * User login page using AuthForm component.
   */

  import { goto } from '$app/navigation';
  import AuthForm from '$lib/components/AuthForm.svelte';

  async function handleLogin({ email, password }) {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Redirect to home or dashboard after successful login
      setTimeout(() => {
        goto('/');
      }, 1000);
      
      return {
        success: true,
        message: 'Logged in successfully!'
      };
    }

    return {
      success: false,
      error: data.error || 'Failed to log in'
    };
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
    background-color: #f9fafb;
    padding: 2rem;
  }

  .container {
    width: 100%;
    max-width: 500px;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }

  h1 {
    text-align: center;
    font-size: 2rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    text-align: center;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  .footer-links {
    margin-top: 1.5rem;
    text-align: center;
    color: #6b7280;
  }

  .footer-links p {
    margin: 0.5rem 0;
  }

  .footer-links a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .footer-links a:hover {
    text-decoration: underline;
  }
</style>