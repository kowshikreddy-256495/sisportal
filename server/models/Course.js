const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    unique: true,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  description: String,
  credits: Number,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  semester: String,
  schedule: {
    days: [String],
    time: String,
    room: String
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
