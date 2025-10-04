<script>
  /**
   * Reset Password Page
   * 
   * Password reset request page using AuthForm component.
   */

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
      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.'
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

<div class="reset-password-page">
  <div class="container">
    <h1>Reset Your Password</h1>
    <p class="subtitle">Enter your email address and we'll send you a link to reset your password</p>

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
  .reset-password-page {
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