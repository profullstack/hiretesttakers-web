import { expect } from 'chai';
import { calculateCommission, validateCryptocurrency } from '../../src/lib/utils/commission.js';

describe('Commission Utilities', () => {
  describe('calculateCommission', () => {
    it('should calculate 3% commission correctly', () => {
      const result = calculateCommission(1.0, 0.03);
      
      expect(result).to.have.property('commissionAmount');
      expect(result).to.have.property('testTakerAmount');
      expect(result).to.have.property('totalAmount');
      
      expect(result.commissionAmount).to.equal(0.03);
      expect(result.testTakerAmount).to.equal(0.97);
      expect(result.totalAmount).to.equal(1.0);
    });
    
    it('should handle decimal amounts correctly', () => {
      const result = calculateCommission(0.12345678, 0.03);
      
      expect(result.commissionAmount).to.be.closeTo(0.00370370, 0.00000001);
      expect(result.testTakerAmount).to.be.closeTo(0.11975308, 0.00000001);
    });
    
    it('should use default 3% rate if not provided', () => {
      const result = calculateCommission(1.0);
      
      expect(result.commissionAmount).to.equal(0.03);
      expect(result.testTakerAmount).to.equal(0.97);
    });
    
    it('should throw error for negative amounts', () => {
      expect(() => calculateCommission(-1.0, 0.03)).to.throw('Amount must be positive');
    });
    
    it('should throw error for invalid commission rate', () => {
      expect(() => calculateCommission(1.0, -0.01)).to.throw('Commission rate must be between 0 and 1');
      expect(() => calculateCommission(1.0, 1.5)).to.throw('Commission rate must be between 0 and 1');
    });
    
    it('should round to 8 decimal places for crypto precision', () => {
      const result = calculateCommission(0.123456789, 0.03);
      
      // Should be rounded to 8 decimals
      const commissionStr = result.commissionAmount.toString();
      const testTakerStr = result.testTakerAmount.toString();
      
      const commissionDecimals = commissionStr.split('.')[1]?.length || 0;
      const testTakerDecimals = testTakerStr.split('.')[1]?.length || 0;
      
      expect(commissionDecimals).to.be.at.most(8);
      expect(testTakerDecimals).to.be.at.most(8);
    });
  });
  
  describe('validateCryptocurrency', () => {
    it('should accept supported cryptocurrencies', () => {
      expect(validateCryptocurrency('BTC')).to.be.true;
      expect(validateCryptocurrency('ETH')).to.be.true;
      expect(validateCryptocurrency('DOGE')).to.be.true;
      expect(validateCryptocurrency('SOL')).to.be.true;
    });
    
    it('should be case-insensitive', () => {
      expect(validateCryptocurrency('btc')).to.be.true;
      expect(validateCryptocurrency('Eth')).to.be.true;
      expect(validateCryptocurrency('doge')).to.be.true;
    });
    
    it('should reject unsupported cryptocurrencies', () => {
      expect(validateCryptocurrency('USDT')).to.be.false;
      expect(validateCryptocurrency('XRP')).to.be.false;
      expect(validateCryptocurrency('INVALID')).to.be.false;
    });
    
    it('should reject null or undefined', () => {
      expect(validateCryptocurrency(null)).to.be.false;
      expect(validateCryptocurrency(undefined)).to.be.false;
      expect(validateCryptocurrency('')).to.be.false;
    });
  });
});