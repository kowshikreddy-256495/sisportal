const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: { type: Array, required: true },
  total: { type: Number, required: true },
  status: { type: String, default: 'Preparing' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
