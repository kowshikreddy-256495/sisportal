const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    unique: true,
    required: true
  },
  dateOfBirth: Date,
  address: String,
  city: String,
  state: String,
  pincode: String,
  parentName: String,
  parentPhone: String,
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated'],
    default: 'active'
  }
});

module.exports = mongoose.model('Student', studentSchema);
