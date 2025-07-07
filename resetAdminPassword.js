require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const adminEmail = 'admin@madrasmeals.com';
const newPassword = 'adminPassword123';

async function resetAdminPassword() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find the admin user
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.error('Admin user not found. Please run createAdmin.js first.');
      return;
    }
    
    // Hash the new password using bcrypt directly (same as in comparePassword)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the admin password
    admin.password = hashedPassword;
    await admin.save();
    
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await mongoose.disconnect();
  }
}

resetAdminPassword(); 