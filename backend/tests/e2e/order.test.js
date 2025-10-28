// E2E tests for Order API (Shopping Cart & Checkout)
const request = require('supertest');
const app = require('../../src/index');

describe('Order API E2E Tests', () => {
  let customerId;
  let orderId;
  let pizzaId;

  beforeAll(async () => {
    // Create a test customer
    const customerResponse = await request(app)
      .post('/api/customers')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-0001'
      });
    customerId = customerResponse.body.id;

    // Get a pizza ID
    const pizzasResponse = await request(app).get('/api/pizzas');
    pizzaId = pizzasResponse.body[0].id;
  });

  describe('POST /api/orders', () => {
    test('should create a new order', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({ customerId })
        .expect(201);
      
      expect(response.body.id).toBeDefined();
      expect(response.body.customerId).toBe(customerId);
      expect(response.body.items).toEqual([]);
      expect(response.body.status).toBe('pending');
      
      orderId = response.body.id;
    });

    test('should fail to create order without customer ID', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({})
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/orders/add-pizza (Shopping Cart)', () => {
    test('should add pizza to order', async () => {
      const response = await request(app)
        .post('/api/orders/add-pizza')
        .send({
          orderId,
          pizzaId,
          quantity: 2
        })
        .expect(200);
      
      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].pizzaId).toBe(pizzaId);
      expect(response.body.items[0].quantity).toBe(2);
    });
  });

  describe('POST /api/orders/update-quantity', () => {
    test('should update pizza quantity in order', async () => {
      const response = await request(app)
        .post('/api/orders/update-quantity')
        .send({
          orderId,
          pizzaId,
          quantity: 3
        })
        .expect(200);
      
      expect(response.body.items[0].quantity).toBe(3);
    });
  });

  describe('GET /api/orders/:id', () => {
    test('should get order by ID', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}`)
        .expect(200);
      
      expect(response.body.id).toBe(orderId);
      expect(response.body.customerId).toBe(customerId);
    });
  });

  describe('GET /api/orders/customer/:customerId', () => {
    test('should get orders by customer ID', async () => {
      const response = await request(app)
        .get(`/api/orders/customer/${customerId}`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/orders/delivery-address', () => {
    test('should set delivery address', async () => {
      const response = await request(app)
        .post('/api/orders/delivery-address')
        .send({
          orderId,
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            country: 'USA',
            instructions: 'Ring doorbell'
          }
        })
        .expect(200);
      
      expect(response.body.deliveryAddress).toBeDefined();
      expect(response.body.deliveryAddress.street).toBe('123 Main St');
    });

    test('should fail with invalid zip code', async () => {
      const response = await request(app)
        .post('/api/orders/delivery-address')
        .send({
          orderId,
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: 'invalid'
          }
        })
        .expect(400);
      
      expect(response.body.error).toContain('ZIP code');
    });
  });

  describe('POST /api/orders/payment', () => {
    test('should set payment information', async () => {
      const response = await request(app)
        .post('/api/orders/payment')
        .send({
          orderId,
          payment: {
            method: 'credit_card',
            cardNumber: '4111111111111111',
            cardHolder: 'Test User',
            expirationDate: '12/25',
            cvv: '123'
          }
        })
        .expect(200);
      
      expect(response.body.payment).toBeDefined();
      expect(response.body.payment.method).toBe('credit_card');
      expect(response.body.payment.cardNumber).toContain('****'); // Card should be masked
    });
  });

  describe('GET /api/orders/:id/total', () => {
    test('should get order total', async () => {
      const response = await request(app)
        .get(`/api/orders/${orderId}/total`)
        .expect(200);
      
      expect(response.body.total).toBeDefined();
      expect(response.body.total).toBeGreaterThan(0);
    });
  });

  describe('POST /api/orders/confirm', () => {
    test('should confirm order', async () => {
      const response = await request(app)
        .post('/api/orders/confirm')
        .send({ orderId })
        .expect(200);
      
      expect(response.body.status).toBe('confirmed');
    });
  });

  describe('POST /api/orders/cancel', () => {
    test('should cancel order', async () => {
      // Create a new order to cancel
      const newOrderResponse = await request(app)
        .post('/api/orders')
        .send({ customerId });
      const newOrderId = newOrderResponse.body.id;
      
      const response = await request(app)
        .post('/api/orders/cancel')
        .send({ orderId: newOrderId })
        .expect(200);
      
      expect(response.body.status).toBe('cancelled');
    });
  });

  describe('POST /api/orders/remove-pizza', () => {
    test('should remove pizza from order', async () => {
      // Create a new order with a pizza
      const newOrderResponse = await request(app)
        .post('/api/orders')
        .send({ customerId });
      const newOrderId = newOrderResponse.body.id;
      
      await request(app)
        .post('/api/orders/add-pizza')
        .send({ orderId: newOrderId, pizzaId, quantity: 1 });
      
      const response = await request(app)
        .post('/api/orders/remove-pizza')
        .send({ orderId: newOrderId, pizzaId })
        .expect(200);
      
      expect(response.body.items).toHaveLength(0);
    });
  });
});
