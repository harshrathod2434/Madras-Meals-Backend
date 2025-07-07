const User = require('../models/User');
const bcrypt = require('bcryptjs');
const connect = require('../config/mongoconnect');

// Get all admin users
const getAllAdmins = async (req, res) => {
  try {
    // Ensure database connection first
    await connect();
    
    // Fetch only admin users and exclude password field
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    console.error('Error getting admin users:', error);
    res.status(500).json({ error: 'Failed to get admin users' });
  }
};

// Create a new admin user
const createAdmin = async (req, res) => {
  try {
    // Ensure database connection first
    await connect();
    
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new admin user
    const newAdmin = new User({
      name,
      email,
      password, // Will be hashed by the pre-save hook in the User model
      role: 'admin'
    });
    
    await newAdmin.save();
    
    // Return user without password
    const adminToReturn = newAdmin.toObject();
    delete adminToReturn.password;
    
    res.status(201).json(adminToReturn);
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ error: 'Failed to create admin user' });
  }
};

// Delete an admin user
const deleteAdmin = async (req, res) => {
  try {
    // Ensure database connection first
    await connect();
    
    const { id } = req.params;
    
    // Don't allow deleting the current user
    if (id === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }
    
    // Find and delete the admin
    const admin = await User.findOneAndDelete({ _id: id, role: 'admin' });
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }
    
    res.json({ message: 'Admin user deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin user:', error);
    res.status(500).json({ error: 'Failed to delete admin user' });
  }
};

module.exports = {
  getAllAdmins,
  createAdmin,
  deleteAdmin
}; 