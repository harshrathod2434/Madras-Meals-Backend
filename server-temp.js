require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const profileRoutes = require('./routes/profile');

// Try to load admin routes with error handling
let adminRoutes;
try {
  adminRoutes = require('./routes/admin');
  console.log('Successfully loaded admin routes');
} catch (error) {
  console.error('Failed to load admin routes:', error);
  process.exit(1);
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Test route to confirm server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Test route is working' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/profile', profileRoutes);

// Add special logging for admin routes
app.use('/api/admin', (req, res, next) => {
  console.log('Admin route requested:', req.method, req.url);
  next();
}, adminRoutes);

// Add another test route for admin
app.get('/api/admin-test', (req, res) => {
  res.json({ message: 'Admin test route is working' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Connect to MongoDB
console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    const PORT = 3002; // Use a different port
    app.listen(PORT, () => {
      console.log(`Temporary server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 