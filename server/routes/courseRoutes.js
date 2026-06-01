const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/api/courses', auth, courseController.getAllCourses);
router.get('/api/courses/:id', auth, courseController.getCourseById);
router.post('/api/courses', adminAuth, courseController.createCourse);
router.put('/api/courses/:id', adminAuth, courseController.updateCourse);
router.delete('/api/courses/:id', adminAuth, courseController.deleteCourse);
router.post('/api/courses/:id/students', adminAuth, courseController.addStudentToCourse);

module.exports = router;
