const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
const paymentRoutes = require('./routes/payment.routes');

// Connect to database
connectToDb();

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        // Allow all origins in development mode
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        const allowedOrigins = [
            'http://localhost:5173', 
            'http://localhost:5174',
            'https://mayank-murex.vercel.app',
            'https://mayank-5.onrender.com'
        ];
        // Allow requests with no origin (like mobile apps, curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Debug route
app.get('/debug', (req, res) => {
    res.status(200).json({
        status: 'ok',
        nodeEnv: process.env.NODE_ENV,
        headers: req.headers,
        cors: {
            allowedOrigins: [
                'http://localhost:5173', 
                'http://localhost:5174',
                'https://mayank-murex.vercel.app',
                'https://mayank-5.onrender.com'
            ],
            mode: process.env.NODE_ENV !== 'production' ? 'development' : 'production'
        },
        routes: {
            userRoutes: '/api/users',
            captainRoutes: '/api/captains',
            mapsRoutes: '/api/maps',
            rideRoutes: '/api/rides',
            paymentRoutes: '/api/payments'
        }
    });
});

// Test login route for debugging
app.post('/test-login', express.json(), (req, res) => {
    console.log('Test login request:', req.body);
    return res.status(200).json({
        success: true,
        message: 'Test login successful',
        receivedData: req.body
    });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/captains', captainRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ 
        message: 'Route not found',
        path: req.originalUrl,
        method: req.method,
        supportedRoutes: [
            '/health',
            '/debug',
            '/api/users/*',
            '/api/captains/*',
            '/api/maps/*',
            '/api/rides/*',
            '/api/payments/*'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;

