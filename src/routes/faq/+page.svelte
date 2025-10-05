<script>
  let openIndex = null;

  function toggle(index) {
    openIndex = openIndex === index ? null : index;
  }

  const faqs = [
    {
      question: 'How do I get started on HireTestTakers?',
      answer: 'Simply sign up for a free account, complete your profile, and you can start posting tests or applying to available opportunities immediately.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Bitcoin (BTC), Ethereum (ETH), Dogecoin (DOGE), and Solana (SOL). All payments are processed securely through cryptocurrency.'
    },
    {
      question: 'How does the reputation system work?',
      answer: 'Your reputation score is calculated based on completed services, average ratings, success rate, and total earnings. Higher reputation scores increase your visibility on the leaderboard.'
    },
    {
      question: 'What is the platform fee?',
      answer: 'We charge a 3% platform fee on all transactions. This fee helps us maintain and improve the platform.'
    },
    {
      question: 'How long does it take to get paid?',
      answer: 'Payments are released immediately upon completion and approval of the work. Cryptocurrency transactions typically confirm within minutes to hours depending on the blockchain.'
    },
    {
      question: 'Can I cancel a test after posting it?',
      answer: 'Yes, you can cancel a test before anyone applies. Once applications are received, cancellation may require mutual agreement or dispute resolution.'
    },
    {
      question: 'How do I improve my reputation score?',
      answer: 'Complete more services successfully, maintain high ratings, respond quickly to messages, and deliver quality work on time.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-standard encryption and security practices. We never share your personal information without your consent.'
    },
    {
      question: 'What if I have a dispute?',
      answer: 'We have a dispute resolution process. Contact support with details, and we will mediate to find a fair solution for both parties.'
    },
    {
      question: 'Can I use the free tools without an account?',
      answer: 'Yes! All our free AI-powered tools are available to everyone without requiring an account or login.'
    }
  ];
</script>

<svelte:head>
  <title>FAQ - HireTestTakers</title>
</svelte:head>

<div class="container">
  <h1>Frequently Asked Questions</h1>
  <p class="subtitle">Find quick answers to common questions</p>

  <div class="faq-list">
    {#each faqs as faq, index}
      <div class="faq-item" class:open={openIndex === index}>
        <button class="faq-question" on:click={() => toggle(index)}>
          <span>{faq.question}</span>
          <span class="icon">{openIndex === index ? '−' : '+'}</span>
        </button>
        {#if openIndex === index}
          <div class="faq-answer">
            <p>{faq.answer}</p>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <section class="contact-cta">
    <h2>Still Have Questions?</h2>
    <p>Can't find what you're looking for? We're here to help!</p>
    <a href="/contact" class="btn-primary">Contact Support</a>
  </section>
</div>

<style>
  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: var(--spacing-2xl) var(--spacing-md);
  }

  h1 {
    font-size: 2.5rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
    text-align: center;
  }

  .subtitle {
    text-align: center;
    color: var(--color-text-secondary);
    font-size: 1.2rem;
    margin-bottom: var(--spacing-2xl);
  }

  .faq-list {
    display: grid;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
  }

  .faq-item {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    transition: all var(--transition-base);
  }

  .faq-item:hover {
    border-color: var(--color-primary);
  }

  .faq-item.open {
    border-color: var(--color-primary);
  }

  .faq-question {
    width: 100%;
    padding: var(--spacing-lg);
    background: transparent;
    border: none;
    text-align: left;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--color-text);
    transition: background var(--transition-base);
  }

  .faq-question:hover {
    background: var(--color-surface-hover);
  }

  .faq-question .icon {
    font-size: 1.5rem;
    color: var(--color-primary);
    font-weight: bold;
  }

  .faq-answer {
    padding: 0 var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
    animation: slideDown 0.2s ease-out;
  }

  .faq-answer p {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin: 0;
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .contact-cta {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--color-bg-secondary);
    border-radius: var(--radius-lg);
  }

  .contact-cta h2 {
    font-size: 2rem;
    color: var(--color-text);
    margin-bottom: var(--spacing-sm);
  }

  .contact-cta p {
    color: var(--color-text-secondary);
    font-size: 1.1rem;
    margin-bottom: var(--spacing-xl);
  }

  .btn-primary {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-weight: 600;
    transition: all var(--transition-base);
  }

  .btn-primary:hover {
    background: var(--color-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }

    .faq-question {
      font-size: 1rem;
    }
  }
</style>