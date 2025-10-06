/**
 * Enhanced CryptAPI Service Tests
 *
 * Tests for USD exchange rate fetching and payment creation with exchange rates
 * Using Vitest framework
 */

import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import {
  getExchangeRate,
  convertToUSD,
  createPaymentWithExchangeRate
} from '../../src/lib/services/cryptapi.js';

describe('CryptAPI Enhanced Service', () => {
  let fetchMock;
  
  beforeEach(() => {
    // Mock global fetch
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('getExchangeRate()', () => {
    it('should fetch USD exchange rate for BTC', async () => {
      const mockResponse = {
        prices: {
          USD: 65000.50
        }
      };
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await getExchangeRate('BTC');
      
      expect(result).toBeTypeOf('object');
      expect(result.cryptocurrency).toBe('BTC');
      expect(result.usdPrice).toBe(65000.50);
      expect(result.source).toBe('CryptAPI');
      expect(result.lastUpdated).toBeTypeOf('string');
    });
    
    it('should fetch USD exchange rate for ETH', async () => {
      const mockResponse = {
        prices: {
          USD: 3500.75
        }
      };
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await getExchangeRate('ETH');
      
      expect(result.cryptocurrency).toBe('ETH');
      expect(result.usdPrice).toBe(3500.75);
    });
    
    it('should handle alternative price field (price_usd)', async () => {
      const mockResponse = {
        price_usd: 0.15
      };
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await getExchangeRate('DOGE');
      
      expect(result.usdPrice).toBe(0.15);
    });
    
    it('should throw error for unsupported cryptocurrency', async () => {
      await expect(getExchangeRate('INVALID')).rejects.toThrow('Unsupported cryptocurrency');
    });
    
    it('should throw error when API call fails', async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error'
      });
      
      await expect(getExchangeRate('BTC')).rejects.toThrow('CryptAPI info endpoint error');
    });
    
    it('should throw error when USD price is invalid', async () => {
      const mockResponse = {
        prices: {
          USD: 0
        }
      };
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      await expect(getExchangeRate('BTC')).rejects.toThrow('Unable to fetch valid USD exchange rate');
    });
  });
  
  describe('convertToUSD()', () => {
    it('should convert BTC amount to USD', async () => {
      const mockResponse = {
        prices: {
          USD: 65000
        }
      };
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await convertToUSD(0.01, 'BTC');
      
      expect(result).toBe(650); // 0.01 * 65000 = 650
    });
    
    it('should round USD amount to 2 decimal places', async () => {
      const mockResponse = {
        prices: {
          USD: 65000.123
        }
      };
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await convertToUSD(0.01234, 'BTC');
      
      // 0.01234 * 65000.123 = 802.10151782, rounded to 802.1
      expect(result).toBe(802.1); // Rounded to 2 decimals
    });
    
    it('should handle small amounts correctly', async () => {
      const mockResponse = {
        prices: {
          USD: 0.15
        }
      };
      
      fetchMock.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });
      
      const result = await convertToUSD(100, 'DOGE');
      
      expect(result).toBe(15); // 100 * 0.15 = 15
    });
  });
  
  describe('createPaymentWithExchangeRate()', () => {
    it('should create payment with exchange rate information', async () => {
      // Mock both calls in sequence
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            prices: { USD: 65000 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            prices: { USD: 65000 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            address_in: 'bc1qtest123',
            callback_url: 'https://api.cryptapi.io/callback'
          })
        });
      
      const params = {
        cryptocurrency: 'BTC',
        amount: 0.01,
        testTakerWallet: 'bc1qtesttaker',
        platformWallet: 'bc1qplatform',
        callbackUrl: 'https://example.com/webhook'
      };
      
      const result = await createPaymentWithExchangeRate(params);
      
      expect(result).toBeTypeOf('object');
      expect(result.paymentAddress).toBe('bc1qtest123');
      expect(result.exchangeRate).toBe(65000);
      expect(result.usdEquivalent).toBe(650);
      expect(result.exchangeRateInfo).toBeTypeOf('object');
      expect(result.exchangeRateInfo.cryptocurrency).toBe('BTC');
    });
    
    it('should include all payment details', async () => {
      // Mock all three fetch calls (getExchangeRate, convertToUSD, createPaymentAddress)
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            prices: { USD: 3500 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            prices: { USD: 3500 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            address_in: '0xtest123',
            callback_url: 'https://api.cryptapi.io/callback'
          })
        });
      
      const params = {
        cryptocurrency: 'ETH',
        amount: 1.5,
        testTakerWallet: '0xtesttaker',
        platformWallet: '0xplatform',
        callbackUrl: 'https://example.com/webhook'
      };
      
      const result = await createPaymentWithExchangeRate(params);
      
      expect(result.totalAmount).toBe(1.5);
      expect(result.testTakerAmount).toBeTypeOf('number');
      expect(result.commissionAmount).toBeTypeOf('number');
      expect(result.cryptocurrency).toBe('ETH');
      expect(result.qrCodeUrl).toBeTypeOf('string');
    });
    
    it('should handle errors gracefully', async () => {
      fetchMock.mockRejectedValue(new Error('Network error'));
      
      const params = {
        cryptocurrency: 'BTC',
        amount: 0.01,
        testTakerWallet: 'bc1qtesttaker',
        platformWallet: 'bc1qplatform',
        callbackUrl: 'https://example.com/webhook'
      };
      
      await expect(createPaymentWithExchangeRate(params)).rejects.toThrow('Failed to fetch exchange rate');
    });
  });
  
  describe('Integration: Full Payment Flow', () => {
    it('should create complete payment with all details', async () => {
      // Mock all fetch calls in sequence
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            prices: { USD: 65000 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            prices: { USD: 65000 }
          })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            address_in: 'bc1qpayment123',
            callback_url: 'https://api.cryptapi.io/callback/test'
          })
        });
      
      const params = {
        cryptocurrency: 'BTC',
        amount: 0.01,
        testTakerWallet: 'bc1qtesttaker123',
        platformWallet: 'bc1qplatform123',
        callbackUrl: 'https://hiretesttakers.com/api/webhooks/cryptapi'
      };
      
      const payment = await createPaymentWithExchangeRate(params);
      
      // Verify all required fields are present
      expect(payment.paymentAddress).toBeTypeOf('string');
      expect(payment.totalAmount).toBe(0.01);
      expect(payment.cryptocurrency).toBe('BTC');
      expect(payment.exchangeRate).toBe(65000);
      expect(payment.usdEquivalent).toBe(650);
      expect(payment.testTakerAmount).toBeCloseTo(0.0097, 4); // 97%
      expect(payment.commissionAmount).toBeCloseTo(0.0003, 4); // 3%
      expect(payment.qrCodeUrl).toContain('qrcode');
      expect(payment.exchangeRateInfo).toHaveProperty('lastUpdated');
    });
  });
});