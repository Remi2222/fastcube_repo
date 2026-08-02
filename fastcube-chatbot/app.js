require('dotenv').config();

const express = require('express');
const cors = require('cors');

const chatbotRoutes = require('./routes/chatbot.routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/chatbot', chatbotRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({
        success: true,
        service: 'FastCube Chatbot',
        status: 'running',
        timestamp: new Date().toISOString()
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route introuvable'
    });
});

module.exports = app;