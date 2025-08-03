"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activityLog_1 = require("../../../services/activityLog");
const router = express_1.default.Router();
/**
 * Get autopilot activity feed
 * Alternative endpoint for activity data specifically for autopilot posts
 */
router.get('/', async (req, res) => {
    try {
        // Get limit from query parameter, default to 100
        const limit = parseInt(req.query.limit) || 100;
        // ✅ NEW: Use fast cached activity feed first, fallback to database
        let posts = await (0, activityLog_1.getActivityFeed)();
        // If cache is empty or insufficient, try database
        if (posts.length === 0) {
            posts = await (0, activityLog_1.getRecentActivity)(limit);
        }
        else {
            // Limit the cached results
            posts = posts.slice(0, limit);
        }
        res.json({
            success: true,
            posts,
            count: posts.length,
            timestamp: new Date()
        });
    }
    catch (error) {
        console.error('❌ Autopilot activity feed error:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get activity feed',
            posts: []
        });
    }
});
exports.default = router;
