"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settings_1 = __importDefault(require("./api/settings"));
// instagram route removed - autopilot handles Instagram functionality
const youtube_1 = __importDefault(require("./api/youtube"));
// phase9Router moved to backend/src/routes/api/phase9_legacy.ts for reference
// audio route removed - not needed for autopilot functionality
const autopilot_1 = __importDefault(require("./api/autopilot"));
// upload route removed - not needed for autopilot functionality
// manual route removed - not needed for autopilot functionality
const oauth_1 = __importDefault(require("./api/oauth"));
// smartScheduler route removed - autopilot handles all scheduling
const activity_1 = __importDefault(require("./api/activity"));
const chart_1 = __importDefault(require("./api/chart"));
const thumbnails_1 = __importDefault(require("./api/thumbnails"));
const router = express_1.default.Router();
// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'backend-v2',
        timestamp: new Date().toISOString()
    });
});
// Settings routes
router.use('/settings', settings_1.default);
// Analytics routes
// Instagram functionality handled by autopilot controller
router.use('/youtube', youtube_1.default);
// Phase 9 routes removed - legacy version moved to original backend
// Audio routes
// Audio functionality not needed for autopilot
// Autopilot routes
router.use('/autopilot', autopilot_1.default);
// Upload routes
// Upload functionality not needed for autopilot
// Manual posting routes
// Manual posting not needed - autopilot handles all posting
// OAuth routes
router.use('/oauth', oauth_1.default);
// Smart Scheduler routes
// Smart scheduler replaced by autopilot system
// Activity and Analytics routes
router.use('/activity', activity_1.default);
// Chart data routes
router.use('/chart', chart_1.default);
// S3 Thumbnail routes for dashboard previews
router.use('/thumbnails', thumbnails_1.default);
exports.default = router;
