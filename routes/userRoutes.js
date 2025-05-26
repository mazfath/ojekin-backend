const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware'); // import named export
const upload = require('../middleware/uploadMiddleware');

// Delete user by admin only
router.delete('/:id', verifyToken, requireRole('admin'), userController.adminDeleteUser);

// Get all users (protected)
router.get('/', verifyToken, requireRole('admin'), userController.getAllUsers);

router.put('/:id', verifyToken, requireRole('admin'), upload.single('foto_profile'), userController.adminUpdateUser);

module.exports = router;
