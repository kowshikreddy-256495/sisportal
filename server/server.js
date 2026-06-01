const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

app.use(cors());
app.use(express.json());

const users = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@sis.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    phone: '9999999999'
  },
  {
    id: '2',
    username: 'teacher',
    email: 'teacher@sis.com',
    password: 'teacher123',
    role: 'teacher',
    firstName: 'Teacher',
    lastName: 'User',
    phone: '9999999998'
  },
  {
    id: '3',
    username: 'student',
    email: 'student@sis.com',
    password: 'student123',
    role: 'student',
    firstName: 'Student',
    lastName: 'User',
    phone: '9999999997'
  }
];

const courses = [
  {
    _id: 'c1',
    courseCode: 'CS101',
    courseName: 'Computer Science 101',
    description: 'Intro to computer science',
    credits: 3,
    instructor: 'Teacher User',
    semester: 'Fall',
    schedule: { days: ['Mon', 'Wed'], time: '10:00 AM', room: 'A1' }
  },
  {
    _id: 'c2',
    courseCode: 'MTH102',
    courseName: 'Mathematics II',
    description: 'Calculus and algebra fundamentals',
    credits: 4,
    instructor: 'Teacher User',
    semester: 'Fall',
    schedule: { days: ['Tue', 'Thu'], time: '11:00 AM', room: 'B2' }
  },
  {
    _id: 'c3',
    courseCode: 'ENG103',
    courseName: 'English Composition',
    description: 'Academic writing and communication',
    credits: 2,
    instructor: 'Teacher User',
    semester: 'Fall',
    schedule: { days: ['Fri'], time: '09:00 AM', room: 'C3' }
  }
];

const studentProfiles = {
  '3': {
    _id: 's1',
    userId: '3',
    studentId: 'S1001',
    dateOfBirth: '2004-05-20',
    address: '123 College Avenue',
    city: 'Cityville',
    state: 'State',
    pincode: '123456',
    parentName: 'Parent Name',
    parentPhone: '9999999999',
    enrolledCourses: courses
  }
};

const attendanceRecords = [
  { _id: 'a1', studentId: 's1', courseId: 'c1', course: courses[0], date: '2025-10-01', status: 'present', remarks: 'On time' },
  { _id: 'a2', studentId: 's1', courseId: 'c2', course: courses[1], date: '2025-10-02', status: 'absent', remarks: 'Sick' },
  { _id: 'a3', studentId: 's1', courseId: 'c3', course: courses[2], date: '2025-10-03', status: 'present', remarks: '' },
  { _id: 'a4', studentId: 's1', courseId: 'c1', course: courses[0], date: '2025-10-04', status: 'present', remarks: '' },
  { _id: 'a5', studentId: 's1', courseId: 'c2', course: courses[1], date: '2025-10-05', status: 'present', remarks: '' }
];

const grades = [
  { _id: 'g1', studentId: 's1', courseId: 'c1', course: courses[0], assignmentGrade: 18, midtermGrade: 24, finalGrade: 40, totalGrade: 82, gradePoint: 'A', semester: 'Fall' },
  { _id: 'g2', studentId: 's1', courseId: 'c2', course: courses[1], assignmentGrade: 15, midtermGrade: 22, finalGrade: 35, totalGrade: 72, gradePoint: 'B', semester: 'Fall' },
  { _id: 'g3', studentId: 's1', courseId: 'c3', course: courses[2], assignmentGrade: 17, midtermGrade: 25, finalGrade: 45, totalGrade: 87, gradePoint: 'A', semester: 'Fall' }
];

const fees = [
  { _id: 'f1', studentId: 's1', semester: 'Fall', amount: 15000, dueDate: '2025-09-15', status: 'pending' },
  { _id: 'f2', studentId: 's1', semester: 'Spring', amount: 15000, dueDate: '2026-01-15', status: 'paid' }
];

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  });
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone
    }
  });
});

app.get('/api/auth/profile', auth, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

app.get('/api/students/profile/me', auth, (req, res) => {
  const profile = studentProfiles[req.user.id];
  if (!profile) {
    return res.status(404).json({ message: 'Student record not found' });
  }

  const user = users.find((u) => u.id === req.user.id);
  res.json({ ...profile, user, enrolledCourses: profile.enrolledCourses });
});

app.put('/api/students/:id', auth, (req, res) => {
  const student = Object.values(studentProfiles).find((profile) => profile._id === req.params.id);
  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }

  const allowedFields = ['address', 'city', 'state', 'parentName', 'parentPhone'];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      student[field] = req.body[field];
    }
  });

  res.json(student);
});

app.get('/api/courses', auth, (req, res) => {
  res.json(courses);
});

// Admin: list all students
app.get('/api/students', adminAuth, (req, res) => {
  const all = Object.values(studentProfiles).map((p) => ({ ...p }));
  res.json(all);
});

