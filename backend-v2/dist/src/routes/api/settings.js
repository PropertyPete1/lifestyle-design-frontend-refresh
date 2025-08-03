"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SettingsModel_1 = __importDefault(require("../../models/SettingsModel"));
const router = express_1.default.Router();
// GET /api/settings - Load user settings
router.get('/', async (req, res) => {
    try {
        // For now, get the first settings document (single user)
        let settings = await SettingsModel_1.default.findOne();
        if (!settings) {
            // Create default settings if none exist
            settings = new SettingsModel_1.default({
                instagramToken: '',
                instagramAccount: '',
                facebookPage: '',
                youtubeToken: '',
                youtubeRefresh: '',
                youtubeChannel: '',
                dropboxToken: '',
                mongodbUri: '',
                runwayApi: '',
                openaiApi: '',
                s3AccessKey: '',
                s3SecretKey: '',
                s3Bucket: '',
                s3Region: '',
                autopilot: false,
                manual: true,
                postTime: '12:00',
                peakHours: false,
                maxPosts: 5,
                repostDelay: 24,
                thumbnailMode: 'auto',
                editorStyle: 'standard',
                cartoon: false,
                postToInstagram: true,
                postToYouTube: true,
                crossPost: false,
                dropboxFolder: '',
                fileRetention: 30
            });
            await settings.save();
        }
        res.json(settings);
    }
    catch (error) {
        console.error('Error loading settings:', error);
        res.status(500).json({ error: 'Failed to load settings' });
    }
});
// POST /api/settings - Save user settings
router.post('/', async (req, res) => {
    try {
        // Update or create settings (upsert)
        const settings = await SettingsModel_1.default.findOneAndUpdate({}, // Empty filter to match any document
        req.body, {
            new: true, // Return updated document
            upsert: true, // Create if doesn't exist
            runValidators: true
        });
        res.json(settings);
    }
    catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});
exports.default = router;
