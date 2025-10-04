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
      // Redirect to home or dashboard after successful signup
      setTimeout(() => {
        goto('/');
      }, 1500);
      
      return {
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.'
      };
    }

    return {
      success: false,
      error: data.error || 'Failed to create account'
    };
  }
</script>

<svelte:head>
  <title>Sign Up - HireTestTakers</title>
</svelte:head>

<div class="signup-page">
  <div class="container">
    <h1>Create Your Account</h1>
    <p class="subtitle">Join HireTestTakers to start hiring or earning</p>

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

  .footer-links a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }

  .footer-links a:hover {
    text-decoration: underline;
  }
</style>