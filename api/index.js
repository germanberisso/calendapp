const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes from server directory
const authRoutes = require('../server/routes/auth');
const shiftRoutes = require('../server/routes/shifts');
const taskRoutes = require('../server/routes/tasks');
const patternRoutes = require('../server/routes/patterns');

const app = express();

// CORS configuration
app.use(cors({
    origin: true,
    credentials: true
}));

app.use(express.json());

// MongoDB connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    cachedDb = connection;
    console.log('MongoDB Connected');
    return connection;
}

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/patterns', patternRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

// Export for Vercel serverless
module.exports = async (req, res) => {
    await connectToDatabase();
    return app(req, res);
};
