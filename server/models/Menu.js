const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  isPopular: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
