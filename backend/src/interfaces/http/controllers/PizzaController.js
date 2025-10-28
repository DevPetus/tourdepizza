// Pizza Controller
const PizzaService = require('../../../domain/services/PizzaService');
const pizzaRepository = require('../../../domain/repositories/PizzaRepository');
const toppingRepository = require('../../../domain/repositories/ToppingRepository');

const pizzaService = new PizzaService(pizzaRepository, toppingRepository);

class PizzaController {
  async getAllPizzas(req, res) {
    try {
      const pizzas = await pizzaService.getAllPizzas();
      res.json(pizzas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPizzaById(req, res) {
    try {
      const pizza = await pizzaService.getPizzaById(req.params.id);
      res.json(pizza);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createCustomPizza(req, res) {
    try {
      const { name, basePrice, size, toppingIds } = req.body;
      const pizza = await pizzaService.createCustomPizza(name, basePrice, size, toppingIds);
      res.status(201).json(pizza);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addTopping(req, res) {
    try {
      const { pizzaId, toppingId } = req.body;
      const pizza = await pizzaService.addToppingToPizza(pizzaId, toppingId);
      res.json(pizza);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeTopping(req, res) {
    try {
      const { pizzaId, toppingId } = req.body;
      const pizza = await pizzaService.removeToppingFromPizza(pizzaId, toppingId);
      res.json(pizza);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllToppings(req, res) {
    try {
      const toppings = await pizzaService.getAllToppings();
      res.json(toppings);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async checkAllergens(req, res) {
    try {
      const { pizzaId, allergens } = req.body;
      const result = await pizzaService.checkAllergens(pizzaId, allergens);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PizzaController();
