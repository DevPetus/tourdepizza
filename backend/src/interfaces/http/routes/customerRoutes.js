// Customer Routes
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/CustomerController');

// Create new customer
router.post('/', customerController.createCustomer.bind(customerController));

// Get customer by ID
router.get('/:id', customerController.getCustomerById.bind(customerController));

// Update customer
router.put('/:id', customerController.updateCustomer.bind(customerController));

// Add allergy to customer (secure storage)
router.post('/allergies/add', customerController.addAllergy.bind(customerController));

// Remove allergy from customer
router.post('/allergies/remove', customerController.removeAllergy.bind(customerController));

// Get customer allergies
router.get('/:id/allergies', customerController.getCustomerAllergies.bind(customerController));

module.exports = router;
