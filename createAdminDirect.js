require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const adminData = {
  name: 'Admin User',
  email: 'admin@madrasmeals.com',
  password: 'adminPassword123',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date()
};

async function createAdmin() {
  let client;
  try {
    // Connect directly to MongoDB
    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB directly');
    
    const db = client.db('MadrasMeals');
    const usersCollection = db.collection('users');
    
    // Check if admin already exists
    const existingAdmin = await usersCollection.findOne({ email: adminData.email });
    
    if (existingAdmin) {
      console.log('Admin exists, deleting old admin...');
      await usersCollection.deleteOne({ email: adminData.email });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);
    
    // Create admin with hashed password
    const result = await usersCollection.insertOne({
      ...adminData,
      password: hashedPassword
    });
    
    console.log('Admin user created directly in database!');
    console.log(`ID: ${result.insertedId}`);
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
  }
}

createAdmin(); 