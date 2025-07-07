require('dotenv').config();
const express = require('express');
const adminRoutes = require('./routes/admin');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Mount the admin routes
app.use('/api/admin', adminRoutes);

// Add a simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test server is working' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    // Start server
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Test server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  }); 