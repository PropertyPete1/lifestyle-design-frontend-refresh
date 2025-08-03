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
exports.autopilotService = void 0;
const axios_1 = __importDefault(require("axios"));
const InstagramContent_1 = require("../models/InstagramContent");
const RepostQueue_1 = require("../models/RepostQueue");
const AutopilotLog_1 = require("../models/AutopilotLog");
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const trendingAudioService_1 = require("./trendingAudioService");
const uuid_1 = require("uuid");
const form_data_1 = __importDefault(require("form-data"));
class AutopilotService {
    constructor() {
        this.isRunning = false;
    }
    /**
     * Main autopilot execution
     */
    async runAutopilot() {
        if (this.isRunning) {
            throw new Error('Autopilot is already running');
        }
        this.isRunning = true;
        const runId = (0, uuid_1.v4)();
        const startTime = new Date();
        try {
            console.log(`🚀 Starting autopilot run ${runId}`);
            // Get settings
            const settings = await SettingsModel_1.default.findOne();
            if (!settings || !settings.autopilot) {
                throw new Error('Autopilot is disabled in settings');
            }
            const result = {
                runId,
                scraped: 0,
                queued: 0,
                posted: 0,
                errors: []
            };
            // Step 1: Scrape Instagram content
            try {
                console.log('📸 Step 1: Scraping Instagram content...');
                const scrapeResult = await this.scrapeInstagramContent(settings);
                result.scraped = scrapeResult.newPosts;
                await this.logActivity(runId, 'scrape', 'completed', {
                    postsProcessed: scrapeResult.totalProcessed,
                    postsSuccessful: scrapeResult.newPosts
                });
            }
            catch (error) {
                const errorMsg = `Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
                result.errors.push(errorMsg);
                await this.logActivity(runId, 'scrape', 'failed', { error: errorMsg });
            }
            // Step 2: Process eligible content for reposting
            try {
                console.log('🔄 Step 2: Processing content for repost queue...');
                const queueResult = await this.processRepostQueue(settings);
                result.queued = queueResult.queued;
                await this.logActivity(runId, 'schedule', 'completed', {
                    postsProcessed: queueResult.processed,
                    postsSuccessful: queueResult.queued
                });
            }
            catch (error) {
                const errorMsg = `Queue processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
                result.errors.push(errorMsg);
                await this.logActivity(runId, 'schedule', 'failed', { error: errorMsg });
            }
            // Step 3: Execute scheduled reposts
            try {
                console.log('📤 Step 3: Executing scheduled reposts...');
                const postResult = await this.executeScheduledPosts(settings);
                result.posted = postResult.posted;
                await this.logActivity(runId, 'repost', 'completed', {
                    postsProcessed: postResult.processed,
                    postsSuccessful: postResult.posted,
                    postsFailed: postResult.failed
                });
            }
            catch (error) {
                const errorMsg = `Reposting failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
                result.errors.push(errorMsg);
                await this.logActivity(runId, 'repost', 'failed', { error: errorMsg });
            }
            const endTime = new Date();
            const duration = endTime.getTime() - startTime.getTime();
            console.log(`✅ Autopilot run ${runId} completed in ${duration}ms`);
            console.log(`📊 Results: ${result.scraped} scraped, ${result.queued} queued, ${result.posted} posted`);
            return result;
        }
        catch (error) {
            console.error(`❌ Autopilot run ${runId} failed:`, error);
            throw error;
        }
        finally {
            this.isRunning = false;
        }
    }
    /**
     * Scrape Instagram content using Graph API - PHASE 9 AUTOPILOT SYSTEM
     */
    async scrapeInstagramContent(settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!settings.instagramToken || !settings.instagramAccount) {
            throw new Error('Instagram credentials not configured in app settings');
        }
        try {
            // Import the new scraping function
            const { scrapeInstagramPosts } = await Promise.resolve().then(() => __importStar(require('./scrapeInstagram')));
            // Get top-performing posts (>10k views)
            console.log('🔍 Scraping top-performing Instagram posts...');
            const topPosts = await scrapeInstagramPosts(settings.instagramToken, settings.instagramAccount);
            console.log(`📊 Found ${topPosts.length} high-performing posts (>10k views)`);
            // Import delay checking functions
            const { isRepostAllowed, markAsPosted } = await Promise.resolve().then(() => __importStar(require('./checkPostDelay')));
            // Process top-performing posts with delay checking
            let newPosts = 0;
            let processedPosts = 0;
            for (const post of topPosts) {
                processedPosts++;
                // Check 30-day repost delay
                const canRepost = await isRepostAllowed(post.id, 30);
                if (!canRepost) {
                    console.log(`⏳ Post ${post.id} was posted within 30 days, skipping...`);
                    continue;
                }
                // Check if already exists in database (deduplication)
                const exists = await InstagramContent_1.InstagramArchive.findOne({ igPostId: post.id });
                if (exists) {
                    console.log(`⏭️ Skipping existing post: ${post.id}`);
                    continue;
                }
                // Use the views from our filtered top posts (already extracted)
                const videoViews = post.views || 0;
                // Parse hashtags from caption
                const hashtags = this.extractHashtags(post.caption || '');
                // Calculate performance score (simplified for top posts)
                const performanceScore = this.calculatePerformanceScore(videoViews, 0, 0);
                // Create Instagram archive entry
                await InstagramContent_1.InstagramArchive.create({
                    igPostId: post.id,
                    caption: post.caption || '',
                    hashtags,
                    mediaUrl: post.url,
                    mediaType: 'VIDEO', // From our filter
                    postTime: new Date(post.timestamp),
                    viewCount: videoViews,
                    likeCount: 0, // Not available in simplified interface
                    commentCount: 0, // Not available in simplified interface
                    performanceScore,
                    repostEligible: true, // Already filtered for >10k views
                    scraped: true
                });
                newPosts++;
            }
            return { newPosts, totalProcessed: processedPosts };
        }
        catch (error) {
            console.error('❌ Instagram scraping failed:', error);
            // Provide helpful error messages
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 400) {
                if (((_c = (_b = error.response.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.code) === 190) {
                    throw new Error('Instagram access token is expired or invalid. Please refresh your Instagram token in the app settings.');
                }
                else if ((_f = (_e = (_d = error.response.data) === null || _d === void 0 ? void 0 : _d.error) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.includes('User does not exist')) {
                    throw new Error('Instagram account ID is invalid. Please use your numeric Instagram account ID (not email) in the app settings.');
                }
            }
            throw new Error(`Instagram API error: ${((_j = (_h = (_g = error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.error) === null || _j === void 0 ? void 0 : _j.message) || error.message}`);
        }
    }
    /**
     * Process eligible content and add to repost queue
     */
    async processRepostQueue(settings) {
        // Get eligible content that hasn't been queued yet
        const eligibleContent = await InstagramContent_1.InstagramArchive.find({
            mediaType: 'VIDEO',
            viewCount: { $gte: settings.minViews || 10000 },
            repostEligible: true
        }).sort({ performanceScore: -1 });
        let queued = 0;
        const maxPosts = settings.maxPosts || 3;
        for (const content of eligibleContent) {
            // Check if already in queue or has been posted before
            const inQueue = await RepostQueue_1.RepostQueue.findOne({ originalPostId: content.igPostId });
            if (inQueue) {
                console.log(`⏭️ Skipping ${content.igPostId} - already in queue or posted`);
                continue;
            }
            // Additional check for completed reposts to prevent duplicates
            const alreadyPosted = await RepostQueue_1.RepostQueue.findOne({
                originalPostId: content.igPostId,
                status: 'completed'
            });
            if (alreadyPosted) {
                console.log(`⏭️ Skipping ${content.igPostId} - already posted successfully`);
                continue;
            }
            // Respect daily post limit
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayQueued = await RepostQueue_1.RepostQueue.countDocuments({
                createdAt: { $gte: today },
                status: { $in: ['queued', 'processing', 'completed'] }
            });
            if (todayQueued >= maxPosts)
                break;
            // Generate AI caption
            const newCaption = await this.generateAICaption(content.caption, settings);
            // Get trending audio
            const audioId = await trendingAudioService_1.trendingAudioService.getRandomTrendingAudio('instagram');
            // Schedule post time
            const scheduledFor = this.calculateScheduleTime(settings);
            // Add to queue for both platforms if enabled
            if (settings.postToInstagram) {
                await RepostQueue_1.RepostQueue.create({
                    originalPostId: content.igPostId,
                    originalUrl: content.mediaUrl,
                    targetPlatform: 'instagram',
                    scheduledFor,
                    newCaption,
                    hashtags: await this.generateOptimizedHashtags(newCaption, 'instagram'),
                    audioId,
                    mediaUrl: content.mediaUrl
                });
                queued++;
            }
            if (settings.postToYouTube) {
                await RepostQueue_1.RepostQueue.create({
                    originalPostId: content.igPostId,
                    originalUrl: content.mediaUrl,
                    targetPlatform: 'youtube',
                    scheduledFor: new Date(scheduledFor.getTime() + 30 * 60 * 1000), // 30 mins after IG
                    newCaption,
                    hashtags: await this.generateOptimizedHashtags(newCaption, 'youtube'),
                    audioId: await trendingAudioService_1.trendingAudioService.getRandomTrendingAudio('youtube'),
                    mediaUrl: content.mediaUrl
                });
                queued++;
            }
            // Only queue one video per run to respect limits
            break;
        }
        return { queued, processed: eligibleContent.length };
    }
    /**
     * Execute scheduled posts that are due
     */
    async executeScheduledPosts(settings) {
        const now = new Date();
        const duePosts = await RepostQueue_1.RepostQueue.find({
            status: 'queued',
            scheduledFor: { $lte: now }
        }).sort({ scheduledFor: 1 });
        let posted = 0;
        let failed = 0;
        for (const post of duePosts) {
            try {
                post.status = 'processing';
                await post.save();
                // Download and post to target platform
                if (post.targetPlatform === 'instagram') {
                    await this.postToInstagram(post, settings);
                }
                else if (post.targetPlatform === 'youtube') {
                    await this.postToYouTube(post, settings);
                }
                // Save to Dropbox if enabled
                if (settings.dropboxSave && settings.dropboxToken) {
                    await this.saveToDropbox(post, settings);
                }
                post.status = 'completed';
                post.processedAt = new Date();
                await post.save();
                posted++;
            }
            catch (error) {
                console.error(`❌ Failed to post ${post._id}:`, error);
                post.status = 'failed';
                post.error = error instanceof Error ? error.message : 'Unknown error';
                await post.save();
                failed++;
            }
        }
        return { posted, failed, processed: duePosts.length };
    }
    /**
     * Get autopilot status and statistics
     */
    async getStatus() {
        const settings = await SettingsModel_1.default.findOne();
        const totalContent = await InstagramContent_1.InstagramArchive.countDocuments();
        const eligibleContent = await InstagramContent_1.InstagramArchive.countDocuments({
            repostEligible: true,
            viewCount: { $gte: 10000 }
        });
        const queueStats = await RepostQueue_1.RepostQueue.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const recentLogs = await AutopilotLog_1.AutopilotLog.find()
            .sort({ createdAt: -1 })
            .limit(5);
        return {
            isEnabled: (settings === null || settings === void 0 ? void 0 : settings.autopilot) || false,
            isRunning: this.isRunning,
            content: {
                total: totalContent,
                eligible: eligibleContent
            },
            queue: queueStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            recentActivity: recentLogs,
            settings: {
                maxPosts: (settings === null || settings === void 0 ? void 0 : settings.maxPosts) || 3,
                postTime: (settings === null || settings === void 0 ? void 0 : settings.postTime) || '14:00',
                repostDelay: (settings === null || settings === void 0 ? void 0 : settings.repostDelay) || 1
            }
        };
    }
    // Helper methods
    extractHashtags(caption) {
        const hashtags = caption.match(/#[a-zA-Z0-9_]+/g) || [];
        return hashtags.map(tag => tag.slice(1)); // Remove # symbol
    }
    calculatePerformanceScore(views, likes, comments) {
        return Math.round(views + (likes * 10) + (comments * 50));
    }
    async generateAICaption(originalCaption, settings) {
        if (!settings.openaiApi) {
            return originalCaption.replace(/-/g, ''); // Just strip dashes if no OpenAI
        }
        try {
            const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{
                        role: 'user',
                        content: `Rewrite this Instagram caption to be more engaging while keeping the core message. Remove all dashes (-). Keep it under 150 characters and maintain any existing hashtags:\n\n${originalCaption}`
                    }],
                max_tokens: 100,
                temperature: 0.7
            }, {
                headers: {
                    'Authorization': `Bearer ${settings.openaiApi}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content.trim();
        }
        catch (error) {
            console.error('❌ AI caption generation failed:', error);
            return originalCaption.replace(/-/g, ''); // Fallback to strip dashes
        }
    }
    async generateOptimizedHashtags(caption, platform) {
        // For now, return a mix of trending hashtags
        // This could be enhanced with real trending data
        const instagramTags = ['mindset', 'motivation', 'lifestyle', 'success', 'entrepreneur', 'inspiration', 'goals', 'hustle', 'grind', 'manifest'];
        const youtubeTags = ['shorts', 'viral', 'trending', 'fyp', 'motivation', 'success', 'lifestyle', 'mindset', 'tips', 'hack'];
        const baseTags = platform === 'instagram' ? instagramTags : youtubeTags;
        // Extract existing hashtags from caption
        const existingTags = this.extractHashtags(caption);
        // Combine and limit to 30 total
        const allTags = [...new Set([...existingTags, ...baseTags])];
        return allTags.slice(0, 30);
    }
    // Removed getTrendingAudio method - now using trendingAudioService
    calculateScheduleTime(settings) {
        const [hours, minutes] = (settings.postTime || '14:00').split(':').map(Number);
        const timezone = settings.timezone || 'America/Chicago'; // Default to Austin, Texas
        // Get current time in user's timezone
        const now = new Date();
        const userNow = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
        // Create scheduled time in user's timezone
        const scheduled = new Date();
        scheduled.setHours(hours, minutes, 0, 0);
        // Convert to user's timezone for comparison
        const scheduledUser = new Date(scheduled.toLocaleString("en-US", { timeZone: timezone }));
        // If time has passed today in user's timezone, schedule for tomorrow
        if (scheduledUser <= userNow) {
            scheduled.setDate(scheduled.getDate() + 1);
        }
        console.log(`🕐 Scheduling for ${hours}:${minutes.toString().padStart(2, '0')} ${timezone}`);
        console.log(`📅 Scheduled UTC time: ${scheduled.toISOString()}`);
        console.log(`📍 Local time: ${scheduled.toLocaleString("en-US", { timeZone: timezone })}`);
        return scheduled;
    }
    async postToInstagram(post, settings) {
        var _a, _b, _c;
        try {
            console.log(`📸 Posting to Instagram: ${post.originalPostId}`);
            if (!settings.instagramToken || !settings.instagramAccount) {
                throw new Error('Instagram credentials not configured');
            }
            // Step 1: Create media container using Facebook Graph API (like original backend)
            const formData = new URLSearchParams({
                image_url: post.mediaUrl, // Use image_url for videos too (Instagram API requirement)
                caption: `${post.newCaption}\n\n${post.hashtags.map((tag) => `#${tag}`).join(' ')}`,
                access_token: settings.instagramToken
            });
            const mediaResponse = await fetch(`https://graph.facebook.com/v18.0/${settings.instagramAccount}/media`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });
            if (!mediaResponse.ok) {
                const errorData = await mediaResponse.json();
                throw new Error(`Container creation failed: ${((_a = errorData.error) === null || _a === void 0 ? void 0 : _a.message) || 'Unknown error'}`);
            }
            const mediaData = await mediaResponse.json();
            const mediaId = mediaData.id;
            console.log(`📸 Instagram media container created: ${mediaId}`);
            // Step 3: Publish the media (simplified like original backend)
            const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${settings.instagramAccount}/media_publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    creation_id: mediaId,
                    access_token: settings.instagramToken
                })
            });
            if (!publishResponse.ok) {
                const errorData = await publishResponse.json();
                throw new Error(`Publish failed: ${((_b = errorData.error) === null || _b === void 0 ? void 0 : _b.message) || 'Unknown error'}`);
            }
            const publishData = await publishResponse.json();
            const publishedId = publishData.id;
            console.log(`✅ Instagram post published successfully: ${publishedId}`);
            // Store the published post ID for tracking
            post.publishedInstagramId = publishedId;
            // Mark as posted for 30-day delay tracking
            const { markAsPosted } = await Promise.resolve().then(() => __importStar(require('./checkPostDelay')));
            await markAsPosted(post.originalPostId);
            console.log(`📝 Marked post ${post.originalPostId} as posted for delay tracking`);
        }
        catch (error) {
            console.error(`❌ Instagram posting failed for ${post.originalPostId}:`, error);
            console.error('📝 Instagram API Error Details:', ((_c = error.response) === null || _c === void 0 ? void 0 : _c.data) || 'No response data');
            throw error;
        }
    }
    async postToYouTube(post, settings) {
        var _a;
        try {
            console.log(`▶️ Posting to YouTube: ${post.originalPostId}`);
            if (!settings.youtubeRefresh || !settings.youtubeClientId || !settings.youtubeClientSecret) {
                throw new Error('YouTube credentials not configured');
            }
            // Step 1: Refresh access token if needed
            let accessToken = settings.youtubeToken;
            try {
                // Test current token
                await axios_1.default.get('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
            }
            catch (tokenError) {
                // Token expired, refresh it
                console.log('🔄 Refreshing YouTube access token...');
                const refreshResponse = await axios_1.default.post('https://oauth2.googleapis.com/token', {
                    client_id: settings.youtubeClientId,
                    client_secret: settings.youtubeClientSecret,
                    refresh_token: settings.youtubeRefresh,
                    grant_type: 'refresh_token'
                });
                accessToken = refreshResponse.data.access_token;
                // Update settings with new token
                await SettingsModel_1.default.findOneAndUpdate({}, { youtubeToken: accessToken });
            }
            // Step 2: Download the video content
            const videoResponse = await axios_1.default.get(post.mediaUrl, { responseType: 'stream' });
            // Step 3: Create form data for multipart upload
            const form = new form_data_1.default();
            // Video metadata
            const metadata = {
                snippet: {
                    title: post.newCaption.substring(0, 100), // YouTube title limit
                    description: `${post.newCaption}\n\n${post.hashtags.map((tag) => `#${tag}`).join(' ')}`,
                    tags: post.hashtags,
                    categoryId: '22', // People & Blogs category
                    defaultLanguage: 'en'
                },
                status: {
                    privacyStatus: 'public',
                    selfDeclaredMadeForKids: false
                }
            };
            form.append('part', 'snippet,status');
            form.append('metadata', JSON.stringify(metadata), {
                contentType: 'application/json'
            });
            form.append('media', videoResponse.data, {
                filename: `${post.originalPostId}.mp4`,
                contentType: 'video/mp4'
            });
            // Step 4: Upload to YouTube
            const uploadResponse = await axios_1.default.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart', form, {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${accessToken}`
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            });
            const videoId = uploadResponse.data.id;
            console.log(`✅ YouTube video uploaded successfully: ${videoId}`);
            // Store the published video ID for tracking
            post.publishedYouTubeId = videoId;
            // Mark as posted for 30-day delay tracking
            const { markAsPosted } = await Promise.resolve().then(() => __importStar(require('./checkPostDelay')));
            await markAsPosted(post.originalPostId);
            console.log(`📝 Marked post ${post.originalPostId} as posted for delay tracking`);
        }
        catch (error) {
            console.error(`❌ YouTube posting failed for ${post.originalPostId}:`, error);
            console.error('📝 YouTube API Error Details:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || 'No response data');
            throw error;
        }
    }
    async saveToDropbox(post, settings) {
        try {
            console.log(`💾 Saving to Dropbox: ${post.originalPostId}`);
            if (!settings.dropboxToken) {
                throw new Error('Dropbox token not configured');
            }
            // Import Dropbox SDK
            const { Dropbox } = require('dropbox');
            const dbx = new Dropbox({ accessToken: settings.dropboxToken });
            // Step 1: Download the video content
            const videoResponse = await axios_1.default.get(post.mediaUrl, { responseType: 'arraybuffer' });
            const videoBuffer = Buffer.from(videoResponse.data);
            // Step 2: Create filename with timestamp and caption snippet
            const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const captionSnippet = post.newCaption.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
            const filename = `${timestamp}_${captionSnippet}_${post.originalPostId}.mp4`;
            const dropboxPath = `${settings.dropboxFolder || '/Autopilot_Posts'}/${filename}`;
            // Step 3: Upload to Dropbox
            const uploadResponse = await dbx.filesUpload({
                path: dropboxPath,
                contents: videoBuffer,
                mode: 'add',
                autorename: true
            });
            console.log(`✅ Dropbox upload successful: ${uploadResponse.result.path_display}`);
            // Step 4: Create a shareable link
            try {
                const shareResponse = await dbx.sharingCreateSharedLinkWithSettings({
                    path: uploadResponse.result.path_lower,
                    settings: {
                        requested_visibility: 'public'
                    }
                });
                post.dropboxPath = uploadResponse.result.path_display;
                post.dropboxUrl = shareResponse.result.url;
                console.log(`🔗 Dropbox share link created: ${shareResponse.result.url}`);
            }
            catch (shareError) {
                // If sharing fails, still save the path
                post.dropboxPath = uploadResponse.result.path_display;
                console.log(`⚠️ Dropbox upload successful but sharing failed: ${shareError}`);
            }
            // Step 5: Save metadata file with post info
            const metadataContent = JSON.stringify({
                originalPostId: post.originalPostId,
                platform: post.targetPlatform,
                caption: post.newCaption,
                hashtags: post.hashtags,
                scheduledFor: post.scheduledFor,
                processedAt: new Date(),
                publishedInstagramId: post.publishedInstagramId,
                publishedYouTubeId: post.publishedYouTubeId,
                videoUrl: post.mediaUrl
            }, null, 2);
            const metadataPath = `${settings.dropboxFolder || '/Autopilot_Posts'}/metadata_${filename}.json`;
            await dbx.filesUpload({
                path: metadataPath,
                contents: metadataContent,
                mode: 'add',
                autorename: true
            });
            console.log(`📝 Metadata saved to Dropbox: ${metadataPath}`);
        }
        catch (error) {
            console.error(`❌ Dropbox backup failed for ${post.originalPostId}:`, error);
            // Don't throw error for Dropbox backup failure - it shouldn't stop the posting process
            post.dropboxError = error instanceof Error ? error.message : 'Unknown Dropbox error';
        }
    }
    async logActivity(runId, type, status, details = {}) {
        await AutopilotLog_1.AutopilotLog.create({
            runId,
            type,
            status,
            ...details,
            startTime: new Date(),
            endTime: new Date(),
            duration: 0
        });
    }
    /**
     * Force post all queued videos immediately (for testing)
     */
    async forcePostAll() {
        const runId = require('crypto').randomUUID();
        console.log(`🚀 Force posting all queued videos (runId: ${runId})...`);
        try {
            // Get settings
            const settings = await SettingsModel_1.default.findOne({});
            if (!settings) {
                throw new Error('Settings not found');
            }
            // Get all queued posts (ignore schedule time for force posting)
            const queuedPosts = await RepostQueue_1.RepostQueue.find({
                status: 'queued'
            }).sort({ priority: 1, scheduledFor: 1 });
            console.log(`📋 Found ${queuedPosts.length} queued videos to post immediately`);
            let posted = 0;
            let failed = 0;
            const errors = [];
            for (const post of queuedPosts) {
                try {
                    post.status = 'processing';
                    await post.save();
                    // Post to target platform
                    if (post.targetPlatform === 'instagram') {
                        await this.postToInstagram(post, settings);
                        console.log(`✅ Posted to Instagram: ${post.originalPostId}`);
                    }
                    else if (post.targetPlatform === 'youtube') {
                        await this.postToYouTube(post, settings);
                        console.log(`✅ Posted to YouTube: ${post.originalPostId}`);
                    }
                    // Save to Dropbox if enabled
                    if (settings.dropboxSave && settings.dropboxToken) {
                        await this.saveToDropbox(post, settings);
                    }
                    post.status = 'completed';
                    post.postedAt = new Date();
                    await post.save();
                    posted++;
                    // Log successful posting
                    await this.logActivity(runId, 'post', 'completed', {
                        platform: post.targetPlatform,
                        postId: post.originalPostId
                    });
                }
                catch (error) {
                    console.error(`❌ Failed to post ${post.originalPostId}:`, error);
                    post.status = 'failed';
                    await post.save();
                    failed++;
                    const errorMsg = `${post.targetPlatform} posting failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
                    errors.push(errorMsg);
                    // Log failed posting
                    await this.logActivity(runId, 'post', 'failed', {
                        platform: post.targetPlatform,
                        postId: post.originalPostId,
                        error: errorMsg
                    });
                }
            }
            const result = {
                posted,
                failed,
                processed: queuedPosts.length,
                errors
            };
            console.log(`🎯 Force posting completed: ${posted} posted, ${failed} failed`);
            // Log overall run
            await this.logActivity(runId, 'force_post', 'completed', result);
            return result;
        }
        catch (error) {
            console.error('❌ Force posting failed:', error);
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            await this.logActivity(runId, 'force_post', 'failed', { error: errorMsg });
            throw error;
        }
    }
}
exports.autopilotService = new AutopilotService();
