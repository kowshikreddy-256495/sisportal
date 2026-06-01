const Attendance = require('../models/Attendance');

exports.getAllAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('student')
      .populate('course');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId })
      .populate('course');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ course: req.params.courseId })
      .populate('student');
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAttendance = async (req, res) => {
  try {
    const { student, course, date, status, remarks } = req.body;
    
    let record = await Attendance.findOne({ student, course, date });
    
    if (record) {
      record.status = status;
      record.remarks = remarks;
      await record.save();
    } else {
      record = new Attendance({
        student,
        course,
        date,
        status,
        remarks
      });
      await record.save();
    }
    
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendancePercentage = async (req, res) => {
  try {
    const { studentId, courseId } = req.params;
    const records = await Attendance.find({
      student: studentId,
      course: courseId
    });
    
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const percentage = total > 0 ? (present / total) * 100 : 0;
    
    res.json({
      total,
      present,
      absent: total - present,
      percentage: percentage.toFixed(2)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
