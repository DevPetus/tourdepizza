// E2E tests for Customer API (including secure allergy storage)
const request = require('supertest');
const app = require('../../src/index');

describe('Customer API E2E Tests', () => {
  let customerId;

  describe('POST /api/customers', () => {
    test('should create a new customer', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '555-0100'
        })
        .expect(201);
      
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe('Jane Doe');
      expect(response.body.email).toBe('jane@example.com');
      expect(response.body.phone).toBe('555-0100');
      expect(response.body.allergies).toEqual([]);
      
      customerId = response.body.id;
    });

    test('should fail to create customer with duplicate email', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({
          name: 'Another User',
          email: 'jane@example.com',
          phone: '555-0101'
        })
        .expect(400);
      
      expect(response.body.error).toContain('email already exists');
    });

    test('should fail to create customer with invalid email', async () => {
      const response = await request(app)
        .post('/api/customers')
        .send({
          name: 'Invalid User',
          email: 'not-an-email',
          phone: '555-0102'
        })
        .expect(400);
      
      expect(response.body.error).toContain('email');
    });
  });

  describe('GET /api/customers/:id', () => {
    test('should get customer by ID', async () => {
      const response = await request(app)
        .get(`/api/customers/${customerId}`)
        .expect(200);
      
      expect(response.body.id).toBe(customerId);
      expect(response.body.name).toBe('Jane Doe');
    });

    test('should return 404 for non-existent customer', async () => {
      const response = await request(app)
        .get('/api/customers/non-existent-id')
        .expect(404);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/customers/:id', () => {
    test('should update customer information', async () => {
      const response = await request(app)
        .put(`/api/customers/${customerId}`)
        .send({
          name: 'Jane Smith',
          phone: '555-9999'
        })
        .expect(200);
      
      expect(response.body.name).toBe('Jane Smith');
      expect(response.body.phone).toBe('555-9999');
    });
  });

  describe('POST /api/customers/allergies/add (Secure Storage)', () => {
    test('should add allergy to customer with secure storage', async () => {
      const response = await request(app)
        .post('/api/customers/allergies/add')
        .send({
          customerId,
          allergy: {
            name: 'peanuts',
            severity: 'severe',
            notes: 'Anaphylaxis risk'
          }
        })
        .expect(200);
      
      expect(response.body.allergies).toHaveLength(1);
      // Verify allergy is encrypted (marked with _encrypted flag)
      expect(response.body.allergies[0]._encrypted).toBe(true);
    });

    test('should fail to add allergy with invalid severity', async () => {
      const response = await request(app)
        .post('/api/customers/allergies/add')
        .send({
          customerId,
          allergy: {
            name: 'dairy',
            severity: 'invalid-severity'
          }
        })
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/customers/:id/allergies', () => {
    test('should get customer allergies', async () => {
      const response = await request(app)
        .get(`/api/customers/${customerId}/allergies`)
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/customers/allergies/remove', () => {
    test('should remove allergy from customer', async () => {
      // First add another allergy
      await request(app)
        .post('/api/customers/allergies/add')
        .send({
          customerId,
          allergy: {
            name: 'shellfish',
            severity: 'moderate'
          }
        });
      
      const response = await request(app)
        .post('/api/customers/allergies/remove')
        .send({
          customerId,
          allergyName: 'shellfish'
        })
        .expect(200);
      
      // Verify shellfish was removed
      const allergiesResponse = await request(app)
        .get(`/api/customers/${customerId}/allergies`);
      
      const hasShellfish = allergiesResponse.body.some(a => a.name === 'shellfish');
      expect(hasShellfish).toBe(false);
    });
  });

  describe('Allergy Check in Order Confirmation', () => {
    test('should prevent order confirmation if pizza contains customer allergen', async () => {
      // Get a pizza that contains an allergen
      const pizzasResponse = await request(app).get('/api/pizzas');
      const pizzaWithPork = pizzasResponse.body.find(p => 
        p.allergens && p.allergens.includes('pork')
      );
      
      if (pizzaWithPork) {
        // Add pork allergy to customer
        await request(app)
          .post('/api/customers/allergies/add')
          .send({
            customerId,
            allergy: { name: 'pork', severity: 'moderate' }
          });
        
        // Create an order with this pizza
        const orderResponse = await request(app)
          .post('/api/orders')
          .send({ customerId });
        const orderId = orderResponse.body.id;
        
        await request(app)
          .post('/api/orders/add-pizza')
          .send({ orderId, pizzaId: pizzaWithPork.id, quantity: 1 });
        
        // Set delivery address
        await request(app)
          .post('/api/orders/delivery-address')
          .send({
            orderId,
            address: {
              street: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345'
            }
          });
        
        // Set payment
        await request(app)
          .post('/api/orders/payment')
          .send({
            orderId,
            payment: {
              method: 'credit_card',
              cardNumber: '4111111111111111',
              cardHolder: 'Jane Doe',
              expirationDate: '12/25',
              cvv: '123'
            }
          });
        
        // Try to confirm - should fail
        const confirmResponse = await request(app)
          .post('/api/orders/confirm')
          .send({ orderId })
          .expect(400);
        
        expect(confirmResponse.body.error).toContain('allergen');
      }
    });
  });
});
