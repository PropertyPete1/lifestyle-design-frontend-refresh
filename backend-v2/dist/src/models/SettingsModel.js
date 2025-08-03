"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const SettingsSchema = new mongoose_1.default.Schema({
    // Core credentials
    instagramToken: String,
    instagramAccount: String,
    facebookPage: String,
    youtubeToken: String,
    youtubeRefresh: String,
    youtubeChannel: String,
    youtubeClientId: String,
    youtubeClientSecret: String,
    youtubeApiKey: String,
    dropboxToken: String,
    mongodbUri: String,
    runwayApi: String,
    openaiApi: String,
    s3AccessKey: String,
    s3SecretKey: String,
    s3Bucket: String,
    s3Region: String,
    // Mode settings
    autopilot: { type: Boolean, default: false },
    manual: { type: Boolean, default: true },
    // Scheduler settings
    postTime: { type: String, default: '14:00' },
    timezone: { type: String, default: 'America/Chicago' }, // Austin, Texas timezone
    peakHours: { type: Boolean, default: true },
    maxPosts: { type: Number, default: 3 },
    repostDelay: { type: Number, default: 1 },
    // Visual settings
    thumbnailMode: { type: String, default: 'first' },
    editorStyle: { type: String, default: 'simple' },
    cartoon: { type: Boolean, default: false },
    // Platform settings
    postToInstagram: { type: Boolean, default: true },
    postToYouTube: { type: Boolean, default: true },
    crossPost: { type: Boolean, default: false },
    // Storage settings
    dropboxFolder: { type: String, default: '/Bulk Upload' },
    fileRetention: { type: Number, default: 7 },
    // Phase 9 specific settings
    minViews: { type: Number, default: 10000 },
    trendingAudio: { type: Boolean, default: true },
    aiCaptions: { type: Boolean, default: true },
    dropboxSave: { type: Boolean, default: false },
    // Autopilot enhanced settings
    dailyPostLimit: { type: Number, default: 5 },
    postDelay: { type: Number, default: 30 }, // Days between reposts
    repostStrategy: { type: String, default: 'high-performers' }, // 'high-performers' or 'all'
    autopilotPlatforms: {
        instagram: { type: Boolean, default: true },
        youtube: { type: Boolean, default: true }
    },
    // Timestamps
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Update timestamps on save
SettingsSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.default = mongoose_1.default.model('Settings', SettingsSchema);
