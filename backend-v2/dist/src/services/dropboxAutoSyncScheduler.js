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
exports.dropboxAutoSyncScheduler = void 0;
const cron = __importStar(require("node-cron"));
const dropboxAutoSync_1 = require("./dropboxAutoSync");
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
class DropboxAutoSyncScheduler {
    constructor() {
        this.syncJob = null;
        this.isRunning = false;
    }
    /**
     * Start the auto-sync scheduler
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️ Dropbox auto-sync scheduler is already running');
            return;
        }
        // Run every 30 minutes
        this.syncJob = cron.schedule('*/30 * * * *', async () => {
            await this.performScheduledSync();
        });
        this.isRunning = true;
        console.log('⏰ Dropbox auto-sync scheduler started (runs every 30 minutes)');
    }
    /**
     * Stop the auto-sync scheduler
     */
    stop() {
        if (this.syncJob) {
            this.syncJob.destroy();
            this.syncJob = null;
        }
        this.isRunning = false;
        console.log('⏹️ Dropbox auto-sync scheduler stopped');
    }
    /**
     * Check if scheduler is running
     */
    isActive() {
        return this.isRunning;
    }
    /**
     * Perform scheduled sync
     */
    async performScheduledSync() {
        console.log('🔄 Running scheduled Dropbox sync...');
        try {
            // Check if Dropbox auto-sync is enabled in settings
            const settings = await SettingsModel_1.default.findOne();
            if (!(settings === null || settings === void 0 ? void 0 : settings.dropboxToken)) {
                console.log('⚠️ Dropbox token not configured - skipping scheduled sync');
                return;
            }
            // Only sync if dropboxSave setting is enabled (indicates user wants Dropbox integration)
            if (!settings.dropboxSave) {
                console.log('📭 Dropbox auto-sync disabled in settings - skipping');
                return;
            }
            // Perform sync with conservative limits for scheduled runs
            const syncStats = await dropboxAutoSync_1.dropboxAutoSync.syncDropboxVideos({
                platform: 'both',
                limit: 10 // Conservative limit for scheduled runs
            });
            if (syncStats.newFiles > 0) {
                console.log(`✅ Scheduled sync completed: ${syncStats.newFiles} new videos added`);
            }
            else {
                console.log('📭 Scheduled sync completed: no new videos found');
            }
        }
        catch (error) {
            console.error('❌ Scheduled Dropbox sync failed:', error);
        }
    }
    /**
     * Trigger manual sync (for API calls)
     */
    async triggerManualSync(options = {}) {
        console.log('🔄 Manual Dropbox sync triggered...');
        try {
            const syncStats = await dropboxAutoSync_1.dropboxAutoSync.syncDropboxVideos(options);
            console.log('✅ Manual sync completed:', syncStats);
            return syncStats;
        }
        catch (error) {
            console.error('❌ Manual Dropbox sync failed:', error);
            throw error;
        }
    }
}
exports.dropboxAutoSyncScheduler = new DropboxAutoSyncScheduler();
