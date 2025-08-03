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
exports.postToInstagram = postToInstagram;
exports.postToYouTube = postToYouTube;
exports.postToMultiplePlatforms = postToMultiplePlatforms;
exports.getPostingStats = getPostingStats;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const settings_1 = require("../db/settings");
const activityLog_1 = require("./activityLog");
/**
 * Post video to Instagram using Graph API
 */
async function postToInstagram(options) {
    var _a, _b;
    try {
        console.log('📸 Posting to Instagram...');
        const settings = await (0, settings_1.getSettings)();
        if (!settings.instagramToken || !settings.instagramAccount) {
            throw new Error('Instagram credentials not configured');
        }
        // Step 1: Create media container
        const formData = new URLSearchParams({
            image_url: options.videoUrl, // Instagram API uses image_url for videos too
            caption: options.caption,
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
        // Step 2: Wait for processing (Instagram needs time to process video)
        console.log('⏳ Waiting for Instagram to process video...');
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30 second wait
        // Step 3: Publish the media
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
        // Log to activity feed
        await (0, activityLog_1.saveToActivityLog)({
            platform: 'instagram',
            videoId: publishedId,
            thumbnailUrl: options.thumbnailUrl || '',
            timestamp: new Date(),
            caption: options.caption,
            status: 'success'
        });
        return {
            success: true,
            id: publishedId,
            platform: 'instagram',
            url: `https://www.instagram.com/p/${publishedId}/`
        };
    }
    catch (error) {
        console.error('❌ Instagram posting failed:', error);
        // Log failed posting to activity feed
        await (0, activityLog_1.saveToActivityLog)({
            platform: 'instagram',
            videoId: 'failed',
            thumbnailUrl: options.thumbnailUrl || '',
            timestamp: new Date(),
            caption: options.caption,
            status: 'failed',
            error: error.message
        });
        return {
            success: false,
            id: '',
            platform: 'instagram',
            error: error.message
        };
    }
}
/**
 * Post video to YouTube using YouTube Data API
 */
async function postToYouTube(options) {
    try {
        console.log('▶️ Posting to YouTube...');
        const settings = await (0, settings_1.getSettings)();
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
            const { updateSettings } = await Promise.resolve().then(() => __importStar(require('../db/settings')));
            await updateSettings({ youtubeToken: accessToken });
        }
        // Step 2: Download the video content
        const videoResponse = await axios_1.default.get(options.videoUrl, { responseType: 'stream' });
        // Step 3: Create form data for multipart upload
        const form = new form_data_1.default();
        // Video metadata
        const metadata = {
            snippet: {
                title: options.caption.substring(0, 100), // YouTube title limit
                description: options.caption,
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
            filename: `autopilot_${Date.now()}.mp4`,
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
        // Log to activity feed
        await (0, activityLog_1.saveToActivityLog)({
            platform: 'youtube',
            videoId: videoId,
            thumbnailUrl: '', // YouTube generates its own thumbnails
            timestamp: new Date(),
            caption: options.caption,
            status: 'success'
        });
        return {
            success: true,
            id: videoId,
            platform: 'youtube',
            url: `https://www.youtube.com/watch?v=${videoId}`
        };
    }
    catch (error) {
        console.error('❌ YouTube posting failed:', error);
        // Log failed posting to activity feed
        await (0, activityLog_1.saveToActivityLog)({
            platform: 'youtube',
            videoId: 'failed',
            thumbnailUrl: '',
            timestamp: new Date(),
            caption: options.caption,
            status: 'failed',
            error: error.message
        });
        return {
            success: false,
            id: '',
            platform: 'youtube',
            error: error.message
        };
    }
}
/**
 * Post to multiple platforms sequentially
 */
async function postToMultiplePlatforms(options, platforms) {
    const results = [];
    for (const platform of platforms) {
        try {
            if (platform === 'instagram') {
                const result = await postToInstagram(options);
                results.push(result);
            }
            else if (platform === 'youtube') {
                const result = await postToYouTube(options);
                results.push(result);
            }
            // Add delay between platform posts
            if (platforms.length > 1 && platform !== platforms[platforms.length - 1]) {
                console.log('⏳ Waiting 30 seconds before next platform...');
                await new Promise(resolve => setTimeout(resolve, 30000));
            }
        }
        catch (error) {
            console.error(`❌ Failed to post to ${platform}:`, error);
            results.push({
                success: false,
                id: '',
                platform,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    return results;
}
/**
 * Get posting statistics
 */
async function getPostingStats() {
    try {
        const { AutopilotLog } = await Promise.resolve().then(() => __importStar(require('../models/AutopilotLog')));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        // Today's posts
        const todayPosts = await AutopilotLog.aggregate([
            { $match: { type: 'post', status: 'success', startTime: { $gte: today } } },
            { $group: { _id: '$platform', count: { $sum: 1 } } }
        ]);
        // This week's posts
        const weekPosts = await AutopilotLog.aggregate([
            { $match: { type: 'post', status: 'success', startTime: { $gte: weekStart } } },
            { $group: { _id: '$platform', count: { $sum: 1 } } }
        ]);
        // Total posts
        const totalPosts = await AutopilotLog.aggregate([
            { $match: { type: 'post', status: 'success' } },
            { $group: { _id: '$platform', count: { $sum: 1 } } }
        ]);
        const formatStats = (stats) => {
            var _a, _b;
            return ({
                instagram: ((_a = stats.find(s => s._id === 'instagram')) === null || _a === void 0 ? void 0 : _a.count) || 0,
                youtube: ((_b = stats.find(s => s._id === 'youtube')) === null || _b === void 0 ? void 0 : _b.count) || 0
            });
        };
        return {
            today: formatStats(todayPosts),
            thisWeek: formatStats(weekPosts),
            total: formatStats(totalPosts)
        };
    }
    catch (error) {
        console.error('❌ Failed to get posting stats:', error);
        return {
            today: { instagram: 0, youtube: 0 },
            thisWeek: { instagram: 0, youtube: 0 },
            total: { instagram: 0, youtube: 0 }
        };
    }
}
