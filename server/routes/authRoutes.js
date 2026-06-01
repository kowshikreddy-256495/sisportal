const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/api/auth/register', authController.register);
router.post('/api/auth/login', authController.login);
router.get('/api/auth/profile', auth, authController.getProfile);
router.put('/api/auth/profile', auth, authController.updateProfile);

module.exports = router;
