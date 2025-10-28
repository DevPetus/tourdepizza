// Domain Entity: Order (Aggregate Root)
const { v4: uuidv4 } = require('uuid');

class Order {
  constructor(id, customerId, items = [], deliveryAddress = null, payment = null) {
    this.id = id || uuidv4();
    this.customerId = customerId;
    this.items = items; // Array of OrderItem { pizzaId, pizza, quantity, price }
    this.deliveryAddress = deliveryAddress;
    this.payment = payment;
    this.status = 'pending'; // pending, confirmed, preparing, delivering, delivered, cancelled
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  addItem(pizza, quantity = 1) {
    const existingItem = this.items.find(item => item.pizzaId === pizza.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = pizza.calculatePrice() * existingItem.quantity;
    } else {
      this.items.push({
        pizzaId: pizza.id,
        pizza: pizza,
        quantity: quantity,
        price: pizza.calculatePrice() * quantity
      });
    }
    
    this.updatedAt = new Date();
  }

  removeItem(pizzaId) {
    this.items = this.items.filter(item => item.pizzaId !== pizzaId);
    this.updatedAt = new Date();
  }

  updateItemQuantity(pizzaId, quantity) {
    const item = this.items.find(item => item.pizzaId === pizzaId);
    
    if (item) {
      if (quantity <= 0) {
        this.removeItem(pizzaId);
      } else {
        item.quantity = quantity;
        item.price = item.pizza.calculatePrice() * quantity;
        this.updatedAt = new Date();
      }
    }
  }

  setDeliveryAddress(address) {
    this.deliveryAddress = address;
    this.updatedAt = new Date();
  }

  setPayment(payment) {
    this.payment = payment;
    this.updatedAt = new Date();
  }

  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.price, 0);
  }

  confirm() {
    const validation = this.validate();
    if (!validation.isValid) {
      throw new Error(`Cannot confirm order: ${validation.errors.join(', ')}`);
    }
    
    this.status = 'confirmed';
    this.updatedAt = new Date();
  }

  cancel() {
    if (this.status === 'delivered') {
      throw new Error('Cannot cancel a delivered order');
    }
    
    this.status = 'cancelled';
    this.updatedAt = new Date();
  }

  validate() {
    const errors = [];
    
    if (!this.customerId) {
      errors.push('Customer ID is required');
    }
    
    if (!this.items || this.items.length === 0) {
      errors.push('Order must have at least one item');
    }
    
    if (!this.deliveryAddress) {
      errors.push('Delivery address is required');
    }
    
    if (!this.payment) {
      errors.push('Payment information is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = Order;
