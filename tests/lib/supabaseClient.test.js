import { expect } from 'chai';
import { createClient, getSupabaseClient } from '../../src/lib/supabaseClient.js';

describe('Supabase Client', () => {
  describe('createClient', () => {
    it('should create a Supabase client with URL and key', () => {
      const client = createClient(
        'http://localhost:8000',
        'test-anon-key'
      );
      
      expect(client).to.exist;
      expect(client).to.have.property('auth');
      expect(client).to.have.property('from');
      expect(client).to.have.property('storage');
    });
    
    it('should throw error if URL is missing', () => {
      expect(() => createClient('', 'test-key')).to.throw('Supabase URL is required');
    });
    
    it('should throw error if anon key is missing', () => {
      expect(() => createClient('http://localhost:8000', '')).to.throw('Supabase anon key is required');
    });
  });
  
  describe('getSupabaseClient', () => {
    it('should return singleton instance', () => {
      const client1 = getSupabaseClient();
      const client2 = getSupabaseClient();
      
      expect(client1).to.equal(client2);
    });
    
    it('should have auth methods', () => {
      const client = getSupabaseClient();
      
      expect(client.auth).to.have.property('signUp');
      expect(client.auth).to.have.property('signInWithPassword');
      expect(client.auth).to.have.property('signOut');
      expect(client.auth).to.have.property('getSession');
    });
    
    it('should have database methods', () => {
      const client = getSupabaseClient();
      
      expect(client.from).to.be.a('function');
    });
    
    it('should have storage methods', () => {
      const client = getSupabaseClient();
      
      expect(client.storage).to.have.property('from');
    });
  });
});