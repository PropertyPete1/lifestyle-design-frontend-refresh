"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activityLog_1 = require("../../services/activityLog");
const storageHealth_1 = require("../../services/storageHealth");
const router = express_1.default.Router();
/**
 * Get recent activity feed
 */
router.get('/feed', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const activities = await (0, activityLog_1.getRecentActivity)(limit);
        res.json({
            success: true,
            data: activities,
            count: activities.length
        });
    }
    catch (error) {
        console.error('❌ Activity feed error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get activity feed'
        });
    }
});
/**
 * Get posting statistics
 */
router.get('/stats', async (req, res) => {
    try {
        const stats = await (0, activityLog_1.getPostingStats)();
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        console.error('❌ Activity stats error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get posting stats'
        });
    }
});
/**
 * Get storage health metrics
 */
router.get('/storage', async (req, res) => {
    try {
        const metrics = await (0, storageHealth_1.getStorageMetrics)();
        res.json({
            success: true,
            data: metrics
        });
    }
    catch (error) {
        console.error('❌ Storage metrics error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get storage metrics'
        });
    }
});
/**
 * Get comprehensive dashboard data
 */
router.get('/dashboard', async (req, res) => {
    try {
        const [recentActivity, postingStats, storageMetrics] = await Promise.all([
            (0, activityLog_1.getRecentActivity)(5),
            (0, activityLog_1.getPostingStats)(),
            (0, storageHealth_1.getStorageMetrics)()
        ]);
        res.json({
            success: true,
            data: {
                recentActivity,
                postingStats,
                storageMetrics,
                timestamp: new Date()
            }
        });
    }
    catch (error) {
        console.error('❌ Dashboard data error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get dashboard data'
        });
    }
});
exports.default = router;
