const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.getAll();
    res.json(customers);
  } catch (err) {
    next(err);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const customer = await Customer.getById(userId);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    next(err);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    await Customer.create(req.body);
    res.status(201).json({ message: 'Customer created' });
  } catch (err) {
    next(err);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    console.log('=> updateCustomer req.body =', req.body);
    const userId = req.params.user_id;
    const affected = await Customer.update(userId, req.body);
    if (affected === 0) return res.status(404).json({ message: 'Customer not found or no data to update' });
    res.json({ message: 'Customer updated' });
  } catch (err) {
    next(err);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const affected = await Customer.delete(userId);
    if (affected === 0) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    next(err);
  }
};

