// Repository Interface for Pizza
// In-memory implementation for simplicity (can be replaced with DB)

class PizzaRepository {
  constructor() {
    this.pizzas = new Map();
    this.initializeSamplePizzas();
  }

  initializeSamplePizzas() {
    const Pizza = require('../entities/Pizza');
    const Topping = require('../entities/Topping');
    
    // Create sample toppings
    const pepperoni = new Topping(null, 'Pepperoni', 1.5, ['pork']);
    const mushrooms = new Topping(null, 'Mushrooms', 1.0, []);
    const olives = new Topping(null, 'Olives', 1.0, []);
    const cheese = new Topping(null, 'Extra Cheese', 2.0, ['dairy']);
    const bacon = new Topping(null, 'Bacon', 1.5, ['pork']);
    
    // Create sample pizzas
    const margherita = new Pizza(null, 'Margherita', 8.99, 'medium', [], ['dairy', 'gluten']);
    const pepperoniPizza = new Pizza(null, 'Pepperoni', 10.99, 'medium', [pepperoni], ['dairy', 'gluten', 'pork']);
    const veggie = new Pizza(null, 'Vegetarian', 9.99, 'medium', [mushrooms, olives], ['dairy', 'gluten']);
    
    this.save(margherita);
    this.save(pepperoniPizza);
    this.save(veggie);
  }

  async findById(id) {
    return this.pizzas.get(id) || null;
  }

  async findAll() {
    return Array.from(this.pizzas.values());
  }

  async save(pizza) {
    this.pizzas.set(pizza.id, pizza);
    return pizza;
  }

  async delete(id) {
    return this.pizzas.delete(id);
  }

  async findByName(name) {
    return Array.from(this.pizzas.values()).filter(p => 
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}

module.exports = new PizzaRepository();
