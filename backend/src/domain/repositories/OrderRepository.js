// Repository Interface for Order
// In-memory implementation for simplicity (can be replaced with DB)

class OrderRepository {
  constructor() {
    this.orders = new Map();
  }

  async findById(id) {
    return this.orders.get(id) || null;
  }

  async findAll() {
    return Array.from(this.orders.values());
  }

  async findByCustomerId(customerId) {
    return Array.from(this.orders.values()).filter(o => o.customerId === customerId);
  }

  async findByStatus(status) {
    return Array.from(this.orders.values()).filter(o => o.status === status);
  }

  async save(order) {
    this.orders.set(order.id, order);
    return order;
  }

  async delete(id) {
    return this.orders.delete(id);
  }

  async update(order) {
    if (!this.orders.has(order.id)) {
      throw new Error('Order not found');
    }
    this.orders.set(order.id, order);
    return order;
  }
}

module.exports = new OrderRepository();
