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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autopilotScheduler = void 0;
const cron = __importStar(require("node-cron"));
const autopilot_controller_1 = require("../controllers/autopilot.controller");
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
class AutopilotScheduler {
    constructor() {
        this.cronJob = null;
        this.isRunning = false;
    }
    /**
     * Start the autopilot scheduler (checks every 15 minutes)
     */
    start() {
        if (this.cronJob) {
            console.log('🔄 Autopilot scheduler already running');
            return;
        }
        // Run every 15 minutes
        this.cronJob = cron.schedule('*/15 * * * *', async () => {
            await this.checkAndRunAutopilot();
        });
        console.log('⏰ Autopilot scheduler started (runs every 15 minutes)');
        this.isRunning = true;
    }
    /**
     * Stop the autopilot scheduler
     */
    stop() {
        if (this.cronJob) {
            this.cronJob.destroy();
            this.cronJob = null;
            this.isRunning = false;
            console.log('⏹️ Autopilot scheduler stopped');
        }
    }
    /**
     * Check if autopilot should run and execute if needed
     */
    async checkAndRunAutopilot() {
        try {
            // Get current settings
            const settings = await SettingsModel_1.default.findOne();
            // Only run if autopilot is enabled
            if (!settings || !settings.autopilot) {
                return;
            }
            // Check if we should run based on schedule
            const shouldRun = await this.shouldRunNow(settings);
            if (shouldRun) {
                console.log('🚀 Running scheduled autopilot with clean controller...');
                // Create mock req/res objects for the controller
                const mockReq = {};
                const mockRes = {
                    json: (data) => {
                        console.log('📊 Scheduled autopilot result:', data);
                        return mockRes;
                    }
                };
                await (0, autopilot_controller_1.runAutopilot)(mockReq, mockRes);
            }
            else {
                // Only log occasionally to reduce noise
                const minute = new Date().getMinutes();
                if (minute % 30 === 0) { // Log every 30 minutes
                    console.log('⏰ Autopilot scheduler active - next check in 15 minutes');
                }
            }
        }
        catch (error) {
            console.error('❌ Autopilot scheduler error:', error);
        }
    }
    /**
     * Determine if autopilot should run now based on settings
     */
    async shouldRunNow(settings) {
        const now = new Date();
        const [hours, minutes] = (settings.postTime || '14:00').split(':').map(Number);
        // Check if we're within 15 minutes of the scheduled post time
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
        const fifteenMinutes = 15 * 60 * 1000;
        // Only run if we're close to the scheduled time
        return timeDiff <= fifteenMinutes;
    }
    /**
     * Get scheduler status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            nextRun: this.cronJob ? 'Every 15 minutes' : null
        };
    }
}
exports.autopilotScheduler = new AutopilotScheduler();
