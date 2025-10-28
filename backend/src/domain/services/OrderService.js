// Domain Service: Order Service
// Handles complex business logic for orders

class OrderService {
  constructor(orderRepository, pizzaRepository, customerRepository) {
    this.orderRepository = orderRepository;
    this.pizzaRepository = pizzaRepository;
    this.customerRepository = customerRepository;
  }

  async createOrder(customerId) {
    const Order = require('../entities/Order');
    const customer = await this.customerRepository.findById(customerId);
    
    if (!customer) {
      throw new Error('Customer not found');
    }
    
    const order = new Order(null, customerId);
    return await this.orderRepository.save(order);
  }

  async addPizzaToOrder(orderId, pizzaId, quantity = 1) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const pizza = await this.pizzaRepository.findById(pizzaId);
    if (!pizza) {
      throw new Error('Pizza not found');
    }

    order.addItem(pizza, quantity);
    return await this.orderRepository.update(order);
  }

  async removePizzaFromOrder(orderId, pizzaId) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.removeItem(pizzaId);
    return await this.orderRepository.update(order);
  }

  async updatePizzaQuantity(orderId, pizzaId, quantity) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.updateItemQuantity(pizzaId, quantity);
    return await this.orderRepository.update(order);
  }

  async setDeliveryAddress(orderId, address) {
    const DeliveryAddress = require('../value-objects/DeliveryAddress');
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const deliveryAddress = new DeliveryAddress(
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
      address.instructions
    );

    const validation = deliveryAddress.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid delivery address: ${validation.errors.join(', ')}`);
    }

    order.setDeliveryAddress(deliveryAddress);
    return await this.orderRepository.update(order);
  }

  async setPayment(orderId, paymentData) {
    const Payment = require('../value-objects/Payment');
    const order = await this.orderRepository.findById(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    const payment = new Payment(
      paymentData.method,
      paymentData.cardNumber,
      paymentData.cardHolder,
      paymentData.expirationDate,
      paymentData.cvv,
      paymentData.billingAddress
    );

    const validation = payment.validate();
    if (!validation.isValid) {
      throw new Error(`Invalid payment: ${validation.errors.join(', ')}`);
    }

    order.setPayment(payment);
    return await this.orderRepository.update(order);
  }

  async confirmOrder(orderId) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Check for customer allergies
    const customer = await this.customerRepository.findById(order.customerId);
    if (customer && customer.allergies.length > 0) {
      const hasAllergenConflict = order.items.some(item => {
        return customer.allergies.some(allergy => 
          item.pizza.hasAllergen(allergy.name)
        );
      });

      if (hasAllergenConflict) {
        throw new Error('Order contains items with customer allergens');
      }
    }

    order.confirm();
    return await this.orderRepository.update(order);
  }

  async cancelOrder(orderId) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    order.cancel();
    return await this.orderRepository.update(order);
  }

  async getOrderTotal(orderId) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    return order.calculateTotal();
  }
}

module.exports = OrderService;
