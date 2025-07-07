const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/admin/all', auth, adminAuth, getAllOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, adminAuth, updateOrderStatus);

module.exports = router; 