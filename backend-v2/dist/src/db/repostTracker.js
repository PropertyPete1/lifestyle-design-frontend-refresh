"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupOldReposts = exports.clearRepostHistory = exports.getRepostHistory = exports.storeRepostLog = exports.isAlreadyReposted = void 0;
const RepostQueue_1 = require("../models/RepostQueue");
const AutopilotLog_1 = require("../models/AutopilotLog");
/**
 * Check if a post has already been reposted
 */
const isAlreadyReposted = async (originalPostId, platform) => {
    try {
        // Get settings to check repost delay
        const SettingsModel = require('../models/SettingsModel').default;
        const settings = await SettingsModel.findOne();
        const repostDelayDays = (settings === null || settings === void 0 ? void 0 : settings.repostDelay) || 1; // Default to 1 day
        // Calculate cutoff date based on delay setting
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - repostDelayDays);
        // Check if ANY platform was posted recently (global delay for the video)
        const recentRepost = await RepostQueue_1.RepostQueue.findOne({
            originalPostId,
            status: { $in: ['completed', 'processing', 'scheduled'] },
            $or: [
                { postedAt: { $gte: cutoffDate } }, // Posted within delay period
                { updatedAt: { $gte: cutoffDate } } // Updated within delay period (fallback)
            ]
        });
        // Check AutopilotLog for recent reposts (within delay period)
        const recentLog = await AutopilotLog_1.AutopilotLog.findOne({
            originalPostId,
            type: 'repost',
            createdAt: { $gte: cutoffDate } // Created within delay period
        });
        if (recentRepost || recentLog) {
            const lastPostDate = (recentRepost === null || recentRepost === void 0 ? void 0 : recentRepost.postedAt) || (recentRepost === null || recentRepost === void 0 ? void 0 : recentRepost.updatedAt) || (recentLog === null || recentLog === void 0 ? void 0 : recentLog.createdAt);
            const daysSincePost = lastPostDate ? Math.floor((Date.now() - lastPostDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
            const platformInfo = (recentLog === null || recentLog === void 0 ? void 0 : recentLog.platform) || (recentRepost === null || recentRepost === void 0 ? void 0 : recentRepost.targetPlatform) || 'any platform';
            console.log(`⏳ ${originalPostId} was last posted to ${platformInfo} ${daysSincePost} days ago (delay: ${repostDelayDays} days)`);
            return true;
        }
        return false;
    }
    catch (error) {
        console.error(`❌ Error checking repost status for ${originalPostId}:`, error);
        return false; // Assume not reposted on error to avoid blocking
    }
};
exports.isAlreadyReposted = isAlreadyReposted;
/**
 * Store repost log for tracking
 */
const storeRepostLog = async (originalPostId, logData) => {
    try {
        const now = new Date();
        // Store in AutopilotLog for history tracking (each platform gets separate entry)
        await AutopilotLog_1.AutopilotLog.create({
            runId: `repost_${Date.now()}_${logData.platform}`,
            type: 'repost',
            status: 'completed',
            originalPostId,
            caption: logData.caption,
            timestamp: logData.timestamp,
            platform: logData.platform || 'instagram',
            publishedId: logData.publishedId,
            startTime: now,
            endTime: now,
            duration: 0,
            createdAt: now // Explicit timestamp for delay checking
        });
        // Create/update RepostQueue entry for delay tracking (global per video)
        await RepostQueue_1.RepostQueue.findOneAndUpdate({ originalPostId, targetPlatform: logData.platform === 'youtube' ? 'youtube' : 'instagram' }, {
            originalPostId,
            status: 'completed',
            postedAt: now,
            updatedAt: now,
            targetPlatform: logData.platform === 'youtube' ? 'youtube' : 'instagram'
        }, { upsert: true, new: true });
        console.log(`📝 Repost log stored for ${originalPostId} on ${logData.platform} with timestamp ${now.toISOString()}`);
    }
    catch (error) {
        console.error(`❌ Failed to store repost log for ${originalPostId}:`, error);
        // Don't throw error - logging failure shouldn't stop the repost process
    }
};
exports.storeRepostLog = storeRepostLog;
/**
 * Get repost history for a specific post
 */
const getRepostHistory = async (originalPostId) => {
    try {
        const history = await AutopilotLog_1.AutopilotLog.find({
            originalPostId,
            type: 'repost'
        }).sort({ createdAt: -1 });
        return history;
    }
    catch (error) {
        console.error(`❌ Error fetching repost history for ${originalPostId}:`, error);
        return [];
    }
};
exports.getRepostHistory = getRepostHistory;
/**
 * Clear repost history (for testing purposes)
 */
const clearRepostHistory = async () => {
    try {
        const logResult = await AutopilotLog_1.AutopilotLog.deleteMany({
            type: 'repost'
        });
        const queueResult = await RepostQueue_1.RepostQueue.deleteMany({});
        const totalDeleted = (logResult.deletedCount || 0) + (queueResult.deletedCount || 0);
        console.log(`🗑️ Cleared ${totalDeleted} repost entries (${logResult.deletedCount || 0} logs + ${queueResult.deletedCount || 0} queue)`);
        return totalDeleted;
    }
    catch (error) {
        console.error('❌ Error clearing repost history:', error);
        return 0;
    }
};
exports.clearRepostHistory = clearRepostHistory;
/**
 * Clean up old repost entries based on current delay settings
 */
const cleanupOldReposts = async () => {
    try {
        const SettingsModel = require('../models/SettingsModel').default;
        const settings = await SettingsModel.findOne();
        const repostDelayDays = (settings === null || settings === void 0 ? void 0 : settings.repostDelay) || 1;
        // Calculate cutoff date (keep entries within delay period + 30 days for history)
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - (repostDelayDays + 30));
        const logResult = await AutopilotLog_1.AutopilotLog.deleteMany({
            type: 'repost',
            createdAt: { $lt: cutoffDate }
        });
        const queueResult = await RepostQueue_1.RepostQueue.deleteMany({
            postedAt: { $lt: cutoffDate }
        });
        const totalDeleted = (logResult.deletedCount || 0) + (queueResult.deletedCount || 0);
        if (totalDeleted > 0) {
            console.log(`🧹 Cleaned up ${totalDeleted} old repost entries (older than ${repostDelayDays + 30} days)`);
        }
        return totalDeleted;
    }
    catch (error) {
        console.error('❌ Error cleaning up old reposts:', error);
        return 0;
    }
};
exports.cleanupOldReposts = cleanupOldReposts;
