/**
 * Backend v2 Server - Simplified version using only Mongoose
 */

require('dotenv/config');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3002;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'https://frontend-v2-sage.vercel.app',
    'https://lifestyle-design-social.vercel.app',
    'https://lifestyle-design-frontend-v2.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifestyle-design';
    await mongoose.connect(mongoUri);
    console.log('✅ [DATABASE] MongoDB connected successfully');
  } catch (error) {
    console.error('❌ [DATABASE] MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Simple ActivityLog schema
const activityLogSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['instagram', 'youtube', 'system'],
    required: true
  },
  type: {
    type: String,
    enum: ['post', 'error', 'protection', 'system', 'emergency_shutdown', 'schedule'],
    required: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending', 'blocked'],
    required: true
  },
  message: String,
  caption: String,
  scheduledAt: {
    type: Date,
    required: false
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// Autopilot Queue schema (using Mongoose instead of native MongoDB)
const autopilotQueueSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  caption: String,
  platform: {
    type: String,
    enum: ['instagram', 'youtube'],
    default: 'instagram'
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  insertedAt: {
    type: Date,
    default: Date.now
  }
});

const AutopilotQueue = mongoose.model('AutopilotQueue', autopilotQueueSchema);

// Settings endpoints
app.get('/api/settings', async (req, res) => {
  try {
    console.log('⚙️  [SETTINGS] GET request received');
    
    // Return mock settings for now - you can connect to real settings later
    const settings = {
      instagram: {
        accessToken: process.env.INSTAGRAM_ACCESS_TOKEN ? 'configured' : null,
        pageId: process.env.INSTAGRAM_PAGE_ID ? 'configured' : null
      },
      youtube: {
        clientId: process.env.YOUTUBE_CLIENT_ID ? 'configured' : null,
        clientSecret: process.env.YOUTUBE_CLIENT_SECRET ? 'configured' : null
      },
      s3: {
        accessKey: process.env.AWS_ACCESS_KEY_ID ? 'configured' : null,
        secretKey: process.env.AWS_SECRET_ACCESS_KEY ? 'configured' : null,
        bucket: process.env.AWS_S3_BUCKET ? 'configured' : null
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY ? 'configured' : null
      }
    };
    
    console.log('⚙️  [SETTINGS] Settings retrieved successfully');
    res.status(200).json({ success: true, settings });
    
  } catch (err) {
    console.error('[SETTINGS GET ERROR]', err);
    res.status(500).json({ 
      error: 'Failed to get settings',
      success: false 
    });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    console.log('⚙️  [SETTINGS] POST request received:', req.body);
    
    // For now, just acknowledge the settings were received
    // You can add actual settings storage to MongoDB later
    const { settings } = req.body;
    
    console.log('⚙️  [SETTINGS] Settings saved successfully');
    res.status(200).json({ 
      success: true, 
      message: 'Settings saved successfully',
      settings: settings 
    });
    
  } catch (err) {
    console.error('[SETTINGS POST ERROR]', err);
    res.status(500).json({ 
      error: 'Failed to save settings',
      success: false 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'backend-v2',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Smart scheduler function
const smartScheduler = async () => {
  const now = new Date();
  const scheduledDate = new Date(now);
  scheduledDate.setHours(scheduledDate.getHours() + 2); // Schedule 2 hours from now
  return scheduledDate;
};

// POST /api/autopost/run-now endpoint
app.post('/api/autopost/run-now', async (req, res) => {
  try {
    console.log('🔄 [RUN NOW TO QUEUE] Starting video queue process...');
    
    const { filename, caption, platform } = req.body;
    
    if (!filename) {
      return res.status(400).json({ error: 'filename is required', success: false });
    }
    
    // Use smart scheduler
    const scheduledAt = await smartScheduler();
    console.log('📅 [SMART SCHEDULER] Optimal time calculated:', scheduledAt.toLocaleString());

    // Create queue entry using Mongoose
    const queueEntry = new AutopilotQueue({
      filename,
      caption: caption || '',
      platform: platform || 'instagram',
      scheduledAt,
      status: 'pending'
    });
    
    const savedEntry = await queueEntry.save();
    console.log('📦 [QUEUE INSERT] Entry added to autopilot_queue:', savedEntry._id);
    
    // Also log to ActivityLog
    const activityEntry = new ActivityLog({
      platform: platform || 'instagram',
      type: 'schedule',
      status: 'pending',
      message: '✅ Video successfully queued via runNowToQueue',
      caption: caption || '',
      scheduledAt,
      metadata: {
        queueId: savedEntry._id,
        filename,
        scheduledBy: 'runNowToQueue'
      }
    });
    
    await activityEntry.save();
    console.log('✅ [RUN NOW TO QUEUE] Video queued successfully!');

    res.status(200).json({ 
      message: '✅ Video added to Smart Queue', 
      scheduledAt,
      queueId: savedEntry._id,
      success: true
    });
    
  } catch (err) {
    console.error('[RunNowToQueue ERROR]', err);
    res.status(500).json({ 
      error: 'Failed to queue video', 
      success: false,
      details: err.message
    });
  }
});

// GET /api/scheduler/status endpoint
app.get('/api/scheduler/status', async (req, res) => {
  try {
    console.log('📊 [SCHEDULER STATUS] Fetching queue status...');
    
    // Get all pending posts using Mongoose
    const queuedPosts = await AutopilotQueue.find({
      status: 'pending'
    }).sort({ scheduledAt: 1 }).exec();
    
    const totalQueued = queuedPosts.length;
    const nextOptimalTime = queuedPosts.length > 0 ? queuedPosts[0].scheduledAt : null;
    
    const queuedVideos = queuedPosts.slice(0, 10).map(post => ({
      filename: post.filename || 'unknown.mp4',
      captionPreview: post.caption ? 
        (post.caption.length > 50 ? post.caption.substring(0, 47) + '...' : post.caption) : 
        'No caption...',
      platform: post.platform || 'instagram',
      scheduledFor: post.scheduledAt
    }));
    
    const responseData = {
      nextOptimalTime,
      totalQueued,
      queuedVideos
    };
    
    console.log('📊 [SCHEDULER STATUS] Status retrieved:', responseData);
    res.status(200).json(responseData);
    
  } catch (err) {
    console.error('[SCHEDULER STATUS ERROR]', err);
    res.status(500).json({ 
      error: 'Failed to get scheduler status',
      nextOptimalTime: null,
      totalQueued: 0,
      queuedVideos: [],
      details: err.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    service: 'backend-v2',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ [SERVER ERROR]', err);
  res.status(500).json({
    error: 'Internal server error',
    service: 'backend-v2',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log('🚀 [SERVER] Backend v2 running on port', PORT);
    console.log('📋 [SERVER] Available endpoints:');
    console.log('   GET  /api/health - Health check');
    console.log('   GET  /api/settings - Get settings');
    console.log('   POST /api/settings - Save settings');
    console.log('   POST /api/autopost/run-now - Queue video for posting');
    console.log('   GET  /api/scheduler/status - Get queue status');
  });
};

startServer().catch(console.error);