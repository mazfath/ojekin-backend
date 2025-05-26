const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orderController');

router.get('/', ordersController.getOrders);
router.get('/:id', ordersController.getOrderById);
router.post('/', ordersController.createOrder);
router.put('/:id', ordersController.updateOrder);
router.delete('/:id', ordersController.deleteOrder);
// Terima order
router.put('/:id/accept', ordersController.acceptOrder);
// Selesaikan order
router.put('/:id/complete', ordersController.completeOrder);
// Batalkan order
router.put('/:id/cancel', ordersController.cancelOrder);


module.exports = router;
