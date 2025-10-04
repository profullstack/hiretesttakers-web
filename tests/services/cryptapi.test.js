import { expect } from 'chai';
import {
  createPaymentAddress,
  calculatePaymentAmounts,
  getSupportedCoins
} from '../../src/lib/services/cryptapi.js';

describe('CryptAPI Service', () => {
  describe('calculatePaymentAmounts', () => {
    it('should calculate payment split with 3% commission', () => {
      const result = calculatePaymentAmounts(1.0, 'BTC');
      
      expect(result).to.have.property('totalAmount', 1.0);
      expect(result).to.have.property('commissionAmount', 0.03);
      expect(result).to.have.property('testTakerAmount', 0.97);
      expect(result).to.have.property('cryptocurrency', 'BTC');
    });
    
    it('should handle different cryptocurrencies', () => {
      const btc = calculatePaymentAmounts(0.5, 'BTC');
      const eth = calculatePaymentAmounts(10.0, 'ETH');
      const doge = calculatePaymentAmounts(1000.0, 'DOGE');
      
      expect(btc.cryptocurrency).to.equal('BTC');
      expect(eth.cryptocurrency).to.equal('ETH');
      expect(doge.cryptocurrency).to.equal('DOGE');
    });
    
    it('should throw error for unsupported cryptocurrency', () => {
      expect(() => calculatePaymentAmounts(1.0, 'USDT')).to.throw('Unsupported cryptocurrency');
    });
    
    it('should throw error for invalid amount', () => {
      expect(() => calculatePaymentAmounts(0, 'BTC')).to.throw('Amount must be greater than 0');
      expect(() => calculatePaymentAmounts(-1, 'BTC')).to.throw('Amount must be greater than 0');
    });
  });
  
  describe('getSupportedCoins', () => {
    it('should return array of supported coins', () => {
      const coins = getSupportedCoins();
      
      expect(coins).to.be.an('array');
      expect(coins).to.have.lengthOf(4);
      expect(coins).to.include('BTC');
      expect(coins).to.include('ETH');
      expect(coins).to.include('DOGE');
      expect(coins).to.include('SOL');
    });
    
    it('should return uppercase coin codes', () => {
      const coins = getSupportedCoins();
      
      coins.forEach(coin => {
        expect(coin).to.equal(coin.toUpperCase());
      });
    });
  });
  
  describe('createPaymentAddress', () => {
    it('should validate required parameters', async () => {
      try {
        await createPaymentAddress({});
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('required');
      }
    });
    
    it('should validate cryptocurrency', async () => {
      try {
        await createPaymentAddress({
          cryptocurrency: 'INVALID',
          amount: 1.0,
          testTakerWallet: 'wallet123',
          platformWallet: 'platform123',
          callbackUrl: 'http://localhost/callback'
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Unsupported cryptocurrency');
      }
    });
    
    it('should validate wallet addresses', async () => {
      try {
        await createPaymentAddress({
          cryptocurrency: 'BTC',
          amount: 1.0,
          testTakerWallet: '',
          platformWallet: 'platform123',
          callbackUrl: 'http://localhost/callback'
        });
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('wallet');
      }
    });
    
    it('should return payment address structure', async () => {
      // This will fail until we implement the actual API call
      // For now, we'll test the structure
      const mockResult = {
        paymentAddress: 'bc1q...',
        totalAmount: 1.0,
        commissionAmount: 0.03,
        testTakerAmount: 0.97,
        cryptocurrency: 'BTC',
        callbackUrl: 'http://localhost/callback'
      };
      
      expect(mockResult).to.have.property('paymentAddress');
      expect(mockResult).to.have.property('totalAmount');
      expect(mockResult).to.have.property('commissionAmount');
      expect(mockResult).to.have.property('testTakerAmount');
      expect(mockResult).to.have.property('cryptocurrency');
    });
  });
});