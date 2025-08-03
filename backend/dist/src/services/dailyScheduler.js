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
exports.dailyScheduler = exports.DailyScheduler = void 0;
const mongodb_1 = require("mongodb");
const cron = __importStar(require("node-cron"));
class DailyScheduler {
    constructor() {
        this.isRunning = false;
    }
    async start() {
        try {
            console.log('🚀 Starting daily scheduler...');
            // Connect to MongoDB
            this.client = new mongodb_1.MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
            await this.client.connect();
            this.db = this.client.db(process.env.MONGODB_DB || 'lifestyle_design_auto_poster');
            // Schedule daily content processing at 6 AM
            this.dailyJob = cron.schedule('0 6 * * *', async () => {
                console.log('⏰ Daily scheduler triggered at 6 AM');
                await this.processDailyTasks();
            });
            this.isRunning = true;
            console.log('✅ Daily scheduler started (runs at 6 AM daily)');
        }
        catch (error) {
            console.error('❌ Failed to start daily scheduler:', error);
            throw error;
        }
    }
    stop() {
        if (this.dailyJob) {
            this.dailyJob.stop();
            this.dailyJob = undefined;
        }
        if (this.client) {
            this.client.close();
        }
        this.isRunning = false;
        console.log('🛑 Daily scheduler stopped');
    }
    async processDailyTasks() {
        try {
            console.log('📅 Processing daily tasks...');
            // Clean up old scheduled posts
            await this.cleanupOldPosts();
            // Update statistics
            await this.updateStatistics();
            console.log('✅ Daily tasks completed successfully');
        }
        catch (error) {
            console.error('❌ Error in daily task processing:', error);
        }
    }
    async cleanupOldPosts() {
        try {
            console.log('🧹 Cleaning up old posts...');
            const repostQueue = this.db.collection('repostqueues');
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            // Remove old completed/failed posts
            const result = await repostQueue.deleteMany({
                status: { $in: ['completed', 'failed'] },
                scheduledFor: { $lt: yesterday }
            });
            console.log(`🗑️ Cleaned up ${result.deletedCount} old posts`);
        }
        catch (error) {
            console.error('❌ Error cleaning up old posts:', error);
        }
    }
    async updateStatistics() {
        try {
            console.log('📊 Updating daily statistics...');
            // Statistics are handled by Phase 9 monitor and individual services
            // This is a placeholder for any daily stats aggregation if needed
            console.log('✅ Daily statistics updated');
        }
        catch (error) {
            console.error('❌ Error updating statistics:', error);
        }
    }
    /**
     * Manual trigger for testing
     */
    async triggerManualRun() {
        try {
            console.log('🔧 Manual daily scheduler run triggered');
            await this.processDailyTasks();
            return { success: true, message: 'Manual daily scheduler run completed' };
        }
        catch (error) {
            console.error('❌ Manual daily scheduler run failed:', error);
            throw error;
        }
    }
    getStatus() {
        return {
            isRunning: this.isRunning,
            nextRun: '6:00 AM daily',
            connected: !!this.db
        };
    }
}
exports.DailyScheduler = DailyScheduler;
exports.dailyScheduler = new DailyScheduler();
