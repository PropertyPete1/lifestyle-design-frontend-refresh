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
exports.getUserSettings = getUserSettings;
exports.updateUserSettings = updateUserSettings;
const mongoose_1 = __importStar(require("mongoose"));
const UserSettingsSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        default: 'default_user' // Single user system for now
    },
    // Core API Credentials
    instagramToken: { type: String, default: '' },
    instagramAccountId: { type: String, default: '' },
    facebookPageId: { type: String, default: '' },
    youtubeToken: { type: String, default: '' },
    youtubeRefreshToken: { type: String, default: '' },
    youtubeChannelId: { type: String, default: '' },
    dropboxToken: { type: String, default: '' },
    mongodbUri: { type: String, default: '' },
    // Optional API Credentials
    runwayApiKey: { type: String, default: '' },
    openaiApiKey: { type: String, default: '' },
    s3AccessKey: { type: String, default: '' },
    s3SecretKey: { type: String, default: '' },
    s3Bucket: { type: String, default: '' },
    s3Region: { type: String, default: '' },
    // Operation Modes
    autopilotEnabled: { type: Boolean, default: false },
    manualMode: { type: Boolean, default: true },
    // Scheduler Settings
    postTime: { type: String, default: '14:00' },
    peakHoursEnabled: { type: Boolean, default: true },
    maxPostsPerDay: { type: Number, default: 5 },
    repostDelayDays: { type: Number, default: 1 },
    // App Visuals & Features
    thumbnailMode: {
        type: String,
        enum: ['first', 'best', 'manual'],
        default: 'first'
    },
    editorStyle: {
        type: String,
        enum: ['simple', 'advanced'],
        default: 'simple'
    },
    cartoonEnabled: { type: Boolean, default: true },
    postToInstagram: { type: Boolean, default: true },
    postToYouTube: { type: Boolean, default: true },
    crossPostEnabled: { type: Boolean, default: true },
    // Storage Settings
    dropboxFolder: { type: String, default: '/Bulk Upload' },
    fileRetentionDays: { type: Number, default: 7 }
}, {
    timestamps: true
});
// Helper functions for user settings
async function getUserSettings(userId = 'default_user') {
    try {
        let settings = await UserSettings.findOne({ userId });
        if (!settings) {
            // Create default settings if none exist
            settings = new UserSettings({ userId });
            await settings.save();
            console.log(`✅ Created default settings for user: ${userId}`);
        }
        return settings;
    }
    catch (error) {
        console.error('❌ Error retrieving user settings:', error);
        throw error;
    }
}
async function updateUserSettings(userId = 'default_user', updates) {
    try {
        const settings = await UserSettings.findOneAndUpdate({ userId }, { ...updates, userId }, // Ensure userId is preserved
        { upsert: true, new: true });
        console.log(`✅ Updated settings for user: ${userId}`);
        return settings;
    }
    catch (error) {
        console.error('❌ Error updating user settings:', error);
        throw error;
    }
}
const UserSettings = mongoose_1.default.model('UserSettings', UserSettingsSchema);
exports.default = UserSettings;
