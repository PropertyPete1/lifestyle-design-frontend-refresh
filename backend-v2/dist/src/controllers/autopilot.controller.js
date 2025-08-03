"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAutopilotStatus = exports.runAutopilot = void 0;
const settings_1 = require("../db/settings");
const instagramScraper_1 = require("../services/instagramScraper");
const videoSelector_1 = require("../services/videoSelector");
const poster_1 = require("../services/poster");
const activityLog_1 = require("../services/activityLog");
const storageHealth_1 = require("../services/storageHealth");
const s3Uploader_1 = require("../utils/s3Uploader");
const generateThumbnail_1 = require("../utils/generateThumbnail");
const videoUtils_1 = require("../utils/videoUtils");
const runAutopilot = async (req, res) => {
    const settings = await (0, settings_1.getSettings)();
    const { postDelay = 30, repostStrategy, dailyPostLimit, autopilotPlatforms } = settings;
    // 1. ✅ Enforce daily post limit
    const postsToday = await (0, activityLog_1.getTodayPostCount)();
    if (postsToday >= dailyPostLimit) {
        return res.json({ success: false, error: 'Daily post limit reached' });
    }
    // 2. ✅ Storage checks
    const s3Okay = await (0, storageHealth_1.checkS3Storage)();
    const mongoOkay = await (0, storageHealth_1.checkMongoStorage)();
    if (!s3Okay || !mongoOkay) {
        return res.json({ success: false, error: 'Storage warning: S3 or MongoDB near capacity' });
    }
    // 3. ✅ Scrape Instagram + filter by repost strategy
    const scrapedVideos = await (0, instagramScraper_1.getVideosFromInstagram)();
    const selectedVideos = repostStrategy === 'high-performers'
        ? (0, videoSelector_1.getTopVideos)(scrapedVideos)
        : (0, videoSelector_1.getAllVideos)(scrapedVideos);
    for (const video of selectedVideos) {
        // 4. ✅ Repost cooldown check
        const tooSoon = await (0, instagramScraper_1.wasPostedRecently)(video.id, postDelay);
        if (tooSoon)
            continue;
        // 5. ✅ Download + generate thumbnail
        const { localPath } = await (0, videoUtils_1.extractVideoMetadata)(video);
        const thumbnailPath = await (0, generateThumbnail_1.generateThumbnail)(localPath);
        // 6. ✅ Upload to S3
        const s3Url = await (0, s3Uploader_1.uploadToS3)(localPath);
        const s3Thumb = await (0, s3Uploader_1.uploadToS3)(thumbnailPath);
        const caption = video.caption;
        // 7. ✅ Post to active platforms
        if (autopilotPlatforms.instagram) {
            await (0, poster_1.postToInstagram)({ videoUrl: s3Url, caption });
        }
        if (autopilotPlatforms.youtube) {
            await (0, poster_1.postToYouTube)({ videoUrl: s3Url, caption, thumbnail: s3Thumb });
        }
        // 8. ✅ Log to activity feed
        await (0, activityLog_1.saveToActivityLog)({
            platform: autopilotPlatforms,
            videoId: video.id,
            thumbnailUrl: s3Thumb,
            timestamp: new Date(),
            caption,
        });
        return res.json({ success: true });
    }
    return res.json({ success: false, error: 'No eligible videos to post' });
};
exports.runAutopilot = runAutopilot;
const getAutopilotStatus = async (req, res) => {
    try {
        const settings = await (0, settings_1.getSettings)();
        const postsToday = await (0, activityLog_1.getTodayPostCount)();
        const s3Healthy = await (0, storageHealth_1.checkS3Storage)();
        const mongoHealthy = await (0, storageHealth_1.checkMongoStorage)();
        return res.json({
            success: true,
            data: {
                enabled: settings.autopilot || false,
                dailyPostCount: postsToday,
                dailyPostLimit: settings.dailyPostLimit || 5,
                repostStrategy: settings.repostStrategy || 'high-performers',
                platforms: settings.autopilotPlatforms || { instagram: true, youtube: true },
                storage: {
                    s3Healthy,
                    mongoHealthy
                }
            }
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get status'
        });
    }
};
exports.getAutopilotStatus = getAutopilotStatus;
