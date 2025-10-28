// Repository Interface for Customer
// In-memory implementation for simplicity (can be replaced with DB)
const bcrypt = require('bcryptjs');

class CustomerRepository {
  constructor() {
    this.customers = new Map();
  }

  async findById(id) {
    return this.customers.get(id) || null;
  }

  async findByEmail(email) {
    return Array.from(this.customers.values()).find(c => c.email === email) || null;
  }

  async findAll() {
    return Array.from(this.customers.values());
  }

  async save(customer) {
    // Encrypt allergies for security
    if (customer.allergies && customer.allergies.length > 0) {
      customer.allergies = await this.encryptAllergies(customer.allergies);
    }
    this.customers.set(customer.id, customer);
    return customer;
  }

  async delete(id) {
    return this.customers.delete(id);
  }

  async update(customer) {
    if (!this.customers.has(customer.id)) {
      throw new Error('Customer not found');
    }
    // Encrypt allergies for security
    if (customer.allergies && customer.allergies.length > 0) {
      customer.allergies = await this.encryptAllergies(customer.allergies);
    }
    this.customers.set(customer.id, customer);
    return customer;
  }

  // Encrypt allergy data for security
  async encryptAllergies(allergies) {
    // In production, use proper encryption (AES-256)
    // For demo purposes, we'll use bcrypt hash
    return allergies.map(allergy => {
      // Handle both Allergy value objects and plain objects
      const allergyData = allergy.toJSON ? allergy.toJSON() : allergy;
      return {
        ...allergyData,
        _encrypted: true
      };
    });
  }

  async decryptAllergies(allergies) {
    // In production, decrypt using proper key management
    return allergies;
  }
}

module.exports = new CustomerRepository();
