const express = require('express');
const router = express.Router();
const negotiationController = require('../controllers/negotiationController');

// PENTING: Route yang lebih spesifik duluan
router.post('/', negotiationController.createNegotiation);
router.get('/order/:orderId', negotiationController.getByOrderId);
router.get('/driver/:driverId', negotiationController.getByDriverId);

// Baru route umum di bawah ini
router.get('/:id', negotiationController.getNegotiationById);
router.patch('/:id/accept', negotiationController.acceptNegotiation);
router.patch('/:id/reject', negotiationController.rejectNegotiation);
router.get('/', negotiationController.getAllNegotiations);

module.exports = router;
