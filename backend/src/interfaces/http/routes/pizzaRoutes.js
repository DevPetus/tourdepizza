// Pizza Routes
const express = require('express');
const router = express.Router();
const pizzaController = require('../controllers/PizzaController');

// Get all pizzas
router.get('/', pizzaController.getAllPizzas.bind(pizzaController));

// Get pizza by ID
router.get('/:id', pizzaController.getPizzaById.bind(pizzaController));

// Create custom pizza
router.post('/', pizzaController.createCustomPizza.bind(pizzaController));

// Add topping to pizza
router.post('/add-topping', pizzaController.addTopping.bind(pizzaController));

// Remove topping from pizza
router.post('/remove-topping', pizzaController.removeTopping.bind(pizzaController));

// Get all available toppings
router.get('/toppings/available', pizzaController.getAllToppings.bind(pizzaController));

// Check allergens for a pizza
router.post('/check-allergens', pizzaController.checkAllergens.bind(pizzaController));

module.exports = router;
