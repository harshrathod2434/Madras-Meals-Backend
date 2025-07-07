const express = require('express');
const router = express.Router();
const { getAllCustomers, getCustomerOrders, getCustomerStats } = require('../controllers/customerController');
const { auth, adminAuth } = require('../middleware/auth');

// All routes require admin authentication
router.use(auth, adminAuth);

// Get all customers
router.get('/', async (req, res) => {
  try {
    await getAllCustomers(req, res);
  } catch (error) {
    console.error('Error in GET /customers:', error);
    res.status(500).json({ error: 'Internal server error in customer route' });
  }
});

// Get orders for a specific customer
router.get('/:customerId/orders', async (req, res) => {
  try {
    await getCustomerOrders(req, res);
  } catch (error) {
    console.error(`Error in GET /customers/${req.params.customerId}/orders:`, error);
    res.status(500).json({ error: 'Internal server error in customer orders route' });
  }
});

// Get customer statistics
router.get('/stats', async (req, res) => {
  try {
    await getCustomerStats(req, res);
  } catch (error) {
    console.error('Error in GET /customers/stats:', error);
    res.status(500).json({ error: 'Internal server error in customer stats route' });
  }
});

module.exports = router; 