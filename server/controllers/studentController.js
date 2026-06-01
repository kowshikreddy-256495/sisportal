const Student = require('../models/Student');
const User = require('../models/User');

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('userId', '-password').populate('enrolledCourses');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', '-password')
      .populate('enrolledCourses');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentByUserId = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id })
      .populate('userId', '-password')
      .populate('enrolledCourses');
    if (!student) return res.status(404).json({ message: 'Student record not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { userId, studentId, dateOfBirth, address, city, state, pincode, parentName, parentPhone } = req.body;
    
    const student = new Student({
      userId,
      studentId,
      dateOfBirth,
      address,
      city,
      state,
      pincode,
      parentName,
      parentPhone
    });
    
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    ).populate('enrolledCourses');
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
