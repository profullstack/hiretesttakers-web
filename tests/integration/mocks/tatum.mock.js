/**
 * Mock implementation for Tatum API
 * Used in integration tests to avoid real API calls
 */

export class TatumMock {
  constructor() {
    this.wallets = new Map();
    this.transactions = new Map();
  }

  /**
   * Generate a mock wallet
   */
  async generateWallet(blockchain) {
    const walletId = `wallet_${blockchain}_${Date.now()}`;
    const wallet = {
      id: walletId,
      blockchain,
      address: `mock_${blockchain}_address_${Date.now()}`,
      privateKey: `mock_private_key_${Date.now()}`,
      mnemonic: 'mock mnemonic phrase for testing purposes only',
      created_at: new Date().toISOString()
    };

    this.wallets.set(walletId, wallet);
    return wallet;
  }

  /**
   * Get wallet balance
   */
  async getBalance(address, blockchain) {
    return {
      address,
      blockchain,
      balance: '1.5',
      currency: blockchain === 'BTC' ? 'BTC' : 'ETH',
      decimals: 8
    };
  }

  /**
   * Send transaction
   */
  async sendTransaction({ from, to, amount, blockchain, privateKey }) {
    const txId = `tx_${blockchain}_${Date.now()}`;
    const transaction = {
      txId,
      from,
      to,
      amount,
      blockchain,
      status: 'pending',
      confirmations: 0,
      created_at: new Date().toISOString()
    };

    this.transactions.set(txId, transaction);

    // Simulate confirmation after a delay
    setTimeout(() => {
      transaction.status = 'confirmed';
      transaction.confirmations = 6;
      transaction.confirmed_at = new Date().toISOString();
    }, 100);

    return {
      txId,
      status: 'success'
    };
  }

  /**
   * Get transaction info
   */
  async getTransaction(txId) {
    const transaction = this.transactions.get(txId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }
    return transaction;
  }

  /**
   * Estimate transaction fee
   */
  async estimateFee(blockchain) {
    const fees = {
      BTC: '0.0001',
      ETH: '0.001',
      USDT: '0.001'
    };

    return {
      blockchain,
      fee: fees[blockchain] || '0.001',
      currency: blockchain
    };
  }

  /**
   * Simulate transaction confirmation
   */
  async confirmTransaction(txId) {
    const transaction = this.transactions.get(txId);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.status = 'confirmed';
    transaction.confirmations = 6;
    transaction.confirmed_at = new Date().toISOString();

    return transaction;
  }

  /**
   * Reset mock state
   */
  reset() {
    this.wallets.clear();
    this.transactions.clear();
  }
}

export const tatumMock = new TatumMock();