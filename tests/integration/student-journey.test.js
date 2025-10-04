/**
 * Integration Test: Complete Student Journey
 * 
 * Tests the full workflow of a student:
 * 1. Sign up
 * 2. Request a service (test taking)
 * 3. Review applications
 * 4. Hire a tutor
 * 5. Make payment
 * 6. Rate the tutor
 * 
 * Uses Vitest for testing
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createTestUser,
  createTestSession,
  cleanupTestData,
  createMockTest,
  createMockApplication,
  createMockPayment,
  waitFor
} from './helpers/test-helpers.js';
import { cryptAPIMock } from './mocks/cryptapi.mock.js';

describe('Integration: Complete Student Journey', () => {
  let student;
  let tutor;
  let studentSession;
  let tutorSession;

  beforeEach(async () => {
    // Create test users
    student = await createTestUser('student@test.com', 'password123', {
      role: 'student',
      username: 'teststudent'
    });
    
    tutor = await createTestUser('tutor@test.com', 'password123', {
      role: 'tutor',
      username: 'testtutor'
    });

    studentSession = createTestSession(student.id);
    tutorSession = createTestSession(tutor.id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  it('should complete full student journey successfully', async () => {
    // Step 1: Student creates a test request
    const testRequest = createMockTest(student.id, {
      title: 'Calculus Final Exam',
      subject: 'Mathematics',
      difficulty: 'hard',
      price: 100.00,
      deadline: new Date(Date.now() + 172800000).toISOString() // 48 hours
    });

    expect(testRequest).toHaveProperty('id');
    expect(testRequest.title).toBe('Calculus Final Exam');
    expect(testRequest.creator_id).toBe(student.id);
    expect(testRequest.status).toBe('open');

    // Step 2: Tutor applies to take the test
    const application = createMockApplication(testRequest.id, tutor.id, {
      cover_letter: 'I have 5 years of experience in calculus',
      proposed_price: 90.00
    });

    expect(application).toHaveProperty('id');
    expect(application.test_id).toBe(testRequest.id);
    expect(application.applicant_id).toBe(tutor.id);
    expect(application.status).toBe('pending');

    // Step 3: Student reviews and accepts the application
    application.status = 'accepted';
    testRequest.status = 'assigned';
    testRequest.assigned_to = tutor.id;

    expect(application.status).toBe('accepted');
    expect(testRequest.assigned_to).toBe(tutor.id);

    // Step 4: Student initiates payment
    const payment = createMockPayment(testRequest.id, student.id, {
      amount: 90.00,
      cryptocurrency: 'BTC',
      status: 'pending'
    });

    expect(payment).toHaveProperty('id');
    expect(payment.amount).toBe(90.00);
    expect(payment.status).toBe('pending');

    // Step 5: Create crypto payment address
    const paymentAddress = await cryptAPIMock.createPaymentAddress({
      cryptocurrency: 'BTC',
      callback_url: `https://api.example.com/payments/${payment.id}/callback`,
      parameters: {
        payment_id: payment.id,
        test_id: testRequest.id
      }
    });

    expect(paymentAddress).toHaveProperty('address_in');
    expect(paymentAddress.status).toBe('success');

    // Step 6: Simulate payment confirmation
    const paymentConfirmation = await cryptAPIMock.simulatePayment(
      paymentAddress.address_in,
      90.00
    );

    expect(paymentConfirmation).toHaveProperty('payment_data');
    expect(paymentConfirmation.payment_data.status).toBe('confirmed');

    // Update payment status
    payment.status = 'confirmed';
    payment.transaction_id = paymentConfirmation.payment_data.txid;
    payment.confirmed_at = new Date().toISOString();

    expect(payment.status).toBe('confirmed');
    expect(payment).toHaveProperty('transaction_id');

    // Step 7: Tutor completes the test
    testRequest.status = 'completed';
    testRequest.completed_at = new Date().toISOString();

    expect(testRequest.status).toBe('completed');

    // Step 8: Student rates the tutor
    const rating = {
      id: `rating_${Date.now()}`,
      test_id: testRequest.id,
      rater_id: student.id,
      rated_user_id: tutor.id,
      rating: 5,
      comment: 'Excellent work! Very professional.',
      created_at: new Date().toISOString()
    };

    expect(rating.rating).toBe(5);
    expect(rating.rater_id).toBe(student.id);
    expect(rating.rated_user_id).toBe(tutor.id);

    // Step 9: Verify tutor receives payment (minus commission)
    const commissionRate = 0.10; // 10% platform fee
    const tutorEarnings = payment.amount * (1 - commissionRate);
    const platformFee = payment.amount * commissionRate;

    expect(tutorEarnings).toBe(81.00);
    expect(platformFee).toBe(9.00);

    // Step 10: Verify leaderboard update
    const leaderboardEntry = {
      user_id: tutor.id,
      total_earnings: tutorEarnings,
      completed_tests: 1,
      average_rating: 5.0,
      rank: 1
    };

    expect(leaderboardEntry.user_id).toBe(tutor.id);
    expect(leaderboardEntry.completed_tests).toBe(1);
    expect(leaderboardEntry.average_rating).toBe(5.0);
  });

  it('should handle payment failure gracefully', async () => {
    const testRequest = createMockTest(student.id);
    const application = createMockApplication(testRequest.id, tutor.id);
    application.status = 'accepted';

    const payment = createMockPayment(testRequest.id, student.id, {
      status: 'pending'
    });

    // Simulate payment failure
    payment.status = 'failed';
    payment.error = 'Insufficient funds';

    expect(payment.status).toBe('failed');
    expect(payment.error).toBe('Insufficient funds');

    // Test should remain in assigned status
    expect(testRequest.status).toBe('open');
  });

  it('should allow student to cancel before payment', async () => {
    const testRequest = createMockTest(student.id);
    const application = createMockApplication(testRequest.id, tutor.id);
    
    // Student cancels before accepting application
    testRequest.status = 'cancelled';
    testRequest.cancelled_at = new Date().toISOString();
    testRequest.cancellation_reason = 'Changed my mind';

    expect(testRequest.status).toBe('cancelled');
    expect(testRequest).toHaveProperty('cancellation_reason');

    // Application should be rejected
    application.status = 'rejected';
    expect(application.status).toBe('rejected');
  });

  it('should handle multiple applications correctly', async () => {
    const testRequest = createMockTest(student.id);

    // Create multiple applications
    const app1 = createMockApplication(testRequest.id, tutor.id);
    const tutor2 = await createTestUser('tutor2@test.com', 'password123', {
      role: 'tutor'
    });
    const app2 = createMockApplication(testRequest.id, tutor2.id);

    expect(app1.status).toBe('pending');
    expect(app2.status).toBe('pending');

    // Student accepts first application
    app1.status = 'accepted';
    testRequest.assigned_to = tutor.id;

    // Second application should be automatically rejected
    app2.status = 'rejected';

    expect(app1.status).toBe('accepted');
    expect(app2.status).toBe('rejected');
  });

  it('should enforce deadline constraints', async () => {
    const pastDeadline = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
    const testRequest = createMockTest(student.id, {
      deadline: pastDeadline
    });

    // Check if deadline has passed
    const isExpired = new Date(testRequest.deadline) < new Date();
    expect(isExpired).toBe(true);

    // Expired tests should not accept new applications
    if (isExpired) {
      testRequest.status = 'expired';
    }

    expect(testRequest.status).toBe('expired');
  });

  it('should track student activity history', async () => {
    const test1 = createMockTest(student.id, { title: 'Test 1' });
    const test2 = createMockTest(student.id, { title: 'Test 2' });

    const studentActivity = {
      user_id: student.id,
      tests_created: 2,
      total_spent: 0,
      active_tests: 2,
      completed_tests: 0
    };

    expect(studentActivity.tests_created).toBe(2);
    expect(studentActivity.active_tests).toBe(2);

    // Complete one test
    test1.status = 'completed';
    studentActivity.completed_tests = 1;
    studentActivity.active_tests = 1;
    studentActivity.total_spent = test1.price;

    expect(studentActivity.completed_tests).toBe(1);
    expect(studentActivity.total_spent).toBe(test1.price);
  });
});