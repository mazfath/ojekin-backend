const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Semua route customer hanya untuk admin
router.use(auth, role('admin'));

// GET /customers
router.get('/', customerController.getAllCustomers);

// GET /customers/:user_id
router.get('/:user_id', customerController.getCustomerById);

// POST /customers
router.post('/', customerController.createCustomer);

// PUT /customers/:user_id
router.put('/:user_id', customerController.updateCustomer);

// DELETE /customers/:user_id
router.delete('/:user_id', customerController.deleteCustomer);

module.exports = router;
