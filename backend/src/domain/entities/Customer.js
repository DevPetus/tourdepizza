// Domain Entity: Customer
const { v4: uuidv4 } = require('uuid');

class Customer {
  constructor(id, name, email, phone, allergies = []) {
    this.id = id || uuidv4();
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.allergies = allergies; // Array of Allergy value objects
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addAllergy(allergy) {
    if (!this.allergies.find(a => a.name === allergy.name)) {
      this.allergies.push(allergy);
      this.updatedAt = new Date();
    }
  }

  removeAllergy(allergyName) {
    this.allergies = this.allergies.filter(a => a.name !== allergyName);
    this.updatedAt = new Date();
  }

  hasAllergy(allergyName) {
    return this.allergies.some(a => a.name === allergyName);
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Customer name is required');
    }
    
    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Valid email is required');
    }
    
    if (!this.phone || this.phone.trim() === '') {
      errors.push('Phone number is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = Customer;
