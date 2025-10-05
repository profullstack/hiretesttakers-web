<script>
  let activeTab = 'paraphrase';
  let loading = false;
  let error = '';
  let result = null;

  // Paraphrase Tool
  let paraphraseInput = '';
  let paraphraseOutput = '';

  // Grammar Checker
  let grammarInput = '';
  let grammarResult = null;

  // Word Counter
  let wordCountInput = '';
  let wordCountStats = null;

  // Factoring Calculator
  let factorA = '';
  let factorB = '';
  let factorC = '';
  let factorResult = null;

  // PDF Summarizer
  let summarizerInput = '';
  let summarizerOutput = '';

  // Citation Generator
  let citationStyle = 'harvard';
  let citationAuthors = '';
  let citationYear = '';
  let citationTitle = '';
  let citationPublisher = '';
  let citationUrl = '';
  let citationAccessDate = '';
  let citationOutput = '';

  // Essay Typer
  let essayTopic = '';
  let essayWordCount = 500;
  let essayOutput = '';

  async function handleParaphrase() {
    if (!paraphraseInput.trim()) {
      error = 'Please enter text to paraphrase';
      return;
    }

    loading = true;
    error = '';
    paraphraseOutput = '';

    try {
      const response = await fetch('/api/tools/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: paraphraseInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to paraphrase text');
      }

      paraphraseOutput = data.paraphrased;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleGrammarCheck() {
    if (!grammarInput.trim()) {
      error = 'Please enter text to check';
      return;
    }

    loading = true;
    error = '';
    grammarResult = null;

    try {
      const response = await fetch('/api/tools/grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: grammarInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check grammar');
      }

      grammarResult = data;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleWordCount() {
    loading = true;
    error = '';
    wordCountStats = null;

    try {
      const response = await fetch('/api/tools/word-count', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: wordCountInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to count words');
      }

      wordCountStats = data;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleFactor() {
    if (!factorA || !factorB || !factorC) {
      error = 'Please enter all coefficients';
      return;
    }

    loading = true;
    error = '';
    factorResult = null;

    try {
      const response = await fetch('/api/tools/factor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ a: factorA, b: factorB, c: factorC })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to factor expression');
      }

      factorResult = data;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleSummarize() {
    if (!summarizerInput.trim()) {
      error = 'Please enter text to summarize';
      return;
    }

    loading = true;
    error = '';
    summarizerOutput = '';

    try {
      const response = await fetch('/api/tools/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: summarizerInput })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize text');
      }

      summarizerOutput = data.summary;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleCitation() {
    if (!citationAuthors || !citationTitle) {
      error = 'Please enter at least authors and title';
      return;
    }

    loading = true;
    error = '';
    citationOutput = '';

    try {
      const authors = citationAuthors.split(',').map((a) => a.trim());
      const source = {
        authors,
        year: citationYear,
        title: citationTitle,
        publisher: citationPublisher,
        url: citationUrl,
        accessDate: citationAccessDate
      };

      const response = await fetch('/api/tools/citation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style: citationStyle, source })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate citation');
      }

      citationOutput = data.citation;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  async function handleEssay() {
    if (!essayTopic.trim()) {
      error = 'Please enter an essay topic';
      return;
    }

    loading = true;
    error = '';
    essayOutput = '';

    try {
      const response = await fetch('/api/tools/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: essayTopic, wordCount: essayWordCount })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate essay');
      }

      essayOutput = data.essay;
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
  }
</script>

<div class="tools-page">
  <h1>Free Academic Tools</h1>
  <p class="subtitle">Professional tools to help with your academic work</p>

  <div class="tabs">
    <button class:active={activeTab === 'paraphrase'} on:click={() => (activeTab = 'paraphrase')}>
      Paraphrase Tool
    </button>
    <button class:active={activeTab === 'grammar'} on:click={() => (activeTab = 'grammar')}>
      Grammar Checker
    </button>
    <button class:active={activeTab === 'wordcount'} on:click={() => (activeTab = 'wordcount')}>
      Word Counter
    </button>
    <button class:active={activeTab === 'factor'} on:click={() => (activeTab = 'factor')}>
      Factoring Calculator
    </button>
    <button class:active={activeTab === 'summarizer'} on:click={() => (activeTab = 'summarizer')}>
      PDF Summarizer
    </button>
    <button class:active={activeTab === 'citation'} on:click={() => (activeTab = 'citation')}>
      Citation Generator
    </button>
    <button class:active={activeTab === 'essay'} on:click={() => (activeTab = 'essay')}>
      Essay Typer
    </button>
  </div>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <div class="tool-content">
    {#if activeTab === 'paraphrase'}
      <div class="tool-section">
        <h2>Paraphrase Tool</h2>
        <p>Rewrite text in an entirely different way while maintaining the original meaning.</p>
        <textarea
          bind:value={paraphraseInput}
          placeholder="Enter text to paraphrase..."
          rows="8"
          maxlength="5000"
        ></textarea>
        <button on:click={handleParaphrase} disabled={loading}>
          {loading ? 'Processing...' : 'Paraphrase'}
        </button>
        {#if paraphraseOutput}
          <div class="result">
            <h3>Paraphrased Text:</h3>
            <div class="output">{paraphraseOutput}</div>
            <button on:click={() => copyToClipboard(paraphraseOutput)}>Copy to Clipboard</button>
          </div>
        {/if}
      </div>
    {:else if activeTab === 'grammar'}
      <div class="tool-section">
        <h2>Grammar Checker</h2>
        <p>Check your text for grammatical errors and get suggestions.</p>
        <textarea
          bind:value={grammarInput}
          placeholder="Enter text to check..."
          rows="8"
          maxlength="5000"
        ></textarea>
        <button on:click={handleGrammarCheck} disabled={loading}>
          {loading ? 'Checking...' : 'Check Grammar'}
        </button>
        {#if grammarResult}
          <div class="result">
            {#if grammarResult.hasErrors}
              <h3>Corrections:</h3>
              {#each grammarResult.corrections as correction}
                <div class="correction">
                  <strong>Original:</strong> {correction.original}<br />
                  <strong>Corrected:</strong> {correction.corrected}<br />
                  <strong>Explanation:</strong> {correction.explanation}
                </div>
              {/each}
              <h3>Corrected Text:</h3>
              <div class="output">{grammarResult.correctedText}</div>
              <button on:click={() => copyToClipboard(grammarResult.correctedText)}>
                Copy Corrected Text
              </button>
            {:else}
              <p class="success">No errors found! Your text looks great.</p>
            {/if}
          </div>
        {/if}
      </div>
    {:else if activeTab === 'wordcount'}
      <div class="tool-section">
        <h2>Word Counter</h2>
        <p>Get accurate word counts, character counts, and more.</p>
        <textarea
          bind:value={wordCountInput}
          on:input={handleWordCount}
          placeholder="Enter or paste your text here..."
          rows="10"
        ></textarea>
        {#if wordCountStats}
          <div class="stats">
            <div class="stat">
              <span class="stat-label">Words:</span>
              <span class="stat-value">{wordCountStats.words}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Characters:</span>
              <span class="stat-value">{wordCountStats.characters}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Characters (no spaces):</span>
              <span class="stat-value">{wordCountStats.charactersNoSpaces}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Paragraphs:</span>
              <span class="stat-value">{wordCountStats.paragraphs}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Sentences:</span>
              <span class="stat-value">{wordCountStats.sentences}</span>
            </div>
          </div>
        {/if}
      </div>
    {:else if activeTab === 'factor'}
      <div class="tool-section">
        <h2>Factoring Calculator</h2>
        <p>Factor quadratic expressions with step-by-step solutions.</p>
        <div class="factor-inputs">
          <div class="input-group">
            <label for="a">a (coefficient of x²):</label>
            <input type="number" id="a" bind:value={factorA} placeholder="1" />
          </div>
          <div class="input-group">
            <label for="b">b (coefficient of x):</label>
            <input type="number" id="b" bind:value={factorB} placeholder="5" />
          </div>
          <div class="input-group">
            <label for="c">c (constant):</label>
            <input type="number" id="c" bind:value={factorC} placeholder="6" />
          </div>
        </div>
        <button on:click={handleFactor} disabled={loading}>
          {loading ? 'Calculating...' : 'Factor'}
        </button>
        {#if factorResult}
          <div class="result">
            <h3>Original Expression:</h3>
            <div class="output">{factorResult.original}</div>
            <h3>Factored Form:</h3>
            <div class="output">{@html factorResult.factored}</div>
            <h3>Steps:</h3>
            {#each factorResult.steps as step}
              <div class="step">{step}</div>
            {/each}
          </div>
        {/if}
      </div>
    {:else if activeTab === 'summarizer'}
      <div class="tool-section">
        <h2>PDF Summarizer</h2>
        <p>Summarize long text content quickly and accurately.</p>
        <textarea
          bind:value={summarizerInput}
          placeholder="Paste your text here to summarize..."
          rows="10"
          maxlength="10000"
        ></textarea>
        <button on:click={handleSummarize} disabled={loading}>
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>
        {#if summarizerOutput}
          <div class="result">
            <h3>Summary:</h3>
            <div class="output">{summarizerOutput}</div>
            <button on:click={() => copyToClipboard(summarizerOutput)}>Copy Summary</button>
          </div>
        {/if}
      </div>
    {:else if activeTab === 'citation'}
      <div class="tool-section">
        <h2>Citation Generator</h2>
        <p>Generate accurate citations in multiple formats.</p>
        <div class="citation-form">
          <div class="input-group">
            <label for="style">Citation Style:</label>
            <select id="style" bind:value={citationStyle}>
              <option value="harvard">Harvard</option>
              <option value="apa">APA</option>
              <option value="mla">MLA</option>
              <option value="chicago">Chicago</option>
            </select>
          </div>
          <div class="input-group">
            <label for="authors">Authors (comma-separated):</label>
            <input
              type="text"
              id="authors"
              bind:value={citationAuthors}
              placeholder="Smith, J., Doe, A."
            />
          </div>
          <div class="input-group">
            <label for="year">Year:</label>
            <input type="text" id="year" bind:value={citationYear} placeholder="2024" />
          </div>
          <div class="input-group">
            <label for="title">Title:</label>
            <input
              type="text"
              id="title"
              bind:value={citationTitle}
              placeholder="Article or Book Title"
            />
          </div>
          <div class="input-group">
            <label for="publisher">Publisher:</label>
            <input
              type="text"
              id="publisher"
              bind:value={citationPublisher}
              placeholder="Publisher Name"
            />
          </div>
          <div class="input-group">
            <label for="url">URL (optional):</label>
            <input type="url" id="url" bind:value={citationUrl} placeholder="https://..." />
          </div>
          <div class="input-group">
            <label for="accessDate">Access Date (optional):</label>
            <input
              type="text"
              id="accessDate"
              bind:value={citationAccessDate}
              placeholder="1 January 2024"
            />
          </div>
        </div>
        <button on:click={handleCitation} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Citation'}
        </button>
        {#if citationOutput}
          <div class="result">
            <h3>Citation:</h3>
            <div class="output">{@html citationOutput}</div>
            <button on:click={() => copyToClipboard(citationOutput.replace(/<[^>]*>/g, ''))}>
              Copy Citation
            </button>
          </div>
        {/if}
      </div>
    {:else if activeTab === 'essay'}
      <div class="tool-section">
        <h2>Essay Typer</h2>
        <p>Generate essay content on any topic automatically.</p>
        <div class="essay-form">
          <div class="input-group">
            <label for="topic">Essay Topic:</label>
            <input
              type="text"
              id="topic"
              bind:value={essayTopic}
              placeholder="Enter your essay topic..."
            />
          </div>
          <div class="input-group">
            <label for="wordCount">Target Word Count:</label>
            <input
              type="number"
              id="wordCount"
              bind:value={essayWordCount}
              min="100"
              max="2000"
              placeholder="500"
            />
          </div>
        </div>
        <button on:click={handleEssay} disabled={loading}>
          {loading ? 'Generating...' : 'Generate Essay'}
        </button>
        {#if essayOutput}
          <div class="result">
            <h3>Generated Essay:</h3>
            <div class="output essay-output">{essayOutput}</div>
            <button on:click={() => copyToClipboard(essayOutput)}>Copy Essay</button>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .tools-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--spacing-xl);
  }

  h1 {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-sm);
    color: var(--color-primary);
  }

  .subtitle {
    font-size: 1.1rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xl);
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
    border-bottom: 2px solid var(--color-border);
    padding-bottom: var(--spacing-md);
  }

  .tabs button {
    padding: var(--spacing-sm) var(--spacing-md);
    background: transparent;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    font-size: 1rem;
    transition: all var(--transition-base);
    border-radius: var(--radius-sm);
  }

  .tabs button:hover {
    background: var(--color-surface-hover);
    color: var(--color-text);
  }

  .tabs button.active {
    background: var(--color-primary);
    color: white;
  }

  .error {
    background: var(--color-error);
    color: white;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-md);
  }

  .success {
    background: var(--color-success);
    color: white;
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
  }

  .tool-section {
    background: var(--color-surface);
    padding: var(--spacing-xl);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }

  .tool-section h2 {
    margin-bottom: var(--spacing-sm);
    color: var(--color-primary);
  }

  .tool-section p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }

  textarea,
  input[type='text'],
  input[type='number'],
  input[type='url'],
  select {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-family: inherit;
    background: var(--color-background);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
  }

  textarea {
    resize: vertical;
    min-height: 150px;
  }

  button {
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    cursor: pointer;
    transition: all var(--transition-base);
  }

  button:hover:not(:disabled) {
    background: var(--color-primary-dark);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .result {
    margin-top: var(--spacing-xl);
    padding: var(--spacing-lg);
    background: var(--color-background);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
  }

  .result h3 {
    margin-bottom: var(--spacing-md);
    color: var(--color-primary);
  }

  .output {
    padding: var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    white-space: pre-wrap;
    word-wrap: break-word;
    margin-bottom: var(--spacing-md);
  }

  .essay-output {
    line-height: 1.8;
  }

  .correction {
    padding: var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-md);
    border-left: 3px solid var(--color-warning);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
    margin-top: var(--spacing-lg);
  }

  .stat {
    padding: var(--spacing-md);
    background: var(--color-surface);
    border-radius: var(--radius-md);
    text-align: center;
  }

  .stat-label {
    display: block;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
  }

  .stat-value {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-primary);
  }

  .factor-inputs,
  .citation-form,
  .essay-form {
    display: grid;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .input-group {
    display: flex;
    flex-direction: column;
  }

  .input-group label {
    margin-bottom: var(--spacing-xs);
    font-weight: 500;
    color: var(--color-text);
  }

  .step {
    padding: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
    background: var(--color-surface);
    border-radius: var(--radius-sm);
  }

  @media (max-width: 768px) {
    .tabs {
      flex-direction: column;
    }

    .tabs button {
      width: 100%;
    }

    h1 {
      font-size: 2rem;
    }
  }
</style>