#!/usr/bin/env node

/**
 * Dark Mode Fix Helper Script
 * 
 * This script helps identify and suggest fixes for hardcoded colors in Svelte files
 * that should be using CSS variables for dark mode compatibility.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Color mapping from hardcoded hex to CSS variables
const colorMappings = {
  // Backgrounds
  '#ffffff': 'var(--color-surface)',
  '#fff': 'var(--color-surface)',
  '#f8f9fa': 'var(--color-bg-secondary)',
  '#f9fafb': 'var(--color-bg-secondary)',
  '#f3f4f6': 'var(--color-bg-secondary)',
  '#e5e7eb': 'var(--color-border)',
  '#d1d5db': 'var(--color-border)',
  
  // Text colors
  '#333': 'var(--color-text)',
  '#333333': 'var(--color-text)',
  '#111827': 'var(--color-text)',
  '#374151': 'var(--color-text)',
  '#666': 'var(--color-text-secondary)',
  '#6b7280': 'var(--color-text-secondary)',
  '#9ca3af': 'var(--color-text-tertiary)',
  
  // Primary colors
  '#007bff': 'var(--color-primary)',
  '#0056b3': 'var(--color-primary-hover)',
  '#3b82f6': 'var(--color-primary)',
  '#2563eb': 'var(--color-primary-hover)',
  
  // Success colors
  '#28a745': 'var(--color-success)',
  '#218838': 'var(--color-success-hover)',
  '#d4edda': 'var(--color-success-light)',
  '#155724': 'var(--color-success-dark)',
  '#10b981': 'var(--color-success)',
  '#d1fae5': 'var(--color-success-light)',
  '#065f46': 'var(--color-success-dark)',
  
  // Error colors
  '#dc3545': 'var(--color-error)',
  '#c82333': 'var(--color-error-hover)',
  '#f8d7da': 'var(--color-error-light)',
  '#721c24': 'var(--color-error-dark)',
  '#ef4444': 'var(--color-error)',
  '#fee2e2': 'var(--color-error-light)',
  '#991b1b': 'var(--color-error-dark)',
  '#dc2626': 'var(--color-error)',
  
  // Warning colors
  '#ffc107': 'var(--color-warning)',
  '#fff3cd': 'var(--color-warning-light)',
  '#856404': 'var(--color-warning-dark)',
  '#f59e0b': 'var(--color-warning)',
  '#fef3c7': 'var(--color-warning-light)',
  
  // Info colors
  '#d1ecf1': 'var(--color-info-light)',
  '#0c5460': 'var(--color-info-dark)',
  
  // Grays
  '#6c757d': 'var(--color-gray-600)',
  '#545b62': 'var(--color-gray-700)',
};

// Spacing mappings
const spacingMappings = {
  '0.25rem': 'var(--spacing-xs)',
  '0.5rem': 'var(--spacing-sm)',
  '1rem': 'var(--spacing-md)',
  '1.5rem': 'var(--spacing-lg)',
  '2rem': 'var(--spacing-xl)',
  '3rem': 'var(--spacing-2xl)',
};

// Border radius mappings
const radiusMappings = {
  '0.25rem': 'var(--radius-sm)',
  '0.375rem': 'var(--radius-md)',
  '0.5rem': 'var(--radius-lg)',
  '0.75rem': 'var(--radius-xl)',
  '9999px': 'var(--radius-full)',
};

function findSvelteFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .svelte-kit
      if (!file.startsWith('.') && file !== 'node_modules') {
        findSvelteFiles(filePath, fileList);
      }
    } else if (file.endsWith('.svelte')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function analyzeFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const issues = [];
  
  // Find hardcoded colors
  const colorRegex = /(background|color|border-color|fill|stroke):\s*(#[0-9a-fA-F]{3,6})/g;
  let match;
  
  while ((match = colorRegex.exec(content)) !== null) {
    const property = match[1];
    const color = match[2].toLowerCase();
    const suggestion = colorMappings[color];
    
    if (suggestion) {
      issues.push({
        type: 'color',
        line: content.substring(0, match.index).split('\n').length,
        original: `${property}: ${color}`,
        suggestion: `${property}: ${suggestion}`,
      });
    }
  }
  
  return issues;
}

function main() {
  console.log('🔍 Scanning for dark mode issues...\n');
  
  const srcDir = join(process.cwd(), 'src', 'routes');
  const files = findSvelteFiles(srcDir);
  
  let totalIssues = 0;
  const fileIssues = [];
  
  files.forEach(file => {
    const issues = analyzeFile(file);
    if (issues.length > 0) {
      totalIssues += issues.length;
      fileIssues.push({ file: file.replace(process.cwd(), '.'), issues });
    }
  });
  
  if (totalIssues === 0) {
    console.log('✅ No dark mode issues found!');
    return;
  }
  
  console.log(`Found ${totalIssues} potential issues in ${fileIssues.length} files:\n`);
  
  fileIssues.forEach(({ file, issues }) => {
    console.log(`📄 ${file}`);
    issues.forEach(issue => {
      console.log(`   Line ${issue.line}: ${issue.original}`);
      console.log(`   → Suggested: ${issue.suggestion}\n`);
    });
  });
  
  console.log('\n📚 See docs/DARK_MODE_GUIDELINES.md for more information');
}

main();