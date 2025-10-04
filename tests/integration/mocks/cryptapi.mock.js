/**
 * Mock implementation for CryptAPI
 * Used in integration tests to avoid real API calls
 */

export class CryptAPIMock {
  constructor() {
    this.payments = new Map();
    this.callbacks = new Map();
  }

  /**
   * Create a mock payment address
   */
  async createPaymentAddress({ cryptocurrency, callback_url, parameters }) {
    const mockAddress = `mock_${cryptocurrency}_${Date.now()}`;
    const paymentId = `payment_${Date.now()}`;

    this.payments.set(paymentId, {
      address: mockAddress,
      cryptocurrency,
      callback_url,
      parameters,
      status: 'pending',
      amount_received: 0,
      created_at: new Date().toISOString()
    });

    this.callbacks.set(mockAddress, callback_url);

    return {
      status: 'success',
      address_in: mockAddress,
      address_out: 'mock_destination_address',
      callback_url,
      priority: 'default',
      multi_token: false
    };
  }

  /**
   * Simulate a payment confirmation
   */
  async simulatePayment(address, amount) {
    const payment = Array.from(this.payments.values()).find(
      p => p.address === address
    );

    if (!payment) {
      throw new Error('Payment address not found');
    }

    payment.amount_received = amount;
    payment.status = 'confirmed';
    payment.confirmed_at = new Date().toISOString();

    // Simulate callback
    const callback_url = this.callbacks.get(address);
    if (callback_url) {
      return {
        callback_url,
        payment_data: {
          address,
          amount,
          txid: `mock_tx_${Date.now()}`,
          confirmations: 6,
          status: 'confirmed'
        }
      };
    }

    return payment;
  }

  /**
   * Get payment info
   */
  async getPaymentInfo(address) {
    const payment = Array.from(this.payments.values()).find(
      p => p.address === address
    );

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }

  /**
   * Reset mock state
   */
  reset() {
    this.payments.clear();
    this.callbacks.clear();
  }
}

export const cryptAPIMock = new CryptAPIMock();