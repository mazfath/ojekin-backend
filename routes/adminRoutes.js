const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// Semua rute admin harus diautentikasi dan role = 'admin'
router.use(authMiddleware.verifyToken);
router.use(authMiddleware.requireRole('admin'));

// Manajemen User
router.get('/users', adminController.getAllUsers);
router.delete('/users/:id', adminController.deleteUser);

// Manajemen Order
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Verifikasi driver
router.put('/users/:id/verify-driver', adminController.verifyDriver);

// Blokir & Unblokir user
router.put('/users/:id/block', adminController.blockUser);
router.put('/users/:id/unblock', adminController.unblockUser);

// Laporan order dibatalkan
router.get('/orders/cancelled', adminController.getCancelledOrders);


module.exports = router;
