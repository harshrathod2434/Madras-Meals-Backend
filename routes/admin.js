const express = require('express');
const router = express.Router();
const { getAllAdmins, createAdmin, deleteAdmin } = require('../controllers/adminController');
const { auth, adminAuth } = require('../middleware/auth');

// Get all admin users - separate auth for each route
router.get('/', auth, adminAuth, getAllAdmins);

// Create a new admin user
router.post('/', auth, adminAuth, createAdmin);

// Delete an admin user
router.delete('/:id', auth, adminAuth, deleteAdmin);

module.exports = router; 