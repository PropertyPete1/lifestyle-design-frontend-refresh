"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Settings_1 = __importDefault(require("../../models/Settings"));
const connection_1 = require("../../database/connection");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
// Load settings from MongoDB
router.get('/load', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        // For single-tenant, use default user ID
        const userId = req.query.userId || 'default';
        let settings = await Settings_1.default.findOne({ userId });
        if (!settings) {
            // Create default settings if none exist
            settings = new Settings_1.default({ userId });
            await settings.save();
        }
        res.json(settings);
    }
    catch (error) {
        console.error('Failed to load settings:', error);
        res.status(500).json({ error: 'Failed to load settings' });
    }
});
// Save settings to MongoDB
router.post('/save', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const userId = req.body.userId || 'default';
        const settingsData = { ...req.body, userId };
        // Upsert settings (update if exists, create if not)
        const settings = await Settings_1.default.findOneAndUpdate({ userId }, settingsData, { upsert: true, new: true, runValidators: true });
        console.log('✅ Settings saved to MongoDB for user:', userId);
        res.json({ message: 'Settings saved successfully', settings });
    }
    catch (error) {
        console.error('Failed to save settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});
// Validate API keys and connections
router.get('/validate', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const userId = req.query.userId || 'default';
        const settings = await Settings_1.default.findOne({ userId });
        if (!settings) {
            return res.status(404).json({ error: 'Settings not found' });
        }
        const validationResults = {
            instagram: !!settings.instagramToken,
            youtube: !!settings.youtubeToken,
            dropbox: !!settings.dropboxToken,
            mongodb: mongoose_1.default.connection.readyState === 1,
            s3: !!(settings.s3AccessKey && settings.s3SecretKey && settings.s3BucketName),
            openai: !!settings.openaiApiKey,
            runway: !!settings.runwayApiKey
        };
        res.json({
            message: 'API validation completed',
            results: validationResults,
            allValid: Object.values(validationResults).every(Boolean)
        });
    }
    catch (error) {
        console.error('Failed to validate settings:', error);
        res.status(500).json({ error: 'Failed to validate settings' });
    }
});
// Test MongoDB connection
router.get('/test-mongodb', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        // Test by performing a simple operation
        const connectionState = mongoose_1.default.connection.readyState;
        const isConnected = connectionState === 1;
        if (isConnected) {
            // Test write operation
            await Settings_1.default.findOne().limit(1);
            res.json({
                success: true,
                message: 'MongoDB connection successful',
                connectionState: 'Connected'
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: 'MongoDB connection failed',
                connectionState: ['Disconnected', 'Connecting', 'Disconnecting'][connectionState] || 'Unknown'
            });
        }
    }
    catch (error) {
        console.error('MongoDB test failed:', error);
        res.status(500).json({
            success: false,
            message: 'MongoDB test failed',
            error: error.message
        });
    }
});
// Cleanup placeholder posts
router.delete('/cleanup', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        // Import models for cleanup
        const { VideoStatus } = await Promise.resolve().then(() => __importStar(require('../../models/VideoStatus')));
        const { RepostQueue } = await Promise.resolve().then(() => __importStar(require('../../models/RepostQueue')));
        const PostInsights = (await Promise.resolve().then(() => __importStar(require('../../models/PostInsights')))).default;
        let cleanupCount = 0;
        // Remove test/placeholder posts (posts with specific test patterns)
        const testPatterns = [
            /test/i,
            /placeholder/i,
            /sample/i,
            /demo/i
        ];
        // Clean up video statuses with test patterns
        for (const pattern of testPatterns) {
            const result = await VideoStatus.deleteMany({
                $or: [
                    { fileName: pattern },
                    { caption: pattern },
                    { title: pattern }
                ]
            });
            cleanupCount += result.deletedCount || 0;
        }
        // Clean up repost queue items with test patterns
        for (const pattern of testPatterns) {
            const result = await RepostQueue.deleteMany({
                $or: [
                    { fileName: pattern },
                    { caption: pattern }
                ]
            });
            cleanupCount += result.deletedCount || 0;
        }
        // Clean up old insights (older than 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        const oldInsights = await PostInsights.deleteMany({
            createdAt: { $lt: ninetyDaysAgo }
        });
        cleanupCount += oldInsights.deletedCount || 0;
        console.log(`🗑️ Cleanup completed: ${cleanupCount} items removed`);
        res.json({
            message: 'Cleanup completed successfully',
            itemsRemoved: cleanupCount
        });
    }
    catch (error) {
        console.error('Cleanup failed:', error);
        res.status(500).json({ error: 'Cleanup failed' });
    }
});
// Test upload endpoint
router.post('/test-upload', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        // Create a test video status entry
        const { VideoStatus } = await Promise.resolve().then(() => __importStar(require('../../models/VideoStatus')));
        const testData = {
            fileName: 'test-upload-' + Date.now() + '.mp4',
            filePath: '/test/uploads/test-video.mp4',
            title: 'Test Upload - ' + new Date().toISOString(),
            caption: 'This is a test upload to verify the system is working correctly.',
            status: 'uploaded',
            platform: 'test',
            isProcessed: true,
            metadata: {
                duration: 30,
                size: 1024000,
                format: 'mp4',
                test: true
            }
        };
        const testVideo = new VideoStatus(testData);
        await testVideo.save();
        console.log('📤 Test upload completed successfully');
        res.json({
            message: 'Test upload completed successfully',
            testVideoId: testVideo._id,
            data: testData
        });
    }
    catch (error) {
        console.error('Test upload failed:', error);
        res.status(500).json({ error: 'Test upload failed' });
    }
});
exports.default = router;
