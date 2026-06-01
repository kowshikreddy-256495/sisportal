const Grade = require('../models/Grade');

exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('student')
      .populate('course');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('course');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ course: req.params.courseId })
      .populate('student');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createGrade = async (req, res) => {
  try {
    const { student, course, assignmentGrade, midtermGrade, finalGrade, semester, remarks } = req.body;
    
    const totalGrade = ((assignmentGrade * 0.2) + (midtermGrade * 0.3) + (finalGrade * 0.5));
    let gradePoint = 'F';
    if (totalGrade >= 90) gradePoint = 'A';
    else if (totalGrade >= 80) gradePoint = 'B';
    else if (totalGrade >= 70) gradePoint = 'C';
    else if (totalGrade >= 60) gradePoint = 'D';
    
    const grade = new Grade({
      student,
      course,
      assignmentGrade,
      midtermGrade,
      finalGrade,
      totalGrade: totalGrade.toFixed(2),
      gradePoint,
      semester,
      remarks
    });
    
    await grade.save();
    res.status(201).json(grade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGrade = async (req, res) => {
  try {
    const grade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
