const express = require('express');
const { placeOrder, getOrders, updateOrderStatus } = require('../controllers/orderController');

module.exports = (io) => {
  const router = express.Router();

  router.post('/order', placeOrder(io));
  router.get('/orders', getOrders);
  router.put('/order/:id', updateOrderStatus(io));

  return router;
};
