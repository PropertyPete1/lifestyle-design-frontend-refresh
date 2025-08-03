"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const environment_1 = require("./src/config/environment");
const connection_1 = require("./src/database/connection");
const autopilotScheduler_1 = require("./src/services/autopilotScheduler");
// Legacy schedulers removed - autopilot handles all scheduling
// Google Drive integration - no auto-sync scheduler needed
const index_1 = __importDefault(require("./src/routes/index"));
const app = (0, express_1.default)();
// CORS configuration for frontend-v2
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = environment_1.appConfig.get('corsOrigins');
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Handle preflight OPTIONS requests
app.options('*', (0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = environment_1.appConfig.get('corsOrigins');
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
// Middleware setup
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: false, limit: '50mb' }));
app.use((0, cookie_parser_1.default)());
// Serve temp files for Instagram video_url (temporary public access)
app.use('/temp', express_1.default.static('temp', {
    maxAge: '1h', // Cache for 1 hour
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET');
    }
}));
// Routes
app.use('/api', index_1.default);
// Error handling middleware
app.use((error, req, res, next) => {
    console.error('❌ Unhandled error:', error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
            status: error.status || 500
        }
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: {
            message: 'Not Found',
            status: 404,
            path: req.path
        }
    });
});
// Initialize database and start server
async function startServer() {
    try {
        // Connect to database
        console.log('🔌 Connecting to database...');
        await (0, connection_1.connectToDatabase)();
        // Start autopilot scheduler
        console.log('⏰ Starting autopilot scheduler...');
        autopilotScheduler_1.autopilotScheduler.start();
        // All scheduling now handled by the unified autopilot system
        console.log('✅ Backend-v2 clean autopilot system ready');
        // Google Drive integration ready
        console.log('🔗 Google Drive integration active via YouTube OAuth');
        // Start server
        const port = environment_1.appConfig.get('port');
        app.listen(port, () => {
            console.log('🚀 Backend-v2 server started');
            console.log(`📡 Server running on port ${port}`);
            console.log(`🌐 Environment: ${environment_1.appConfig.get('nodeEnv')}`);
            console.log('✅ Ready to serve frontend-v2!');
            console.log('🤖 Autopilot scheduler is running');
            console.log('🤖 Smart Post Scheduler is running (4 posts daily at optimal times)');
            console.log('📸 Instagram backup auto-posting is running (checks every 5 minutes)');
            console.log('🔗 Google Drive integration ready');
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    autopilotScheduler_1.autopilotScheduler.stop();
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    autopilotScheduler_1.autopilotScheduler.stop();
    process.exit(0);
});
// Start the server
startServer();
exports.default = app;
