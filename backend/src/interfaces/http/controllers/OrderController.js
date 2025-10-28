// Order Controller
const OrderService = require('../../../domain/services/OrderService');
const orderRepository = require('../../../domain/repositories/OrderRepository');
const pizzaRepository = require('../../../domain/repositories/PizzaRepository');
const customerRepository = require('../../../domain/repositories/CustomerRepository');

const orderService = new OrderService(orderRepository, pizzaRepository, customerRepository);

class OrderController {
  async createOrder(req, res) {
    try {
      const { customerId } = req.body;
      const order = await orderService.createOrder(customerId);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await orderRepository.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrdersByCustomer(req, res) {
    try {
      const orders = await orderRepository.findByCustomerId(req.params.customerId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async addPizzaToOrder(req, res) {
    try {
      const { orderId, pizzaId, quantity } = req.body;
      const order = await orderService.addPizzaToOrder(orderId, pizzaId, quantity);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removePizzaFromOrder(req, res) {
    try {
      const { orderId, pizzaId } = req.body;
      const order = await orderService.removePizzaFromOrder(orderId, pizzaId);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePizzaQuantity(req, res) {
    try {
      const { orderId, pizzaId, quantity } = req.body;
      const order = await orderService.updatePizzaQuantity(orderId, pizzaId, quantity);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async setDeliveryAddress(req, res) {
    try {
      const { orderId, address } = req.body;
      const order = await orderService.setDeliveryAddress(orderId, address);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async setPayment(req, res) {
    try {
      const { orderId, payment } = req.body;
      const order = await orderService.setPayment(orderId, payment);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async confirmOrder(req, res) {
    try {
      const { orderId } = req.body;
      const order = await orderService.confirmOrder(orderId);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { orderId } = req.body;
      const order = await orderService.cancelOrder(orderId);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getOrderTotal(req, res) {
    try {
      const total = await orderService.getOrderTotal(req.params.id);
      res.json({ total });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OrderController();
