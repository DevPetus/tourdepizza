// Order Routes
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

// Create new order
router.post('/', orderController.createOrder.bind(orderController));

// Get order by ID
router.get('/:id', orderController.getOrderById.bind(orderController));

// Get orders by customer ID
router.get('/customer/:customerId', orderController.getOrdersByCustomer.bind(orderController));

// Add pizza to order (shopping cart)
router.post('/add-pizza', orderController.addPizzaToOrder.bind(orderController));

// Remove pizza from order
router.post('/remove-pizza', orderController.removePizzaFromOrder.bind(orderController));

// Update pizza quantity in order
router.post('/update-quantity', orderController.updatePizzaQuantity.bind(orderController));

// Set delivery address
router.post('/delivery-address', orderController.setDeliveryAddress.bind(orderController));

// Set payment information
router.post('/payment', orderController.setPayment.bind(orderController));

// Confirm order
router.post('/confirm', orderController.confirmOrder.bind(orderController));

// Cancel order
router.post('/cancel', orderController.cancelOrder.bind(orderController));

// Get order total
router.get('/:id/total', orderController.getOrderTotal.bind(orderController));

module.exports = router;
