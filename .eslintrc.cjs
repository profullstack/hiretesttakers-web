module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:svelte/recommended',
    'prettier'
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2024,
    extraFileExtensions: ['.svelte']
  },
  env: {
    browser: true,
    es2024: true,
    node: true
  },
  rules: {
    // Enforce consistent code style
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'prefer-const': 'error',
    'no-var': 'error',
    
    // Modern JavaScript features
    'prefer-arrow-callback': 'error',
    'prefer-template': 'error',
    'object-shorthand': 'error',
    
    // Error prevention
    'no-throw-literal': 'error',
    'no-return-await': 'error',
    'require-await': 'warn',
    
    // Best practices
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
    'no-eval': 'error',
    'no-implied-eval': 'error'
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser'
    },
    {
      files: ['tests/**/*.js'],
      env: {
        mocha: true
      },
      rules: {
        'no-unused-expressions': 'off' // Allow chai assertions
      }
    }
  ]
};