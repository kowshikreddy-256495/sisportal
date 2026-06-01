const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  assignmentGrade: Number,
  midtermGrade: Number,
  finalGrade: Number,
  totalGrade: Number,
  gradePoint: String,
  remarks: String,
  semester: String,
  recordedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Grade', gradeSchema);
