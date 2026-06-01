const Course = require('../models/Course');

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', '-password')
      .populate('students');
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', '-password')
      .populate('students');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { courseCode, courseName, description, credits, instructor, semester, schedule } = req.body;
    
    const course = new Course({
      courseCode,
      courseName,
      description,
      credits,
      instructor,
      semester,
      schedule
    });
    
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addStudentToCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { students: req.body.studentId } },
      { new: true }
    ).populate('students');
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
