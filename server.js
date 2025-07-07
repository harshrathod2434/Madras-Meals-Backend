require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const profileRoutes = require('./routes/profile');

// Try to load admin and customer routes with error handling
let adminRoutes, customerRoutes;
try {
  adminRoutes = require('./routes/admin');
  customerRoutes = require('./routes/customer');
} catch (error) {
  console.error('Failed to load routes:', error);
}

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

app.use(express.json());

// Test route to confirm server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

// Add admin routes
if (adminRoutes) {
  app.use('/api/admin', adminRoutes);
  
  // Add a test admin route
  app.get('/api/admin-test', (req, res) => {
    res.json({ message: 'Admin test route is working' });
  });
} else {
  console.error('Admin routes not available');
}

// Add customer routes
if (customerRoutes) {
  app.use('/api/customers', customerRoutes);
  
  // Add a test customer route
  app.get('/api/customers-test', (req, res) => {
    res.json({ message: 'Customer test route is working' });
  });
} else {
  console.error('Customer routes not available');
}

// Route for checking all registered routes
app.get('/api/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if(middleware.route) { // routes registered directly on the app
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if(middleware.name === 'router') { // router middleware
      middleware.handle.stack.forEach(handler => {
        if(handler.route) {
          routes.push({
            path: middleware.regexp.toString() + handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json(routes);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    // Start server
    const PORT = process.env.PORT || 2000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 