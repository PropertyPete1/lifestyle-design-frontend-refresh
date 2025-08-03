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
exports.getVideosFromInstagram = getVideosFromInstagram;
exports.wasPostedRecently = wasPostedRecently;
exports.markAsPosted = markAsPosted;
exports.getScrapingStats = getScrapingStats;
const axios_1 = __importDefault(require("axios"));
const InstagramContent_1 = require("../models/InstagramContent");
/**
 * Instagram Content Scraping Service
 * Handles fetching and filtering video content from Instagram Graph API
 */
/**
 * Get videos from Instagram using Graph API
 */
async function getVideosFromInstagram() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    try {
        // Import settings to get Instagram credentials
        const { getSettings } = await Promise.resolve().then(() => __importStar(require('../db/settings')));
        const settings = await getSettings();
        if (!settings.instagramToken || !settings.instagramAccount) {
            throw new Error('Instagram credentials not configured in settings');
        }
        console.log('📸 Fetching videos from Instagram Graph API...');
        // Get media from Instagram Business Account with comprehensive insights
        const mediaResponse = await axios_1.default.get(`https://graph.facebook.com/v18.0/${settings.instagramAccount}/media`, {
            params: {
                fields: 'id,media_type,media_url,caption,timestamp,insights.metric(reach,impressions,engagement,likes,comments,plays,video_views)',
                access_token: settings.instagramToken,
                limit: 50 // Get more posts to have better selection
            }
        });
        const posts = mediaResponse.data.data;
        console.log(`📊 Retrieved ${posts.length} posts from Instagram`);
        // Filter for video content and transform to VideoPost format
        const videos = [];
        for (const post of posts) {
            if (post.media_type === 'VIDEO' || post.media_type === 'CAROUSEL_ALBUM') {
                try {
                    // Extract comprehensive insights data
                    let reach = 0;
                    let impressions = 0;
                    let engagement = 0;
                    let likes = 0;
                    let comments = 0;
                    let videoViews = 0;
                    let plays = 0;
                    if (post.insights && post.insights.data) {
                        const metrics = post.insights.data;
                        reach = ((_b = (_a = metrics.find((m) => m.name === 'reach')) === null || _a === void 0 ? void 0 : _a.values[0]) === null || _b === void 0 ? void 0 : _b.value) || 0;
                        impressions = ((_d = (_c = metrics.find((m) => m.name === 'impressions')) === null || _c === void 0 ? void 0 : _c.values[0]) === null || _d === void 0 ? void 0 : _d.value) || 0;
                        engagement = ((_f = (_e = metrics.find((m) => m.name === 'engagement')) === null || _e === void 0 ? void 0 : _e.values[0]) === null || _f === void 0 ? void 0 : _f.value) || 0;
                        likes = ((_h = (_g = metrics.find((m) => m.name === 'likes')) === null || _g === void 0 ? void 0 : _g.values[0]) === null || _h === void 0 ? void 0 : _h.value) || 0;
                        comments = ((_k = (_j = metrics.find((m) => m.name === 'comments')) === null || _j === void 0 ? void 0 : _j.values[0]) === null || _k === void 0 ? void 0 : _k.value) || 0;
                        videoViews = ((_m = (_l = metrics.find((m) => m.name === 'video_views')) === null || _l === void 0 ? void 0 : _l.values[0]) === null || _m === void 0 ? void 0 : _m.value) || 0;
                        plays = ((_p = (_o = metrics.find((m) => m.name === 'plays')) === null || _o === void 0 ? void 0 : _o.values[0]) === null || _p === void 0 ? void 0 : _p.value) || 0;
                    }
                    // Calculate engagement score based on available metrics
                    const primaryMetric = videoViews || plays || reach || impressions;
                    const engagementScore = engagement || (likes + comments * 2);
                    const totalScore = primaryMetric + (engagementScore * 10);
                    // Skip if no meaningful engagement data
                    if (primaryMetric === 0 && engagementScore === 0) {
                        console.log(`⏭️ Skipping post ${post.id} - no engagement data available`);
                        continue;
                    }
                    videos.push({
                        id: post.id,
                        url: post.media_url,
                        caption: post.caption || '',
                        timestamp: post.timestamp,
                        views: primaryMetric, // Use best available metric as "views"
                        likes: likes,
                        comments: comments,
                        performanceScore: totalScore,
                        insights: {
                            reach,
                            impressions,
                            engagement,
                            videoViews,
                            plays,
                            engagementScore
                        }
                    });
                    console.log(`✅ Added video ${post.id}: ${primaryMetric.toLocaleString()} views`);
                }
                catch (insightError) {
                    console.warn(`⚠️ Could not get insights for post ${post.id}:`, insightError);
                }
            }
        }
        console.log(`🎬 Filtered to ${videos.length} video posts with view data`);
        return videos;
    }
    catch (error) {
        console.error('❌ Instagram scraping failed:', error);
        // Provide helpful error messages
        if (((_q = error.response) === null || _q === void 0 ? void 0 : _q.status) === 400) {
            if (((_s = (_r = error.response.data) === null || _r === void 0 ? void 0 : _r.error) === null || _s === void 0 ? void 0 : _s.code) === 190) {
                throw new Error('Instagram access token is expired or invalid. Please refresh your Instagram token in settings.');
            }
            else if ((_v = (_u = (_t = error.response.data) === null || _t === void 0 ? void 0 : _t.error) === null || _u === void 0 ? void 0 : _u.message) === null || _v === void 0 ? void 0 : _v.includes('User does not exist')) {
                throw new Error('Instagram account ID is invalid. Please check your Instagram account ID in settings.');
            }
        }
        throw new Error(`Instagram API error: ${((_y = (_x = (_w = error.response) === null || _w === void 0 ? void 0 : _w.data) === null || _x === void 0 ? void 0 : _x.error) === null || _y === void 0 ? void 0 : _y.message) || error.message}`);
    }
}
/**
 * Check if a video was posted recently (within the repost delay)
 */
