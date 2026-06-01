const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/api/grades', auth, gradeController.getAllGrades);
router.get('/api/grades/student/:studentId', auth, gradeController.getStudentGrades);
router.get('/api/grades/course/:courseId', auth, gradeController.getCourseGrades);
router.post('/api/grades', adminAuth, gradeController.createGrade);
router.put('/api/grades/:id', adminAuth, gradeController.updateGrade);

module.exports = router;
