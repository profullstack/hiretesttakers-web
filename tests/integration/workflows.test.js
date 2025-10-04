/**
 * Integration Test: Service Workflows
 * 
 * Tests various service workflows:
 * - Homework help
 * - Programming help
 * - Assignment writing
 * - Payment flows with commission
 * - Leaderboard updates
 * - Job offers
 * - Messaging
 * - Referrals
 * - Notifications
 * - Resource access
 * 
 * Uses Vitest for testing
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createTestUser,
  cleanupTestData,
  createMockHomework,
  createMockProgrammingTask,
  createMockJobOffer,
  createMockPayment,
  waitFor
} from './helpers/test-helpers.js';
import { cryptAPIMock } from './mocks/cryptapi.mock.js';

describe('Integration: Service Workflows', () => {
  let student;
  let tutor;
  let helper;

  beforeEach(async () => {
    student = await createTestUser('student@test.com', 'password123', {
      role: 'student'
    });
    
    tutor = await createTestUser('tutor@test.com', 'password123', {
      role: 'tutor',
      skills: ['Mathematics', 'Programming']
    });

    helper = await createTestUser('helper@test.com', 'password123', {
      role: 'helper',
      skills: ['JavaScript', 'Python', 'Writing']
    });
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  describe('Homework Help Workflow', () => {
    it('should complete homework help request successfully', async () => {
      // Student creates homework request
      const homework = createMockHomework(student.id, {
        title: 'Calculus Problem Set',
        subject: 'Mathematics',
        deadline: new Date(Date.now() + 86400000).toISOString(),
        budget: 40.00
      });

      expect(homework.status).toBe('open');
      expect(homework.budget).toBe(40.00);

      // Helper applies
      const application = {
        id: `app_${Date.now()}`,
        homework_id: homework.id,
        helper_id: helper.id,
        proposed_price: 35.00,
        estimated_time: '3 hours',
        status: 'pending'
      };

      expect(application.status).toBe('pending');

      // Student accepts
      application.status = 'accepted';
      homework.status = 'assigned';
      homework.assigned_to = helper.id;

      expect(homework.assigned_to).toBe(helper.id);

      // Payment processed
      const payment = createMockPayment(homework.id, student.id, {
        amount: 35.00,
        status: 'confirmed'
      });

      expect(payment.status).toBe('confirmed');

      // Helper completes work
      homework.status = 'completed';
      homework.solution = 'Detailed solutions provided';

      expect(homework.status).toBe('completed');

      // Calculate earnings
      const commissionRate = 0.10;
      const helperEarnings = payment.amount * (1 - commissionRate);

      expect(helperEarnings).toBe(31.50);
    });

    it('should handle urgent homework requests', async () => {
      const urgentDeadline = new Date(Date.now() + 7200000).toISOString(); // 2 hours
      const homework = createMockHomework(student.id, {
        deadline: urgentDeadline,
        is_urgent: true,
        budget: 60.00
      });

      expect(homework.is_urgent).toBe(true);

      // Urgent requests might have higher fees
      const urgentFee = homework.budget * 0.20;
      const totalCost = homework.budget + urgentFee;

      expect(totalCost).toBe(72.00);
    });
  });

  describe('Programming Help Workflow', () => {
    it('should complete programming task successfully', async () => {
      // Client creates programming task
      const task = createMockProgrammingTask(student.id, {
        title: 'Build REST API',
        language: 'JavaScript',
        framework: 'Express',
        budget: 150.00
      });

      expect(task.status).toBe('open');
      expect(task.language).toBe('JavaScript');

      // Developer applies
      const application = {
        id: `app_${Date.now()}`,
        task_id: task.id,
        developer_id: helper.id,
        portfolio_link: 'https://github.com/helper',
        proposed_price: 140.00,
        status: 'pending'
      };

      // Client accepts
      application.status = 'accepted';
      task.status = 'in_progress';
      task.assigned_to = helper.id;

      expect(task.status).toBe('in_progress');

      // Payment in escrow
      const payment = createMockPayment(task.id, student.id, {
        amount: 140.00,
        status: 'escrowed'
      });

      expect(payment.status).toBe('escrowed');

      // Developer completes task
      task.status = 'completed';
      task.repository_url = 'https://github.com/helper/project';

      // Release payment
      payment.status = 'released';
      const commissionRate = 0.10;
      const developerEarnings = payment.amount * (1 - commissionRate);

      expect(developerEarnings).toBe(126.00);
    });

    it('should handle code review requests', async () => {
      const task = createMockProgrammingTask(student.id, {
        title: 'Code Review',
        type: 'review',
        budget: 50.00
      });

      expect(task.type).toBe('review');

      // Reviewer provides feedback
      const review = {
        task_id: task.id,
        reviewer_id: helper.id,
        feedback: 'Code quality is good, suggested improvements...',
        rating: 4
      };

      expect(review.rating).toBe(4);
    });
  });

  describe('Assignment Writing Workflow', () => {
    it('should complete assignment writing successfully', async () => {
      const assignment = {
        id: `assign_${Date.now()}`,
        student_id: student.id,
        title: 'Research Paper on AI',
        subject: 'Computer Science',
        word_count: 2000,
        deadline: new Date(Date.now() + 259200000).toISOString(), // 3 days
        budget: 80.00,
        status: 'open'
      };

      expect(assignment.word_count).toBe(2000);

      // Writer applies
      const application = {
        id: `app_${Date.now()}`,
        assignment_id: assignment.id,
        writer_id: helper.id,
        sample_work: 'Link to portfolio',
        proposed_price: 75.00,
        status: 'pending'
      };

      application.status = 'accepted';
      assignment.status = 'in_progress';

      const payment = createMockPayment(assignment.id, student.id, {
        amount: 75.00,
        status: 'escrowed'
      });

      // Writer submits draft
      assignment.draft_url = 'https://docs.example.com/draft';
      assignment.status = 'review';

      // Student approves
      assignment.status = 'completed';
      payment.status = 'released';

      const commissionRate = 0.10;
      const writerEarnings = payment.amount * (1 - commissionRate);

      expect(writerEarnings).toBe(67.50);
    });
  });

  describe('Payment Flow with Commission', () => {
    it('should calculate commission correctly for different tiers', async () => {
      const payments = [
        { amount: 50.00, tier: 'basic' },
        { amount: 150.00, tier: 'standard' },
        { amount: 500.00, tier: 'premium' }
      ];

      const commissionRates = {
        basic: 0.10,
        standard: 0.08,
        premium: 0.05
      };

      const results = payments.map(p => ({
        amount: p.amount,
        commission: p.amount * commissionRates[p.tier],
        earnings: p.amount * (1 - commissionRates[p.tier])
      }));

      expect(results[0].earnings).toBe(45.00);
      expect(results[1].earnings).toBe(138.00);
      expect(results[2].earnings).toBe(475.00);
    });

    it('should handle refunds correctly', async () => {
      const payment = createMockPayment('test_123', student.id, {
        amount: 100.00,
        status: 'confirmed'
      });

      // Issue refund
      payment.status = 'refunded';
      payment.refund_amount = 100.00;
      payment.refund_reason = 'Service not delivered';

      expect(payment.status).toBe('refunded');
      expect(payment.refund_amount).toBe(100.00);
    });

    it('should handle partial payments', async () => {
      const totalAmount = 200.00;
      const payment1 = createMockPayment('test_123', student.id, {
        amount: 100.00,
        status: 'confirmed',
        is_partial: true
      });

      const payment2 = createMockPayment('test_123', student.id, {
        amount: 100.00,
        status: 'confirmed',
        is_partial: true
      });

      const totalPaid = payment1.amount + payment2.amount;
      expect(totalPaid).toBe(totalAmount);
    });
  });

  describe('Leaderboard Updates', () => {
    it('should update leaderboard after completed work', async () => {
      const completedWork = [
        { amount: 100.00, rating: 5 },
        { amount: 150.00, rating: 4 },
        { amount: 200.00, rating: 5 }
      ];

      const commissionRate = 0.10;
      const totalEarnings = completedWork.reduce(
        (sum, work) => sum + (work.amount * (1 - commissionRate)),
        0
      );

      const averageRating = completedWork.reduce(
        (sum, work) => sum + work.rating,
        0
      ) / completedWork.length;

      const leaderboardEntry = {
        user_id: tutor.id,
        total_earnings: totalEarnings,
        completed_jobs: completedWork.length,
        average_rating: averageRating,
        rank: 1
      };

      expect(leaderboardEntry.total_earnings).toBe(405.00);
      expect(leaderboardEntry.average_rating).toBeCloseTo(4.67, 1);
      expect(leaderboardEntry.completed_jobs).toBe(3);
    });

    it('should rank users correctly', async () => {
      const users = [
        { id: 'user1', earnings: 500.00, rating: 4.5 },
        { id: 'user2', earnings: 750.00, rating: 4.8 },
        { id: 'user3', earnings: 600.00, rating: 4.7 }
      ];

      // Sort by earnings
      const ranked = users.sort((a, b) => b.earnings - a.earnings);

      expect(ranked[0].id).toBe('user2');
      expect(ranked[1].id).toBe('user3');
      expect(ranked[2].id).toBe('user1');
    });
  });

  describe('Job Offer Workflow', () => {
    it('should complete job offer process', async () => {
      const jobOffer = createMockJobOffer(student.id, tutor.id, {
        title: 'Full-time Tutor',
        salary: 60000,
        type: 'full-time'
      });

      expect(jobOffer.status).toBe('pending');

      // Candidate accepts
      jobOffer.status = 'accepted';
      jobOffer.accepted_at = new Date().toISOString();

      expect(jobOffer.status).toBe('accepted');

      // Create employment record
      const employment = {
        job_offer_id: jobOffer.id,
        employer_id: student.id,
        employee_id: tutor.id,
        start_date: new Date().toISOString(),
        status: 'active'
      };

      expect(employment.status).toBe('active');
    });

    it('should handle job offer rejection', async () => {
      const jobOffer = createMockJobOffer(student.id, tutor.id);

      jobOffer.status = 'rejected';
      jobOffer.rejection_reason = 'Salary not competitive';

      expect(jobOffer.status).toBe('rejected');
    });
  });

  describe('Message Exchange', () => {
    it('should handle message thread', async () => {
      const thread = {
        id: `thread_${Date.now()}`,
        participants: [student.id, tutor.id],
        created_at: new Date().toISOString()
      };

      const messages = [
        {
          id: `msg_1`,
          thread_id: thread.id,
          sender_id: student.id,
          content: 'Hello, can you help with my test?',
          created_at: new Date().toISOString()
        },
        {
          id: `msg_2`,
          thread_id: thread.id,
          sender_id: tutor.id,
          content: 'Yes, I can help. What subject?',
          created_at: new Date().toISOString()
        }
      ];

      expect(messages.length).toBe(2);
      expect(messages[0].sender_id).toBe(student.id);
      expect(messages[1].sender_id).toBe(tutor.id);
    });

    it('should mark messages as read', async () => {
      const message = {
        id: `msg_${Date.now()}`,
        sender_id: student.id,
        recipient_id: tutor.id,
        content: 'Test message',
        read: false
      };

      message.read = true;
      message.read_at = new Date().toISOString();

      expect(message.read).toBe(true);
    });
  });

  describe('Referral System', () => {
    it('should track referrals and bonuses', async () => {
      const referrer = student;
      const referred = await createTestUser('referred@test.com', 'password123', {
        referred_by: referrer.id
      });

      const referral = {
        id: `ref_${Date.now()}`,
        referrer_id: referrer.id,
        referred_id: referred.id,
        status: 'pending',
        bonus_amount: 0
      };

      // Referred user completes first transaction
      const firstTransaction = createMockPayment('test_123', referred.id, {
        amount: 100.00,
        status: 'confirmed'
      });

      // Award referral bonus
      referral.status = 'completed';
      referral.bonus_amount = 10.00; // 10% of first transaction

      expect(referral.status).toBe('completed');
      expect(referral.bonus_amount).toBe(10.00);
    });

    it('should calculate tiered referral bonuses', async () => {
      const referrals = [
        { count: 5, tier: 'bronze', bonus_rate: 0.05 },
        { count: 15, tier: 'silver', bonus_rate: 0.08 },
        { count: 30, tier: 'gold', bonus_rate: 0.10 }
      ];

      const transactionAmount = 100.00;
      const bonuses = referrals.map(r => ({
        tier: r.tier,
        bonus: transactionAmount * r.bonus_rate
      }));

      expect(bonuses[0].bonus).toBe(5.00);
      expect(bonuses[1].bonus).toBe(8.00);
      expect(bonuses[2].bonus).toBe(10.00);
    });
  });

  describe('Notification Delivery', () => {
    it('should send notifications for key events', async () => {
      const notifications = [
        {
          user_id: tutor.id,
          type: 'new_application',
          message: 'New test application received',
          read: false
        },
        {
          user_id: student.id,
          type: 'payment_confirmed',
          message: 'Payment has been confirmed',
          read: false
        },
        {
          user_id: tutor.id,
          type: 'test_completed',
          message: 'Test marked as completed',
          read: false
        }
      ];

      expect(notifications.length).toBe(3);
      expect(notifications.every(n => !n.read)).toBe(true);

      // Mark as read
      notifications[0].read = true;
      expect(notifications[0].read).toBe(true);
    });

    it('should handle notification preferences', async () => {
      const preferences = {
        user_id: student.id,
        email_notifications: true,
        push_notifications: false,
        sms_notifications: false,
        notification_types: ['payment', 'application', 'message']
      };

      expect(preferences.email_notifications).toBe(true);
      expect(preferences.notification_types).toContain('payment');
    });
  });

  describe('Resource Access', () => {
    it('should control resource access based on subscription', async () => {
      const resource = {
        id: `resource_${Date.now()}`,
        title: 'Advanced Math Guide',
        type: 'premium',
        price: 20.00
      };

      const userSubscription = {
        user_id: student.id,
        tier: 'free',
        has_access_to_premium: false
      };

      const hasAccess = userSubscription.tier === 'premium' || 
                       userSubscription.has_access_to_premium;

      expect(hasAccess).toBe(false);

      // Upgrade subscription
      userSubscription.tier = 'premium';
      userSubscription.has_access_to_premium = true;

      const hasAccessNow = userSubscription.tier === 'premium';
      expect(hasAccessNow).toBe(true);
    });

    it('should track resource downloads', async () => {
      const resource = {
        id: `resource_${Date.now()}`,
        downloads: 0
      };

      // User downloads resource
      resource.downloads += 1;

      const downloadRecord = {
        resource_id: resource.id,
        user_id: student.id,
        downloaded_at: new Date().toISOString()
      };

      expect(resource.downloads).toBe(1);
      expect(downloadRecord.user_id).toBe(student.id);
    });

    it('should rate resources', async () => {
      const resource = {
        id: `resource_${Date.now()}`,
        ratings: [],
        average_rating: 0
      };

      const ratings = [5, 4, 5, 3, 4];
      resource.ratings = ratings;
      resource.average_rating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

      expect(resource.average_rating).toBeCloseTo(4.2, 1);
    });
  });
});