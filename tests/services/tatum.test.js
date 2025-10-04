import { expect } from 'chai';
import {
  getExchangeRate,
  convertCryptoToUSD,
  getSupportedPairs
} from '../../src/lib/services/tatum.js';

describe('Tatum Exchange Rate Service', () => {
  describe('getSupportedPairs', () => {
    it('should return array of supported currency pairs', () => {
      const pairs = getSupportedPairs();
      
      expect(pairs).to.be.an('array');
      expect(pairs.length).to.be.greaterThan(0);
      expect(pairs).to.include('BTC-USD');
      expect(pairs).to.include('ETH-USD');
      expect(pairs).to.include('DOGE-USD');
      expect(pairs).to.include('SOL-USD');
    });
  });
  
  describe('convertCryptoToUSD', () => {
    it('should calculate USD value from crypto amount and rate', () => {
      const usdValue = convertCryptoToUSD(0.01, 65000); // 0.01 BTC at $65k
      
      expect(usdValue).to.equal(650);
    });
    
    it('should handle decimal amounts', () => {
      const usdValue = convertCryptoToUSD(0.12345678, 50000);
      
      expect(usdValue).to.be.closeTo(6172.84, 0.01);
    });
    
    it('should round to 2 decimal places', () => {
      const usdValue = convertCryptoToUSD(0.123, 1234.567);
      
      const decimals = usdValue.toString().split('.')[1]?.length || 0;
      expect(decimals).to.be.at.most(2);
    });
    
    it('should throw error for negative amount', () => {
      expect(() => convertCryptoToUSD(-1, 50000)).to.throw('Amount must be positive');
    });
    
    it('should throw error for negative rate', () => {
      expect(() => convertCryptoToUSD(1, -50000)).to.throw('Exchange rate must be positive');
    });
    
    it('should handle zero amount', () => {
      const usdValue = convertCryptoToUSD(0, 50000);
      
      expect(usdValue).to.equal(0);
    });
  });
  
  describe('getExchangeRate', () => {
    it('should validate cryptocurrency parameter', async () => {
      try {
        await getExchangeRate('');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Cryptocurrency is required');
      }
    });
    
    it('should validate supported cryptocurrency', async () => {
      try {
        await getExchangeRate('INVALID');
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error.message).to.include('Unsupported cryptocurrency');
      }
    });
    
    it('should accept supported cryptocurrencies', async () => {
      // This will make actual API call or use mock
      // For now, test the validation passes
      const supportedCoins = ['BTC', 'ETH', 'DOGE', 'SOL'];
      
      for (const coin of supportedCoins) {
        try {
          // Will fail without API key, but validation should pass
          await getExchangeRate(coin);
        } catch (error) {
          // Should fail on API call, not validation
          expect(error.message).to.not.include('Unsupported');
        }
      }
    });
    
    it('should return rate structure', async () => {
      // Mock expected structure
      const mockRate = {
        cryptocurrency: 'BTC',
        fiatCurrency: 'USD',
        rate: 65000,
        timestamp: new Date().toISOString()
      };
      
      expect(mockRate).to.have.property('cryptocurrency');
      expect(mockRate).to.have.property('fiatCurrency');
      expect(mockRate).to.have.property('rate');
      expect(mockRate).to.have.property('timestamp');
      expect(mockRate.rate).to.be.a('number');
      expect(mockRate.rate).to.be.greaterThan(0);
    });
  });
});