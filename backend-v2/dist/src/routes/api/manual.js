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
const connection_1 = require("../../database/connection");
const UploadQueue_1 = require("../../models/UploadQueue");
const VideoStatus_1 = require("../../models/VideoStatus");
const SettingsModel_1 = __importDefault(require("../../models/SettingsModel"));
const instagram_working_1 = require("../../uploaders/instagram_working");
const youtube_1 = require("../../uploaders/youtube");
const googleDriveService_1 = __importDefault(require("../../services/googleDriveService"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const router = express_1.default.Router();
// GET /api/manual/videos - Get all uploaded videos for manual posting
router.get('/videos', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        // Get uploaded videos from UploadQueue
        const uploadedVideos = await UploadQueue_1.UploadQueue.find({
            status: { $in: ['pending', 'ready'] }
        });
        // Get or create VideoStatus for each video
        const videosWithStatus = await Promise.all(uploadedVideos.map(async (upload) => {
            let videoStatus = await VideoStatus_1.VideoStatus.findOne({ uploadQueueId: upload._id });
            if (!videoStatus) {
                // Create new VideoStatus with default values
                videoStatus = new VideoStatus_1.VideoStatus({
                    videoId: upload.videoId,
                    uploadQueueId: upload._id,
                    filename: upload.filename || 'Unknown File',
                    platform: upload.platform,
                    originalCaption: `Amazing content from ${upload.filename}! 🔥✨`,
                    rewrittenCaptions: {
                        clickbait: `You WON'T BELIEVE What Happens Next! 🤯 ${upload.filename}`,
                        informational: `Complete guide to ${upload.filename} - Everything you need to know! 📚`,
                        emotional: `This ${upload.filename} changed my life forever... 💫❤️`
                    },
                    selectedCaption: `Amazing content from ${upload.filename}! 🔥✨`,
                    hashtags: [
                        '#lifestyle', '#motivation', '#inspiration', '#viral', '#trending',
                        '#success', '#goals', '#mindset', '#growth', '#transformation'
                    ],
                    currentAudio: 'Trending Beat #247',
                    availableAudios: [
                        'Trending Beat #247', 'Viral Melody Mix', 'Popular Piano Loop',
                        'Energetic Pop Track', 'Chill Vibes Original', 'Motivational Anthem'
                    ],
                    status: 'draft'
                });
                await videoStatus.save();
            }
            return {
                ...upload.toObject(),
                videoStatus: videoStatus.toObject(),
                thumbnail: getVideoThumbnail(upload.filename)
            };
        }));
        // Add Instagram view ranking and recommendations
        const rankedVideos = videosWithStatus.map(video => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            const instagramViews = ((_b = (_a = video.metadata) === null || _a === void 0 ? void 0 : _a.instagramPerformance) === null || _b === void 0 ? void 0 : _b.views) || 0;
            const instagramLikes = ((_d = (_c = video.metadata) === null || _c === void 0 ? void 0 : _c.instagramPerformance) === null || _d === void 0 ? void 0 : _d.likes) || 0;
            const instagramComments = ((_f = (_e = video.metadata) === null || _e === void 0 ? void 0 : _e.instagramPerformance) === null || _f === void 0 ? void 0 : _f.comments) || 0;
            const instagramScore = ((_h = (_g = video.metadata) === null || _g === void 0 ? void 0 : _g.instagramPerformance) === null || _h === void 0 ? void 0 : _h.score) || 0;
            // Calculate recommendation status based on Instagram performance
            let recommendationLevel = 'standard';
            let recommendationReason = '';
            if (instagramViews >= 10000) {
                recommendationLevel = 'highly_recommended';
                recommendationReason = `🚀 High Performance: ${instagramViews.toLocaleString()} views`;
            }
            else if (instagramViews >= 5000) {
                recommendationLevel = 'recommended';
                recommendationReason = `⭐ Good Performance: ${instagramViews.toLocaleString()} views`;
            }
            else if (instagramLikes >= 20) {
                recommendationLevel = 'highly_recommended';
                recommendationReason = `🔥 Top Engagement: ${instagramLikes} likes`;
            }
            else if (instagramLikes >= 15) {
                recommendationLevel = 'recommended';
                recommendationReason = `❤️ High Engagement: ${instagramLikes} likes`;
            }
            else if (instagramScore >= 500) {
                recommendationLevel = 'recommended';
                recommendationReason = `📊 Strong Score: ${instagramScore}`;
            }
            else if (instagramLikes >= 10) {
                recommendationLevel = 'recommended';
                recommendationReason = `👍 Good Engagement: ${instagramLikes} likes`;
            }
            // For videos with 0 views, use score and likes as fallback
            const rankingScore = instagramViews > 0 ?
                instagramViews * 10 + instagramLikes * 5 + instagramComments * 3 :
                instagramScore;
            return {
                ...video,
                instagramViews,
                rankingScore,
                recommendationLevel,
                recommendationReason,
                isHighPerformance: instagramViews >= 10000 || instagramLikes >= 15 || instagramScore >= 500
            };
        });
        // Sort by ranking score (highest first), then by creation date
        rankedVideos.sort((a, b) => {
            if (b.rankingScore !== a.rankingScore) {
                return b.rankingScore - a.rankingScore;
            }
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        res.json({
            success: true,
            videos: rankedVideos,
            analytics: {
                totalVideos: rankedVideos.length,
                highPerformance: rankedVideos.filter(v => v.isHighPerformance).length,
                withInstagramViews: rankedVideos.filter(v => v.instagramViews > 0).length,
                averageScore: rankedVideos.reduce((sum, v) => sum + v.rankingScore, 0) / rankedVideos.length || 0
            }
        });
    }
    catch (error) {
        console.error('Error fetching manual videos:', error);
        res.status(500).json({
            error: 'Failed to fetch videos',
            details: error.message
        });
    }
});
// PUT /api/manual/videos/:videoId - Update video settings
router.put('/videos/:videoId', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        const { selectedCaption, hashtags, currentAudio, platform, scheduledTime } = req.body;
        const videoStatus = await VideoStatus_1.VideoStatus.findOneAndUpdate({ videoId }, {
            selectedCaption,
            hashtags,
            currentAudio,
            platform,
            scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined
        }, { new: true });
        if (!videoStatus) {
            return res.status(404).json({
                error: 'Video not found'
            });
        }
        res.json({
            success: true,
            message: 'Video settings updated',
            videoStatus
        });
    }
    catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({
            error: 'Failed to update video',
            details: error.message
        });
    }
});
// POST /api/manual/post-now/:videoId - Post video immediately
router.post('/post-now/:videoId', async (req, res) => {
    var _a;
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        // Get video status and upload info
        const videoStatus = await VideoStatus_1.VideoStatus.findOne({ videoId });
        if (!videoStatus) {
            return res.status(404).json({ error: 'Video not found' });
        }
        const upload = await UploadQueue_1.UploadQueue.findById(videoStatus.uploadQueueId);
        if (!upload) {
            return res.status(404).json({ error: 'Upload record not found' });
        }
        if (!upload.filePath) {
            return res.status(400).json({ error: 'Video file path not found' });
        }
        const results = { success: true, posted: [], errors: [] };
        try {
            // Prepare video file path
            let videoFilePath = upload.filePath;
            // Handle different video sources
            if (upload.source === 'google') {
                console.log(`🔗 Downloading Google Drive video: ${upload.filePath}`);
                try {
                    // Extract file ID from Google Drive URL: https://drive.google.com/file/d/{fileId}
                    const fileIdMatch = (_a = upload.filePath) === null || _a === void 0 ? void 0 : _a.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                    if (!fileIdMatch) {
                        throw new Error(`Invalid Google Drive URL format: ${upload.filePath}`);
                    }
                    const fileId = fileIdMatch[1];
                    const videoBuffer = await googleDriveService_1.default.downloadVideoFromDrive(fileId, upload.filename || 'video.mp4');
                    // Save to temp file
                    const tempDir = path.join(__dirname, '../../../temp');
                    if (!fs.existsSync(tempDir)) {
                        fs.mkdirSync(tempDir, { recursive: true });
                    }
                    const tempFileName = `drive_${Date.now()}_${upload.filename}`;
                    videoFilePath = path.join(tempDir, tempFileName);
                    fs.writeFileSync(videoFilePath, videoBuffer);
                    console.log(`✅ Google Drive video downloaded to: ${videoFilePath}`);
                }
                catch (downloadError) {
                    return res.status(500).json({
                        error: 'Failed to download video from Google Drive',
                        details: downloadError.message
                    });
                }
            }
            else if (upload.source === 'direct_upload') {
                console.log(`📁 Using directly uploaded video: ${upload.filePath}`);
                // Video is already in temp folder, verify it exists
                if (!fs.existsSync(videoFilePath)) {
                    return res.status(404).json({
                        error: 'Video file not found',
                        details: `File ${videoFilePath} does not exist`
                    });
                }
                const stats = fs.statSync(videoFilePath);
                console.log(`📹 Direct upload video ready: ${upload.filename} (${stats.size} bytes)`);
            }
            // Post to selected platforms
            if (videoStatus.platform === 'instagram' || videoStatus.platform === 'both') {
                try {
                    const instagramId = await (0, instagram_working_1.uploadToInstagram)({
                        videoPath: videoFilePath,
                        caption: videoStatus.selectedCaption + '\n\n' + videoStatus.hashtags.join(' '),
                        audio: null // Let the system auto-select trending audio
                    });
                    results.posted.push({ platform: 'instagram', id: instagramId });
                    if (!videoStatus.postedUrls)
                        videoStatus.postedUrls = {};
                    videoStatus.postedUrls.instagram = instagramId;
                }
                catch (error) {
                    results.errors.push({ platform: 'instagram', error: error.message });
                }
            }
            if (videoStatus.platform === 'youtube' || videoStatus.platform === 'both') {
                try {
                    const youtubeId = await (0, youtube_1.uploadToYouTube)({
                        videoPath: videoFilePath,
                        title: videoStatus.selectedCaption,
                        audio: null // Let the system auto-select trending audio
                    });
                    results.posted.push({ platform: 'youtube', id: youtubeId });
                    if (!videoStatus.postedUrls)
                        videoStatus.postedUrls = {};
                    videoStatus.postedUrls.youtube = youtubeId;
                }
                catch (error) {
                    results.errors.push({ platform: 'youtube', error: error.message });
                }
            }
            // Clean up temp file if it was a Google Drive download
            if (upload.source === 'google' && videoFilePath !== upload.filePath) {
                try {
                    fs.unlinkSync(videoFilePath);
                    console.log(`🧹 Cleaned up temp file: ${videoFilePath}`);
                }
                catch (cleanupError) {
                    console.warn(`⚠️ Could not clean up temp file: ${cleanupError}`);
                }
            }
            // Update status
            videoStatus.status = results.posted.length > 0 ? 'posted' : 'failed';
            await videoStatus.save();
            res.json({
                ...results,
                message: results.posted.length > 0
                    ? `Successfully posted to ${results.posted.length} platform(s)`
                    : 'Failed to post to any platform'
            });
        }
        catch (error) {
            console.error('Post now error:', error);
            res.status(500).json({
                error: 'Posting failed',
                details: error.message
            });
        }
    }
    catch (error) {
        console.error('Post now error:', error);
        res.status(500).json({
            error: 'Failed to post video',
            details: error.message
        });
    }
});
// POST /api/manual/schedule/:videoId - Schedule video for later
router.post('/schedule/:videoId', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        const { scheduledTime } = req.body;
        if (!scheduledTime) {
            return res.status(400).json({ error: 'Scheduled time required' });
        }
        const videoStatus = await VideoStatus_1.VideoStatus.findOneAndUpdate({ videoId }, {
            scheduledTime: new Date(scheduledTime),
            status: 'scheduled'
        }, { new: true });
        if (!videoStatus) {
            return res.status(404).json({ error: 'Video not found' });
        }
        res.json({
            success: true,
            message: `Video scheduled for ${new Date(scheduledTime).toLocaleString()}`,
            videoStatus
        });
    }
    catch (error) {
        console.error('Schedule error:', error);
        res.status(500).json({
            error: 'Failed to schedule video',
            details: error.message
        });
    }
});
// POST /api/manual/refresh-caption/:videoId - Regenerate AI captions
router.post('/refresh-caption/:videoId', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        const videoStatus = await VideoStatus_1.VideoStatus.findOne({ videoId });
        if (!videoStatus) {
            return res.status(404).json({ error: 'Video not found' });
        }
        // Generate new AI captions using OpenAI
        const settings = await SettingsModel_1.default.findOne();
        if (!(settings === null || settings === void 0 ? void 0 : settings.openaiApi)) {
            return res.status(400).json({ error: 'OpenAI API key not configured' });
        }
        try {
            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${settings.openaiApi}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                            role: 'user',
                            content: `Generate 3 different caption styles for a video called "${videoStatus.filename}":

1. CLICKBAIT: Exciting, attention-grabbing, uses emojis, creates curiosity
2. INFORMATIONAL: Educational, clear, helpful, professional tone  
3. EMOTIONAL: Inspiring, personal, motivational, heartfelt

Rules:
- No dashes in any output
- Keep hooks and emojis
- Each caption should be 2-3 sentences max
- Include trending elements

Return as JSON with keys: clickbait, informational, emotional`
                        }],
                    max_tokens: 500,
                    temperature: 0.8
                })
            });
            if (!openaiResponse.ok) {
                const errorText = await openaiResponse.text();
                console.error('OpenAI API Error:', errorText);
                throw new Error(`OpenAI API request failed: ${openaiResponse.status} ${errorText}`);
            }
            const openaiData = await openaiResponse.json();
            if (!openaiData.choices || !openaiData.choices[0] || !openaiData.choices[0].message) {
                throw new Error('Invalid OpenAI response format');
            }
            let generatedCaptions;
            try {
                generatedCaptions = JSON.parse(openaiData.choices[0].message.content);
            }
            catch (parseError) {
                console.error('Failed to parse OpenAI response:', openaiData.choices[0].message.content);
                // Fallback to simple captions if parsing fails
                generatedCaptions = {
                    clickbait: `🔥 You won't believe this amazing property! ${videoStatus.filename}`,
                    informational: `Take a look at this beautiful property: ${videoStatus.filename}`,
                    emotional: `✨ This place has captured my heart! ${videoStatus.filename}`
                };
            }
            // Update video status with new captions
            videoStatus.rewrittenCaptions = {
                clickbait: generatedCaptions.clickbait || videoStatus.rewrittenCaptions.clickbait,
                informational: generatedCaptions.informational || videoStatus.rewrittenCaptions.informational,
                emotional: generatedCaptions.emotional || videoStatus.rewrittenCaptions.emotional
            };
            // Set the clickbait version as selected by default
            videoStatus.selectedCaption = generatedCaptions.clickbait || videoStatus.selectedCaption;
            await videoStatus.save();
            res.json({
                success: true,
                message: 'Captions refreshed successfully',
                captions: videoStatus.rewrittenCaptions
            });
        }
        catch (aiError) {
            console.error('AI caption generation failed:', aiError);
            res.status(500).json({
                error: 'Failed to generate new captions',
                details: aiError.message
            });
        }
    }
    catch (error) {
        console.error('Refresh caption error:', error);
        res.status(500).json({
            error: 'Failed to refresh captions',
            details: error.message
        });
    }
});
// POST /api/manual/refresh-audio/:videoId - Get new trending audio
router.post('/refresh-audio/:videoId', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        const videoStatus = await VideoStatus_1.VideoStatus.findOne({ videoId });
        if (!videoStatus) {
            return res.status(404).json({ error: 'Video not found' });
        }
        // Generate random trending audio
        const trendingAudios = [
            'Trending Beat #247', 'Viral Melody Mix', 'Popular Piano Loop',
            'Energetic Pop Track', 'Chill Vibes Original', 'Motivational Anthem',
            'Smooth Jazz Blend', 'Uplifting Acoustic', 'Electronic Dance Hit',
            'Indie Folk Vibes', 'Hip Hop Instrumental', 'Ambient Chill Track'
        ];
        const newAudio = trendingAudios[Math.floor(Math.random() * trendingAudios.length)];
        videoStatus.currentAudio = newAudio;
        videoStatus.availableAudios = trendingAudios;
        await videoStatus.save();
        res.json({
            success: true,
            message: `Audio updated to: ${newAudio}`,
            currentAudio: newAudio,
            availableAudios: trendingAudios
        });
    }
    catch (error) {
        console.error('Refresh audio error:', error);
        res.status(500).json({
            error: 'Failed to refresh audio',
            details: error.message
        });
    }
});
// GET /api/manual/video/:videoId/stream - Stream video for preview
router.get('/video/:videoId/stream', async (req, res) => {
    var _a;
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        // Find the upload record
        const upload = await UploadQueue_1.UploadQueue.findOne({ videoId });
        if (!upload || !upload.filePath) {
            return res.status(404).json({ error: 'Video not found' });
        }
        // Check if this is a directly uploaded video or if the file exists locally
        const isLocalFile = upload.source === 'direct_upload' || fs.existsSync(upload.filePath);
        if (isLocalFile && fs.existsSync(upload.filePath)) {
            // Stream local file directly
            console.log(`📁 Streaming local video: ${upload.filePath}`);
            const videoStats = fs.statSync(upload.filePath);
            res.set({
                'Content-Type': 'video/mp4',
                'Content-Length': videoStats.size.toString(),
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=3600'
            });
            const videoStream = fs.createReadStream(upload.filePath);
            videoStream.pipe(res);
        }
        else if (upload.source === 'google') {
            // For Google Drive videos, download and stream
            try {
                console.log(`🔗 Streaming Google Drive video: ${upload.filePath}`);
                // Extract file ID from Google Drive URL: https://drive.google.com/file/d/{fileId}
                const fileIdMatch = (_a = upload.filePath) === null || _a === void 0 ? void 0 : _a.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                if (!fileIdMatch) {
                    throw new Error(`Invalid Google Drive URL format: ${upload.filePath}`);
                }
                const fileId = fileIdMatch[1];
                const videoBuffer = await googleDriveService_1.default.downloadVideoFromDrive(fileId, upload.filename || 'video.mp4');
                res.set({
                    'Content-Type': 'video/mp4',
                    'Content-Length': videoBuffer.length.toString(),
                    'Accept-Ranges': 'bytes',
                    'Cache-Control': 'public, max-age=3600'
                });
                res.send(videoBuffer);
            }
            catch (downloadError) {
                console.error('Failed to stream Google Drive video:', downloadError);
                // Generate a simple video thumbnail instead
                const placeholder = await generateVideoPlaceholder(upload);
                res.set({
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache'
                });
                res.send(placeholder);
            }
        }
        else {
            // File not found anywhere
            return res.status(404).json({ error: 'Video file not found' });
        }
    }
    catch (error) {
        console.error('Video streaming error:', error);
        res.status(500).json({
            error: 'Failed to stream video',
            details: error.message
        });
    }
});
// Helper function to get video thumbnail
function getVideoThumbnail(filename) {
    const thumbnails = ['🎬', '📹', '🎥', '🌟', '✨', '🔥', '⚡', '🎯', '🚀', '💫'];
    const hash = filename.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
    return thumbnails[Math.abs(hash) % thumbnails.length];
}
// Generate SVG placeholder for video preview
async function generateVideoPlaceholder(upload) {
    var _a, _b;
    const emoji = getVideoThumbnail(upload.filename);
    const instagramBadge = ((_a = upload.metadata) === null || _a === void 0 ? void 0 : _a.instagramFound) ? '📸 Instagram' : '✨ Original';
    const matchType = ((_b = upload.metadata) === null || _b === void 0 ? void 0 : _b.matchType) || 'new';
    return `
    <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f4c75;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#bg)"/>
      
      <!-- Video icon -->
      <text x="200" y="80" text-anchor="middle" font-size="40" fill="white">${emoji}</text>
      
      <!-- Filename -->
      <text x="200" y="120" text-anchor="middle" font-size="12" fill="white" font-family="Arial">
        ${upload.filename.length > 30 ? upload.filename.substring(0, 30) + '...' : upload.filename}
      </text>
      
      <!-- Instagram badge -->
      <rect x="10" y="10" width="80" height="20" rx="10" fill="rgba(255,255,255,0.2)"/>
      <text x="50" y="23" text-anchor="middle" font-size="10" fill="white" font-family="Arial">
        ${instagramBadge}
      </text>
      
      <!-- Match type -->
      <rect x="310" y="10" width="80" height="20" rx="10" fill="rgba(255,255,255,0.1)"/>
      <text x="350" y="23" text-anchor="middle" font-size="10" fill="white" font-family="Arial">
        ${matchType}
      </text>
      
      <!-- Play button overlay -->
      <circle cx="200" cy="112" r="25" fill="rgba(255,255,255,0.3)"/>
      <polygon points="190,102 190,122 210,112" fill="white"/>
      
      <!-- Video preview unavailable text -->
      <text x="200" y="160" text-anchor="middle" font-size="11" fill="rgba(255,255,255,0.7)" font-family="Arial">
        Video Preview Loading...
      </text>
      <text x="200" y="180" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.5)" font-family="Arial">
        Full video available when posted
      </text>
    </svg>
  `;
}
// DELETE /api/manual/cleanup-old-dropbox - Remove old dropbox videos with placeholders
router.delete('/cleanup-old-dropbox', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        console.log(`ℹ️ Cleanup endpoint called - Dropbox integration has been replaced with Google Drive`);
        res.json({
            success: true,
            message: `Dropbox integration has been replaced with Google Drive - no cleanup needed`,
            removedCount: 0
        });
    }
    catch (error) {
        console.error('Error cleaning up old videos:', error);
        res.status(500).json({
            error: 'Failed to cleanup old videos',
            details: error.message
        });
    }
});
// GET /api/manual/thumbnail/:videoId - Generate video thumbnail as image
router.get('/thumbnail/:videoId', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const { videoId } = req.params;
        const upload = await UploadQueue_1.UploadQueue.findOne({ videoId });
        if (!upload) {
            return res.status(404).json({ error: 'Video not found' });
        }
        console.log(`🖼️ Thumbnail request for: ${upload.filename}`);
        // Generate a clean SVG thumbnail
        const filename = upload.filename.substring(0, 20) + (upload.filename.length > 20 ? '...' : '');
        const statusColor = upload.source === 'direct_upload' ? '#22c55e' : '#ef4444';
        const statusText = upload.source === 'direct_upload' ? 'Ready' : upload.source;
        const svgThumbnail = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#1a1a1a" rx="10"/>
  <circle cx="150" cy="80" r="20" fill="#333"/>
  <polygon points="140,70 140,90 160,80" fill="white"/>
  <text x="150" y="120" text-anchor="middle" fill="white" font-family="Arial" font-size="12">${filename}</text>
  <rect x="100" y="140" width="100" height="20" fill="${statusColor}" rx="10"/>
  <text x="150" y="153" text-anchor="middle" fill="white" font-family="Arial" font-size="10">${statusText}</text>
</svg>`;
        res.set({
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=3600'
        });
        res.send(svgThumbnail);
    }
    catch (error) {
        console.error('Error generating thumbnail:', error);
        res.status(500).json({ error: 'Thumbnail generation failed', details: error.message });
    }
});
exports.default = router;
