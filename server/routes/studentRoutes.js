const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/api/students', auth, studentController.getAllStudents);
router.get('/api/students/:id', auth, studentController.getStudentById);
router.get('/api/students/profile/me', auth, studentController.getStudentByUserId);
router.post('/api/students', adminAuth, studentController.createStudent);
router.put('/api/students/:id', adminAuth, studentController.updateStudent);
router.post('/api/students/:id/enroll', auth, studentController.enrollCourse);

module.exports = router;
