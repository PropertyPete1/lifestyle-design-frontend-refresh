"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSettings = getSettings;
exports.updateSettings = updateSettings;
exports.isAutopilotReady = isAutopilotReady;
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
/**
 * Get application settings from database
 */
async function getSettings() {
    try {
        const settings = await SettingsModel_1.default.findOne();
        if (!settings) {
            console.log('⚠️ No settings found, using defaults');
            return getDefaultSettings();
        }
        return {
            autopilot: settings.autopilot || false,
            postDelay: settings.postDelay || 30,
            repostStrategy: settings.repostStrategy || 'high-performers',
            dailyPostLimit: settings.dailyPostLimit || 5,
            autopilotPlatforms: settings.autopilotPlatforms || { instagram: true, youtube: true },
            minViews: settings.minViews || 500,
            maxPosts: settings.maxPosts || 3,
            postTime: settings.postTime || '14:00',
            timezone: settings.timezone || 'America/Chicago',
            instagramToken: settings.instagramToken,
            instagramAccount: settings.instagramAccount,
            youtubeToken: settings.youtubeToken,
            youtubeRefresh: settings.youtubeRefresh,
            youtubeClientId: settings.youtubeClientId,
            youtubeClientSecret: settings.youtubeClientSecret,
            openaiApi: settings.openaiApi,
            dropboxToken: settings.dropboxToken,
            dropboxSave: settings.dropboxSave || false,
            dropboxFolder: settings.dropboxFolder || '/Autopilot_Posts',
            postToInstagram: settings.postToInstagram !== false, // Default to true
            postToYouTube: settings.postToYouTube !== false, // Default to true
            // nextScheduledRun removed - not in SettingsModel schema
        };
    }
    catch (error) {
        console.error('❌ Failed to get settings:', error);
        return getDefaultSettings();
    }
}
/**
 * Update application settings
 */
async function updateSettings(updates) {
    try {
        const settings = await SettingsModel_1.default.findOneAndUpdate({}, { $set: updates }, { new: true, upsert: true });
        console.log('✅ Settings updated successfully');
        return await getSettings();
    }
    catch (error) {
        console.error('❌ Failed to update settings:', error);
        throw error;
    }
}
/**
 * Get default settings when none exist
 */
function getDefaultSettings() {
    return {
        autopilot: false,
        postDelay: 30,
        repostStrategy: 'high-performers',
        dailyPostLimit: 5,
        autopilotPlatforms: { instagram: true, youtube: true },
        minViews: 500,
        maxPosts: 3,
        postTime: '14:00',
        timezone: 'America/Chicago',
        dropboxSave: false,
        dropboxFolder: '/Autopilot_Posts',
        postToInstagram: true,
        postToYouTube: true
    };
}
/**
 * Check if autopilot is enabled and properly configured
 */
async function isAutopilotReady() {
    const settings = await getSettings();
    const issues = [];
    if (!settings.autopilot) {
        issues.push('Autopilot is disabled in settings');
    }
    if (settings.autopilotPlatforms.instagram && (!settings.instagramToken || !settings.instagramAccount)) {
        issues.push('Instagram credentials not configured');
    }
    if (settings.autopilotPlatforms.youtube && (!settings.youtubeToken || !settings.youtubeRefresh)) {
        issues.push('YouTube credentials not configured');
    }
    return {
        ready: issues.length === 0,
        issues
    };
}
