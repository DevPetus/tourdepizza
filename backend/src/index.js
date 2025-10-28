// Express API Server - Tour de Pizza
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const pizzaRoutes = require('./interfaces/http/routes/pizzaRoutes');
const orderRoutes = require('./interfaces/http/routes/orderRoutes');
const customerRoutes = require('./interfaces/http/routes/customerRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Tour de Pizza API',
    version: '1.0.0',
    endpoints: {
      pizzas: {
        'GET /api/pizzas': 'Get all pizzas',
        'GET /api/pizzas/:id': 'Get pizza by ID',
        'POST /api/pizzas': 'Create custom pizza',
        'POST /api/pizzas/add-topping': 'Add topping to pizza',
        'POST /api/pizzas/remove-topping': 'Remove topping from pizza',
        'GET /api/pizzas/toppings/available': 'Get all available toppings',
        'POST /api/pizzas/check-allergens': 'Check allergens for a pizza'
      },
      orders: {
        'POST /api/orders': 'Create new order',
        'GET /api/orders/:id': 'Get order by ID',
        'GET /api/orders/customer/:customerId': 'Get orders by customer',
        'POST /api/orders/add-pizza': 'Add pizza to order (shopping cart)',
        'POST /api/orders/remove-pizza': 'Remove pizza from order',
        'POST /api/orders/update-quantity': 'Update pizza quantity',
        'POST /api/orders/delivery-address': 'Set delivery address',
        'POST /api/orders/payment': 'Set payment information',
        'POST /api/orders/confirm': 'Confirm order',
        'POST /api/orders/cancel': 'Cancel order',
        'GET /api/orders/:id/total': 'Get order total'
      },
      customers: {
        'POST /api/customers': 'Create new customer',
        'GET /api/customers/:id': 'Get customer by ID',
        'PUT /api/customers/:id': 'Update customer',
        'POST /api/customers/allergies/add': 'Add allergy (secure storage)',
        'POST /api/customers/allergies/remove': 'Remove allergy',
        'GET /api/customers/:id/allergies': 'Get customer allergies'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Tour de Pizza API server running on port ${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api`);
  });
}

module.exports = app;
