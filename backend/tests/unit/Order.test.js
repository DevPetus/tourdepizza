// Unit tests for Order entity
const Order = require('../../src/domain/entities/Order');
const Pizza = require('../../src/domain/entities/Pizza');
const DeliveryAddress = require('../../src/domain/value-objects/DeliveryAddress');
const Payment = require('../../src/domain/value-objects/Payment');

describe('Order Entity', () => {
  let testPizza;

  beforeEach(() => {
    testPizza = new Pizza('pizza-1', 'Margherita', 10.00, 'medium', [], ['dairy']);
  });

  describe('Creation', () => {
    test('should create an order with valid data', () => {
      const order = new Order(null, 'customer-123');
      
      expect(order.id).toBeDefined();
      expect(order.customerId).toBe('customer-123');
      expect(order.items).toEqual([]);
      expect(order.status).toBe('pending');
    });
  });

  describe('Shopping Cart - Items Management', () => {
    test('should add pizza to order', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      
      expect(order.items).toHaveLength(1);
      expect(order.items[0].pizzaId).toBe('pizza-1');
      expect(order.items[0].quantity).toBe(1);
    });

    test('should increase quantity when adding existing pizza', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      order.addItem(testPizza, 2);
      
      expect(order.items).toHaveLength(1);
      expect(order.items[0].quantity).toBe(3);
    });

    test('should remove pizza from order', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      order.removeItem('pizza-1');
      
      expect(order.items).toHaveLength(0);
    });

    test('should update pizza quantity', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      order.updateItemQuantity('pizza-1', 5);
      
      expect(order.items[0].quantity).toBe(5);
    });

    test('should remove item when quantity is set to 0', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      order.updateItemQuantity('pizza-1', 0);
      
      expect(order.items).toHaveLength(0);
    });
  });

  describe('Delivery Address', () => {
    test('should set delivery address', () => {
      const order = new Order(null, 'customer-123');
      const address = new DeliveryAddress('123 Main St', 'Anytown', 'CA', '12345');
      
      order.setDeliveryAddress(address);
      
      expect(order.deliveryAddress).toBe(address);
    });
  });

  describe('Payment', () => {
    test('should set payment information', () => {
      const order = new Order(null, 'customer-123');
      const payment = new Payment('credit_card', '1234567890123456', 'John Doe', '12/25', '123');
      
      order.setPayment(payment);
      
      expect(order.payment).toBe(payment);
    });
  });

  describe('Total Calculation', () => {
    test('should calculate total for single item', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 2);
      
      // 10.00 * 1.3 (medium multiplier) * 2 = 26.00
      expect(order.calculateTotal()).toBe(26.00);
    });

    test('should calculate total for multiple items', () => {
      const order = new Order(null, 'customer-123');
      const pizza2 = new Pizza('pizza-2', 'Pepperoni', 12.00, 'large', [], ['dairy']);
      
      order.addItem(testPizza, 1);
      order.addItem(pizza2, 1);
      
      // 10.00 * 1.3 + 12.00 * 1.6 = 13.00 + 19.20 = 32.20
      expect(order.calculateTotal()).toBe(32.20);
    });

    test('should return 0 for empty order', () => {
      const order = new Order(null, 'customer-123');
      
      expect(order.calculateTotal()).toBe(0);
    });
  });

  describe('Validation', () => {
    test('should validate complete order', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      
      const address = new DeliveryAddress('123 Main St', 'Anytown', 'CA', '12345');
      order.setDeliveryAddress(address);
      
      const payment = new Payment('credit_card', '1234567890123456', 'John Doe', '12/25', '123');
      order.setPayment(payment);
      
      const validation = order.validate();
      expect(validation.isValid).toBe(true);
    });

    test('should fail validation when customer ID is missing', () => {
      const order = new Order(null, null);
      const validation = order.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Customer ID is required');
    });

    test('should fail validation when items are empty', () => {
      const order = new Order(null, 'customer-123');
      const validation = order.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Order must have at least one item');
    });

    test('should fail validation when delivery address is missing', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      const validation = order.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Delivery address is required');
    });

    test('should fail validation when payment is missing', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      const address = new DeliveryAddress('123 Main St', 'Anytown', 'CA', '12345');
      order.setDeliveryAddress(address);
      const validation = order.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Payment information is required');
    });
  });

  describe('Order Lifecycle', () => {
    test('should confirm valid order', () => {
      const order = new Order(null, 'customer-123');
      order.addItem(testPizza, 1);
      
      const address = new DeliveryAddress('123 Main St', 'Anytown', 'CA', '12345');
      order.setDeliveryAddress(address);
      
      const payment = new Payment('credit_card', '1234567890123456', 'John Doe', '12/25', '123');
      order.setPayment(payment);
      
      order.confirm();
      
      expect(order.status).toBe('confirmed');
    });

    test('should throw error when confirming invalid order', () => {
      const order = new Order(null, 'customer-123');
      
      expect(() => order.confirm()).toThrow('Cannot confirm order');
    });

    test('should cancel order', () => {
      const order = new Order(null, 'customer-123');
      order.cancel();
      
      expect(order.status).toBe('cancelled');
    });

    test('should not cancel delivered order', () => {
      const order = new Order(null, 'customer-123');
      order.status = 'delivered';
      
      expect(() => order.cancel()).toThrow('Cannot cancel a delivered order');
    });
  });
});
