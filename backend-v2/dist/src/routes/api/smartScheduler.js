"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const smartPostScheduler_1 = require("../../services/smartPostScheduler");
const router = express_1.default.Router();
// GET /api/smart-scheduler/status
// Get smart post scheduler status
router.get('/status', async (req, res) => {
    try {
        const status = smartPostScheduler_1.smartPostScheduler.getStatus();
        res.json({
            success: true,
            message: 'Smart scheduler status retrieved',
            status: {
                ...status,
                description: status.isRunning ?
                    'Smart scheduler posts 4 times daily at optimal engagement times (6 AM, 11:30 AM, 2 PM, 7:30 PM)' :
                    'Smart scheduler is currently stopped'
            }
        });
    }
    catch (error) {
        console.error('Error getting smart scheduler status:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get smart scheduler status'
        });
    }
});
// POST /api/smart-scheduler/generate-schedule
// Manually trigger schedule generation
router.post('/generate-schedule', async (req, res) => {
    try {
        console.log('🔄 Manual schedule generation triggered...');
        await smartPostScheduler_1.smartPostScheduler.triggerScheduleGeneration();
        res.json({
            success: true,
            message: 'Smart schedule generation triggered successfully',
            note: 'Check server logs for detailed schedule creation'
        });
    }
    catch (error) {
        console.error('Error triggering schedule generation:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to trigger schedule generation'
        });
    }
});
exports.default = router;
