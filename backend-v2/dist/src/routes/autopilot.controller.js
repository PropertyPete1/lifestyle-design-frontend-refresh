"use strict";
// ✅ /routes/autopilot.controller.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const autopilotPoster_1 = require("../services/autopilotPoster");
const router = express_1.default.Router();
router.post('/api/autopilot/run', async (req, res) => {
    try {
        console.log('🤖 API: Starting Autopilot via button...');
        const results = await (0, autopilotPoster_1.runAutopilot)();
        console.log(`🎯 API: Autopilot completed - ${results.posted} posts created`);
        res.status(200).json({
            success: true,
            message: 'Autopilot executed successfully.',
            data: results
        });
    }
    catch (err) {
        console.error('❌ Autopilot error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});
exports.default = router;
