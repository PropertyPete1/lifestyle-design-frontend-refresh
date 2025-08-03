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
exports.Phase9DailyScheduler = void 0;
const RepostQueue_1 = require("../../models/RepostQueue");
const InstagramContent_1 = require("../../models/InstagramContent");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const cron = __importStar(require("node-cron"));
class Phase9DailyScheduler {
    constructor() {
        this.settingsPath = path.join(__dirname, '../../../settings.json');
    }
    /**
     * Start the daily scheduling system
     */
    async startDailyScheduling() {
        var _a;
        try {
            console.log('📅 Phase 9: Starting daily scheduling system...');
            const settings = this.loadSettings();
            const dailySettings = (_a = settings.phase9Settings) === null || _a === void 0 ? void 0 : _a.dailyScheduling;
            if (!(dailySettings === null || dailySettings === void 0 ? void 0 : dailySettings.enabled)) {
                console.log('📅 Daily scheduling is disabled');
                return;
            }
            // Schedule daily preparation job (runs at 2 AM every day)
            this.schedulingJob = cron.schedule(dailySettings.scheduleTime || '0 2 * * *', async () => {
                await this.prepareDailySchedule();
            });
            // Run initial schedule preparation for today and rest of week
            await this.scheduleRestOfWeek();
            console.log('✅ Daily scheduling system started');
        }
        catch (error) {
            console.error('❌ Failed to start daily scheduling:', error);
            throw error;
        }
    }
    /**
     * Stop the daily scheduling system
     */
    stopDailyScheduling() {
        if (this.schedulingJob) {
            this.schedulingJob.stop();
            this.schedulingJob = undefined;
            console.log('✅ Daily scheduling system stopped');
        }
    }
    /**
     * Schedule posts for the rest of the week starting from today
     */
    async scheduleRestOfWeek() {
        var _a;
        try {
            console.log('📅 Scheduling posts for the rest of the week...');
            const settings = this.loadSettings();
            const phase9Settings = settings.phase9Settings || {};
            const weeklySchedule = ((_a = phase9Settings.dailyScheduling) === null || _a === void 0 ? void 0 : _a.weeklySchedule) || this.getDefaultWeeklySchedule();
            // Use maxRepostsPerPlatform from phase9Settings for precise control
            const maxRepostsPerDay = settings.maxRepostsPerDay || 8;
            const maxPostsPerPlatform = phase9Settings.maxRepostsPerPlatform || Math.floor(maxRepostsPerDay / 2); // 4 posts per platform (Instagram + YouTube)
            // Get peak hours for both platforms
            const peakHours = await this.getPeakHours();
            // Get top performers that haven't been posted recently
            const availableContent = await this.getAvailableContent();
            let totalScheduled = 0;
            const weekSchedule = {};
            // Schedule for each day of the week starting from today
            const today = new Date();
            const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            for (let i = 0; i < 7; i++) {
                const targetDate = new Date(today);
                targetDate.setDate(today.getDate() + i);
                const dayName = daysOfWeek[targetDate.getDay()];
                const daySchedule = weeklySchedule[dayName];
                if (!daySchedule)
                    continue;
                const scheduledForDay = await this.scheduleDayPosts(targetDate, daySchedule, availableContent, peakHours, maxPostsPerPlatform);
                weekSchedule[dayName] = scheduledForDay;
                totalScheduled += scheduledForDay.instagram + scheduledForDay.youtube;
                console.log(`📅 ${dayName.toUpperCase()}: Instagram at ${daySchedule.instagram}, YouTube at ${daySchedule.youtube}`);
                console.log(`   📊 Scheduled: ${scheduledForDay.instagram} Instagram, ${scheduledForDay.youtube} YouTube posts`);
            }
            console.log(`✅ Week scheduling complete: ${totalScheduled} posts scheduled across both platforms`);
            return {
                success: true,
                scheduledPosts: totalScheduled,
                weekSchedule
            };
        }
        catch (error) {
            console.error('❌ Failed to schedule rest of week:', error);
            return {
                success: false,
                scheduledPosts: 0,
                weekSchedule: {}
            };
        }
    }
    /**
     * Schedule posts for a specific day
     */
    async scheduleDayPosts(targetDate, daySchedule, availableContent, peakHours, maxPostsPerPlatform) {
        const scheduled = { instagram: 0, youtube: 0 };
        try {
            // Skip if date is in the past
            if (targetDate < new Date()) {
                return scheduled;
            }
            // Schedule Instagram posts
            const instagramTime = this.parseTimeString(daySchedule.instagram);
            const instagramDate = new Date(targetDate);
            instagramDate.setHours(instagramTime.hour, instagramTime.minute, 0, 0);
            // Optimize timing based on peak hours
            const optimizedInstagramTime = this.optimizePostTime(instagramDate, peakHours.instagram);
            const instagramContent = availableContent
                .filter(content => !content.scheduledForInstagram)
                .slice(0, maxPostsPerPlatform);
            for (let i = 0; i < instagramContent.length; i++) {
                const content = instagramContent[i];
                const postTime = new Date(optimizedInstagramTime);
                postTime.setMinutes(postTime.getMinutes() + (i * 30)); // Stagger posts by 30 minutes
                await this.createScheduledPost(content, 'instagram', postTime, i + 1);
                content.scheduledForInstagram = true;
                scheduled.instagram++;
            }
            // Schedule YouTube posts
            const youtubeTime = this.parseTimeString(daySchedule.youtube);
            const youtubeDate = new Date(targetDate);
            youtubeDate.setHours(youtubeTime.hour, youtubeTime.minute, 0, 0);
            // Optimize timing based on peak hours
            const optimizedYouTubeTime = this.optimizePostTime(youtubeDate, peakHours.youtube);
            // Use the SAME content for YouTube as Instagram (same videos on both platforms)
            const youtubeContent = instagramContent;
            for (let i = 0; i < youtubeContent.length; i++) {
                const content = youtubeContent[i];
                const postTime = new Date(optimizedYouTubeTime);
                postTime.setMinutes(postTime.getMinutes() + (i * 45)); // Stagger posts by 45 minutes
                await this.createScheduledPost(content, 'youtube', postTime, i + 1);
                content.scheduledForYouTube = true;
                scheduled.youtube++;
            }
        }
        catch (error) {
            console.error(`❌ Failed to schedule posts for ${targetDate.toDateString()}:`, error);
        }
        return scheduled;
    }
    /**
     * Create a scheduled post entry in the repost queue
     */
    async createScheduledPost(content, platform, scheduledTime, priority) {
        try {
            // Check if already scheduled (any status to prevent any duplicates)
            const existing = await RepostQueue_1.RepostQueue.findOne({
                sourceMediaId: content.videoId,
                targetPlatform: platform
            });
            if (existing) {
                console.log(`⏭️ Post ${content.videoId} already scheduled for ${platform} (status: ${existing.status})`);
                return;
            }
            const originalContent = {
                caption: content.caption,
                hashtags: content.hashtags,
                performanceScore: content.performanceScore,
                viewCount: content.viewCount,
                likeCount: content.likeCount,
                commentCount: content.commentCount,
                media_url: content.media_url,
                permalink: content.permalink,
                audioId: content.audioId
            };
            await RepostQueue_1.RepostQueue.create({
                sourceMediaId: content.videoId,
                targetPlatform: platform,
                platform: platform, // Also set platform field for backward compatibility
                priority,
                scheduledFor: scheduledTime,
                originalContent,
                status: 'queued'
            });
            console.log(`📅 Scheduled ${platform} post: ${content.videoId} for ${scheduledTime.toLocaleString()}`);
        }
        catch (error) {
            console.error(`❌ Failed to create scheduled post for ${content.videoId}:`, error);
        }
    }
    /**
     * Get available content for scheduling
     */
    async getAvailableContent() {
        try {
            // Get top performers that haven't been reposted recently (use settings minDaysBetweenPosts)
            const settings = this.loadSettings();
            const minDaysBetween = settings.minDaysBetweenPosts || 30;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - minDaysBetween);
            const availableContent = await InstagramContent_1.InstagramArchive.find({
                $and: [
                    {
                        $or: [
                            { mediaType: 'REEL' },
                            { mediaType: 'VIDEO' }
                        ]
                    },
                    { performanceScore: { $gt: 500 } }, // Lower threshold to get more content
                    {
                        $or: [
                            { lastRepostDate: { $exists: false } },
                            { lastRepostDate: { $lt: cutoffDate } }
                        ]
                    }
                ]
            })
                .sort({ performanceScore: -1 })
                .limit(200); // Get more content to ensure we have enough for the week
            console.log(`📊 Found ${availableContent.length} pieces of content available for scheduling`);
            return availableContent;
        }
        catch (error) {
            console.error('❌ Failed to get available content:', error);
            return [];
        }
    }
    /**
     * Get peak hours for both platforms
     */
    async getPeakHours() {
        try {
            // Get real audience engagement data from database
            const { peakHoursScheduler } = require('../../lib/peakHours/scheduler');
            const instagramOptimal = await peakHoursScheduler.getOptimalTimes('instagram', 5);
            const youtubeOptimal = await peakHoursScheduler.getOptimalTimes('youtube', 5);
            // Convert optimal times to the expected format
            const instagramPeaks = instagramOptimal.map((time) => ({
                hour: time.hour,
                engagement: time.score
            }));
            const youtubePeaks = youtubeOptimal.map((time) => ({
                hour: time.hour,
                engagement: time.score
            }));
            console.log(`📊 Using real audience data: Instagram peaks at ${instagramPeaks.map(p => `${p.hour}:00`).join(', ')}`);
            console.log(`📊 Using real audience data: YouTube peaks at ${youtubePeaks.map(p => `${p.hour}:00`).join(', ')}`);
            return {
                instagram: instagramPeaks.length > 0 ? instagramPeaks : [
                    { hour: 14, engagement: 100 }, // Default fallback: Sunday 2PM (from real data)
                    { hour: 22, engagement: 95 }, // Monday 10PM
                    { hour: 13, engagement: 90 } // Thursday 1PM
                ],
                youtube: youtubePeaks.length > 0 ? youtubePeaks : [
                    { hour: 18, engagement: 100 }, // Default fallback: Friday 6PM (from real data)
                    { hour: 12, engagement: 95 }, // Monday/Friday 12PM
                    { hour: 17, engagement: 90 } // Standard evening time
                ]
            };
        }
        catch (error) {
            console.error('❌ Failed to get real peak hours, using smart defaults:', error);
            return {
                instagram: [
                    { hour: 14, engagement: 100 }, // Sunday 2PM (from your real data)
                    { hour: 22, engagement: 95 }, // Monday 10PM (from your real data)
                    { hour: 13, engagement: 90 } // Thursday 1PM (from your real data)
                ],
                youtube: [
                    { hour: 18, engagement: 100 }, // Friday 6PM (from your real data)
                    { hour: 12, engagement: 95 }, // Monday 12PM (from your real data)
                    { hour: 17, engagement: 90 } // Standard evening time
                ]
            };
        }
    }
    /**
     * Optimize post time based on peak hours
     */
    optimizePostTime(baseTime, peakHours) {
        const optimizedTime = new Date(baseTime);
        // Find the closest peak hour
        const baseHour = baseTime.getHours();
        let closestPeak = peakHours[0];
        let minDistance = Math.abs(baseHour - closestPeak.hour);
        for (const peak of peakHours) {
            const distance = Math.abs(baseHour - peak.hour);
            if (distance < minDistance) {
                minDistance = distance;
                closestPeak = peak;
            }
        }
        // Adjust time to be closer to peak hour (but not exactly)
        const targetHour = closestPeak.hour;
        const adjustment = Math.round((targetHour - baseHour) * 0.5); // Move 50% towards peak
        optimizedTime.setHours(baseHour + adjustment);
        return optimizedTime;
    }
    /**
     * Parse time string (e.g., "10:30") to hour and minute
     */
    parseTimeString(timeStr) {
        const [hourStr, minuteStr] = timeStr.split(':');
        return {
            hour: parseInt(hourStr, 10),
            minute: parseInt(minuteStr, 10) || 0
        };
    }
    /**
     * Get default weekly schedule
     */
    getDefaultWeeklySchedule() {
        return {
            monday: { instagram: "10:00", youtube: "14:00" },
            tuesday: { instagram: "09:30", youtube: "15:30" },
            wednesday: { instagram: "11:00", youtube: "16:00" },
            thursday: { instagram: "10:30", youtube: "14:30" },
            friday: { instagram: "09:00", youtube: "17:00" },
            saturday: { instagram: "12:00", youtube: "18:00" },
            sunday: { instagram: "13:00", youtube: "19:00" }
        };
    }
    /**
     * Prepare daily schedule (runs every morning)
     */
    async prepareDailySchedule() {
        var _a;
        try {
            console.log('🌅 Preparing daily schedule...');
            const settings = this.loadSettings();
            const phase9Settings = settings.phase9Settings || {};
            if (!((_a = phase9Settings.dailyScheduling) === null || _a === void 0 ? void 0 : _a.prepareForTomorrow)) {
                return;
            }
            // Schedule posts for tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayName = daysOfWeek[tomorrow.getDay()];
            const weeklySchedule = phase9Settings.dailyScheduling.weeklySchedule || this.getDefaultWeeklySchedule();
            const daySchedule = weeklySchedule[dayName];
            if (daySchedule) {
                const peakHours = await this.getPeakHours();
                const availableContent = await this.getAvailableContent();
                const maxPostsPerPlatform = phase9Settings.maxPostsPerPlatform || 4;
                await this.scheduleDayPosts(tomorrow, daySchedule, availableContent, peakHours, maxPostsPerPlatform);
                console.log(`✅ Prepared schedule for ${dayName} (${tomorrow.toDateString()})`);
            }
        }
        catch (error) {
            console.error('❌ Failed to prepare daily schedule:', error);
        }
    }
    /**
     * Get scheduling statistics
     */
    async getSchedulingStats() {
        try {
            const totalScheduled = await RepostQueue_1.RepostQueue.countDocuments({ status: 'queued' });
            const instagramScheduled = await RepostQueue_1.RepostQueue.countDocuments({
                targetPlatform: 'instagram',
                status: 'queued'
            });
            const youtubeScheduled = await RepostQueue_1.RepostQueue.countDocuments({
                targetPlatform: 'youtube',
                status: 'queued'
            });
            const nextPost = await RepostQueue_1.RepostQueue.findOne({ status: 'queued' })
                .sort({ scheduledFor: 1 })
                .select('scheduledFor');
            // Get upcoming week breakdown
            const weekStart = new Date();
            const weekEnd = new Date();
            weekEnd.setDate(weekStart.getDate() + 7);
            const upcomingPosts = await RepostQueue_1.RepostQueue.find({
                status: 'queued',
                scheduledFor: { $gte: weekStart, $lte: weekEnd }
            }).sort({ scheduledFor: 1 });
            const upcomingWeek = {};
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            for (const post of upcomingPosts) {
                const dayName = daysOfWeek[post.scheduledFor.getDay()];
                upcomingWeek[dayName] = (upcomingWeek[dayName] || 0) + 1;
            }
            return {
                totalScheduled,
                instagramScheduled,
                youtubeScheduled,
                nextPost: nextPost === null || nextPost === void 0 ? void 0 : nextPost.scheduledFor,
                upcomingWeek
            };
        }
        catch (error) {
            console.error('❌ Error getting scheduling stats:', error);
            return {
                totalScheduled: 0,
                instagramScheduled: 0,
                youtubeScheduled: 0,
                upcomingWeek: {}
            };
        }
    }
    /**
     * Clean up old scheduled posts that are past due
     */
    async cleanupOldScheduledPosts() {
        try {
            const oneDayAgo = new Date();
            oneDayAgo.setDate(oneDayAgo.getDate() - 1);
            const result = await RepostQueue_1.RepostQueue.deleteMany({
                status: 'queued',
                scheduledFor: { $lt: oneDayAgo }
            });
            if (result.deletedCount > 0) {
                console.log(`🧹 Cleaned up ${result.deletedCount} old scheduled posts`);
            }
            return result.deletedCount;
        }
        catch (error) {
            console.error('❌ Failed to cleanup old scheduled posts:', error);
            return 0;
        }
    }
    /**
     * Load settings from file
     */
    loadSettings() {
        try {
            const settingsData = fs.readFileSync(this.settingsPath, 'utf8');
            return JSON.parse(settingsData);
        }
        catch (error) {
            console.error('❌ Failed to load settings:', error);
            return {};
        }
    }
}
exports.Phase9DailyScheduler = Phase9DailyScheduler;
