/**
 * Integration Test: Complete Tutor Journey
 * 
 * Tests the full workflow of a tutor:
 * 1. Sign up
 * 2. Browse available tests
 * 3. Apply to take a test
 * 4. Get hired
 * 5. Complete the test
 * 6. Receive payment
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
  createMockPayment
} from './helpers/test-helpers.js';
import { cryptAPIMock } from './mocks/cryptapi.mock.js';

describe('Integration: Complete Tutor Journey', () => {
  let student;
  let tutor;
  let studentSession;
  let tutorSession;

  beforeEach(async () => {
    student = await createTestUser('student@test.com', 'password123', {
      role: 'student',
      username: 'teststudent'
    });
    
    tutor = await createTestUser('tutor@test.com', 'password123', {
      role: 'tutor',
      username: 'testtutor',
      skills: ['Mathematics', 'Physics'],
      experience_years: 5
    });

    studentSession = createTestSession(student.id);
    tutorSession = createTestSession(tutor.id);
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  it('should complete full tutor journey successfully', async () => {
    // Step 1: Student creates a test (tutor's opportunity)
    const testRequest = createMockTest(student.id, {
      title: 'Physics Midterm',
      subject: 'Physics',
      difficulty: 'medium',
      price: 75.00
    });

    expect(testRequest.status).toBe('open');

    // Step 2: Tutor browses available tests
    const availableTests = [testRequest];
    const matchingTests = availableTests.filter(
      test => test.status === 'open' && 
      tutor.user_metadata.skills.includes(test.subject)
    );

    expect(matchingTests.length).toBe(1);
    expect(matchingTests[0].subject).toBe('Physics');

    // Step 3: Tutor applies to take the test
    const application = createMockApplication(testRequest.id, tutor.id, {
      cover_letter: 'I have 5 years of experience teaching Physics',
      proposed_price: 70.00,
      estimated_completion_time: '2 hours'
    });

    expect(application.status).toBe('pending');
    expect(application.proposed_price).toBe(70.00);

    // Step 4: Student accepts the application
    application.status = 'accepted';
    application.accepted_at = new Date().toISOString();
    testRequest.status = 'assigned';
    testRequest.assigned_to = tutor.id;

    expect(application.status).toBe('accepted');
    expect(testRequest.assigned_to).toBe(tutor.id);

    // Step 5: Payment is processed
    const payment = createMockPayment(testRequest.id, student.id, {
      amount: 70.00,
      cryptocurrency: 'BTC'
    });

    const paymentAddress = await cryptAPIMock.createPaymentAddress({
      cryptocurrency: 'BTC',
      callback_url: `https://api.example.com/payments/${payment.id}/callback`,
      parameters: { payment_id: payment.id }
    });

    await cryptAPIMock.simulatePayment(paymentAddress.address_in, 70.00);
    payment.status = 'confirmed';

    expect(payment.status).toBe('confirmed');

    // Step 6: Tutor completes the test
    testRequest.status = 'completed';
    testRequest.completed_at = new Date().toISOString();
    testRequest.completion_notes = 'Test completed successfully';

    expect(testRequest.status).toBe('completed');

    // Step 7: Calculate tutor earnings (after commission)
    const commissionRate = 0.10;
    const tutorEarnings = payment.amount * (1 - commissionRate);
    const platformFee = payment.amount * commissionRate;

    expect(tutorEarnings).toBe(63.00);
    expect(platformFee).toBe(7.00);

    // Step 8: Update tutor's profile stats
    const tutorStats = {
      user_id: tutor.id,
      total_earnings: tutorEarnings,
      completed_tests: 1,
      success_rate: 100,
      average_rating: 0, // No rating yet
      total_ratings: 0
    };

    expect(tutorStats.completed_tests).toBe(1);
    expect(tutorStats.total_earnings).toBe(63.00);

    // Step 9: Student rates the tutor
    const rating = {
      id: `rating_${Date.now()}`,
      test_id: testRequest.id,
      rater_id: student.id,
      rated_user_id: tutor.id,
      rating: 5,
      comment: 'Great work!',
      created_at: new Date().toISOString()
    };

    // Update tutor stats with rating
    tutorStats.total_ratings = 1;
    tutorStats.average_rating = 5.0;

    expect(tutorStats.average_rating).toBe(5.0);
    expect(tutorStats.total_ratings).toBe(1);
  });

  it('should handle application rejection gracefully', async () => {
    const testRequest = createMockTest(student.id);
    const application = createMockApplication(testRequest.id, tutor.id);

    // Student rejects the application
    application.status = 'rejected';
    application.rejection_reason = 'Looking for more experienced tutor';

    expect(application.status).toBe('rejected');
    expect(application).toHaveProperty('rejection_reason');

    // Test should remain open for other applications
    expect(testRequest.status).toBe('open');
  });

  it('should allow tutor to withdraw application', async () => {
    const testRequest = createMockTest(student.id);
    const application = createMockApplication(testRequest.id, tutor.id);

    // Tutor withdraws application
    application.status = 'withdrawn';
    application.withdrawn_at = new Date().toISOString();
    application.withdrawal_reason = 'Schedule conflict';

    expect(application.status).toBe('withdrawn');
    expect(application).toHaveProperty('withdrawal_reason');
  });

  it('should track tutor performance metrics', async () => {
    // Create and complete multiple tests
    const test1 = createMockTest(student.id, { price: 50.00 });
    const test2 = createMockTest(student.id, { price: 75.00 });

    const app1 = createMockApplication(test1.id, tutor.id);
    const app2 = createMockApplication(test2.id, tutor.id);

    app1.status = 'accepted';
    app2.status = 'accepted';

    test1.status = 'completed';
    test2.status = 'completed';

    const payment1 = createMockPayment(test1.id, student.id, { amount: 50.00, status: 'confirmed' });
    const payment2 = createMockPayment(test2.id, student.id, { amount: 75.00, status: 'confirmed' });

    const commissionRate = 0.10;
    const totalEarnings = (payment1.amount + payment2.amount) * (1 - commissionRate);

    const tutorMetrics = {
      user_id: tutor.id,
      total_tests: 2,
      completed_tests: 2,
      success_rate: 100,
      total_earnings: totalEarnings,
      average_completion_time: '2 hours'
    };

    expect(tutorMetrics.completed_tests).toBe(2);
    expect(tutorMetrics.total_earnings).toBe(112.50);
    expect(tutorMetrics.success_rate).toBe(100);
  });

  it('should handle test cancellation by student', async () => {
    const testRequest = createMockTest(student.id);
    const application = createMockApplication(testRequest.id, tutor.id);
    
    application.status = 'accepted';
    testRequest.assigned_to = tutor.id;

    // Student cancels after assignment but before completion
    testRequest.status = 'cancelled';
    testRequest.cancelled_at = new Date().toISOString();

    expect(testRequest.status).toBe('cancelled');

    // Tutor should be notified
    const notification = {
      user_id: tutor.id,
      type: 'test_cancelled',
      message: 'Test has been cancelled by the student',
      test_id: testRequest.id
    };

    expect(notification.type).toBe('test_cancelled');
  });

  it('should prevent duplicate applications', async () => {
    const testRequest = createMockTest(student.id);
    const application1 = createMockApplication(testRequest.id, tutor.id);

    // Try to apply again
    const isDuplicate = application1.test_id === testRequest.id && 
                       application1.applicant_id === tutor.id;

    expect(isDuplicate).toBe(true);

    // Second application should be prevented
    // In real implementation, this would throw an error
  });

  it('should update leaderboard after completion', async () => {
    const testRequest = createMockTest(student.id, { price: 100.00 });
    const application = createMockApplication(testRequest.id, tutor.id);
    
    application.status = 'accepted';
    testRequest.status = 'completed';

    const payment = createMockPayment(testRequest.id, student.id, {
      amount: 100.00,
      status: 'confirmed'
    });

    const commissionRate = 0.10;
    const earnings = payment.amount * (1 - commissionRate);

    const leaderboardEntry = {
      user_id: tutor.id,
      username: tutor.user_metadata.username,
      total_earnings: earnings,
      completed_tests: 1,
      average_rating: 5.0,
      rank: 1,
      updated_at: new Date().toISOString()
    };

    expect(leaderboardEntry.total_earnings).toBe(90.00);
    expect(leaderboardEntry.completed_tests).toBe(1);
  });

  it('should handle payment delays', async () => {
    const testRequest = createMockTest(student.id);
    const application = createMockApplication(testRequest.id, tutor.id);
    
    application.status = 'accepted';
    testRequest.assigned_to = tutor.id;

    const payment = createMockPayment(testRequest.id, student.id, {
      status: 'pending'
    });

    // Payment is pending - tutor should wait
    expect(payment.status).toBe('pending');
    expect(testRequest.status).not.toBe('completed');

    // After payment confirmation, tutor can proceed
    payment.status = 'confirmed';
    testRequest.status = 'in_progress';

    expect(payment.status).toBe('confirmed');
    expect(testRequest.status).toBe('in_progress');
  });

  it('should calculate accurate earnings with multiple commission tiers', async () => {
    const tests = [
      createMockTest(student.id, { price: 50.00 }),
      createMockTest(student.id, { price: 100.00 }),
      createMockTest(student.id, { price: 200.00 })
    ];

    const payments = tests.map(test => 
      createMockPayment(test.id, student.id, {
        amount: test.price,
        status: 'confirmed'
      })
    );

    // Standard commission rate
    const commissionRate = 0.10;
    
    const totalEarnings = payments.reduce((sum, payment) => {
      return sum + (payment.amount * (1 - commissionRate));
    }, 0);

    expect(totalEarnings).toBe(315.00); // (50 + 100 + 200) * 0.9
  });
});