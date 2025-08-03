"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SettingsModel_1 = __importDefault(require("../../models/SettingsModel"));
const AutopilotLog_1 = require("../../models/AutopilotLog");
const activityLog_1 = require("../../services/activityLog");
const chartMetrics_1 = require("../../services/chartMetrics");
// Helper functions for chart status endpoint
async function getSettings() {
    const settings = await SettingsModel_1.default.findOne().sort({ updatedAt: -1 });
    return {
        dailyPostLimit: (settings === null || settings === void 0 ? void 0 : settings.dailyPostLimit) || 3,
        autopilotRunning: (settings === null || settings === void 0 ? void 0 : settings.autopilot) || false,
        postToInstagram: (settings === null || settings === void 0 ? void 0 : settings.postToInstagram) !== false,
        postToYouTube: (settings === null || settings === void 0 ? void 0 : settings.postToYouTube) !== false,
        repostStrategy: (settings === null || settings === void 0 ? void 0 : settings.repostStrategy) || 'high-performers',
        postDelay: (settings === null || settings === void 0 ? void 0 : settings.postDelay) || 30
    };
}
async function getEngagementScore() {
    try {
        // Get recent activity from ActivityLog (consistent model)
        const recentPosts = await (0, activityLog_1.getActivityFeed)();
        const now = Date.now();
        const last7days = recentPosts.filter((post) => {
            const timestamp = post.timestamp;
            return new Date(timestamp).getTime() > now - 7 * 24 * 60 * 60 * 1000;
        });
        // Calculate engagement score based on recent activity
        const totalPosts = last7days.length;
        const avgPostsPerDay = totalPosts / 7;
        // Normalize to 0-1 scale (base 0.3, increase with activity)
        const engagementScore = Math.min(avgPostsPerDay / 10 + 0.3, 1.0);
        return Number(engagementScore.toFixed(2));
    }
    catch (error) {
        console.warn('⚠️ Engagement score calculation failed:', error);
        return 0.65; // Default engagement score
    }
}
async function isAutopilotOn() {
    try {
        const settings = await SettingsModel_1.default.findOne().sort({ updatedAt: -1 });
        return (settings === null || settings === void 0 ? void 0 : settings.autopilot) || false;
    }
    catch (error) {
        console.warn('⚠️ Autopilot status check failed:', error);
        return false;
    }
}
async function isNewEngagementRecord() {
    try {
        // Get recent activity from ActivityLog
        const recentPosts = await (0, activityLog_1.getActivityFeed)(100);
        const now = Date.now();
        const last30days = recentPosts.filter((post) => {
            const timestamp = post.timestamp;
            return new Date(timestamp).getTime() > now - 30 * 24 * 60 * 60 * 1000;
        });
        // Group by day and find max posts in a single day
        const dailyCounts = {};
        last30days.forEach((post) => {
            const timestamp = post.timestamp;
            const date = new Date(timestamp).toDateString();
            dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        });
        const maxDailyPosts = Math.max(...Object.values(dailyCounts), 0);
        const todayPosts = dailyCounts[new Date().toDateString()] || 0;
        // New record if today's posts equal the max AND it's above average
        return todayPosts === maxDailyPosts && todayPosts > 3;
    }
    catch (error) {
        console.warn('⚠️ New engagement record check failed:', error);
        return false;
    }
}
async function getLastPostTimestamp() {
    try {
        // Get most recent post from cache first
        const recentPosts = await (0, activityLog_1.getActivityFeed)();
        if (recentPosts.length > 0) {
            const mostRecent = recentPosts[0];
            return new Date(mostRecent.timestamp).getTime();
        }
        // Fallback to database
        const lastLog = await AutopilotLog_1.AutopilotLog.findOne({ type: 'post' })
            .sort({ startTime: -1 });
        if (lastLog) {
            return new Date(lastLog.startTime).getTime();
        }
        return null;
    }
    catch (error) {
        console.warn('⚠️ Last post timestamp check failed:', error);
        return null;
    }
}
const router = express_1.default.Router();
// GET /api/chart/status - Real-time chart data for reactive dashboard
router.get('/status', async (req, res) => {
    try {
        // Get data from chartMetrics service
        const graphStats = await (0, chartMetrics_1.getGraphStats)();
        const platformCounts = await (0, chartMetrics_1.getPlatformPostCounts)();
        const engagementScore = await getEngagementScore();
        const lastPostTime = await getLastPostTimestamp();
        // Simple response with available data
        const response = {
            settings: {
                dailyPostLimit: 5, // Default value
                autopilotRunning: true, // Active if backend is running
                postToInstagram: true,
                postToYouTube: true
            },
            engagementScore: engagementScore,
            autopilotRunning: true,
            newHighScore: false, // Basic implementation
            lastPostTime: lastPostTime,
            platformData: {
                instagram: {
                    active: true,
                    todayPosts: platformCounts.instagram.today
                },
                youtube: {
                    active: true,
                    todayPosts: platformCounts.youtube.today
                }
            },
            totalPostsToday: platformCounts.instagram.today + platformCounts.youtube.today,
            graphData: graphStats
        };
        console.log('📊 Chart status response:', response);
        res.json(response);
    }
    catch (error) {
        console.error('❌ Chart status error:', error);
        res.status(500).json({
            settings: {
                dailyPostLimit: 3,
                autopilotRunning: false,
                postToInstagram: true,
                postToYouTube: true
            },
            engagementScore: 0.5,
            autopilotRunning: false,
            newHighScore: false,
            lastPostTime: null,
            platformData: {
                instagram: { active: true, todayPosts: 0 },
                youtube: { active: true, todayPosts: 0 }
            },
            totalPostsToday: 0,
            error: error.message
        });
    }
});
// GET /api/chart/activity - Historical activity data for chart visualization
router.get('/activity', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const limit = parseInt(req.query.limit) || 100;
        // Get activity data from ActivityLog
        const posts = await (0, activityLog_1.getActivityFeed)(limit);
        const now = Date.now();
        const timeWindow = days * 24 * 60 * 60 * 1000;
        const recentPosts = posts.filter((post) => {
            const timestamp = post.timestamp;
            return new Date(timestamp).getTime() > now - timeWindow;
        });
        // Group by day and platform
        const dailyData = {};
        recentPosts.forEach((post) => {
            var _a, _b;
            const timestamp = post.timestamp || post.startTime;
            const date = new Date(timestamp).toDateString();
            if (!dailyData[date]) {
                dailyData[date] = { instagram: 0, youtube: 0, total: 0 };
            }
            if (typeof post.platform === 'string') {
                if (post.platform === 'instagram')
                    dailyData[date].instagram++;
                if (post.platform === 'youtube')
                    dailyData[date].youtube++;
            }
            else {
                if ((_a = post.platform) === null || _a === void 0 ? void 0 : _a.instagram)
                    dailyData[date].instagram++;
                if ((_b = post.platform) === null || _b === void 0 ? void 0 : _b.youtube)
                    dailyData[date].youtube++;
            }
            dailyData[date].total++;
        });
        res.json({
            success: true,
            dailyData,
            totalPosts: recentPosts.length,
            timeWindow: `${days} days`,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('❌ Chart activity error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            dailyData: {},
            totalPosts: 0
        });
    }
});
exports.default = router;
