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
exports.dailyHashtagRefresh = exports.DailyHashtagRefreshService = void 0;
const cron = __importStar(require("node-cron"));
const youtubeScraper_1 = require("./youtubeScraper");
const instagramScraper_1 = require("./instagramScraper");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class DailyHashtagRefreshService {
    constructor() {
        this.refreshJob = null;
    }
    /**
     * Start daily hashtag refresh scheduler
     * Runs every day at 3 AM to refresh hashtag data
     */
    start() {
        console.log('🔄 Starting daily hashtag refresh scheduler...');
        this.refreshJob = cron.schedule('0 3 * * *', async () => {
            console.log('🌅 Daily hashtag refresh triggered at:', new Date());
            await this.performDailyRefresh();
        });
        console.log('✅ Daily hashtag refresh scheduler started (runs at 3 AM daily)');
    }
    /**
     * Stop the daily refresh scheduler
     */
    stop() {
        if (this.refreshJob) {
            this.refreshJob.stop();
            this.refreshJob = null;
            console.log('❌ Daily hashtag refresh scheduler stopped');
        }
    }
    /**
     * Load credentials from settings.json
     */
    loadCredentials() {
        try {
            const settingsPath = path.resolve(__dirname, '../../settings.json');
            if (fs.existsSync(settingsPath)) {
                const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                return {
                    youtube: {
                        apiKey: settings.youtubeApiKey,
                        channelId: settings.youtubeChannelId,
                        refreshToken: settings.youtubeRefreshToken
                    },
                    instagram: {
                        accessToken: settings.instagramAccessToken,
                        pageId: settings.instagramBusinessId
                    }
                };
            }
        }
        catch (error) {
            console.warn('Could not load credentials from settings.json:', error);
        }
        return null;
    }
    /**
     * Perform daily hashtag refresh by scraping latest content
     */
    async performDailyRefresh() {
        var _a, _b, _c, _d;
        try {
            console.log('🚀 Starting daily hashtag refresh process...');
            const credentials = this.loadCredentials();
            if (!credentials) {
                console.error('❌ No credentials found for daily refresh');
                return;
            }
            let refreshResults = {
                youtube: { success: false, hashtagsUpdated: 0 },
                instagram: { success: false, hashtagsUpdated: 0 },
                totalUpdated: 0
            };
            // Refresh YouTube hashtags if credentials available
            if (((_a = credentials.youtube) === null || _a === void 0 ? void 0 : _a.apiKey) && ((_b = credentials.youtube) === null || _b === void 0 ? void 0 : _b.channelId)) {
                try {
                    console.log('📺 Refreshing YouTube hashtag data...');
                    const ytScraper = new youtubeScraper_1.YouTubeScraper(credentials.youtube.apiKey, credentials.youtube.channelId, credentials.youtube.refreshToken);
                    // Scrape top performing videos to update hashtag trends
                    const videos = await ytScraper.scrapeTopPerformingVideos();
                    refreshResults.youtube = {
                        success: true,
                        hashtagsUpdated: videos.length
                    };
                    console.log(`✅ YouTube: ${refreshResults.youtube.hashtagsUpdated} hashtags updated`);
                }
                catch (ytError) {
                    console.error('❌ YouTube hashtag refresh failed:', ytError);
                    refreshResults.youtube = { success: false, hashtagsUpdated: 0 };
                }
            }
            // Refresh Instagram hashtags if credentials available
            if (((_c = credentials.instagram) === null || _c === void 0 ? void 0 : _c.accessToken) && ((_d = credentials.instagram) === null || _d === void 0 ? void 0 : _d.pageId)) {
                try {
                    console.log('📸 Refreshing Instagram hashtag data...');
                    const igScraper = new instagramScraper_1.InstagramScraper(credentials.instagram.accessToken, credentials.instagram.pageId);
                    // Scrape Instagram content to update hashtag trends
                    const content = await igScraper.scrapeTopPerformingVideos();
                    refreshResults.instagram = {
                        success: true,
                        hashtagsUpdated: content.length
                    };
                    console.log(`✅ Instagram: ${refreshResults.instagram.hashtagsUpdated} hashtags updated`);
                }
                catch (igError) {
                    console.error('❌ Instagram hashtag refresh failed:', igError);
                    refreshResults.instagram = { success: false, hashtagsUpdated: 0 };
                }
            }
            refreshResults.totalUpdated = refreshResults.youtube.hashtagsUpdated + refreshResults.instagram.hashtagsUpdated;
            console.log(`🎉 Daily hashtag refresh completed! Total hashtags updated: ${refreshResults.totalUpdated}`);
            // Log refresh activity to settings for tracking
            await this.logRefreshActivity(refreshResults);
        }
        catch (error) {
            console.error('❌ Daily hashtag refresh error:', error);
        }
    }
    /**
     * Log refresh activity to track daily refresh performance
     */
    async logRefreshActivity(results) {
        try {
            const logEntry = {
                timestamp: new Date(),
                type: 'daily_hashtag_refresh',
                results: results
            };
            const logPath = path.resolve(__dirname, '../../logs/hashtag_refresh.log');
            const logDir = path.dirname(logPath);
            // Ensure logs directory exists
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }
            // Append log entry
            fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
        }
        catch (error) {
            console.warn('Could not log refresh activity:', error);
        }
    }
    /**
     * Manually trigger hashtag refresh (for testing)
     */
    async triggerManualRefresh() {
        console.log('🔧 Manual hashtag refresh triggered');
        await this.performDailyRefresh();
        return { success: true, message: 'Manual hashtag refresh completed' };
    }
}
exports.DailyHashtagRefreshService = DailyHashtagRefreshService;
// Export singleton instance
exports.dailyHashtagRefresh = new DailyHashtagRefreshService();
