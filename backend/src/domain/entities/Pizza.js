// Domain Entity: Pizza (Aggregate Root)
const { v4: uuidv4 } = require('uuid');

class Pizza {
  constructor(id, name, basePrice, size, toppings = [], allergens = []) {
    this.id = id || uuidv4();
    this.name = name;
    this.basePrice = basePrice;
    this.size = size; // 'small', 'medium', 'large'
    this.toppings = toppings;
    this.allergens = allergens;
    this.createdAt = new Date();
  }

  addTopping(topping) {
    if (!this.toppings.find(t => t.id === topping.id)) {
      this.toppings.push(topping);
    }
  }

  removeTopping(toppingId) {
    this.toppings = this.toppings.filter(t => t.id !== toppingId);
  }

  calculatePrice() {
    const sizeMultiplier = {
      small: 1.0,
      medium: 1.3,
      large: 1.6
    };
    
    const toppingsPrice = this.toppings.reduce((sum, topping) => sum + topping.price, 0);
    return (this.basePrice + toppingsPrice) * (sizeMultiplier[this.size] || 1.0);
  }

  hasAllergen(allergen) {
    return this.allergens.includes(allergen) || 
           this.toppings.some(t => t.allergens && t.allergens.includes(allergen));
  }

  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Pizza name is required');
    }
    
    if (!this.basePrice || this.basePrice <= 0) {
      errors.push('Base price must be greater than 0');
    }
    
    if (!['small', 'medium', 'large'].includes(this.size)) {
      errors.push('Size must be small, medium, or large');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Pizza;
