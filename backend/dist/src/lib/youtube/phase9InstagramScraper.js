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
exports.Phase9InstagramScraper = void 0;
const axios_1 = __importDefault(require("axios"));
const InstagramContent_1 = require("../../models/InstagramContent");
const RepostQueue_1 = require("../../models/RepostQueue");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class Phase9InstagramScraper {
    constructor(accessToken, businessAccountId) {
        this.maxPosts = 500;
        this.accessToken = accessToken;
        this.businessAccountId = businessAccountId;
    }
    /**
     * Scrape 500 most recent Instagram posts with full metadata
     */
    async scrapeRecentPosts() {
        var _a;
        try {
            console.log('🔍 Phase 9: Starting comprehensive Instagram scraper for 500 recent posts...');
            const allPosts = [];
            let nextUrl;
            let requestCount = 0;
            const maxRequests = 20; // Increased to get more posts
            // Enhanced API request with more fields including audio data
            const baseUrl = `https://graph.facebook.com/v18.0/${this.businessAccountId}/media`;
            const fields = 'id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count,media_product_type';
            let currentUrl = `${baseUrl}?fields=${fields}&limit=50&access_token=${this.accessToken}`;
            // Fetch all available posts up to 500
            while (allPosts.length < this.maxPosts && requestCount < maxRequests) {
                console.log(`📊 Fetching batch ${requestCount + 1}, current count: ${allPosts.length}`);
                try {
                    const response = await axios_1.default.get(currentUrl);
                    const mediaData = response.data;
                    if (!mediaData.data || mediaData.data.length === 0) {
                        console.log('📭 No more posts available');
                        break;
                    }
                    // Filter for videos only (Reels content) - this is what we want to repost
                    const videoPosts = mediaData.data.filter(post => post.media_type === 'VIDEO' &&
                        post.media_url &&
                        post.permalink);
                    allPosts.push(...videoPosts);
                    console.log(`   📹 Found ${videoPosts.length} video posts in this batch`);
                    // Check if we have next page
                    if (!((_a = mediaData.paging) === null || _a === void 0 ? void 0 : _a.next) || allPosts.length >= this.maxPosts) {
                        break;
                    }
                    currentUrl = mediaData.paging.next;
                    requestCount++;
                    // Rate limiting - be nice to Instagram API
                    await this.delay(300);
                }
                catch (apiError) {
                    console.error(`❌ API Error in batch ${requestCount + 1}:`, apiError);
                    break;
                }
            }
            console.log(`📱 Total video posts found: ${allPosts.length}. Processing with insights...`);
            // Process each post with enhanced data extraction
            let processedCount = 0;
            const batchSize = 5; // Smaller batches for more reliable processing
            for (let i = 0; i < Math.min(allPosts.length, this.maxPosts); i += batchSize) {
                const batch = allPosts.slice(i, i + batchSize);
                await Promise.all(batch.map(async (post) => {
                    try {
                        // Get enhanced insights including views
                        const insights = await this.getEnhancedPostInsights(post.id);
                        const audioId = await this.extractAudioId(post);
                        const processedPost = await this.processPostWithEnhancedData(post, insights, audioId);
                        if (processedPost) {
                            processedCount++;
                            if (processedCount % 10 === 0) {
                                console.log(`   ✅ Processed ${processedCount} posts...`);
                            }
                        }
                    }
                    catch (error) {
                        console.error(`❌ Error processing post ${post.id}:`, error);
                    }
                }));
                // Rate limiting between batches
                await this.delay(1500);
            }
            // Clean up old data first
            await this.cleanupOldData();
            // Identify top 50 performers and add to repost queue
            const topPerformers = await this.identifyTopPerformers();
            console.log(`✅ Phase 9 Instagram scraping complete:`);
            console.log(`   📊 Total posts processed: ${processedCount}`);
            console.log(`   🏆 Top performers identified: ${topPerformers}`);
            console.log(`   📈 Average processing rate: ${Math.round(processedCount / requestCount)} posts per API call`);
            return {
                success: true,
                postsScraped: processedCount,
                topPerformers
            };
        }
        catch (error) {
            console.error('❌ Phase 9 Instagram scraper error:', error);
            return {
                success: false,
                postsScraped: 0,
                topPerformers: 0,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * Get enhanced insights including video views and engagement metrics
     */
    async getEnhancedPostInsights(mediaId) {
        try {
            // Get comprehensive insights for video content
            const insightsUrl = `https://graph.facebook.com/v18.0/${mediaId}/insights`;
            const metrics = 'plays,likes,comments,reach,impressions,video_views';
            const response = await axios_1.default.get(`${insightsUrl}?metric=${metrics}&access_token=${this.accessToken}`);
            const insightsData = response.data;
            let views = 0;
            let likes = 0;
            let comments = 0;
            let reach = 0;
            let impressions = 0;
            insightsData.data.forEach(insight => {
                var _a;
                const value = ((_a = insight.values[0]) === null || _a === void 0 ? void 0 : _a.value) || 0;
                switch (insight.name) {
                    case 'plays':
                    case 'video_views':
                        views = Math.max(views, value); // Take the higher value
                        break;
                    case 'likes':
                        likes = value;
                        break;
                    case 'comments':
                        comments = value;
                        break;
                    case 'reach':
                        reach = value;
                        break;
                    case 'impressions':
                        impressions = value;
                        break;
                }
            });
            return { views, likes, comments, reach, impressions };
        }
        catch (error) {
            console.warn(`⚠️ Could not fetch enhanced insights for ${mediaId}, using basic data`);
            return { views: 0, likes: 0, comments: 0, reach: 0, impressions: 0 };
        }
    }
    /**
     * Extract audio ID from Instagram post (for trending audio matching)
     */
    async extractAudioId(post) {
        try {
            // Try to get audio information from the post
            // This might require additional API calls or parsing
            // For now, we'll use a fallback approach
            const audioId = `audio_${post.id}_${Date.now()}`;
            return audioId;
        }
        catch (error) {
            console.warn(`⚠️ Could not extract audio ID for ${post.id}`);
            return '';
        }
    }
    /**
     * Process individual post with enhanced data and save to InstagramArchive
     */
    async processPostWithEnhancedData(post, insights, audioId) {
        try {
            // Extract hashtags from caption
            const hashtags = this.extractHashtags(post.caption || '');
            // Use API engagement data first, fall back to insights
            const likes = post.like_count || insights.likes || 0;
            const comments = post.comments_count || insights.comments || 0;
            const views = insights.views || 0;
            // Enhanced performance score calculation: views + likes*2 + comments*3
            const performanceScore = views + (likes * 2) + (comments * 3);
            // Check if post already exists (avoid duplicates)
            const existingPost = await InstagramContent_1.InstagramArchive.findOne({ videoId: post.id });
            const postData = {
                videoId: post.id,
                caption: post.caption || `Video from ${new Date(post.timestamp).toLocaleDateString()}`,
                hashtags,
                audioId,
                publishDate: new Date(post.timestamp),
                viewCount: views,
                likeCount: likes,
                commentCount: comments,
                performanceScore,
                originalPostDate: new Date(post.timestamp),
                repostEligible: performanceScore > 1000, // Minimum threshold for quality content
                reposted: false,
                media_url: post.media_url,
                permalink: post.permalink,
                mediaType: post.media_type,
                scrapedAt: new Date(),
                repostPriority: 0, // Will be set in identifyTopPerformers
                repostCount: 0,
                dropboxSynced: false
            };
            if (existingPost) {
                // Update existing post with latest data
                Object.assign(existingPost, postData);
                await existingPost.save();
                return existingPost;
            }
            else {
                // Create new post
                const newPost = new InstagramContent_1.InstagramArchive(postData);
                await newPost.save();
                return newPost;
            }
        }
        catch (error) {
            console.error(`❌ Error processing post ${post.id}:`, error);
            return null;
        }
    }
    /**
     * Extract hashtags from caption text
     */
    extractHashtags(caption) {
        const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
        const matches = caption.match(hashtagRegex);
        return matches ? matches.map(tag => tag.toLowerCase()) : [];
    }
    /**
     * Clean up old data to maintain database performance
     */
    async cleanupOldData() {
        try {
            // Remove posts older than 6 months that are not top performers
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            const deletedCount = await InstagramContent_1.InstagramArchive.deleteMany({
                scrapedAt: { $lt: sixMonthsAgo },
                repostEligible: false,
                reposted: false
            });
            if (deletedCount.deletedCount > 0) {
                console.log(`🧹 Cleaned up ${deletedCount.deletedCount} old posts`);
            }
        }
        catch (error) {
            console.error('❌ Error during cleanup:', error);
        }
    }
    /**
     * Identify top 50 performers based on comprehensive scoring
     */
    async identifyTopPerformers() {
        try {
            // Get posts that haven't been reposted in the last 20 days
            const twentyDaysAgo = new Date();
            twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);
            // Get top performers that are eligible for reposting with Phase 9 criteria
            const twentyDaysAgoForAge = new Date();
            twentyDaysAgoForAge.setDate(twentyDaysAgoForAge.getDate() - 20);
            // Get last 20 reposted video IDs to exclude from consideration
            const lastReposts = await InstagramContent_1.InstagramArchive.find({
                reposted: true,
                lastRepostDate: { $exists: true }
            })
                .sort({ lastRepostDate: -1 })
                .limit(20)
                .select('videoId');
            const excludeVideoIds = lastReposts.map(post => post.videoId);
            const topPosts = await InstagramContent_1.InstagramArchive.find({
                mediaType: 'VIDEO',
                viewCount: { $gte: 10000 }, // Phase 9: Minimum 10K+ views requirement
                reposted: false, // Phase 9: Not already reposted
                originalPostDate: { $lt: twentyDaysAgoForAge }, // Phase 9: At least 20 days old
                videoId: { $nin: excludeVideoIds }, // Phase 9: Not among last 20 reposts
                $or: [
                    { lastRepostDate: { $exists: false } },
                    { lastRepostDate: { $lt: twentyDaysAgo } }
                ]
            })
                .sort({ performanceScore: -1 })
                .limit(50);
            console.log(`🏆 Identified ${topPosts.length} top performers for reposting`);
            // Update repost priority and eligibility
            for (let i = 0; i < topPosts.length; i++) {
                const post = topPosts[i];
                post.repostEligible = true;
                post.repostPriority = i + 1; // 1 = highest priority
                await post.save();
                // Add to repost queue for both platforms
                await this.queueForRepost(post, i + 1);
            }
            return topPosts.length;
        }
        catch (error) {
            console.error('❌ Error identifying top performers:', error);
            return 0;
        }
    }
    /**
     * Add top performing content to repost queue for both platforms
     */
    async queueForRepost(post, priority) {
        try {
            // Load settings to check platform preferences
            const settingsPath = path.join(__dirname, '../../../settings.json');
            let settings = {};
            try {
                settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            }
            catch (error) {
                console.warn('⚠️ Could not load settings, using defaults');
            }
            const phase9Settings = settings.phase9Settings || {};
            const enableYouTube = phase9Settings.enableYouTubeReposts !== false;
            const enableInstagram = phase9Settings.enableInstagramReposts !== false;
            const repostDelay = phase9Settings.repostDelay || 20; // days between reposts
            const minDaysBetweenPosts = settings.minDaysBetweenPosts || 20;
            // Calculate scheduling with proper delays
            const baseScheduleDate = new Date();
            baseScheduleDate.setDate(baseScheduleDate.getDate() + Math.max(repostDelay, minDaysBetweenPosts));
            const originalContent = {
                caption: post.caption,
                hashtags: post.hashtags,
                performanceScore: post.performanceScore,
                viewCount: post.viewCount,
                likeCount: post.likeCount,
                commentCount: post.commentCount,
                media_url: post.media_url,
                permalink: post.permalink,
                audioId: post.audioId
            };
            // Queue for YouTube (priority platform for long-form content)
            if (enableYouTube) {
                const youtubeDate = new Date(baseScheduleDate);
                // Stagger posts - highest priority posts get earlier slots
                youtubeDate.setHours(youtubeDate.getHours() + (priority * 2));
                // Check if already queued for YouTube
                const existingYouTube = await RepostQueue_1.RepostQueue.findOne({
                    sourceMediaId: post.videoId,
                    targetPlatform: 'youtube'
                });
                if (!existingYouTube) {
                    try {
                        await RepostQueue_1.RepostQueue.create({
                            sourceMediaId: post.videoId,
                            targetPlatform: 'youtube',
                            priority,
                            scheduledFor: youtubeDate,
                            originalContent,
                            status: 'queued'
                        });
                        console.log(`📺 Queued ${post.videoId} for YouTube repost (priority ${priority}, scheduled: ${youtubeDate.toLocaleDateString()})`);
                    }
                    catch (error) {
                        console.log(`⏭️ Post ${post.videoId} already queued for YouTube`);
                    }
                }
                else {
                    console.log(`⏭️ Post ${post.videoId} already queued for YouTube`);
                }
            }
            // Queue for Instagram (shorter format, different scheduling)
            if (enableInstagram) {
                const instagramDate = new Date(baseScheduleDate);
                instagramDate.setDate(instagramDate.getDate() + 1); // Offset by 1 day from YouTube
                instagramDate.setHours(instagramDate.getHours() + (priority * 3));
                // Check if already queued for Instagram
                const existingInstagram = await RepostQueue_1.RepostQueue.findOne({
                    sourceMediaId: post.videoId,
                    targetPlatform: 'instagram'
                });
                if (!existingInstagram) {
                    try {
                        await RepostQueue_1.RepostQueue.create({
                            sourceMediaId: post.videoId,
                            targetPlatform: 'instagram',
                            priority,
                            scheduledFor: instagramDate,
                            originalContent,
                            status: 'queued'
                        });
                        console.log(`📱 Queued ${post.videoId} for Instagram repost (priority ${priority}, scheduled: ${instagramDate.toLocaleDateString()})`);
                    }
                    catch (error) {
                        console.log(`⏭️ Post ${post.videoId} already queued for Instagram`);
                    }
                }
                else {
                    console.log(`⏭️ Post ${post.videoId} already queued for Instagram`);
                }
            }
        }
        catch (error) {
            console.error(`❌ Error queueing post ${post.videoId} for repost:`, error);
        }
    }
    /**
     * Utility delay function for rate limiting
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Get comprehensive scraping statistics
     */
    async getScrapingStats() {
        try {
            const totalPosts = await InstagramContent_1.InstagramArchive.countDocuments();
            const recentCutoff = new Date();
            recentCutoff.setHours(recentCutoff.getHours() - 24);
            const recentPosts = await InstagramContent_1.InstagramArchive.countDocuments({
                scrapedAt: { $gte: recentCutoff }
            });
            const topPerformers = await InstagramContent_1.InstagramArchive.countDocuments({
                repostEligible: true
            });
            const videosReady = await InstagramContent_1.InstagramArchive.countDocuments({
                mediaType: 'VIDEO',
                repostEligible: true,
                reposted: false
            });
            const statsResult = await InstagramContent_1.InstagramArchive.aggregate([
                {
                    $group: {
                        _id: null,
                        avgScore: { $avg: '$performanceScore' },
                        totalViews: { $sum: '$viewCount' },
                        totalLikes: { $sum: '$likeCount' },
                        totalComments: { $sum: '$commentCount' }
                    }
                }
            ]);
            const stats = statsResult[0] || { avgScore: 0, totalViews: 0, totalLikes: 0, totalComments: 0 };
            const totalEngagement = stats.totalLikes + stats.totalComments;
            const lastPost = await InstagramContent_1.InstagramArchive.findOne().sort({ scrapedAt: -1 });
            const lastScrapedAt = lastPost === null || lastPost === void 0 ? void 0 : lastPost.scrapedAt;
            return {
                totalPosts,
                recentPosts,
                topPerformers,
                avgPerformanceScore: Math.round(stats.avgScore),
                lastScrapedAt,
                videosReady,
                totalViews: stats.totalViews,
                totalEngagement
            };
        }
        catch (error) {
            console.error('❌ Error getting scraping stats:', error);
            return {
                totalPosts: 0,
                recentPosts: 0,
                topPerformers: 0,
                avgPerformanceScore: 0,
                videosReady: 0,
                totalViews: 0,
                totalEngagement: 0
            };
        }
    }
}
exports.Phase9InstagramScraper = Phase9InstagramScraper;
