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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dailyRepostScheduler = exports.DailyRepostScheduler = void 0;
const RepostQueue_1 = require("../models/RepostQueue");
const InstagramContent_1 = require("../models/InstagramContent");
const scheduler_1 = require("../lib/peakHours/scheduler");
const audioMatchingService_1 = require("./audioMatchingService");
const cron = __importStar(require("node-cron"));
class DailyRepostScheduler {
    constructor() {
        this.isRunning = false;
        this.cronJob = null;
        this.config = {
            enabled: true,
            scheduleTime: "0 2 * * *", // 2 AM daily
            maxPostsPerDay: 8,
            maxPostsPerPlatform: 4,
            prepareForTomorrow: true,
            peakHoursOnly: true
        };
        this.audioMatchingService = new audioMatchingService_1.AudioMatchingService();
    }
    /**
     * Start the daily repost scheduler
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️ Daily Repost Scheduler already running');
            return;
        }
        console.log('🚀 Starting Daily Repost Scheduler...');
        console.log(`⏰ Schedule: ${this.config.scheduleTime} (2 AM daily)`);
        console.log(`📊 Target: ${this.config.maxPostsPerDay} posts per day (${this.config.maxPostsPerPlatform} per platform)`);
        // Schedule daily preparation at 2 AM
        this.cronJob = cron.schedule(this.config.scheduleTime, async () => {
            console.log('🔄 Daily repost preparation triggered at 2 AM');
            await this.prepareTodaysReposts();
        });
        this.cronJob.start();
        this.isRunning = true;
        console.log('✅ Daily Repost Scheduler started successfully');
        // Also run immediately if it's the first time
        this.prepareTodaysReposts();
    }
    /**
     * Prepare 8 reposts for today (4 Instagram + 4 YouTube)
     */
    async prepareTodaysReposts() {
        try {
            console.log('🚀 Starting daily repost preparation for today (8 videos)...');
            // Clear old queue entries
            await this.clearOldQueue();
            // Get top performing Instagram content
            const topContent = await this.getTopInstagramContent();
            if (topContent.length === 0) {
                console.log('⚠️ No eligible content found for reposting');
                return;
            }
            console.log(`📊 Found ${topContent.length} eligible posts for reposting`);
            // Schedule Instagram reposts
            const instagramCount = await this.scheduleInstagramReposts(topContent);
            // Schedule YouTube reposts
            const youtubeCount = await this.scheduleYouTubeReposts(topContent);
            // Update statistics
            await this.updateRepostStatistics();
            console.log(`✅ Daily repost preparation complete!`);
            console.log(`📱 Instagram: ${instagramCount} posts scheduled for today`);
            console.log(`📺 YouTube: ${youtubeCount} posts scheduled for today`);
            console.log(`📅 Total: ${instagramCount + youtubeCount} posts scheduled for today`);
        }
        catch (error) {
            console.error('❌ Error in daily repost preparation:', error);
        }
    }
    /**
     * Clear old queue entries
     */
    async clearOldQueue() {
        try {
            // Remove posts that are older than yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const result = await RepostQueue_1.RepostQueue.deleteMany({
                scheduledFor: { $lt: yesterday }
            });
            console.log(`🗑️ Cleared ${result.deletedCount} old posts from queue`);
        }
        catch (error) {
            console.error('❌ Error clearing old queue:', error);
        }
    }
    /**
     * Get top performing Instagram content for reposting
     */
    async getTopInstagramContent() {
        try {
            console.log('🔍 Finding top performing Instagram content...');
            // Get top performing content that's eligible for reposting
            const topContent = await InstagramContent_1.InstagramArchive.find({
                repostEligible: true,
                reposted: false,
                performanceScore: { $gte: 1000 }, // Minimum performance score
                originalPostDate: {
                    $lte: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // At least 1 day old
                }
            })
                .sort({ performanceScore: -1 })
                .limit(20) // Get top 20 for selection
                .lean();
            console.log(`📊 Found ${topContent.length} eligible posts for reposting`);
            return topContent;
        }
        catch (error) {
            console.error('❌ Error getting top Instagram content:', error);
            return [];
        }
    }
    /**
     * Schedule Instagram reposts for today
     */
    async scheduleInstagramReposts(topContent) {
        var _a, _b, _c, _d;
        try {
            console.log('📱 Scheduling Instagram reposts for today...');
            // Get peak hours for Instagram
            const peakHours = await scheduler_1.peakHoursScheduler.getOptimalTimes('instagram', 10);
            let scheduledCount = 0;
            const instagramPosts = topContent.slice(0, this.config.maxPostsPerPlatform);
            for (let i = 0; i < instagramPosts.length; i++) {
                const post = instagramPosts[i];
                // Schedule all 4 Instagram posts for today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                // Schedule for today at different peak hours
                const scheduledTime = this.getNextPeakTime(peakHours, today, i);
                // Match with trending audio for Instagram
                console.log(`🎵 Matching trending audio for Instagram repost ${i + 1}/4...`);
                const audioMatch = await this.audioMatchingService.matchVideoWithAudio(post.videoId);
                // Check if already queued
                const existingRepost = await RepostQueue_1.RepostQueue.findOne({
                    sourceMediaId: post.videoId,
                    targetPlatform: 'instagram'
                });
                if (existingRepost) {
                    console.log(`⏭️ Post ${post.videoId} already scheduled for Instagram repost`);
                    continue;
                }
                // Create repost queue entry
                try {
                    await RepostQueue_1.RepostQueue.create({
                        sourceMediaId: post.videoId,
                        targetPlatform: 'instagram',
                        status: 'queued',
                        priority: i + 1,
                        scheduledFor: scheduledTime,
                        queuedAt: new Date(),
                        originalContent: {
                            caption: post.caption,
                            hashtags: post.hashtags,
                            performanceScore: post.performanceScore,
                            viewCount: post.viewCount,
                            likeCount: post.likeCount,
                            commentCount: post.commentCount,
                            media_url: post.media_url,
                            permalink: post.permalink
                        },
                        repostContent: {
                            optimizedForPlatform: 'instagram',
                            matchedAudio: audioMatch ? {
                                title: audioMatch.matchedAudio,
                                artist: (_a = audioMatch.audioMetadata) === null || _a === void 0 ? void 0 : _a.artist,
                                duration: (_b = audioMatch.audioMetadata) === null || _b === void 0 ? void 0 : _b.duration,
                                trending_rank: (_c = audioMatch.audioMetadata) === null || _c === void 0 ? void 0 : _c.trending_rank,
                                platform_audio_id: (_d = audioMatch.audioMetadata) === null || _d === void 0 ? void 0 : _d.platform_audio_id
                            } : null
                        }
                    });
                    scheduledCount++;
                    const dayName = scheduledTime.toLocaleDateString('en-US', { weekday: 'long' });
                    console.log(`📱 Scheduled Instagram repost ${i + 1}/4 for ${dayName} at ${scheduledTime.toLocaleTimeString()}`);
                }
                catch (createError) {
                    console.log(`⏭️ Post ${post.videoId} already scheduled for Instagram (duplicate detected)`);
                }
            }
            return scheduledCount;
        }
        catch (error) {
            console.error('❌ Error scheduling Instagram reposts:', error);
            return 0;
        }
    }
    /**
     * Schedule YouTube reposts for today
     */
    async scheduleYouTubeReposts(topContent) {
        var _a, _b, _c, _d;
        try {
            console.log('📺 Scheduling YouTube reposts for today...');
            // Get peak hours for YouTube
            const peakHours = await scheduler_1.peakHoursScheduler.getOptimalTimes('youtube', 10);
            let scheduledCount = 0;
            const youtubePosts = topContent.slice(0, this.config.maxPostsPerPlatform);
            for (let i = 0; i < youtubePosts.length; i++) {
                const post = youtubePosts[i];
                // Schedule all 4 YouTube posts for today
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                // Schedule for today at different peak hours
                const scheduledTime = this.getNextPeakTime(peakHours, today, i);
                // Match with trending audio for YouTube
                console.log(`🎵 Matching trending audio for YouTube repost ${i + 1}/4...`);
                const audioMatch = await this.audioMatchingService.matchVideoWithAudio(post.videoId);
                // Check if already queued
                const existingYouTubeRepost = await RepostQueue_1.RepostQueue.findOne({
                    sourceMediaId: post.videoId,
                    targetPlatform: 'youtube'
                });
                if (existingYouTubeRepost) {
                    console.log(`⏭️ Post ${post.videoId} already scheduled for YouTube repost`);
                    continue;
                }
                // Create repost queue entry
                try {
                    await RepostQueue_1.RepostQueue.create({
                        sourceMediaId: post.videoId,
                        targetPlatform: 'youtube',
                        status: 'queued',
                        priority: i + 1,
                        scheduledFor: scheduledTime,
                        queuedAt: new Date(),
                        originalContent: {
                            caption: post.caption,
                            hashtags: post.hashtags,
                            performanceScore: post.performanceScore,
                            viewCount: post.viewCount,
                            likeCount: post.likeCount,
                            commentCount: post.commentCount,
                            media_url: post.media_url,
                            permalink: post.permalink
                        },
                        repostContent: {
                            optimizedForPlatform: 'youtube',
                            matchedAudio: audioMatch ? {
                                title: audioMatch.matchedAudio,
                                artist: (_a = audioMatch.audioMetadata) === null || _a === void 0 ? void 0 : _a.artist,
                                duration: (_b = audioMatch.audioMetadata) === null || _b === void 0 ? void 0 : _b.duration,
                                trending_rank: (_c = audioMatch.audioMetadata) === null || _c === void 0 ? void 0 : _c.trending_rank,
                                platform_audio_id: (_d = audioMatch.audioMetadata) === null || _d === void 0 ? void 0 : _d.platform_audio_id
                            } : null
                        }
                    });
                    scheduledCount++;
                    const dayName = scheduledTime.toLocaleDateString('en-US', { weekday: 'long' });
                    console.log(`📺 Scheduled YouTube repost ${i + 1}/4 for ${dayName} at ${scheduledTime.toLocaleTimeString()}`);
                }
                catch (createError) {
                    console.log(`⏭️ Post ${post.videoId} already scheduled for YouTube (duplicate detected)`);
                }
            }
            return scheduledCount;
        }
        catch (error) {
            console.error('❌ Error scheduling YouTube reposts:', error);
            return 0;
        }
    }
    /**
     * Get next peak time for scheduling
     */
    getNextPeakTime(peakHours, baseDate, index) {
        if (!peakHours || peakHours.length === 0) {
            // Fallback: schedule every 3 hours starting at 9 AM
            const scheduledTime = new Date(baseDate);
            scheduledTime.setHours(9 + (index * 3), 0, 0, 0);
            return scheduledTime;
        }
        // Use peak hours if available
        const peakIndex = index % peakHours.length;
        const peakHour = peakHours[peakIndex];
        const scheduledTime = new Date(baseDate);
        scheduledTime.setHours(peakHour.hour || 9 + (index * 3), 0, 0, 0);
        return scheduledTime;
    }
    /**
     * Update repost statistics
     */
    async updateRepostStatistics() {
        try {
            console.log('📊 Updating repost statistics...');
            // Get queue statistics
            const queueStats = await RepostQueue_1.RepostQueue.aggregate([
                {
                    $group: {
                        _id: '$targetPlatform',
                        count: { $sum: 1 },
                        queued: {
                            $sum: { $cond: [{ $eq: ['$status', 'queued'] }, 1, 0] }
                        },
                        processing: {
                            $sum: { $cond: [{ $eq: ['$status', 'processing'] }, 1, 0] }
                        },
                        completed: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        }
                    }
                }
            ]);
            console.log('📊 Repost queue statistics:', queueStats);
        }
        catch (error) {
            console.error('❌ Error updating repost statistics:', error);
        }
    }
    /**
     * Stop the scheduler
     */
    stop() {
        if (this.cronJob) {
            this.cronJob.stop();
            this.cronJob = null;
        }
        this.isRunning = false;
        console.log('🛑 Daily Repost Scheduler stopped');
    }
    /**
     * Get scheduler status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            config: this.config,
            lastRun: new Date().toISOString()
        };
    }
    /**
     * Manual trigger for testing
     */
    async manualTrigger() {
        console.log('🔧 Manual trigger of daily repost preparation...');
        await this.prepareTodaysReposts();
    }
}
exports.DailyRepostScheduler = DailyRepostScheduler;
// Export singleton instance
exports.dailyRepostScheduler = new DailyRepostScheduler();
