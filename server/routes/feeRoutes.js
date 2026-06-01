const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/api/fees', auth, feeController.getAllFees);
router.get('/api/fees/student/:studentId', auth, feeController.getStudentFees);
router.post('/api/fees', adminAuth, feeController.createFee);
router.put('/api/fees/:id/pay', auth, feeController.payFee);
router.put('/api/fees/:id', adminAuth, feeController.updateFee);

module.exports = router;
