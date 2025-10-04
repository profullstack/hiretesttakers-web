/**
 * Integration Test Helpers
 * Utilities for setting up and tearing down integration tests
 */

import { cryptAPIMock } from '../mocks/cryptapi.mock.js';
import { tatumMock } from '../mocks/tatum.mock.js';

/**
 * Create a test user with authentication
 */
export async function createTestUser(email, password, metadata = {}) {
  // This would normally call the auth service
  // For integration tests, we'll use a simplified version
  const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: userId,
    email,
    user_metadata: metadata,
    created_at: new Date().toISOString()
  };
}

/**
 * Create a test session
 */
export function createTestSession(userId) {
  return {
    access_token: `mock_token_${userId}`,
    refresh_token: `mock_refresh_${userId}`,
    expires_at: Date.now() + 3600000, // 1 hour
    user: {
      id: userId
    }
  };
}

/**
 * Clean up test data
 */
export async function cleanupTestData() {
  // Reset all mocks
  cryptAPIMock.reset();
  tatumMock.reset();
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(condition, timeout = 5000, interval = 100) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error('Timeout waiting for condition');
}

/**
 * Create mock test data
 */
export function createMockTest(userId, overrides = {}) {
  return {
    id: `test_${Date.now()}`,
    title: 'Sample Test',
    description: 'A test for integration testing',
    subject: 'Mathematics',
    difficulty: 'medium',
    price: 50.00,
    currency: 'USD',
    deadline: new Date(Date.now() + 86400000).toISOString(), // 24 hours
    creator_id: userId,
    status: 'open',
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Create mock application data
 */
export function createMockApplication(testId, applicantId, overrides = {}) {
  return {
    id: `app_${Date.now()}`,
    test_id: testId,
    applicant_id: applicantId,
    status: 'pending',
    cover_letter: 'I am interested in taking this test',
    proposed_price: 45.00,
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Create mock payment data
 */
export function createMockPayment(testId, payerId, overrides = {}) {
  return {
    id: `payment_${Date.now()}`,
    test_id: testId,
    payer_id: payerId,
    amount: 50.00,
    currency: 'USD',
    cryptocurrency: 'BTC',
    status: 'pending',
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Create mock homework assignment
 */
export function createMockHomework(studentId, overrides = {}) {
  return {
    id: `hw_${Date.now()}`,
    student_id: studentId,
    title: 'Math Homework',
    description: 'Solve calculus problems',
    subject: 'Mathematics',
    deadline: new Date(Date.now() + 86400000).toISOString(),
    budget: 30.00,
    status: 'open',
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Create mock programming task
 */
export function createMockProgrammingTask(clientId, overrides = {}) {
  return {
    id: `prog_${Date.now()}`,
    client_id: clientId,
    title: 'Build REST API',
    description: 'Create a Node.js REST API',
    language: 'JavaScript',
    framework: 'Express',
    budget: 100.00,
    deadline: new Date(Date.now() + 172800000).toISOString(), // 48 hours
    status: 'open',
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Create mock job offer
 */
export function createMockJobOffer(employerId, candidateId, overrides = {}) {
  return {
    id: `job_${Date.now()}`,
    employer_id: employerId,
    candidate_id: candidateId,
    title: 'Software Developer',
    description: 'Full-time position',
    salary: 80000,
    currency: 'USD',
    status: 'pending',
    created_at: new Date().toISOString(),
    ...overrides
  };
}

/**
 * Simulate time passage
 */
export async function advanceTime(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}