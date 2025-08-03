"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlatformPostCounts = exports.getGraphStats = void 0;
const activityLog_1 = __importDefault(require("../models/activityLog"));
/**
 * Chart Metrics Service
 * Provides data for dashboard charts and analytics
 */
const getGraphStats = async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentActivity = await activityLog_1.default.find({
        timestamp: { $gte: thirtyDaysAgo }
    }).sort({ timestamp: 1 });
    // Group by date for chart display
    const dailyStats = {};
    recentActivity.forEach(activity => {
        const date = activity.timestamp.toISOString().split('T')[0];
        if (!dailyStats[date]) {
            dailyStats[date] = { instagram: 0, youtube: 0 };
        }
        if (activity.platform === 'instagram')
            dailyStats[date].instagram++;
        if (activity.platform === 'youtube')
            dailyStats[date].youtube++;
    });
    return Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        instagram: stats.instagram,
        youtube: stats.youtube
    }));
};
exports.getGraphStats = getGraphStats;
const getPlatformPostCounts = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [instagramToday, youtubeToday, instagramTotal, youtubeTotal] = await Promise.all([
        activityLog_1.default.countDocuments({
            platform: 'instagram',
            timestamp: { $gte: today }
        }),
        activityLog_1.default.countDocuments({
            platform: 'youtube',
            timestamp: { $gte: today }
        }),
        activityLog_1.default.countDocuments({ platform: 'instagram' }),
        activityLog_1.default.countDocuments({ platform: 'youtube' })
    ]);
    return {
        instagram: { today: instagramToday, total: instagramTotal },
        youtube: { today: youtubeToday, total: youtubeTotal }
    };
};
exports.getPlatformPostCounts = getPlatformPostCounts;
