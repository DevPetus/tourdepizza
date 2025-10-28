// Domain Entity: Topping
const { v4: uuidv4 } = require('uuid');

class Topping {
  constructor(id, name, price, allergens = [], available = true) {
    this.id = id || uuidv4();
    this.name = name;
    this.price = price;
    this.allergens = allergens; // Array of allergen strings
    this.available = available;
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Topping name is required');
    }
    
    if (this.price === undefined || this.price < 0) {
      errors.push('Price must be 0 or greater');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Topping;
