"use strict";
/**
 * 🚀 PHASE 9 AUTOPILOT - Enhanced with GridFS + Smart AI + Post Now
 *
 * This is the main autopilot execution file that can be:
 * 1. Called by cron runner/scheduler
 * 2. Triggered manually via POST /run-autopilot
 * 3. Triggered with "Post Now" for instant posting
 *
 * Enhanced Features:
 * ✅ MongoDB GridFS video storage (no Dropbox dependency)
 * ✅ Smart video re-encoding to break hash fingerprinting
 * ✅ AI-powered caption rewriting with OpenAI
 * ✅ Smart scheduler OR instant "Post Now" capability
 * ✅ YouTube posting ACTIVE and working perfectly
 * 🚨 Instagram posting TEMPORARILY DISABLED (waiting for new access token)
 * ✅ Advanced duplicate prevention
 * ✅ Trending audio integration
 * ✅ High-performance video filtering (10k+ views)
 *
 * STATUS: YouTube-only mode until Instagram permissions are fixed
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autopilotReposter = void 0;
exports.runAutopilot = runAutopilot;
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const connection_1 = require("../src/database/connection");
const SettingsModel_1 = __importDefault(require("../src/models/SettingsModel"));
// Import new utilities
const gridfs_1 = require("../src/utils/gridfs");
const videoProcessor_1 = require("../src/utils/videoProcessor");
const captionAI_1 = require("../src/utils/captionAI");
const trendingAudio_1 = require("../src/utils/trendingAudio");
const scheduler_1 = require("../src/utils/scheduler");
const uploaders_1 = require("../src/uploaders");
const graphAPI_1 = require("../src/integrations/graphAPI");
const repostTracker_1 = require("../src/db/repostTracker");
const TEMP_DIR = path_1.default.resolve(__dirname, '../temp');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// Ensure temp directory exists
if (!fs_1.default.existsSync(TEMP_DIR)) {
    fs_1.default.mkdirSync(TEMP_DIR, { recursive: true });
}
/**
 * Enhanced autopilot reposter with GridFS and smart AI features
 */
