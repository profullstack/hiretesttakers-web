/**
 * Enhanced Payment Service Tests
 * 
 * Tests for enhanced payment features including:
 * - Commission calculation by service type
 * - Payment splitting
 * - Refund system
 * - Earnings summary
 * - Payment method management
 * 
 * Using Vitest for testing
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Supabase client - must be defined before the mock
vi.mock('../../src/lib/supabaseClient.js', () => {
  const mockSupabase = {
    from: vi.fn(),
    rpc: vi.fn()
  };
  return {
    getSupabaseClient: () => mockSupabase
  };
});

// Import service functions
import {
  calculateCommissionByServiceType,
  splitPayment,
  requestRefund,
  getRefundStatus,
  getEarningsSummary,
  addPaymentMethod,
  getPaymentMethods,
  setDefaultPaymentMethod,
  deletePaymentMethod
} from '../../src/lib/services/payment-enhanced.js';

// Get the mocked supabase instance
import { getSupabaseClient } from '../../src/lib/supabaseClient.js';
const mockSupabase = getSupabaseClient();

describe('Enhanced Payment Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateCommissionByServiceType', () => {
    it('should calculate 15% commission for homework_help', () => {
      const result = calculateCommissionByServiceType(100, 'homework_help');
      
      expect(result).toEqual({
        totalAmount: 100,
        commissionRate: 0.15,
        commissionAmount: 15,
        serviceProviderAmount: 85
      });
    });

    it('should calculate 20% commission for programming_help', () => {
      const result = calculateCommissionByServiceType(100, 'programming_help');
      
      expect(result).toEqual({
        totalAmount: 100,
        commissionRate: 0.20,
        commissionAmount: 20,
        serviceProviderAmount: 80
      });
    });

    it('should calculate 15% commission for assignment_writing', () => {
      const result = calculateCommissionByServiceType(100, 'assignment_writing');
      
      expect(result).toEqual({
        totalAmount: 100,
        commissionRate: 0.15,
        commissionAmount: 15,
        serviceProviderAmount: 85
      });
    });

    it('should calculate 25% commission for test_taking', () => {
      const result = calculateCommissionByServiceType(100, 'test_taking');
      
      expect(result).toEqual({
        totalAmount: 100,
        commissionRate: 0.25,
        commissionAmount: 25,
        serviceProviderAmount: 75
      });
    });

    it('should default to 3% for unknown service type', () => {
      const result = calculateCommissionByServiceType(100, 'unknown_service');
      
      expect(result).toEqual({
        totalAmount: 100,
        commissionRate: 0.03,
        commissionAmount: 3,
        serviceProviderAmount: 97
      });
    });

    it('should handle decimal amounts correctly', () => {
      const result = calculateCommissionByServiceType(99.99, 'homework_help');
      
      expect(result.commissionAmount).toBeCloseTo(14.9985, 4);
      expect(result.serviceProviderAmount).toBeCloseTo(84.9915, 4);
    });

    it('should throw error for negative amounts', () => {
      expect(() => calculateCommissionByServiceType(-100, 'homework_help'))
        .toThrow('Amount must be positive');
    });

    it('should throw error for zero amount', () => {
      expect(() => calculateCommissionByServiceType(0, 'homework_help'))
        .toThrow('Amount must be positive');
    });
  });

  describe('splitPayment', () => {
    it('should split payment successfully', async () => {
      const mockPayment = {
        id: 'payment-123',
        amount: 100,
        service_type: 'homework_help',
        test_taker_id: 'user-123'
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockPayment, error: null })
          })
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: { ...mockPayment, commission_amount: 15, test_taker_amount: 85 },
                error: null
              })
            })
          })
        })
      });

      const result = await splitPayment('payment-123');

      expect(result).toHaveProperty('commissionAmount', 15);
      expect(result).toHaveProperty('serviceProviderAmount', 85);
    });

    it('should throw error if payment not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
          })
        })
      });

      await expect(splitPayment('invalid-id')).rejects.toThrow('Payment not found');
    });

    it('should throw error for missing payment ID', async () => {
      await expect(splitPayment()).rejects.toThrow('Payment ID is required');
    });
  });

  describe('requestRefund', () => {
    it('should create refund request successfully', async () => {
      const refundData = {
        paymentId: 'payment-123',
        requesterId: 'user-123',
        reason: 'Service not satisfactory',
        amount: 100
      };

      const mockPayment = {
        id: 'payment-123',
        amount: 100,
        cryptocurrency: 'BTC',
        usd_equivalent: 100
      };

      // Mock the payment fetch
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockPayment, error: null })
          })
        })
      });

      // Mock the refund insert
      mockSupabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'refund-123', ...refundData, status: 'pending' },
              error: null
            })
          })
        })
      });

      const result = await requestRefund(refundData);

      expect(result).toHaveProperty('id', 'refund-123');
      expect(result).toHaveProperty('status', 'pending');
    });

    it('should throw error for missing payment ID', async () => {
      await expect(requestRefund({ requesterId: 'user-123', reason: 'test' }))
        .rejects.toThrow('Payment ID is required');
    });

    it('should throw error for missing requester ID', async () => {
      await expect(requestRefund({ paymentId: 'payment-123', reason: 'test' }))
        .rejects.toThrow('Requester ID is required');
    });

    it('should throw error for missing reason', async () => {
      await expect(requestRefund({ paymentId: 'payment-123', requesterId: 'user-123' }))
        .rejects.toThrow('Reason is required');
    });

    it('should throw error if refund already exists', async () => {
      const mockPayment = {
        id: 'payment-123',
        amount: 100,
        cryptocurrency: 'BTC',
        usd_equivalent: 100
      };

      // Mock the payment fetch
      mockSupabase.from.mockReturnValueOnce({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockPayment, error: null })
          })
        })
      });

      // Mock the refund insert with duplicate error
      mockSupabase.from.mockReturnValueOnce({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: null,
              error: { code: '23505', message: 'duplicate key' }
            })
          })
        })
      });

      await expect(requestRefund({
        paymentId: 'payment-123',
        requesterId: 'user-123',
        reason: 'test'
      })).rejects.toThrow('Refund request already exists');
    });
  });

  describe('getRefundStatus', () => {
    it('should get refund status successfully', async () => {
      const mockRefund = {
        id: 'refund-123',
        payment_id: 'payment-123',
        status: 'pending',
        reason: 'Test reason'
      };

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockRefund, error: null })
          })
        })
      });

      const result = await getRefundStatus('refund-123');

      expect(result).toEqual(mockRefund);
    });

    it('should return null if refund not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } })
          })
        })
      });

      const result = await getRefundStatus('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('getEarningsSummary', () => {
    it('should get earnings summary for a period', async () => {
      const mockSummary = {
        total_earned: 1000,
        total_paid: 850,
        total_pending: 150,
        total_refunded: 50,
        services_completed: 10,
        average_service_value: 100
      };

      mockSupabase.rpc.mockResolvedValue({ data: mockSummary, error: null });

      const result = await getEarningsSummary('user-123', '2024-01-01', '2024-01-31');

      expect(result).toEqual(mockSummary);
    });

    it('should throw error for missing user ID', async () => {
      await expect(getEarningsSummary(null, '2024-01-01', '2024-01-31'))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error for missing start date', async () => {
      await expect(getEarningsSummary('user-123', null, '2024-01-31'))
        .rejects.toThrow('Start date is required');
    });

    it('should throw error for missing end date', async () => {
      await expect(getEarningsSummary('user-123', '2024-01-01', null))
        .rejects.toThrow('End date is required');
    });
  });

  describe('addPaymentMethod', () => {
    it('should add crypto wallet payment method', async () => {
      const methodData = {
        userId: 'user-123',
        methodType: 'crypto_wallet',
        cryptocurrency: 'BTC',
        walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'method-123', ...methodData },
              error: null
            })
          })
        })
      });

      const result = await addPaymentMethod(methodData);

      expect(result).toHaveProperty('id', 'method-123');
      expect(result).toHaveProperty('methodType', 'crypto_wallet');
    });

    it('should add PayPal payment method', async () => {
      const methodData = {
        userId: 'user-123',
        methodType: 'paypal',
        paypalEmail: 'user@example.com'
      };

      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: 'method-123', ...methodData },
              error: null
            })
          })
        })
      });

      const result = await addPaymentMethod(methodData);

      expect(result).toHaveProperty('methodType', 'paypal');
    });

    it('should throw error for missing user ID', async () => {
      await expect(addPaymentMethod({ methodType: 'crypto_wallet' }))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error for invalid method type', async () => {
      await expect(addPaymentMethod({
        userId: 'user-123',
        methodType: 'invalid'
      })).rejects.toThrow('Invalid payment method type');
    });
  });

  describe('getPaymentMethods', () => {
    it('should get all payment methods for user', async () => {
      const mockMethods = [
        { id: 'method-1', method_type: 'crypto_wallet', cryptocurrency: 'BTC' },
        { id: 'method-2', method_type: 'paypal', paypal_email: 'user@example.com' }
      ];

      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockMethods, error: null })
          })
        })
      });

      const result = await getPaymentMethods('user-123');

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 'method-1');
    });

    it('should return empty array if no methods found', async () => {
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null })
          })
        })
      });

      const result = await getPaymentMethods('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('setDefaultPaymentMethod', () => {
    it('should set payment method as default', async () => {
      // Mock unset all defaults
      mockSupabase.from.mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null })
        })
      });

      // Mock set new default
      mockSupabase.from.mockReturnValueOnce({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      });

      await expect(setDefaultPaymentMethod('user-123', 'method-123'))
        .resolves.not.toThrow();
    });

    it('should throw error for missing user ID', async () => {
      await expect(setDefaultPaymentMethod(null, 'method-123'))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error for missing method ID', async () => {
      await expect(setDefaultPaymentMethod('user-123', null))
        .rejects.toThrow('Payment method ID is required');
    });
  });

  describe('deletePaymentMethod', () => {
    it('should delete payment method', async () => {
      mockSupabase.from.mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ data: null, error: null })
          })
        })
      });

      await expect(deletePaymentMethod('user-123', 'method-123'))
        .resolves.not.toThrow();
    });

    it('should throw error for missing user ID', async () => {
      await expect(deletePaymentMethod(null, 'method-123'))
        .rejects.toThrow('User ID is required');
    });

    it('should throw error for missing method ID', async () => {
      await expect(deletePaymentMethod('user-123', null))
        .rejects.toThrow('Payment method ID is required');
    });
  });
});