// Admin: create grade for a student
app.post('/api/grades', adminAuth, (req, res) => {
  const { studentId, courseId, assignmentGrade = 0, midtermGrade = 0, finalGrade = 0, semester = 'Fall' } = req.body;
  if (!studentId || !courseId) return res.status(400).json({ message: 'studentId and courseId required' });
  const totalGrade = Number(assignmentGrade) + Number(midtermGrade) + Number(finalGrade);
  const gradePoint = totalGrade >= 85 ? 'A' : totalGrade >= 70 ? 'B' : totalGrade >= 55 ? 'C' : totalGrade >= 40 ? 'D' : 'F';
  const newGrade = { _id: `g${grades.length + 1}`, studentId, courseId, course: courses.find(c => c._id === courseId) || null, assignmentGrade, midtermGrade, finalGrade, totalGrade, gradePoint, semester };
  grades.push(newGrade);
  res.status(201).json(newGrade);
});

// Admin: update grade
app.put('/api/grades/:id', adminAuth, (req, res) => {
  const grade = grades.find(g => g._id === req.params.id);
  if (!grade) return res.status(404).json({ message: 'Grade not found' });
  const fields = ['assignmentGrade', 'midtermGrade', 'finalGrade', 'semester'];
  fields.forEach(f => { if (req.body[f] !== undefined) grade[f] = req.body[f]; });
  grade.totalGrade = Number(grade.assignmentGrade) + Number(grade.midtermGrade) + Number(grade.finalGrade);
  grade.gradePoint = grade.totalGrade >= 85 ? 'A' : grade.totalGrade >= 70 ? 'B' : grade.totalGrade >= 55 ? 'C' : grade.totalGrade >= 40 ? 'D' : 'F';
  res.json(grade);
});

// Admin: create attendance record
app.post('/api/attendance', adminAuth, (req, res) => {
  const { studentId, courseId, date, status = 'present', remarks = '' } = req.body;
  if (!studentId || !courseId || !date) return res.status(400).json({ message: 'studentId, courseId and date required' });
  const newRec = { _id: `a${attendanceRecords.length + 1}`, studentId, courseId, course: courses.find(c => c._id === courseId) || null, date, status, remarks };
  attendanceRecords.push(newRec);
  res.status(201).json(newRec);
});

// Admin: update attendance
app.put('/api/attendance/:id', adminAuth, (req, res) => {
  const rec = attendanceRecords.find(a => a._id === req.params.id);
  if (!rec) return res.status(404).json({ message: 'Attendance record not found' });
  const fields = ['status', 'remarks', 'date'];
  fields.forEach(f => { if (req.body[f] !== undefined) rec[f] = req.body[f]; });
  res.json(rec);
});

// Admin: get all grades
app.get('/api/grades', adminAuth, (req, res) => {
  res.json(grades);
});

// Admin: delete grade
app.delete('/api/grades/:id', adminAuth, (req, res) => {
  const idx = grades.findIndex(g => g._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Grade not found' });
  const removed = grades.splice(idx, 1)[0];
  res.json(removed);
});

// Admin: get all attendance records
app.get('/api/attendance', adminAuth, (req, res) => {
  res.json(attendanceRecords);
});

// Admin: delete attendance record
app.delete('/api/attendance/:id', adminAuth, (req, res) => {
  const idx = attendanceRecords.findIndex(a => a._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Attendance record not found' });
  const removed = attendanceRecords.splice(idx, 1)[0];
  res.json(removed);
});

app.get('/api/attendance/student/:studentId', auth, (req, res) => {
  const records = attendanceRecords.filter((record) => record.studentId === req.params.studentId);
  res.json(records);
});

app.get('/api/attendance/:studentId/:courseId/percentage', auth, (req, res) => {
  const records = attendanceRecords.filter((record) => record.studentId === req.params.studentId && record.courseId === req.params.courseId);
  const present = records.filter((record) => record.status === 'present').length;
  const total = records.length;
  const absent = records.filter((record) => record.status === 'absent').length;
  const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
  res.json({ present, absent, total, percentage });
});

app.get('/api/grades/student/:studentId', auth, (req, res) => {
  const records = grades.filter((grade) => grade.studentId === req.params.studentId);
  res.json(records);
});

app.get('/api/fees/student/:studentId', auth, (req, res) => {
  const records = fees.filter((fee) => fee.studentId === req.params.studentId);
  res.json(records);
});

app.put('/api/fees/:feeId/pay', auth, (req, res) => {
  const fee = fees.find((f) => f._id === req.params.feeId);
  if (!fee) {
    return res.status(404).json({ message: 'Fee record not found' });
  }
  fee.status = 'paid';
  res.json(fee);
});

app.listen(port, () => console.log(`Server running on port ${port}`));
