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
exports.appConfig = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class EnvironmentConfig {
    constructor() {
        this.settingsPath = path.join(__dirname, '../../settings.json');
        this.config = this.loadConfig();
    }
    loadConfig() {
        // In production, use environment variables
        if (process.env.NODE_ENV === 'production') {
            return this.loadFromEnvironment();
        }
        // In development, try to load from settings.json first, then fall back to environment
        try {
            if (fs.existsSync(this.settingsPath)) {
                const settingsData = fs.readFileSync(this.settingsPath, 'utf8');
                const settings = JSON.parse(settingsData);
                return this.convertSettingsToConfig(settings);
            }
        }
        catch (error) {
            console.warn('⚠️ Could not load settings.json, using environment variables');
        }
        return this.loadFromEnvironment();
    }
    loadFromEnvironment() {
        return {
            // Database
            mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/lifestyle-design-auto-poster',
            mongoDatabase: process.env.MONGO_DATABASE || 'lifestyle-design-auto-poster',
            // Instagram API
            instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN || '',
            instagramBusinessId: process.env.INSTAGRAM_BUSINESS_ID || '',
            instagramAppId: process.env.INSTAGRAM_APP_ID || '',
            instagramUserId: process.env.INSTAGRAM_USER_ID || '',
            // YouTube API
            youtubeApiKey: process.env.YOUTUBE_API_KEY || '',
            youtubeClientId: process.env.YOUTUBE_CLIENT_ID || '',
            youtubeClientSecret: process.env.YOUTUBE_CLIENT_SECRET || '',
            youtubeRefreshToken: process.env.YOUTUBE_REFRESH_TOKEN || '',
            youtubeChannelId: process.env.YOUTUBE_CHANNEL_ID || '',
            // AI Services
            openaiApiKey: process.env.OPENAI_API_KEY || '',
            // Storage
            dropboxApiKey: process.env.DROPBOX_API_KEY || '',
            // App Settings
            port: parseInt(process.env.PORT || '3001'),
            nodeEnv: process.env.NODE_ENV || 'development',
            phase9AutopilotMode: process.env.PHASE9_AUTOPILOT_MODE || 'both',
            maxRepostsPerDay: parseInt(process.env.MAX_REPOSTS_PER_DAY || '8'),
            minDaysBetweenPosts: parseInt(process.env.MIN_DAYS_BETWEEN_POSTS || '20'),
            // Phase 9 Settings
            phase9Settings: {
                minPerformanceScore: parseInt(process.env.MIN_PERFORMANCE_SCORE || '1000'),
                repostDelay: parseInt(process.env.REPOST_DELAY || '1'),
                enableYouTubeReposts: process.env.ENABLE_YOUTUBE_REPOSTS !== 'false',
                enableInstagramReposts: process.env.ENABLE_INSTAGRAM_REPOSTS !== 'false',
                maxRepostsPerDay: parseInt(process.env.MAX_REPOSTS_PER_DAY || '8'),
                maxRepostsPerPlatform: parseInt(process.env.MAX_REPOSTS_PER_PLATFORM || '4'),
                dailyScheduling: {
                    enabled: process.env.DAILY_SCHEDULING_ENABLED !== 'false',
                    scheduleTime: process.env.DAILY_SCHEDULE_TIME || '0 2 * * *',
                    prepareForTomorrow: process.env.PREPARE_FOR_TOMORROW !== 'false',
                    maxPostsPerDay: parseInt(process.env.MAX_POSTS_PER_DAY || '8'),
                    maxPostsPerPlatform: parseInt(process.env.MAX_POSTS_PER_PLATFORM || '4'),
                    peakHoursOnly: process.env.PEAK_HOURS_ONLY !== 'false'
                },
                dropboxSync: {
                    enabled: process.env.DROPBOX_SYNC_ENABLED !== 'false',
                    syncPath: process.env.DROPBOX_SYNC_PATH || '/SyncedInstagramPosts/',
                    filenameFormat: process.env.DROPBOX_FILENAME_FORMAT || 'YYYY-MM-DD_CaptionSnippet.mp4',
                    preventDuplicates: process.env.PREVENT_DUPLICATES !== 'false'
                },
                contentRefresh: {
                    enabled: process.env.CONTENT_REFRESH_ENABLED !== 'false',
                    refreshAfterPost: process.env.REFRESH_AFTER_POST !== 'false',
                    refreshAudio: process.env.REFRESH_AUDIO !== 'false',
                    refreshHashtags: process.env.REFRESH_HASHTAGS !== 'false',
                    refreshDescriptions: process.env.REFRESH_DESCRIPTIONS !== 'false'
                }
            }
        };
    }
    convertSettingsToConfig(settings) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12;
        return {
            // Database
            mongoUri: settings.mongoUri || 'mongodb://localhost:27017/lifestyle-design-auto-poster',
            mongoDatabase: settings.mongoDatabase || 'lifestyle-design-auto-poster',
            // Instagram API
            instagramAccessToken: settings.instagramAccessToken || '',
            instagramBusinessId: settings.instagramBusinessId || '',
            instagramAppId: settings.instagramAppId || '',
            instagramUserId: settings.instagramUserId || '',
            // YouTube API
            youtubeApiKey: settings.youtubeApiKey || '',
            youtubeClientId: settings.youtubeClientId || '',
            youtubeClientSecret: settings.youtubeClientSecret || '',
            youtubeRefreshToken: settings.youtubeRefreshToken || '',
            youtubeChannelId: settings.youtubeChannelId || '',
            // AI Services
            openaiApiKey: settings.openaiApiKey || '',
            // Storage
            dropboxApiKey: settings.dropboxApiKey || '',
            // App Settings
            port: parseInt(process.env.PORT || '3001'),
            nodeEnv: process.env.NODE_ENV || 'development',
            phase9AutopilotMode: settings.phase9AutopilotMode || settings.autopostMode || 'both',
            maxRepostsPerDay: ((_a = settings.phase9Settings) === null || _a === void 0 ? void 0 : _a.maxRepostsPerDay) || 8,
            minDaysBetweenPosts: settings.minDaysBetweenPosts || 20,
            // Phase 9 Settings
            phase9Settings: {
                minPerformanceScore: ((_b = settings.phase9Settings) === null || _b === void 0 ? void 0 : _b.minPerformanceScore) || 1000,
                repostDelay: ((_c = settings.phase9Settings) === null || _c === void 0 ? void 0 : _c.repostDelay) || 1,
                enableYouTubeReposts: ((_d = settings.phase9Settings) === null || _d === void 0 ? void 0 : _d.enableYouTubeReposts) !== false,
                enableInstagramReposts: ((_e = settings.phase9Settings) === null || _e === void 0 ? void 0 : _e.enableInstagramReposts) !== false,
                maxRepostsPerDay: ((_f = settings.phase9Settings) === null || _f === void 0 ? void 0 : _f.maxRepostsPerDay) || 8,
                maxRepostsPerPlatform: ((_g = settings.phase9Settings) === null || _g === void 0 ? void 0 : _g.maxRepostsPerPlatform) || 4,
                dailyScheduling: {
                    enabled: ((_j = (_h = settings.phase9Settings) === null || _h === void 0 ? void 0 : _h.dailyScheduling) === null || _j === void 0 ? void 0 : _j.enabled) !== false,
                    scheduleTime: ((_l = (_k = settings.phase9Settings) === null || _k === void 0 ? void 0 : _k.dailyScheduling) === null || _l === void 0 ? void 0 : _l.scheduleTime) || '0 2 * * *',
                    prepareForTomorrow: ((_o = (_m = settings.phase9Settings) === null || _m === void 0 ? void 0 : _m.dailyScheduling) === null || _o === void 0 ? void 0 : _o.prepareForTomorrow) !== false,
                    maxPostsPerDay: ((_q = (_p = settings.phase9Settings) === null || _p === void 0 ? void 0 : _p.dailyScheduling) === null || _q === void 0 ? void 0 : _q.maxPostsPerDay) || 8,
                    maxPostsPerPlatform: ((_s = (_r = settings.phase9Settings) === null || _r === void 0 ? void 0 : _r.dailyScheduling) === null || _s === void 0 ? void 0 : _s.maxPostsPerPlatform) || 4,
                    peakHoursOnly: ((_u = (_t = settings.phase9Settings) === null || _t === void 0 ? void 0 : _t.dailyScheduling) === null || _u === void 0 ? void 0 : _u.peakHoursOnly) !== false
                },
                dropboxSync: {
                    enabled: ((_w = (_v = settings.phase9Settings) === null || _v === void 0 ? void 0 : _v.dropboxSync) === null || _w === void 0 ? void 0 : _w.enabled) !== false,
                    syncPath: ((_y = (_x = settings.phase9Settings) === null || _x === void 0 ? void 0 : _x.dropboxSync) === null || _y === void 0 ? void 0 : _y.syncPath) || '/SyncedInstagramPosts/',
                    filenameFormat: ((_0 = (_z = settings.phase9Settings) === null || _z === void 0 ? void 0 : _z.dropboxSync) === null || _0 === void 0 ? void 0 : _0.filenameFormat) || 'YYYY-MM-DD_CaptionSnippet.mp4',
                    preventDuplicates: ((_2 = (_1 = settings.phase9Settings) === null || _1 === void 0 ? void 0 : _1.dropboxSync) === null || _2 === void 0 ? void 0 : _2.preventDuplicates) !== false
                },
                contentRefresh: {
                    enabled: ((_4 = (_3 = settings.phase9Settings) === null || _3 === void 0 ? void 0 : _3.contentRefresh) === null || _4 === void 0 ? void 0 : _4.enabled) !== false,
                    refreshAfterPost: ((_6 = (_5 = settings.phase9Settings) === null || _5 === void 0 ? void 0 : _5.contentRefresh) === null || _6 === void 0 ? void 0 : _6.refreshAfterPost) !== false,
                    refreshAudio: ((_8 = (_7 = settings.phase9Settings) === null || _7 === void 0 ? void 0 : _7.contentRefresh) === null || _8 === void 0 ? void 0 : _8.refreshAudio) !== false,
                    refreshHashtags: ((_10 = (_9 = settings.phase9Settings) === null || _9 === void 0 ? void 0 : _9.contentRefresh) === null || _10 === void 0 ? void 0 : _10.refreshHashtags) !== false,
                    refreshDescriptions: ((_12 = (_11 = settings.phase9Settings) === null || _11 === void 0 ? void 0 : _11.contentRefresh) === null || _12 === void 0 ? void 0 : _12.refreshDescriptions) !== false
                }
            }
        };
    }
    getConfig() {
        return this.config;
    }
    get(key) {
        return this.config[key];
    }
    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        // In development, also update settings.json
        if (process.env.NODE_ENV !== 'production') {
            try {
                const currentSettings = fs.existsSync(this.settingsPath)
                    ? JSON.parse(fs.readFileSync(this.settingsPath, 'utf8'))
                    : {};
                const updatedSettings = { ...currentSettings, ...updates };
                fs.writeFileSync(this.settingsPath, JSON.stringify(updatedSettings, null, 2));
            }
            catch (error) {
                console.warn('⚠️ Could not update settings.json:', error);
            }
        }
    }
    validateConfig() {
        const required = [
            'instagramAccessToken',
            'instagramBusinessId',
            'youtubeApiKey',
            'youtubeClientId',
            'youtubeClientSecret',
            'youtubeRefreshToken',
            'openaiApiKey'
        ];
        const missing = required.filter(key => !this.config[key]);
        return {
            valid: missing.length === 0,
            missing
        };
    }
}
// Export singleton instance
exports.appConfig = new EnvironmentConfig();
exports.default = exports.appConfig;
