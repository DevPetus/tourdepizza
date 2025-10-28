// E2E tests for Pizza API
const request = require('supertest');
const app = require('../../src/index');

describe('Pizza API E2E Tests', () => {
  describe('GET /api/pizzas', () => {
    test('should return all pizzas', async () => {
      const response = await request(app)
        .get('/api/pizzas')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/pizzas/:id', () => {
    test('should return a specific pizza', async () => {
      // First get all pizzas to get a valid ID
      const pizzasResponse = await request(app).get('/api/pizzas');
      const pizzaId = pizzasResponse.body[0].id;
      
      const response = await request(app)
        .get(`/api/pizzas/${pizzaId}`)
        .expect(200);
      
      expect(response.body.id).toBe(pizzaId);
      expect(response.body.name).toBeDefined();
      expect(response.body.basePrice).toBeDefined();
    });

    test('should return 404 for non-existent pizza', async () => {
      const response = await request(app)
        .get('/api/pizzas/non-existent-id')
        .expect(404);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/pizzas', () => {
    test('should create a custom pizza', async () => {
      const response = await request(app)
        .post('/api/pizzas')
        .send({
          name: 'My Custom Pizza',
          basePrice: 12.99,
          size: 'large',
          toppingIds: []
        })
        .expect(201);
      
      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe('My Custom Pizza');
      expect(response.body.basePrice).toBe(12.99);
      expect(response.body.size).toBe('large');
    });

    test('should fail to create pizza with invalid data', async () => {
      const response = await request(app)
        .post('/api/pizzas')
        .send({
          name: '',
          basePrice: -5,
          size: 'invalid'
        })
        .expect(400);
      
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/pizzas/toppings/available', () => {
    test('should return all available toppings', async () => {
      const response = await request(app)
        .get('/api/pizzas/toppings/available')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].name).toBeDefined();
      expect(response.body[0].price).toBeDefined();
    });
  });

  describe('POST /api/pizzas/check-allergens', () => {
    test('should check allergens for a pizza', async () => {
      const pizzasResponse = await request(app).get('/api/pizzas');
      const pizzaId = pizzasResponse.body[0].id;
      
      const response = await request(app)
        .post('/api/pizzas/check-allergens')
        .send({
          pizzaId: pizzaId,
          allergens: ['dairy', 'nuts']
        })
        .expect(200);
      
      expect(response.body.hasConflicts).toBeDefined();
      expect(response.body.conflicts).toBeDefined();
    });
  });
});
