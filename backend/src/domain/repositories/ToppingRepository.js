// Repository Interface for Topping
// In-memory implementation for simplicity (can be replaced with DB)

class ToppingRepository {
  constructor() {
    this.toppings = new Map();
    this.initializeSampleToppings();
  }

  initializeSampleToppings() {
    const Topping = require('../entities/Topping');
    
    const toppings = [
      new Topping(null, 'Pepperoni', 1.5, ['pork'], true),
      new Topping(null, 'Mushrooms', 1.0, [], true),
      new Topping(null, 'Olives', 1.0, [], true),
      new Topping(null, 'Extra Cheese', 2.0, ['dairy'], true),
      new Topping(null, 'Bacon', 1.5, ['pork'], true),
      new Topping(null, 'Onions', 0.75, [], true),
      new Topping(null, 'Bell Peppers', 1.0, [], true),
      new Topping(null, 'Sausage', 1.5, ['pork'], true),
      new Topping(null, 'Pineapple', 1.25, [], true),
      new Topping(null, 'Spinach', 1.0, [], true)
    ];
    
    toppings.forEach(t => this.save(t));
  }

  async findById(id) {
    return this.toppings.get(id) || null;
  }

  async findAll() {
    return Array.from(this.toppings.values());
  }

  async findAvailable() {
    return Array.from(this.toppings.values()).filter(t => t.available);
  }

  async save(topping) {
    this.toppings.set(topping.id, topping);
    return topping;
  }

  async delete(id) {
    return this.toppings.delete(id);
  }
}

module.exports = new ToppingRepository();
