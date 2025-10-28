// Unit tests for Pizza entity
const Pizza = require('../../src/domain/entities/Pizza');
const Topping = require('../../src/domain/entities/Topping');

describe('Pizza Entity', () => {
  describe('Creation', () => {
    test('should create a pizza with valid data', () => {
      const pizza = new Pizza(null, 'Margherita', 8.99, 'medium', [], ['dairy', 'gluten']);
      
      expect(pizza.id).toBeDefined();
      expect(pizza.name).toBe('Margherita');
      expect(pizza.basePrice).toBe(8.99);
      expect(pizza.size).toBe('medium');
      expect(pizza.toppings).toEqual([]);
      expect(pizza.allergens).toEqual(['dairy', 'gluten']);
    });
  });

  describe('Validation', () => {
    test('should validate a valid pizza', () => {
      const pizza = new Pizza(null, 'Margherita', 8.99, 'medium', [], ['dairy']);
      const validation = pizza.validate();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    test('should fail validation when name is empty', () => {
      const pizza = new Pizza(null, '', 8.99, 'medium', [], ['dairy']);
      const validation = pizza.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Pizza name is required');
    });

    test('should fail validation when price is invalid', () => {
      const pizza = new Pizza(null, 'Margherita', 0, 'medium', [], ['dairy']);
      const validation = pizza.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Base price must be greater than 0');
    });

    test('should fail validation when size is invalid', () => {
      const pizza = new Pizza(null, 'Margherita', 8.99, 'extra-large', [], ['dairy']);
      const validation = pizza.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Size must be small, medium, or large');
    });
  });

  describe('Toppings', () => {
    test('should add topping to pizza', () => {
      const pizza = new Pizza(null, 'Margherita', 8.99, 'medium', [], ['dairy']);
      const topping = new Topping(null, 'Pepperoni', 1.5, ['pork']);
      
      pizza.addTopping(topping);
      
      expect(pizza.toppings).toHaveLength(1);
      expect(pizza.toppings[0]).toBe(topping);
    });

    test('should not add duplicate topping', () => {
      const pizza = new Pizza(null, 'Margherita', 8.99, 'medium', [], ['dairy']);
      const topping = new Topping('123', 'Pepperoni', 1.5, ['pork']);
      
      pizza.addTopping(topping);
      pizza.addTopping(topping);
      
      expect(pizza.toppings).toHaveLength(1);
    });

    test('should remove topping from pizza', () => {
      const topping1 = new Topping('1', 'Pepperoni', 1.5, ['pork']);
      const topping2 = new Topping('2', 'Mushrooms', 1.0, []);
      const pizza = new Pizza(null, 'Custom', 8.99, 'medium', [topping1, topping2], ['dairy']);
      
      pizza.removeTopping('1');
      
      expect(pizza.toppings).toHaveLength(1);
      expect(pizza.toppings[0].id).toBe('2');
    });
  });

  describe('Price Calculation', () => {
    test('should calculate price for small pizza without toppings', () => {
      const pizza = new Pizza(null, 'Margherita', 10.00, 'small', [], ['dairy']);
      
      expect(pizza.calculatePrice()).toBe(10.00);
    });

    test('should calculate price for medium pizza without toppings', () => {
      const pizza = new Pizza(null, 'Margherita', 10.00, 'medium', [], ['dairy']);
      
      expect(pizza.calculatePrice()).toBe(13.00);
    });

    test('should calculate price for large pizza without toppings', () => {
      const pizza = new Pizza(null, 'Margherita', 10.00, 'large', [], ['dairy']);
      
      expect(pizza.calculatePrice()).toBe(16.00);
    });

    test('should calculate price with toppings', () => {
      const topping1 = new Topping(null, 'Pepperoni', 1.5, ['pork']);
      const topping2 = new Topping(null, 'Mushrooms', 1.0, []);
      const pizza = new Pizza(null, 'Custom', 10.00, 'medium', [topping1, topping2], ['dairy']);
      
      // (10.00 + 1.5 + 1.0) * 1.3 = 16.25
      expect(pizza.calculatePrice()).toBe(16.25);
    });
  });

  describe('Allergen Detection', () => {
    test('should detect base allergen', () => {
      const pizza = new Pizza(null, 'Margherita', 8.99, 'medium', [], ['dairy', 'gluten']);
      
      expect(pizza.hasAllergen('dairy')).toBe(true);
      expect(pizza.hasAllergen('gluten')).toBe(true);
    });

    test('should detect allergen from toppings', () => {
      const topping = new Topping(null, 'Pepperoni', 1.5, ['pork']);
      const pizza = new Pizza(null, 'Custom', 8.99, 'medium', [topping], ['dairy']);
      
      expect(pizza.hasAllergen('pork')).toBe(true);
    });

    test('should return false for non-existent allergen', () => {
      const pizza = new Pizza(null, 'Margherita', 8.99, 'medium', [], ['dairy']);
      
      expect(pizza.hasAllergen('nuts')).toBe(false);
    });
  });
});
