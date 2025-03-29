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
        // For development or testing environments, allow all origins
        if (!origin || process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:5174',
            'https://mayank-murex.vercel.app',
            'https://mayank-5.onrender.com',
            'https://graceful-chaja-df272e.netlify.app',
            'https://final-uber-6.onrender.com'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, origin);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Root path handler (as a fallback if no static file is found)
app.get('/', (req, res) => {
    // Try to send the static HTML first, fall back to JSON if that fails
    res.format({
        html: () => {
            res.sendFile(path.join(__dirname, 'public', 'index.html'));
        },
        json: () => {
            res.status(200).json({
                status: 'success',
                message: 'Uber Clone API Server is running',
                docs: 'Visit /debug for API information',
                health: 'Visit /health for server status',
                api: {
                    users: '/api/users',
                    captains: '/api/captains',
                    maps: '/api/maps',
                    rides: '/api/rides',
                    payments: '/api/payments'
                }
            });
        },
        default: () => {
            res.status(200).send('Uber Clone API Server is running');
        }
    });
});

// Favicon route
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // No content response for favicon requests
});

// Debug route
app.get('/debug', (req, res) => {
    res.status(200).json({
        status: 'ok',
        nodeEnv: process.env.NODE_ENV || 'not set',
        headers: req.headers,
        cors: {
            allowedOrigins: [
                'http://localhost:5173',
                'http://localhost:5174',
                'https://mayank-murex.vercel.app',
                'https://mayank-5.onrender.com',
                'https://graceful-chaja-df272e.netlify.app',
                'https://final-uber-6.onrender.com'
            ],
            developmentMode: process.env.NODE_ENV === 'development',
            mode: process.env.NODE_ENV || 'not set'
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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler - should be AFTER all other routes
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.originalUrl}`);
    
    // Respond based on the requested format
    res.format({
        html: () => {
            res.status(404).send(`
                <html>
                    <head>
                        <title>404 - Not Found</title>
                        <style>
                            body { font-family: sans-serif; text-align: center; margin-top: 50px; }
                            h1 { color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>404 - Page Not Found</h1>
                            <p>The page you're looking for doesn't exist.</p>
                            <a class="btn" href="/">Back to Home</a>
                        </div>
                    </body>
                </html>
            `);
        },
        json: () => {
            res.status(404).json({ 
                message: 'Route not found',
                path: req.originalUrl,
                method: req.method,
                supportedRoutes: [
                    '/',
                    '/health',
                    '/debug',
                    '/api/users/*',
                    '/api/captains/*',
                    '/api/maps/*',
                    '/api/rides/*',
                    '/api/payments/*'
                ]
            });
        },
        default: () => {
            res.status(404).send('404 - Not Found');
        }
    });
});

module.exports = app;

