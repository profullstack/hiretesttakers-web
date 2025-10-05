/**
 * Count words, characters, paragraphs, and sentences in text
 * @param {string} text - Text to analyze
 * @returns {object} Word count statistics
 */
export function countWords(text) {
  if (!text || typeof text !== 'string') {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      paragraphs: 0,
      sentences: 0
    };
  }

  const trimmedText = text.trim();

  // Count words (split by whitespace and filter empty strings)
  const words = trimmedText
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  // Count characters
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Count paragraphs (split by double newlines or more)
  const paragraphs = trimmedText
    .split(/\n\s*\n/)
    .filter((para) => para.trim().length > 0).length;

  // Count sentences (split by . ! ? followed by space or end of string)
  const sentences = trimmedText
    .split(/[.!?]+(?:\s|$)/)
    .filter((sentence) => sentence.trim().length > 0).length;

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    sentences
  };
}

/**
 * Factor a quadratic expression ax² + bx + c
 * @param {number} a - Coefficient of x²
 * @param {number} b - Coefficient of x
 * @param {number} c - Constant term
 * @returns {object} Factoring result with steps
 */
export function factorQuadratic(a, b, c) {
  const result = {
    original: `${a}x² + ${b}x + ${c}`,
    factored: null,
    steps: [],
    discriminant: null,
    roots: []
  };

  // Calculate discriminant
  const discriminant = b * b - 4 * a * c;
  result.discriminant = discriminant;
  result.steps.push(`Step 1: Calculate discriminant: b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`);

  if (discriminant < 0) {
    result.steps.push('Step 2: Discriminant is negative, no real roots exist');
    result.factored = 'Cannot be factored over real numbers';
    return result;
  }

  // Calculate roots using quadratic formula
  const sqrtDiscriminant = Math.sqrt(discriminant);
  const root1 = (-b + sqrtDiscriminant) / (2 * a);
  const root2 = (-b - sqrtDiscriminant) / (2 * a);

  result.roots = [root1, root2];
  result.steps.push(`Step 2: Calculate roots using quadratic formula:`);
  result.steps.push(`x = (-b ± √discriminant) / 2a`);
  result.steps.push(`x₁ = ${root1.toFixed(2)}, x₂ = ${root2.toFixed(2)}`);

  // Format factored form
  if (discriminant === 0) {
    result.factored = `${a}(x - ${root1.toFixed(2)})²`;
    result.steps.push(`Step 3: Since discriminant = 0, we have a perfect square: ${result.factored}`);
  } else {
    result.factored = `${a}(x - ${root1.toFixed(2)})(x - ${root2.toFixed(2)})`;
    result.steps.push(`Step 3: Factored form: ${result.factored}`);
  }

  return result;
}

/**
 * Generate Harvard-style citation
 * @param {object} source - Source information
 * @returns {string} Harvard citation
 */
export function generateHarvardCitation(source) {
  const { authors, year, title, publisher, url, accessDate } = source;

  let citation = '';

  // Authors (Last name, First initial.)
  if (authors && authors.length > 0) {
    if (authors.length === 1) {
      citation += `${authors[0]} `;
    } else if (authors.length === 2) {
      citation += `${authors[0]} and ${authors[1]} `;
    } else {
      citation += `${authors[0]} et al. `;
    }
  }

  // Year
  if (year) {
    citation += `(${year}) `;
  }

  // Title (italicized)
  if (title) {
    citation += `<em>${title}</em>. `;
  }

  // Publisher
  if (publisher) {
    citation += `${publisher}. `;
  }

  // URL and access date for online sources
  if (url) {
    citation += `Available at: ${url} `;
    if (accessDate) {
      citation += `(Accessed: ${accessDate})`;
    }
  }

  return citation.trim();
}

/**
 * Generate APA-style citation
 * @param {object} source - Source information
 * @returns {string} APA citation
 */
export function generateAPACitation(source) {
  const { authors, year, title, publisher, url, accessDate } = source;

  let citation = '';

  // Authors (Last name, First initial.)
  if (authors && authors.length > 0) {
    if (authors.length === 1) {
      citation += `${authors[0]} `;
    } else if (authors.length <= 7) {
      citation += authors.slice(0, -1).join(', ') + ', & ' + authors[authors.length - 1] + ' ';
    } else {
      citation += authors.slice(0, 6).join(', ') + ', ... ' + authors[authors.length - 1] + ' ';
    }
  }

  // Year
  if (year) {
    citation += `(${year}). `;
  }

  // Title
  if (title) {
    citation += `${title}. `;
  }

  // Publisher
  if (publisher) {
    citation += `${publisher}. `;
  }

  // URL for online sources
  if (url) {
    citation += `Retrieved from ${url}`;
  }

  return citation.trim();
}

/**
 * Generate MLA-style citation
 * @param {object} source - Source information
 * @returns {string} MLA citation
 */
export function generateMLACitation(source) {
  const { authors, title, publisher, year, url, accessDate } = source;

  let citation = '';

  // Authors (Last name, First name.)
  if (authors && authors.length > 0) {
    citation += `${authors[0]}. `;
  }

  // Title (italicized)
  if (title) {
    citation += `<em>${title}</em>. `;
  }

  // Publisher
  if (publisher) {
    citation += `${publisher}, `;
  }

  // Year
  if (year) {
    citation += `${year}. `;
  }

  // URL and access date for online sources
  if (url) {
    citation += `${url}. `;
    if (accessDate) {
      citation += `Accessed ${accessDate}.`;
    }
  }

  return citation.trim();
}

/**
 * Generate Chicago-style citation
 * @param {object} source - Source information
 * @returns {string} Chicago citation
 */
export function generateChicagoCitation(source) {
  const { authors, year, title, publisher, url, accessDate } = source;

  let citation = '';

  // Authors (Last name, First name.)
  if (authors && authors.length > 0) {
    citation += `${authors[0]}. `;
  }

  // Title (italicized)
  if (title) {
    citation += `<em>${title}</em>. `;
  }

  // Publisher and year
  if (publisher && year) {
    citation += `${publisher}, ${year}. `;
  } else if (year) {
    citation += `${year}. `;
  }

  // URL and access date for online sources
  if (url) {
    citation += `${url}`;
    if (accessDate) {
      citation += ` (accessed ${accessDate})`;
    }
    citation += '.';
  }

  return citation.trim();
}