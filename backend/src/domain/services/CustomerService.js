// Domain Service: Customer Service
// Handles complex business logic for customers

class CustomerService {
  constructor(customerRepository) {
    this.customerRepository = customerRepository;
  }

  async createCustomer(name, email, phone) {
    const Customer = require('../entities/Customer');
    
    // Check if email already exists
    const existing = await this.customerRepository.findByEmail(email);
    if (existing) {
      throw new Error('Customer with this email already exists');
    }

    const customer = new Customer(null, name, email, phone, []);
    
    const validation = customer.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid customer: ${validation.errors.join(', ')}`);
    }

    return await this.customerRepository.save(customer);
  }

  async addAllergy(customerId, allergyData) {
    const Allergy = require('../value-objects/Allergy');
    const customer = await this.customerRepository.findById(customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }

    const allergy = new Allergy(
      allergyData.name,
      allergyData.severity || 'moderate',
      allergyData.notes || ''
    );

    const validation = allergy.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid allergy: ${validation.errors.join(', ')}`);
    }

    customer.addAllergy(allergy);
    return await this.customerRepository.update(customer);
  }

  async removeAllergy(customerId, allergyName) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    customer.removeAllergy(allergyName);
    return await this.customerRepository.update(customer);
  }

  async getCustomerAllergies(customerId) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer.allergies;
  }

  async getCustomerById(id) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async updateCustomer(customerId, updates) {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    if (updates.name) customer.name = updates.name;
    if (updates.email) {
      // Check if new email already exists
      const existing = await this.customerRepository.findByEmail(updates.email);
      if (existing && existing.id !== customerId) {
        throw new Error('Email already in use');
      }
      customer.email = updates.email;
    }
    if (updates.phone) customer.phone = updates.phone;

    customer.updatedAt = new Date();

    const validation = customer.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid customer: ${validation.errors.join(', ')}`);
    }

    return await this.customerRepository.update(customer);
  }
}

module.exports = CustomerService;
