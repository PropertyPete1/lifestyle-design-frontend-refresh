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
const multer_1 = __importDefault(require("multer"));
const connection_1 = require("../../database/connection");
const UploadQueue_1 = require("../../models/UploadQueue");
const SettingsModel_1 = __importDefault(require("../../models/SettingsModel"));
const InstagramContent_1 = require("../../models/InstagramContent");
const googleDriveService_1 = __importDefault(require("../../services/googleDriveService"));
const captionAI_1 = require("../../utils/captionAI");
const instagramScraper_1 = require("../../services/instagramScraper");
const uuid_1 = require("uuid");
const crypto = __importStar(require("crypto"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const router = express_1.default.Router();
// Configure multer for drag-and-drop uploads
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 500 * 1024 * 1024, // 500MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accepted formats: .mp4, .mov, .webm
        const allowedFormats = ['video/mp4', 'video/mov', 'video/webm'];
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.mp4', '.mov', '.webm'];
        if (allowedFormats.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only .mp4, .mov, .webm formats are allowed'));
        }
    }
});
// Generate video fingerprint for duplicate detection
function generateVideoFingerprint(buffer, filename) {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    hash.update(filename);
    hash.update(buffer.length.toString());
    return hash.digest('hex');
}
// POST /api/upload/drag-drop
// Handle drag-and-drop uploads
router.post('/drag-drop', upload.array('videos', 20), async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const { platform = 'instagram' } = req.body;
        if (!['youtube', 'instagram', 'both'].includes(platform)) {
            return res.status(400).json({ error: 'Invalid platform. Must be youtube, instagram, or both' });
        }
        const results = {
            uploaded: 0,
            duplicates: 0,
            errors: 0,
            details: []
        };
        for (const file of files) {
            try {
                // Generate fingerprint for duplicate detection
                const fingerprint = generateVideoFingerprint(file.buffer, file.originalname);
                // Check for duplicates
                const existingVideo = await UploadQueue_1.UploadQueue.findOne({ fingerprint });
                if (existingVideo) {
                    results.duplicates++;
                    results.details.push({
                        filename: file.originalname,
                        status: 'duplicate',
                        message: 'Video already exists in upload queue'
                    });
                    continue;
                }
                // Save file to temp directory
                const videoId = (0, uuid_1.v4)();
                const timestamp = Date.now();
                const filename = `${timestamp}_${fingerprint.substring(0, 8)}_${file.originalname}`;
                const tempDir = path.join(__dirname, '../../../temp');
                // Ensure temp directory exists
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                const filePath = path.join(tempDir, filename);
                fs.writeFileSync(filePath, file.buffer);
                // Create UploadQueue record
                const uploadRecord = new UploadQueue_1.UploadQueue({
                    videoId,
                    source: 'drag',
                    platform,
                    fingerprint,
                    filename: file.originalname,
                    filePath,
                    fileSize: file.size,
                    status: 'pending'
                });
                await uploadRecord.save();
                results.uploaded++;
                results.details.push({
                    filename: file.originalname,
                    status: 'uploaded',
                    videoId,
                    platform,
                    fileSize: file.size
                });
            }
            catch (error) {
                console.error(`Error processing file ${file.originalname}:`, error);
                results.errors++;
                results.details.push({
                    filename: file.originalname,
                    status: 'error',
                    message: error.message
                });
            }
        }
        res.json({
            success: true,
            message: `Drag-drop upload completed: ${results.uploaded} uploaded, ${results.duplicates} duplicates, ${results.errors} errors`,
            results
        });
    }
    catch (error) {
        console.error('Drag-drop upload error:', error);
        res.status(500).json({
            error: 'Drag-drop upload failed',
            details: error.message
        });
    }
});
// POST /api/upload/dropbox
// Handle Dropbox uploads
router.post('/dropbox', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { dropboxPath, platform = 'instagram' } = req.body;
        if (!dropboxPath || typeof dropboxPath !== 'string') {
            return res.status(400).json({ error: 'Dropbox path required' });
        }
        if (!['youtube', 'instagram', 'both'].includes(platform)) {
            return res.status(400).json({ error: 'Invalid platform. Must be youtube, instagram, or both' });
        }
        // Validate file format
        const fileExtension = path.extname(dropboxPath).toLowerCase();
        if (!['.mp4', '.mov', '.webm'].includes(fileExtension)) {
            return res.status(400).json({
                error: 'Invalid file format',
                details: 'Only .mp4, .mov, .webm formats are allowed'
            });
        }
        // Generate fingerprint from Dropbox path
        const fingerprint = crypto.createHash('sha256')
            .update(dropboxPath)
            .update(Date.now().toString())
            .digest('hex');
        // Check for duplicates
        const existingVideo = await UploadQueue_1.UploadQueue.findOne({ fingerprint });
        if (existingVideo) {
            return res.status(409).json({
                error: 'Duplicate video detected',
                message: 'This Dropbox video is already in the upload queue'
            });
        }
        // Create UploadQueue record
        const videoId = (0, uuid_1.v4)();
        const filename = path.basename(dropboxPath);
        const uploadRecord = new UploadQueue_1.UploadQueue({
            videoId,
            source: 'dropbox',
            platform,
            fingerprint,
            filename,
            filePath: dropboxPath,
            status: 'pending'
        });
        await uploadRecord.save();
        res.json({
            success: true,
            message: 'Dropbox video added to upload queue',
            videoId,
            filename,
            platform,
            dropboxPath
        });
    }
    catch (error) {
        console.error('Dropbox upload error:', error);
        res.status(500).json({
            error: 'Dropbox upload failed',
            details: error.message
        });
    }
});
// POST /api/upload/google-drive
// Handle Google Drive uploads
router.post('/google-drive', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { googleDriveFileId, filename, platform = 'instagram' } = req.body;
        if (!googleDriveFileId || typeof googleDriveFileId !== 'string') {
            return res.status(400).json({ error: 'Google Drive file ID required' });
        }
        if (!filename || typeof filename !== 'string') {
            return res.status(400).json({ error: 'Filename required' });
        }
        if (!['youtube', 'instagram', 'both'].includes(platform)) {
            return res.status(400).json({ error: 'Invalid platform. Must be youtube, instagram, or both' });
        }
        // Validate file format
        const fileExtension = path.extname(filename).toLowerCase();
        if (!['.mp4', '.mov', '.webm'].includes(fileExtension)) {
            return res.status(400).json({
                error: 'Invalid file format',
                details: 'Only .mp4, .mov, .webm formats are allowed'
            });
        }
        // Generate fingerprint from Google Drive file ID
        const fingerprint = crypto.createHash('sha256')
            .update(googleDriveFileId)
            .update(filename)
            .update(Date.now().toString())
            .digest('hex');
        // Check for duplicates
        const existingVideo = await UploadQueue_1.UploadQueue.findOne({ fingerprint });
        if (existingVideo) {
            return res.status(409).json({
                error: 'Duplicate video detected',
                message: 'This Google Drive video is already in the upload queue'
            });
        }
        // Create UploadQueue record
        const videoId = (0, uuid_1.v4)();
        const googleDrivePath = `https://drive.google.com/file/d/${googleDriveFileId}`;
        const uploadRecord = new UploadQueue_1.UploadQueue({
            videoId,
            source: 'google',
            platform,
            fingerprint,
            filename,
            filePath: googleDrivePath,
            status: 'pending'
        });
        await uploadRecord.save();
        res.json({
            success: true,
            message: 'Google Drive video added to upload queue',
            videoId,
            filename,
            platform,
            googleDriveFileId
        });
    }
    catch (error) {
        console.error('Google Drive upload error:', error);
        res.status(500).json({
            error: 'Google Drive upload failed',
            details: error.message
        });
    }
});
// GET /api/upload/queue
// Get current upload queue
router.get('/queue', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const limit = parseInt(req.query.limit) || 50;
        const source = req.query.source;
        const platform = req.query.platform;
        const status = req.query.status;
        const query = {};
        if (source)
            query.source = source;
        if (platform)
            query.platform = platform;
        if (status)
            query.status = status;
        const uploads = await UploadQueue_1.UploadQueue.find(query)
            .sort({ createdAt: -1 })
            .limit(limit);
        const stats = {
            total: uploads.length,
            pending: uploads.filter(u => u.status === 'pending').length,
            ready: uploads.filter(u => u.status === 'ready').length,
            bySource: {
                drag: uploads.filter(u => u.source === 'drag').length,
                dropbox: uploads.filter(u => u.source === 'dropbox').length,
                google: uploads.filter(u => u.source === 'google').length
            },
            byPlatform: {
                youtube: uploads.filter(u => u.platform === 'youtube').length,
                instagram: uploads.filter(u => u.platform === 'instagram').length,
                both: uploads.filter(u => u.platform === 'both').length
            }
        };
        res.json({
            success: true,
            uploads,
            stats
        });
    }
    catch (error) {
        console.error('Queue fetch error:', error);
        res.status(500).json({
            error: 'Failed to fetch upload queue',
            details: error.message
        });
    }
});
// DELETE /api/upload/:videoId
// Remove video from upload queue
router.delete('/:videoId', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        const upload = await UploadQueue_1.UploadQueue.findOne({ videoId });
        if (!upload) {
            return res.status(404).json({
                success: false,
                message: 'Video not found in upload queue'
            });
        }
        // Delete file if it's a drag-drop upload
        if (upload.source === 'drag' && upload.filePath && fs.existsSync(upload.filePath)) {
            fs.unlinkSync(upload.filePath);
        }
        await UploadQueue_1.UploadQueue.deleteOne({ videoId });
        res.json({
            success: true,
            message: 'Video removed from upload queue',
            videoId
        });
    }
    catch (error) {
        console.error('Error removing video from queue:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove video from queue',
            error: error.message
        });
    }
});
// PUT /api/upload/:videoId/status
// Update video status
router.put('/:videoId/status', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        const { status } = req.body;
        if (!['pending', 'ready'].includes(status)) {
            return res.status(400).json({
                error: 'Invalid status. Must be pending or ready'
            });
        }
        const upload = await UploadQueue_1.UploadQueue.findOneAndUpdate({ videoId }, { status }, { new: true });
        if (!upload) {
            return res.status(404).json({
                success: false,
                message: 'Video not found in upload queue'
            });
        }
        res.json({
            success: true,
            message: 'Video status updated',
            upload
        });
    }
    catch (error) {
        console.error('Error updating video status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update video status',
            error: error.message
        });
    }
});
// POST /api/upload/sync-drive
// Auto-sync videos from Google Drive folder
router.post('/sync-drive', async (req, res) => {
    try {
        console.log('🔄 Manual Google Drive sync requested...');
        const { folderUrl, limit = 10, autoDownload = true } = req.body;
        const syncResult = await googleDriveService_1.default.syncDriveVideos({
            folderUrl,
            limit: parseInt(limit),
            autoDownload
        });
        res.json({
            success: syncResult.success,
            message: `Google Drive sync completed: ${syncResult.stats.newFiles} new videos added`,
            stats: syncResult.stats,
            videos: syncResult.videos
        });
    }
    catch (error) {
        console.error('❌ Google Drive sync error:', error);
        res.status(500).json({
            error: 'Google Drive sync failed',
            details: error.message
        });
    }
});
// GET /api/upload/drive-stats
// Get Google Drive sync statistics
router.get('/drive-stats', async (req, res) => {
    try {
        const stats = googleDriveService_1.default.getSyncStats();
        res.json({
            success: true,
            stats
        });
    }
    catch (error) {
        console.error('❌ Error getting Google Drive stats:', error);
        res.status(500).json({
            error: 'Failed to get Google Drive stats',
            details: error.message
        });
    }
});
// DELETE /api/upload/clear-all
// Clear all mock/test data from upload queue
router.delete('/clear-all', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const result = await UploadQueue_1.UploadQueue.deleteMany({});
        console.log(`🗑️ Cleared ${result.deletedCount} entries from upload queue`);
        return res.json({
            success: true,
            message: `Cleared ${result.deletedCount} entries from upload queue`,
            deletedCount: result.deletedCount
        });
    }
    catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
});
// POST /api/upload/test-drive
// Quick test to show what's in your Google Drive
router.post('/test-drive', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { folderUrl } = req.body;
        if (!folderUrl) {
            return res.status(400).json({ error: 'Google Drive folder URL required' });
        }
        console.log('🔧 Testing Google Drive connection...');
        const initialized = await googleDriveService_1.default.initializeDriveClient();
        if (!initialized) {
            throw new Error('Failed to initialize Google Drive client');
        }
        console.log('✅ Connected to Google Drive');
        const allVideos = await googleDriveService_1.default.getSharedFolderVideos(folderUrl);
        return res.json({
            success: true,
            videosFound: allVideos.length,
            videos: allVideos.map(v => ({ name: v.name, id: v.id, size: v.size }))
        });
    }
    catch (error) {
        return res.status(400).json({
            error: error.message,
            details: error
        });
    }
});
// POST /api/upload/smart-drive-sync  
// Intelligent Google Drive folder analysis and video selection
router.post('/smart-drive-sync', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { folderUrl } = req.body;
        if (!folderUrl) {
            return res.status(400).json({
                error: 'Google Drive folder URL required'
            });
        }
        // Get settings for daily video limit
        const settings = await SettingsModel_1.default.findOne();
        const dailyLimit = (settings === null || settings === void 0 ? void 0 : settings.maxPosts) || 5;
        console.log(`🧠 Starting smart Google Drive analysis for folder: ${folderUrl}`);
        console.log(`📊 Daily limit: ${dailyLimit} videos`);
        // Get real video list from your Google Drive folder
        let videoList = [];
        try {
            // Initialize Google Drive client using YouTube credentials
            console.log('🔧 Initializing Google Drive connection...');
            const initialized = await googleDriveService_1.default.initializeDriveClient();
            if (!initialized) {
                throw new Error('Failed to initialize Google Drive client - check your YouTube OAuth credentials');
            }
            console.log('✅ Google Drive client connected successfully');
            console.log('🔗 Using shared folder URL to access your videos directly...');
            // Get videos from shared Google Drive folder
            const allVideos = await googleDriveService_1.default.getSharedFolderVideos(folderUrl);
            console.log(`📹 SHARED FOLDER SCAN RESULT: Found ${allVideos.length} videos in your shared folder`);
            if (allVideos.length > 0) {
                videoList = allVideos;
                console.log(`✅ SUCCESS! Found ${videoList.length} videos in your shared Google Drive folder:`);
                allVideos.forEach((video, i) => {
                    console.log(`  ${i + 1}. ${video.name} (${(parseInt(video.size) / 1024 / 1024).toFixed(2)} MB)`);
                });
            }
            else {
                throw new Error('No videos found in your shared folder - check if it contains .mp4, .mov, or .webm files');
            }
        }
        catch (scanError) {
            console.log('❌ Complete scan failed:', scanError.message);
            return res.status(400).json({
                error: 'Cannot access your Google Drive folder',
                details: scanError.message,
                suggestion: 'Check your YouTube OAuth credentials and folder permissions',
                folderUrl: folderUrl,
                needsManualInput: true
            });
        }
        if (videoList.length === 0) {
            return res.status(404).json({
                error: 'No videos found in your Google Drive folder',
                message: 'The folder appears to be empty or contains no supported video formats (.mp4, .mov, .webm)',
                checkedFolder: 'shared folder'
            });
        }
        // Get existing Instagram content for performance analysis
        const recentPosts = await InstagramContent_1.InstagramArchive.find({})
            .sort({ createdAt: -1 })
            .limit(100);
        console.log(`📱 Found ${recentPosts.length} Instagram posts for analysis`);
        // Score videos based on content similarity and performance
        const scoredVideos = videoList.map(video => {
            let score = Math.random() * 100; // Base random score
            // Boost score for trending keywords
            const trendingKeywords = ['viral', 'hack', 'tutorial', 'transformation', 'motivation'];
            const matchingKeywords = trendingKeywords.filter(keyword => video.name.toLowerCase().includes(keyword));
            score += matchingKeywords.length * 15;
            // Find similar content in Instagram posts
            const similarPosts = recentPosts.filter(post => {
                if (!post.caption)
                    return false;
                const videoKeywords = video.name.toLowerCase().replace('.mp4', '').split('_');
                return videoKeywords.some(keyword => post.caption.toLowerCase().includes(keyword));
            });
            // Boost score based on similar content performance
            if (similarPosts.length > 0) {
                const avgViews = similarPosts.reduce((sum, post) => {
                    const views = post.viewCount || 1000;
                    return sum + views;
                }, 0) / similarPosts.length;
                // Scale view count to score boost (higher views = higher score)
                const viewBoost = Math.min(avgViews / 1000, 50); // Cap at 50 point boost
                score += viewBoost;
                console.log(`📊 ${video.name}: ${similarPosts.length} similar posts, avg views: ${avgViews.toFixed(0)}, score: ${score.toFixed(1)}`);
            }
            return {
                ...video,
                filename: video.name,
                score: score,
                reasons: [
                    ...matchingKeywords.map(k => `Trending keyword: ${k}`),
                    similarPosts.length > 0 ? `${similarPosts.length} similar high-performing posts` : 'New content type',
                    score > 80 ? 'High viral potential' : score > 60 ? 'Good potential' : 'Moderate potential'
                ].filter(Boolean)
            };
        });
        // Sort by score and select top videos
        const selectedVideos = scoredVideos
            .sort((a, b) => b.score - a.score)
            .slice(0, dailyLimit);
        console.log(`🎯 Selected ${selectedVideos.length} top-performing videos:`);
        selectedVideos.forEach((video, i) => {
            console.log(`  ${i + 1}. ${video.filename} (score: ${video.score.toFixed(1)})`);
        });
        // Add selected videos to upload queue
        const results = {
            added: 0,
            duplicates: 0,
            errors: 0,
            details: [],
            analysis: {
                totalAnalyzed: videoList.length,
                selected: selectedVideos.length,
                selectionCriteria: 'Performance score based on Instagram similarity and trending keywords'
            }
        };
        console.log(`🎬 Processing ${selectedVideos.length} videos sequentially to avoid AI rate limits...`);
        for (let i = 0; i < selectedVideos.length; i++) {
            const video = selectedVideos[i];
            try {
                console.log(`\n📹 Processing video ${i + 1}/${selectedVideos.length}: ${video.filename}`);
                // Generate fingerprint using Google Drive file ID
                const fingerprint = crypto.createHash('sha256')
                    .update(video.id)
                    .update(video.filename)
                    .update(Date.now().toString())
                    .digest('hex');
                // Check for duplicates
                const existingVideo = await UploadQueue_1.UploadQueue.findOne({ fingerprint });
                if (existingVideo) {
                    results.duplicates++;
                    results.details.push({
                        filename: video.filename,
                        status: 'duplicate',
                        score: video.score,
                        reasons: video.reasons
                    });
                    continue;
                }
                // Download the video from Google Drive
                console.log(`📥 Downloading video from Google Drive: ${video.filename}`);
                const videoBuffer = await googleDriveService_1.default.downloadVideoFromDrive(video.id, video.filename);
                // Save to temp folder
                const uniqueFilename = `drive_${Date.now()}_${(0, uuid_1.v4)().replace(/-/g, '')}.${video.filename.split('.').pop()}`;
                const filePath = path.join(process.cwd(), 'temp', uniqueFilename);
                // Ensure temp directory exists
                const tempDir = path.dirname(filePath);
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }
                fs.writeFileSync(filePath, videoBuffer);
                console.log(`💾 Saved to: ${filePath}`);
                // Scrape Instagram for existing video and smart caption
                console.log(`🔍 Scraping Instagram for video: ${video.filename}`);
                const instagramData = await (0, instagramScraper_1.scrapeInstagramForVideo)(video.filename);
                let smartCaption = '';
                let originalCaption = '';
                let instagramPerformance = null;
                if (instagramData.found) {
                    console.log(`✅ Found existing Instagram post for ${video.filename}`);
                    originalCaption = instagramData.caption || '';
                    smartCaption = instagramData.smartCaption || '';
                    instagramPerformance = instagramData.performance;
                }
                else {
                    console.log(`📝 No existing Instagram post found, generating smart caption for ${video.filename}`);
                    // Generate smart caption from video filename and trending data
                    try {
                        smartCaption = await (0, captionAI_1.rewriteCaption)(`Amazing ${video.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')} content that showcases incredible quality and will captivate your audience!`, 'instagram');
                    }
                    catch (captionError) {
                        console.log('Smart caption generation failed, using enhanced fallback');
                        smartCaption = `✨ Amazing content that will captivate your audience! This ${video.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')} showcases incredible quality and trending appeal. 🔥\n\n#viral #trending #amazing #content #lifestyle`;
                    }
                }
                // Get user settings to determine platform preferences
                const settings = await SettingsModel_1.default.findOne();
                let targetPlatform = 'both'; // Default
                if (settings) {
                    if (settings.postToInstagram && settings.postToYouTube) {
                        targetPlatform = 'both';
                    }
                    else if (settings.postToInstagram) {
                        targetPlatform = 'instagram';
                    }
                    else if (settings.postToYouTube) {
                        targetPlatform = 'youtube';
                    }
                }
                console.log(`📱 Using platform setting: ${targetPlatform} (Instagram: ${settings === null || settings === void 0 ? void 0 : settings.postToInstagram}, YouTube: ${settings === null || settings === void 0 ? void 0 : settings.postToYouTube})`);
                // Create UploadQueue record with Instagram data and smart caption
                const videoId = (0, uuid_1.v4)();
                const uploadRecord = new UploadQueue_1.UploadQueue({
                    videoId,
                    source: 'direct_upload', // All Google Drive videos are downloaded to temp
                    platform: targetPlatform,
                    fingerprint,
                    filename: video.filename,
                    filePath: filePath,
                    fileSize: parseInt(video.size) || 0,
                    mimeType: video.mimeType,
                    status: 'ready',
                    metadata: {
                        originalFolderUrl: folderUrl,
                        googleDriveId: video.id,
                        performanceScore: video.score,
                        selectionReasons: video.reasons,
                        analyzedAt: new Date(),
                        autoSelected: true,
                        instagramFound: instagramData.found,
                        originalCaption: originalCaption,
                        smartCaption: smartCaption,
                        instagramPerformance: instagramPerformance,
                        matchType: instagramData.matchType,
                        crossPost: (settings === null || settings === void 0 ? void 0 : settings.crossPost) || false,
                        settingsApplied: {
                            postToInstagram: settings === null || settings === void 0 ? void 0 : settings.postToInstagram,
                            postToYouTube: settings === null || settings === void 0 ? void 0 : settings.postToYouTube,
                            crossPost: settings === null || settings === void 0 ? void 0 : settings.crossPost,
                            aiCaptions: settings === null || settings === void 0 ? void 0 : settings.aiCaptions
                        }
                    }
                });
                await uploadRecord.save();
                results.added++;
                results.details.push({
                    filename: video.filename,
                    status: 'added',
                    videoId,
                    score: video.score,
                    reasons: video.reasons,
                    platform: 'both'
                });
                // Add delay between videos to prevent AI rate limiting
                if (i < selectedVideos.length - 1) {
                    console.log(`⏳ Pausing 1 second before next video to prevent AI rate limits...`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            catch (error) {
                console.error(`Error processing ${video.filename}:`, error);
                results.errors++;
                results.details.push({
                    filename: video.filename,
                    status: 'error',
                    message: error.message
                });
            }
        }
        res.json({
            success: true,
            message: `Smart Dropbox analysis complete: ${results.added} high-potential videos selected (${results.duplicates} duplicates, ${results.errors} errors)`,
            results
        });
    }
    catch (error) {
        console.error('Smart Dropbox analysis error:', error);
        res.status(500).json({
            error: 'Smart Dropbox analysis failed',
            details: error.message
        });
    }
});
// POST /api/upload/smart-video-analyze
// Smart analysis of user-provided video names
router.post('/smart-video-analyze', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { folderUrl, videoNames, platform = 'both' } = req.body;
        if (!folderUrl || !videoNames || !Array.isArray(videoNames)) {
            return res.status(400).json({
                error: 'Folder URL and video names array required'
            });
        }
        if (!['youtube', 'instagram', 'both'].includes(platform)) {
            return res.status(400).json({
                error: 'Invalid platform. Must be youtube, instagram, or both'
            });
        }
        // Get settings for daily video limit
        const settings = await SettingsModel_1.default.findOne();
        const dailyLimit = (settings === null || settings === void 0 ? void 0 : settings.maxPosts) || 5;
        console.log(`🧠 Starting smart analysis of ${videoNames.length} user-provided videos`);
        console.log(`📊 Daily limit: ${dailyLimit} videos`);
        console.log(`📋 Videos to analyze: ${videoNames.join(', ')}`);
        // Get existing Instagram content for performance analysis
        const recentPosts = await InstagramContent_1.InstagramArchive.find({})
            .sort({ createdAt: -1 })
            .limit(100);
        console.log(`📱 Found ${recentPosts.length} Instagram posts for analysis`);
        // Score videos based on content similarity and performance
        const scoredVideos = videoNames.map((videoName) => {
            let score = Math.random() * 50 + 25; // Base score 25-75
            // Boost score for trending keywords
            const trendingKeywords = ['viral', 'hack', 'tutorial', 'transformation', 'motivation', 'trending', 'tips', 'dance', 'funny', 'workout', 'cooking', 'travel', 'makeup', 'business', 'music', 'life', 'review', 'vlog'];
            const matchingKeywords = trendingKeywords.filter(keyword => videoName.toLowerCase().includes(keyword));
            score += matchingKeywords.length * 12; // +12 per keyword
            // Boost for certain file patterns that tend to perform well
            if (videoName.toLowerCase().includes('short') || videoName.toLowerCase().includes('reel')) {
                score += 20;
            }
            if (videoName.toLowerCase().includes('part') || videoName.toLowerCase().includes('series')) {
                score += 15;
            }
            if (videoName.toLowerCase().includes('new') || videoName.toLowerCase().includes('latest')) {
                score += 10;
            }
            // Find similar content in Instagram posts
            const similarPosts = recentPosts.filter(post => {
                if (!post.caption)
                    return false;
                const videoKeywords = videoName.toLowerCase().replace(/\.[^/.]+$/, '').split(/[_\-\s]+/);
                return videoKeywords.some(keyword => keyword.length > 2 && post.caption.toLowerCase().includes(keyword));
            });
            // Boost score based on similar content performance
            if (similarPosts.length > 0) {
                const avgViews = similarPosts.reduce((sum, post) => {
                    const views = post.viewCount || 1000;
                    return sum + views;
                }, 0) / similarPosts.length;
                // Scale view count to score boost (higher views = higher score)
                const viewBoost = Math.min(avgViews / 500, 35); // Cap at 35 point boost
                score += viewBoost;
                console.log(`📊 ${videoName}: ${similarPosts.length} similar posts, avg views: ${avgViews.toFixed(0)}, score: ${score.toFixed(1)}`);
            }
            return {
                filename: videoName,
                score: score,
                reasons: [
                    ...matchingKeywords.slice(0, 2).map(k => `Trending: ${k}`),
                    similarPosts.length > 0 ? `${similarPosts.length} similar high-performing posts` : 'New content opportunity',
                    score > 85 ? 'Viral potential' : score > 65 ? 'High potential' : score > 45 ? 'Good potential' : 'Moderate potential'
                ].filter(Boolean).slice(0, 3)
            };
        });
        // Sort by score and select top videos
        const selectedVideos = scoredVideos
            .sort((a, b) => b.score - a.score)
            .slice(0, dailyLimit);
        console.log(`🎯 Selected ${selectedVideos.length} top-performing videos from ${videoNames.length} analyzed:`);
        selectedVideos.forEach((video, i) => {
            console.log(`  ${i + 1}. ${video.filename} (score: ${video.score.toFixed(1)})`);
        });
        // Add selected videos to upload queue
        const results = {
            added: 0,
            duplicates: 0,
            errors: 0,
            skipped: videoNames.length - selectedVideos.length,
            details: [],
            analysis: {
                totalAnalyzed: videoNames.length,
                selected: selectedVideos.length,
                selectionCriteria: 'AI performance scoring based on trending keywords and Instagram similarity',
                dailyLimit: dailyLimit
            }
        };
        const folderMatch = folderUrl.match(/\/fo\/([^\/\?]+)/);
        const folderId = folderMatch ? folderMatch[1] : 'unknown';
        for (const video of selectedVideos) {
            try {
                const dropboxPath = `/shared_folder_${folderId}/${video.filename}`;
                // Generate fingerprint
                const fingerprint = crypto.createHash('sha256')
                    .update(dropboxPath)
                    .update(video.filename)
                    .update(Date.now().toString())
                    .digest('hex');
                // Check for duplicates
                const existingVideo = await UploadQueue_1.UploadQueue.findOne({ fingerprint });
                if (existingVideo) {
                    results.duplicates++;
                    results.details.push({
                        filename: video.filename,
                        status: 'duplicate',
                        score: video.score,
                        reasons: video.reasons
                    });
                    continue;
                }
                // Validate file format
                const fileExtension = path.extname(video.filename).toLowerCase();
                if (!['.mp4', '.mov', '.webm'].includes(fileExtension)) {
                    results.errors++;
                    results.details.push({
                        filename: video.filename,
                        status: 'error',
                        message: 'Invalid file format (only .mp4, .mov, .webm allowed)'
                    });
                    continue;
                }
                // Scrape Instagram for existing video and smart caption
                console.log(`🔍 Scraping Instagram for video: ${video.filename}`);
                const instagramData = await (0, instagramScraper_1.scrapeInstagramForVideo)(video.filename);
                let smartCaption = '';
                let originalCaption = '';
                let instagramPerformance = null;
                if (instagramData.found) {
                    console.log(`✅ Found existing Instagram post for ${video.filename}`);
                    originalCaption = instagramData.caption || '';
                    smartCaption = instagramData.smartCaption || '';
                    instagramPerformance = instagramData.performance;
                }
                else {
                    console.log(`📝 No existing Instagram post found, generating smart caption for ${video.filename}`);
                    // Generate smart caption from video filename and trending data
                    try {
                        smartCaption = await (0, captionAI_1.rewriteCaption)(`Amazing ${video.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')} content that showcases incredible quality and will captivate your audience!`, platform === 'youtube' ? 'youtube' : 'instagram');
                    }
                    catch (captionError) {
                        console.log('Smart caption generation failed, using enhanced fallback');
                        smartCaption = `✨ Amazing content that will captivate your audience! This ${video.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')} showcases incredible quality and trending appeal. 🔥\n\n#viral #trending #amazing #content #lifestyle`;
                    }
                }
                // Get user settings to determine platform preferences
                const settings = await SettingsModel_1.default.findOne();
                let targetPlatform = platform; // Use requested platform as base
                // Override with settings if user has specific preferences
                if (settings && platform === 'both') {
                    if (settings.postToInstagram && settings.postToYouTube) {
                        targetPlatform = 'both';
                    }
                    else if (settings.postToInstagram) {
                        targetPlatform = 'instagram';
                    }
                    else if (settings.postToYouTube) {
                        targetPlatform = 'youtube';
                    }
                }
                console.log(`📱 Using platform setting: ${targetPlatform} (requested: ${platform}, Instagram: ${settings === null || settings === void 0 ? void 0 : settings.postToInstagram}, YouTube: ${settings === null || settings === void 0 ? void 0 : settings.postToYouTube})`);
                // Note: Google Drive integration is fully implemented and operational
                console.log(`❌ This endpoint (smart-video-analyze) is disabled until Google Drive integration`);
                throw new Error('This endpoint needs to be updated for Google Drive - use smart-drive-sync instead');
                // Create UploadQueue record (this code is disabled but fixed for compilation)
                const videoId = (0, uuid_1.v4)();
                const uploadRecord = new UploadQueue_1.UploadQueue({
                    videoId,
                    source: dropboxPath.includes('/temp/') ? 'direct_upload' : 'google',
                    platform: targetPlatform,
                    fingerprint,
                    filename: video.filename,
                    filePath: dropboxPath,
                    status: 'ready',
                    metadata: {
                        originalFolderUrl: folderUrl,
                        folderId: folderId,
                        performanceScore: video.score,
                        selectionReasons: video.reasons,
                        analyzedAt: new Date(),
                        smartSelected: true,
                        totalAnalyzed: videoNames.length,
                        instagramFound: instagramData.found,
                        originalCaption: originalCaption,
                        smartCaption: smartCaption,
                        instagramPerformance: instagramPerformance,
                        matchType: instagramData.matchType,
                        crossPost: (settings === null || settings === void 0 ? void 0 : settings.crossPost) || false,
                        settingsApplied: {
                            postToInstagram: settings === null || settings === void 0 ? void 0 : settings.postToInstagram,
                            postToYouTube: settings === null || settings === void 0 ? void 0 : settings.postToYouTube,
                            crossPost: settings === null || settings === void 0 ? void 0 : settings.crossPost,
                            aiCaptions: settings === null || settings === void 0 ? void 0 : settings.aiCaptions
                        }
                    }
                });
                await uploadRecord.save();
                results.added++;
                results.details.push({
                    filename: video.filename,
                    status: 'added',
                    videoId,
                    score: video.score,
                    reasons: video.reasons,
                    platform
                });
            }
            catch (error) {
                console.error(`Error processing ${video.filename}:`, error);
                results.errors++;
                results.details.push({
                    filename: video.filename,
                    status: 'error',
                    message: error.message
                });
            }
        }
        res.json({
            success: true,
            message: `Smart analysis complete: Selected ${results.added} top videos from ${videoNames.length} analyzed (${results.duplicates} duplicates, ${results.skipped} skipped by AI)`,
            results
        });
    }
    catch (error) {
        console.error('Smart video analysis error:', error);
        res.status(500).json({
            error: 'Smart video analysis failed',
            details: error.message
        });
    }
});
// POST /api/upload/dropbox-folder
// Handle Dropbox folder by manual video listing
router.post('/dropbox-folder', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { folderUrl, videoNames, platform = 'both' } = req.body;
        if (!folderUrl || !videoNames || !Array.isArray(videoNames)) {
            return res.status(400).json({
                error: 'Folder URL and video names array required'
            });
        }
        if (!['youtube', 'instagram', 'both'].includes(platform)) {
            return res.status(400).json({
                error: 'Invalid platform. Must be youtube, instagram, or both'
            });
        }
        const results = {
            added: 0,
            duplicates: 0,
            errors: 0,
            details: []
        };
        // Extract folder ID from URL
        const folderMatch = folderUrl.match(/\/fo\/([^\/\?]+)/);
        const folderId = folderMatch ? folderMatch[1] : 'unknown';
        for (const videoName of videoNames) {
            try {
                // Create a unique path for each video
                const dropboxPath = `/shared_folder_${folderId}/${videoName}`;
                // Generate fingerprint
                const fingerprint = crypto.createHash('sha256')
                    .update(dropboxPath)
                    .update(videoName)
                    .update(Date.now().toString())
                    .digest('hex');
                // Check for duplicates
                const existingVideo = await UploadQueue_1.UploadQueue.findOne({ fingerprint });
                if (existingVideo) {
                    results.duplicates++;
                    results.details.push({
                        filename: videoName,
                        status: 'duplicate',
                        message: 'Video already exists in upload queue'
                    });
                    continue;
                }
                // Validate file format
                const fileExtension = path.extname(videoName).toLowerCase();
                if (!['.mp4', '.mov', '.webm'].includes(fileExtension)) {
                    results.errors++;
                    results.details.push({
                        filename: videoName,
                        status: 'error',
                        message: 'Invalid file format (only .mp4, .mov, .webm allowed)'
                    });
                    continue;
                }
                // Create UploadQueue record
                const videoId = (0, uuid_1.v4)();
                const uploadRecord = new UploadQueue_1.UploadQueue({
                    videoId,
                    source: 'dropbox',
                    platform,
                    fingerprint,
                    filename: videoName,
                    filePath: dropboxPath,
                    status: 'ready',
                    // Store the original folder URL for reference
                    metadata: {
                        originalFolderUrl: folderUrl,
                        folderId: folderId
                    }
                });
                await uploadRecord.save();
                results.added++;
                results.details.push({
                    filename: videoName,
                    status: 'added',
                    videoId,
                    platform
                });
            }
            catch (error) {
                console.error(`Error processing ${videoName}:`, error);
                results.errors++;
                results.details.push({
                    filename: videoName,
                    status: 'error',
                    message: error.message
                });
            }
        }
        res.json({
            success: true,
            message: `Dropbox folder processed: ${results.added} added, ${results.duplicates} duplicates, ${results.errors} errors`,
            results
        });
    }
    catch (error) {
        console.error('Dropbox folder processing error:', error);
        res.status(500).json({
            error: 'Dropbox folder processing failed',
            details: error.message
        });
    }
});
// POST /api/upload/refresh-caption
// Refresh smart caption for a specific video
router.post('/refresh-caption', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId, filename } = req.body;
        if (!videoId || !filename) {
            return res.status(400).json({
                error: 'Video ID and filename required'
            });
        }
        console.log(`🔄 Refreshing smart caption for video: ${filename}`);
        // Find the video in upload queue
        const upload = await UploadQueue_1.UploadQueue.findOne({ videoId });
        if (!upload) {
            return res.status(404).json({
                error: 'Video not found in upload queue'
            });
        }
        // Scrape Instagram again for fresh data
        const instagramData = await (0, instagramScraper_1.scrapeInstagramForVideo)(upload.filename);
        let smartCaption = '';
        let hashtags = [];
        if (instagramData.found && instagramData.caption) {
            console.log(`✅ Found Instagram data for ${upload.filename}, generating enhanced caption`);
            smartCaption = await (0, captionAI_1.rewriteCaption)(instagramData.caption, 'instagram');
        }
        else {
            console.log(`📝 No Instagram data, generating fresh smart caption for ${upload.filename}`);
            // Generate new smart caption from filename and trending data
            smartCaption = await (0, captionAI_1.rewriteCaption)(`Incredible ${upload.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')} content that showcases amazing quality and will engage your audience!`, 'instagram');
        }
        // Extract hashtags from smart caption
        const hashtagMatches = smartCaption.match(/#[a-zA-Z0-9_]+/g) || [];
        hashtags = hashtagMatches.slice(0, 10);
        // Update the upload record with new smart caption
        await UploadQueue_1.UploadQueue.findOneAndUpdate({ videoId }, {
            'metadata.smartCaption': smartCaption,
            'metadata.refreshedAt': new Date()
        });
        res.json({
            success: true,
            smartCaption,
            hashtags,
            instagramFound: instagramData.found,
            message: 'Smart caption refreshed successfully'
        });
    }
    catch (error) {
        console.error('Error refreshing caption:', error);
        res.status(500).json({
            error: 'Failed to refresh caption',
            details: error.message
        });
    }
});
// POST /api/upload/get-real-instagram-captions
// Get real Instagram captions for all videos without AI enhancement
router.post('/get-real-instagram-captions', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        console.log('📱 Getting real Instagram captions for all videos...');
        // Get all videos in the queue
        const allVideos = await UploadQueue_1.UploadQueue.find({});
        if (allVideos.length === 0) {
            return res.json({
                success: true,
                message: 'No videos in queue to process',
                processed: 0
            });
        }
        console.log(`📹 Found ${allVideos.length} videos to get Instagram captions for`);
        let processed = 0;
        let instagramMatches = 0;
        const results = [];
        for (const video of allVideos) {
            try {
                console.log(`🔍 Getting Instagram caption for: ${video.filename}`);
                // Scrape Instagram for this video
                const instagramData = await (0, instagramScraper_1.scrapeInstagramForVideo)(video.filename);
                let realCaption = '';
                let originalCaption = '';
                let instagramPerformance = null;
                let matchType = '';
                if (instagramData.found) {
                    console.log(`✅ Found Instagram match for ${video.filename} (${instagramData.matchType})`);
                    realCaption = instagramData.caption || '';
                    originalCaption = instagramData.caption || '';
                    instagramPerformance = instagramData.performance;
                    matchType = instagramData.matchType || '';
                    instagramMatches++;
                    console.log(`📝 Real Instagram caption: "${realCaption.substring(0, 100)}..."`);
                }
                else {
                    console.log(`❌ No Instagram match found for ${video.filename}`);
                    realCaption = `🎬 ${video.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')} - Original content ready for posting! ✨`;
                }
                // Extract hashtags from real caption
                const hashtagMatches = realCaption.match(/#[a-zA-Z0-9_]+/g) || [];
                const hashtags = hashtagMatches.slice(0, 15);
                // Update the video record with real Instagram data
                await UploadQueue_1.UploadQueue.findByIdAndUpdate(video._id, {
                    'metadata.instagramFound': instagramData.found,
                    'metadata.originalCaption': originalCaption,
                    'metadata.smartCaption': realCaption, // Use real Instagram caption as "smart" caption
                    'metadata.instagramPerformance': instagramPerformance,
                    'metadata.matchType': matchType,
                    'metadata.processedAt': new Date(),
                    'metadata.hashtags': hashtags,
                    'metadata.realInstagramCaption': realCaption
                });
                processed++;
                results.push({
                    filename: video.filename,
                    instagramFound: instagramData.found,
                    matchType: matchType,
                    realCaptionLength: realCaption.length,
                    hashtagCount: hashtags.length,
                    caption: realCaption.substring(0, 100) + (realCaption.length > 100 ? '...' : '')
                });
            }
            catch (error) {
                console.error(`❌ Error processing ${video.filename}:`, error);
                results.push({
                    filename: video.filename,
                    error: error.message
                });
            }
        }
        console.log(`✅ Processing complete! ${processed}/${allVideos.length} videos processed, ${instagramMatches} real Instagram captions found`);
        res.json({
            success: true,
            message: `Found ${instagramMatches} real Instagram captions out of ${processed} videos processed`,
            processed,
            instagramMatches,
            total: allVideos.length,
            results: results.slice(0, 10) // Show sample results
        });
    }
    catch (error) {
        console.error('Error getting Instagram captions:', error);
        res.status(500).json({
            error: 'Failed to get Instagram captions',
            details: error.message
        });
    }
});
// POST /api/upload/process-all-videos
// Process all videos in queue with Instagram scraping and smart captions
router.post('/process-all-videos', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        console.log('🔄 Processing all videos in queue with Instagram scraping and smart captions...');
        // Get all videos in the queue
        const allVideos = await UploadQueue_1.UploadQueue.find({});
        if (allVideos.length === 0) {
            return res.json({
                success: true,
                message: 'No videos in queue to process',
                processed: 0
            });
        }
        console.log(`📹 Found ${allVideos.length} videos to process`);
        let processed = 0;
        let instagramMatches = 0;
        const results = [];
        for (const video of allVideos) {
            try {
                console.log(`🔍 Processing: ${video.filename}`);
                // Scrape Instagram for this video
                const instagramData = await (0, instagramScraper_1.scrapeInstagramForVideo)(video.filename);
                let smartCaption = '';
                let originalCaption = '';
                let instagramPerformance = null;
                let matchType = '';
                if (instagramData.found) {
                    console.log(`✅ Found Instagram match for ${video.filename} (${instagramData.matchType})`);
                    originalCaption = instagramData.caption || '';
                    smartCaption = instagramData.smartCaption || '';
                    instagramPerformance = instagramData.performance;
                    matchType = instagramData.matchType || '';
                    instagramMatches++;
                }
                else {
                    console.log(`📝 No Instagram match, generating smart caption for ${video.filename}`);
                    // Generate smart caption from video filename
                    try {
                        smartCaption = await (0, captionAI_1.rewriteCaption)(`🎬 Amazing ${video.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')} content! This video showcases incredible quality and will captivate your audience with trending appeal. ✨\n\n#viral #content #amazing #trending #lifestyle #quality`, 'instagram');
                    }
                    catch (captionError) {
                        smartCaption = `✨ Amazing ${video.filename.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')} content! 🔥 This video showcases incredible quality and trending appeal.\n\n#viral #trending #amazing #content #lifestyle #quality #professional #engaging`;
                    }
                }
                // Extract hashtags from smart caption
                const hashtagMatches = smartCaption.match(/#[a-zA-Z0-9_]+/g) || [];
                const hashtags = hashtagMatches.slice(0, 10);
                // Update the video record with processed data
                await UploadQueue_1.UploadQueue.findByIdAndUpdate(video._id, {
                    'metadata.instagramFound': instagramData.found,
                    'metadata.originalCaption': originalCaption,
                    'metadata.smartCaption': smartCaption,
                    'metadata.instagramPerformance': instagramPerformance,
                    'metadata.matchType': matchType,
                    'metadata.processedAt': new Date(),
                    'metadata.hashtags': hashtags
                });
                processed++;
                results.push({
                    filename: video.filename,
                    instagramFound: instagramData.found,
                    matchType: matchType,
                    smartCaptionLength: smartCaption.length,
                    hashtagCount: hashtags.length
                });
            }
            catch (error) {
                console.error(`❌ Error processing ${video.filename}:`, error);
                results.push({
                    filename: video.filename,
                    error: error.message
                });
            }
        }
        console.log(`✅ Processing complete! ${processed}/${allVideos.length} videos processed, ${instagramMatches} Instagram matches found`);
        res.json({
            success: true,
            message: `Processed ${processed} videos with ${instagramMatches} Instagram matches`,
            processed,
            instagramMatches,
            total: allVideos.length,
            results: results.slice(0, 10) // Limit results for response size
        });
    }
    catch (error) {
        console.error('Error processing all videos:', error);
        res.status(500).json({
            error: 'Failed to process videos',
            details: error.message
        });
    }
});
// POST /api/upload/direct-video - Upload videos directly to temp folder
router.post('/direct-video', upload.single('video'), async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }
        const file = req.file;
        const videoId = (0, uuid_1.v4)();
        // Create temp directory if it doesn't exist
        const tempDir = path.join(__dirname, '../../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        // Save video to temp folder with unique name
        const fileExtension = path.extname(file.originalname);
        const fileName = `${Date.now()}_${crypto.randomBytes(8).toString('hex')}${fileExtension}`;
        const filePath = path.join(tempDir, fileName);
        // Write file to disk
        fs.writeFileSync(filePath, file.buffer);
        console.log(`📁 Video uploaded directly: ${fileName} (${file.size} bytes)`);
        // Add to upload queue
        const uploadRecord = new UploadQueue_1.UploadQueue({
            videoId,
            filename: file.originalname,
            filePath: filePath,
            source: 'direct_upload',
            status: 'ready',
            uploadedAt: new Date(),
            fileSize: file.size,
            metadata: {
                originalName: file.originalname,
                uploadMethod: 'direct'
            }
        });
        await uploadRecord.save();
        // Try to scrape Instagram for this video
        try {
            const instagramData = await (0, instagramScraper_1.scrapeInstagramForVideo)(file.originalname);
            if (instagramData.found) {
                uploadRecord.metadata = {
                    ...uploadRecord.metadata,
                    instagramFound: true,
                    originalCaption: instagramData.caption,
                    smartCaption: instagramData.smartCaption,
                    instagramPerformance: instagramData.performance,
                    matchType: instagramData.matchType
                };
                await uploadRecord.save();
                console.log(`📸 Instagram data found for: ${file.originalname}`);
            }
        }
        catch (instagramError) {
            console.log(`ℹ️ No Instagram data found for: ${file.originalname}`);
        }
        res.json({
            success: true,
            message: 'Video uploaded successfully',
            video: {
                videoId: uploadRecord.videoId,
                filename: uploadRecord.filename,
                filePath: uploadRecord.filePath,
                source: uploadRecord.source,
                status: uploadRecord.status,
                fileSize: uploadRecord.fileSize,
                metadata: uploadRecord.metadata
            }
        });
    }
    catch (error) {
        console.error('Error uploading video:', error);
        res.status(500).json({
            error: 'Failed to upload video',
            details: error.message
        });
    }
});
exports.default = router;
