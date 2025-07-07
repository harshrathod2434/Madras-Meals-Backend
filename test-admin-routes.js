// Test file to check if we can require the admin routes file
try {
  const adminRoutes = require('./routes/admin');
  console.log('Successfully required admin routes file:', adminRoutes);
} catch (error) {
  console.error('Error requiring admin routes file:', error);
}

// Test if we can require the admin controller
try {
  const adminController = require('./controllers/adminController');
  console.log('Successfully required admin controller:', Object.keys(adminController));
} catch (error) {
  console.error('Error requiring admin controller:', error);
}

// Test if the auth middleware is working
try {
  const { auth, adminAuth } = require('./middleware/auth');
  console.log('Successfully required auth middleware:', { auth: !!auth, adminAuth: !!adminAuth });
} catch (error) {
  console.error('Error requiring auth middleware:', error);
} 