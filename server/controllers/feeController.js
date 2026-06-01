const Fee = require('../models/Fee');

exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.find().populate('student');
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudentFees = async (req, res) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFee = async (req, res) => {
  try {
    const { student, semester, amount, dueDate, description } = req.body;
    
    const fee = new Fee({
      student,
      semester,
      amount,
      dueDate,
      description
    });
    
    await fee.save();
    res.status(201).json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.payFee = async (req, res) => {
  try {
    const { paymentAmount } = req.body;
    const fee = await Fee.findById(req.params.id);
    
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    
    const amountPaid = fee.status === 'pending' ? paymentAmount : (paymentAmount);
    const newAmount = fee.amount - amountPaid;
    
    fee.status = newAmount <= 0 ? 'paid' : 'partial';
    fee.amount = newAmount <= 0 ? 0 : newAmount;
    fee.paidDate = new Date();
    
    await fee.save();
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
