const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/register', upload.single('foto_profile'), authController.register);
router.post('/login', authController.login);

router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, upload.single('foto_profile'), authController.updateProfile);

module.exports = router;