async function wasPostedRecently(videoId, delayDays) {
    try {
        const delayDate = new Date();
        delayDate.setDate(delayDate.getDate() - delayDays);
        // Check in InstagramArchive for last post time
        const recentPost = await InstagramContent_1.InstagramArchive.findOne({
            igPostId: videoId,
            lastRepostDate: { $gte: delayDate }
        });
        if (recentPost) {
            console.log(`⏳ Video ${videoId} was posted within ${delayDays} days`);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(`❌ Error checking repost delay for ${videoId}:`, error);
        return false; // Default to allowing repost if check fails
    }
}
/**
 * Mark a video as posted (for delay tracking)
 */
async function markAsPosted(videoId) {
    try {
        await InstagramContent_1.InstagramArchive.findOneAndUpdate({ igPostId: videoId }, {
            lastRepostDate: new Date(),
            $inc: { repostCount: 1 }
        }, { upsert: true });
        console.log(`📝 Marked video ${videoId} as posted for delay tracking`);
    }
    catch (error) {
        console.error(`❌ Failed to mark video ${videoId} as posted:`, error);
    }
}
/**
 * Get Instagram scraping statistics
 */
async function getScrapingStats() {
    try {
        const allVideos = await InstagramContent_1.InstagramArchive.countDocuments({ mediaType: 'VIDEO' });
        const eligibleVideos = await InstagramContent_1.InstagramArchive.countDocuments({
            mediaType: 'VIDEO',
            repostEligible: true
        });
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentVideos = await InstagramContent_1.InstagramArchive.countDocuments({
            mediaType: 'VIDEO',
            postTime: { $gte: sevenDaysAgo }
        });
        // Calculate average views
        const viewsAggregate = await InstagramContent_1.InstagramArchive.aggregate([
            { $match: { mediaType: 'VIDEO' } },
            { $group: { _id: null, avgViews: { $avg: '$viewCount' } } }
        ]);
        const averageViews = viewsAggregate.length > 0 ? Math.round(viewsAggregate[0].avgViews) : 0;
        return {
            totalVideos: allVideos,
            eligibleVideos,
            recentVideos,
            averageViews
        };
    }
    catch (error) {
        console.error('❌ Failed to get scraping stats:', error);
        return { totalVideos: 0, eligibleVideos: 0, recentVideos: 0, averageViews: 0 };
    }
}
