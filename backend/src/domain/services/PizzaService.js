// Domain Service: Pizza Service
// Handles complex business logic for pizzas

class PizzaService {
  constructor(pizzaRepository, toppingRepository) {
    this.pizzaRepository = pizzaRepository;
    this.toppingRepository = toppingRepository;
  }

  async createCustomPizza(name, basePrice, size, toppingIds = []) {
    const Pizza = require('../entities/Pizza');
    
    const toppings = [];
    for (const toppingId of toppingIds) {
      const topping = await this.toppingRepository.findById(toppingId);
      if (!topping) {
        throw new Error(`Topping ${toppingId} not found`);
      }
      if (!topping.available) {
        throw new Error(`Topping ${topping.name} is not available`);
      }
      toppings.push(topping);
    }

    // Collect all allergens from toppings
    const allergens = [...new Set(toppings.flatMap(t => t.allergens))];
    allergens.push('dairy', 'gluten'); // Base pizza allergens

    const pizza = new Pizza(null, name, basePrice, size, toppings, allergens);
    
    const validation = pizza.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid pizza: ${validation.errors.join(', ')}`);
    }

    return await this.pizzaRepository.save(pizza);
  }

  async addToppingToPizza(pizzaId, toppingId) {
    const pizza = await this.pizzaRepository.findById(pizzaId);
    if (!pizza) {
      throw new Error('Pizza not found');
    }

    const topping = await this.toppingRepository.findById(toppingId);
    if (!topping) {
      throw new Error('Topping not found');
    }

    if (!topping.available) {
      throw new Error(`Topping ${topping.name} is not available`);
    }

    pizza.addTopping(topping);
    
    // Update allergens
    if (topping.allergens && topping.allergens.length > 0) {
      pizza.allergens = [...new Set([...pizza.allergens, ...topping.allergens])];
    }

    return await this.pizzaRepository.save(pizza);
  }

  async removeToppingFromPizza(pizzaId, toppingId) {
    const pizza = await this.pizzaRepository.findById(pizzaId);
    if (!pizza) {
      throw new Error('Pizza not found');
    }

    pizza.removeTopping(toppingId);
    
    // Recalculate allergens
    const allergens = ['dairy', 'gluten']; // Base allergens
    pizza.toppings.forEach(t => {
      if (t.allergens) {
        allergens.push(...t.allergens);
      }
    });
    pizza.allergens = [...new Set(allergens)];

    return await this.pizzaRepository.save(pizza);
  }

  async getAllPizzas() {
    return await this.pizzaRepository.findAll();
  }

  async getPizzaById(id) {
    const pizza = await this.pizzaRepository.findById(id);
    if (!pizza) {
      throw new Error('Pizza not found');
    }
    return pizza;
  }

  async getAllToppings() {
    return await this.toppingRepository.findAvailable();
  }

  async checkAllergens(pizzaId, allergens) {
    const pizza = await this.pizzaRepository.findById(pizzaId);
    if (!pizza) {
      throw new Error('Pizza not found');
    }

    const conflicts = allergens.filter(allergen => pizza.hasAllergen(allergen));
    return {
      hasConflicts: conflicts.length > 0,
      conflicts
    };
  }
}

module.exports = PizzaService;