const autopilotReposter = async ({ postNow = false } = {}) => {
    console.log(`🚀 Phase 9 Enhanced Autopilot - ${postNow ? 'POST NOW' : 'SCHEDULED'} mode`);
    try {
        await (0, connection_1.connectToDatabase)();
        const settings = await SettingsModel_1.default.findOne();
        if (!settings || (!postNow && !settings.autopilot)) {
            throw new Error('Autopilot is disabled in settings');
        }
        // Get high-performing Instagram videos
        const minViews = settings.minViews || 10000;
        const posts = await (0, graphAPI_1.getHighPerformingInstagramVideos)(minViews);
        if (posts.length === 0) {
            console.log(`📭 No high-performing videos found (${minViews}+ views)`);
            return { success: true, processed: 0, posted: 0, errors: [] };
        }
        console.log(`📱 Found ${posts.length} high-performing videos to process`);
        let processed = 0;
        let posted = 0;
        const errors = [];
        for (const post of posts) {
            // Skip if already reposted 
            if (await (0, repostTracker_1.isAlreadyReposted)(post.id)) {
                console.log(`⏭️ Skipping ${post.id} - already reposted`);
                continue;
            }
            try {
                console.log(`🎬 Processing video: ${post.id} (${post.view_count} views)`);
                // Set up file paths
                const rawVideoPath = path_1.default.join(TEMP_DIR, `${post.id}-raw.mp4`);
                const reencodedPath = path_1.default.join(TEMP_DIR, `${post.id}-ready.mp4`);
                // Check GridFS first, then download if needed
                let hasMongoVideo = await (0, gridfs_1.getVideoFromGridFS)(post.id, rawVideoPath);
                if (!hasMongoVideo) {
                    console.log(`📥 Downloading video from Instagram: ${post.video_url}`);
                    // Skip CDN URLs but allow external demo URLs
                    if (post.video_url.includes('scontent-') || post.video_url.includes('cdninstagram.com')) {
                        console.log(`🚫 Skipping Instagram CDN URL (not allowed for reposting): ${post.video_url}`);
                        errors.push(`Video ${post.id}: Instagram CDN URLs cannot be reposted`);
                        continue;
                    }
                    console.log(`✅ Processing external video URL: ${post.video_url}`);
                    // Download Instagram video 
                    console.log(`🔥 Downloading Instagram video for reposting...`);
                    try {
                        const videoResponse = await axios_1.default.get(post.video_url, {
                            responseType: 'arraybuffer',
                            timeout: 30000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                            }
                        });
                        if (!videoResponse.data || videoResponse.data.byteLength === 0) {
                            throw new Error('Downloaded video is empty');
                        }
                        fs_1.default.writeFileSync(rawVideoPath, Buffer.from(videoResponse.data, 'binary'));
                        console.log(`✅ Downloaded video: ${(videoResponse.data.byteLength / 1024 / 1024).toFixed(2)}MB`);
                        // Save to GridFS for future use
                        await (0, gridfs_1.saveVideoToGridFS)(rawVideoPath, post.id);
                        console.log(`💾 Video saved to GridFS: ${post.id}`);
                    }
                    catch (downloadError) {
                        console.error(`❌ Failed to download video ${post.id}:`, downloadError.message);
                        errors.push(`Video ${post.id}: Download failed - ${downloadError.message}`);
                        continue;
                    }
                }
                else {
                    console.log(`✅ Video retrieved from GridFS: ${post.id}`);
                }
                // Re-encode video to break hash fingerprinting
                await (0, videoProcessor_1.reencodeVideo)(rawVideoPath, reencodedPath);
                // Generate smart captions and audio
                const igCaption = await (0, captionAI_1.rewriteCaption)(post.caption, 'instagram');
                const ytTitle = await (0, captionAI_1.rewriteCaption)(post.caption, 'youtube');
                const igHashtags = await (0, captionAI_1.generateOptimizedHashtags)(igCaption, 'instagram');
                const ytHashtags = await (0, captionAI_1.generateOptimizedHashtags)(ytTitle, 'youtube');
                const igAudio = await (0, trendingAudio_1.getTrendingAudio)('instagram');
                const ytAudio = await (0, trendingAudio_1.getTrendingAudio)('youtube');
                // Smart scheduler or post now
                const igTime = postNow ? new Date() : await (0, scheduler_1.schedulePost)('instagram');
                const ytTime = postNow ? new Date() : await (0, scheduler_1.schedulePost)('youtube');
                // Upload to platforms based on settings
                let instagramId = null;
                let youtubeId = null;
                // Add delay to prevent OpenAI rate limiting
                await sleep(2000);
                console.log(`🎯 Platform settings: Instagram=${settings.postToInstagram}, YouTube=${settings.postToYouTube}`);
                // Instagram posting (only if enabled in settings)
                if (settings.postToInstagram === true) {
                    try {
                        const igCaptionWithHashtags = `${igCaption}\n\n${igHashtags.map(tag => `#${tag}`).join(' ')}`;
                        instagramId = await (0, uploaders_1.uploadToInstagram)({
                            videoPath: reencodedPath,
                            caption: igCaptionWithHashtags,
                            audio: igAudio,
                            scheduledTime: postNow ? new Date() : igTime
                        });
                        console.log(`📸 Instagram upload result: ${instagramId}`);
                    }
                    catch (igError) {
                        console.error(`❌ Instagram upload failed:`, igError);
                        errors.push(`Instagram: ${igError instanceof Error ? igError.message : 'Unknown error'}`);
                    }
                }
                else {
                    console.log(`📸 Instagram posting disabled in settings`);
                }
                // YouTube posting (only if enabled in settings)
                if (settings.postToYouTube === true) {
                    try {
                        youtubeId = await (0, uploaders_1.uploadToYouTube)({
                            videoPath: reencodedPath,
                            title: ytTitle,
                            audio: ytAudio,
                            scheduledTime: postNow ? new Date() : ytTime
                        });
                        console.log(`▶️ YouTube upload result: ${youtubeId}`);
                    }
                    catch (ytError) {
                        console.error(`❌ YouTube upload failed:`, ytError);
                        errors.push(`YouTube: ${ytError instanceof Error ? ytError.message : 'Unknown error'}`);
                    }
                }
                else {
                    console.log(`▶️ YouTube posting disabled in settings`);
                }
                // Log successful reposts for each platform separately
                if (instagramId) {
                    await (0, repostTracker_1.storeRepostLog)(post.id, {
                        caption: igCaption,
                        timestamp: new Date().toISOString(),
                        platform: 'instagram',
                        publishedId: instagramId
                    });
                }
                if (youtubeId) {
                    await (0, repostTracker_1.storeRepostLog)(post.id, {
                        caption: ytTitle,
                        timestamp: new Date().toISOString(),
                        platform: 'youtube',
                        publishedId: youtubeId
                    });
                }
                if (instagramId || youtubeId) {
                    posted++;
                }
                // Clean up temp files
                [rawVideoPath, reencodedPath].forEach(file => {
                    if (fs_1.default.existsSync(file)) {
                        fs_1.default.unlinkSync(file);
                    }
                });
                processed++;
                // If not posting now, add delay between posts
                if (!postNow && processed < posts.length) {
                    const delay = Math.floor(Math.random() * (3 * 60 * 60 * 1000 - 60 * 60 * 1000)) + 60 * 60 * 1000; // 1-3 hours
                    console.log(`⏱️ Waiting ${Math.round(delay / 1000 / 60)} minutes before next post...`);
                    await sleep(delay);
                }
            }
            catch (error) {
                console.error(`❌ Failed to process video ${post.id}:`, error);
                errors.push(`${post.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            // In postNow mode, only process one video
            if (postNow)
                break;
        }
        console.log(`🎯 Autopilot completed: ${processed} processed, ${posted} posted`);
        // Determine actual success based on posts and errors
        const hasSuccessfulPosts = posted > 0;
        const hasErrors = errors.length > 0;
        const actualSuccess = hasSuccessfulPosts || (processed > 0 && !hasErrors);
        let message;
        if (posted > 0) {
            message = `✅ Success! Posted ${posted} of ${processed} videos processed`;
        }
        else if (processed > 0 && hasErrors) {
            message = `❌ Failed to post any videos. Processed ${processed} but encountered ${errors.length} errors`;
        }
        else if (processed === 0) {
            message = `📭 No eligible videos found for posting`;
        }
        else {
            message = `⚠️ Processed ${processed} videos but none were posted successfully`;
        }
        return {
            success: actualSuccess,
            processed,
            posted,
            errors,
            message
        };
    }
    catch (error) {
        console.error('❌ Autopilot reposter failed:', error);
        return {
            success: false,
            processed: 0,
            posted: 0,
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            message: 'Autopilot execution failed'
        };
    }
};
exports.autopilotReposter = autopilotReposter;
/**
 * Main autopilot execution function (backward compatibility)
 */
async function runAutopilot(options = {}) {
    return await (0, exports.autopilotReposter)(options);
}
/**
 * If this file is run directly (for testing or manual execution)
 */
if (require.main === module) {
    console.log('🔧 Running Phase 9 Enhanced Autopilot directly...');
    // Check for postNow argument
    const postNow = process.argv.includes('--post-now') || process.argv.includes('--now');
    runAutopilot({ postNow })
        .then((result) => {
        console.log('📋 Final result:', result);
        if (result.errors && result.errors.length > 0) {
            console.log('⚠️ Errors encountered:', result.errors);
        }
        process.exit(result.success ? 0 : 1);
    })
        .catch((error) => {
        console.error('💥 Fatal error:', error);
        process.exit(1);
    });
}
exports.default = runAutopilot;
