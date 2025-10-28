// Customer Controller
const CustomerService = require('../../../domain/services/CustomerService');
const customerRepository = require('../../../domain/repositories/CustomerRepository');

const customerService = new CustomerService(customerRepository);

class CustomerController {
  async createCustomer(req, res) {
    try {
      const { name, email, phone } = req.body;
      const customer = await customerService.createCustomer(name, email, phone);
      res.status(201).json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCustomerById(req, res) {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      res.json(customer);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateCustomer(req, res) {
    try {
      const customer = await customerService.updateCustomer(req.params.id, req.body);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async addAllergy(req, res) {
    try {
      const { customerId, allergy } = req.body;
      const customer = await customerService.addAllergy(customerId, allergy);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeAllergy(req, res) {
    try {
      const { customerId, allergyName } = req.body;
      const customer = await customerService.removeAllergy(customerId, allergyName);
      res.json(customer);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCustomerAllergies(req, res) {
    try {
      const allergies = await customerService.getCustomerAllergies(req.params.id);
      res.json(allergies);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new CustomerController();
