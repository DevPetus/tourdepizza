// Unit tests for Customer entity
const Customer = require('../../src/domain/entities/Customer');
const Allergy = require('../../src/domain/value-objects/Allergy');

describe('Customer Entity', () => {
  describe('Creation', () => {
    test('should create a customer with valid data', () => {
      const customer = new Customer(null, 'John Doe', 'john@example.com', '555-1234', []);
      
      expect(customer.id).toBeDefined();
      expect(customer.name).toBe('John Doe');
      expect(customer.email).toBe('john@example.com');
      expect(customer.phone).toBe('555-1234');
      expect(customer.allergies).toEqual([]);
    });
  });

  describe('Validation', () => {
    test('should validate a valid customer', () => {
      const customer = new Customer(null, 'John Doe', 'john@example.com', '555-1234', []);
      const validation = customer.validate();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    test('should fail validation when name is empty', () => {
      const customer = new Customer(null, '', 'john@example.com', '555-1234', []);
      const validation = customer.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Customer name is required');
    });

    test('should fail validation when email is invalid', () => {
      const customer = new Customer(null, 'John Doe', 'invalid-email', '555-1234', []);
      const validation = customer.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Valid email is required');
    });

    test('should fail validation when phone is empty', () => {
      const customer = new Customer(null, 'John Doe', 'john@example.com', '', []);
      const validation = customer.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Phone number is required');
    });
  });

  describe('Allergy Management', () => {
    test('should add allergy to customer', () => {
      const customer = new Customer(null, 'John Doe', 'john@example.com', '555-1234', []);
      const allergy = new Allergy('peanuts', 'severe', 'Anaphylaxis risk');
      
      customer.addAllergy(allergy);
      
      expect(customer.allergies).toHaveLength(1);
      expect(customer.allergies[0]).toBe(allergy);
    });

    test('should not add duplicate allergy', () => {
      const customer = new Customer(null, 'John Doe', 'john@example.com', '555-1234', []);
      const allergy1 = new Allergy('peanuts', 'severe');
      const allergy2 = new Allergy('peanuts', 'moderate');
      
      customer.addAllergy(allergy1);
      customer.addAllergy(allergy2);
      
      expect(customer.allergies).toHaveLength(1);
    });

    test('should remove allergy from customer', () => {
      const allergy1 = new Allergy('peanuts', 'severe');
      const allergy2 = new Allergy('dairy', 'mild');
      const customer = new Customer(null, 'John Doe', 'john@example.com', '555-1234', [allergy1, allergy2]);
      
      customer.removeAllergy('peanuts');
      
      expect(customer.allergies).toHaveLength(1);
      expect(customer.allergies[0].name).toBe('dairy');
    });

    test('should check if customer has allergy', () => {
      const allergy = new Allergy('peanuts', 'severe');
      const customer = new Customer(null, 'John Doe', 'john@example.com', '555-1234', [allergy]);
      
      expect(customer.hasAllergy('peanuts')).toBe(true);
      expect(customer.hasAllergy('dairy')).toBe(false);
    });
  });

  describe('Email Validation', () => {
    test('should accept valid email addresses', () => {
      const customer = new Customer(null, 'John', 'john@example.com', '555-1234');
      expect(customer.isValidEmail('test@domain.com')).toBe(true);
      expect(customer.isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('should reject invalid email addresses', () => {
      const customer = new Customer(null, 'John', 'john@example.com', '555-1234');
      expect(customer.isValidEmail('invalid')).toBe(false);
      expect(customer.isValidEmail('@domain.com')).toBe(false);
      expect(customer.isValidEmail('user@')).toBe(false);
    });
  });
});
