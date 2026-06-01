const Order = require('../models/Order');

exports.placeOrder = (io) => async (req, res) => {
  try {
    const order = await Order.create({
      ...req.body,
      status: 'Preparing',
    });
    if (io) io.emit('orderUpdate', order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = (io) => async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    }, { new: true });
    if (io) io.emit('orderUpdate', updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
