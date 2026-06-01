const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/api/attendance', auth, attendanceController.getAllAttendance);
router.get('/api/attendance/student/:studentId', auth, attendanceController.getStudentAttendance);
router.get('/api/attendance/course/:courseId', auth, attendanceController.getCourseAttendance);
router.post('/api/attendance', adminAuth, attendanceController.markAttendance);
router.get('/api/attendance/:studentId/:courseId/percentage', auth, attendanceController.getAttendancePercentage);

module.exports = router;
