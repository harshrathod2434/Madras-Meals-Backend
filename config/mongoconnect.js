const mongoose = require('mongoose');

const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 45000,
        });

        return connection;
    } catch (error) {
        console.error('MongoDB Connection Error:', error);
        throw error;
    }
};

module.exports = connect; 