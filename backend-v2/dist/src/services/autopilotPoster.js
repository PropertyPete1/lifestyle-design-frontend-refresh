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
exports.runAutopilot = runAutopilot;
const scrapeInstagram_1 = require("./scrapeInstagram");
const checkPostDelay_1 = require("./checkPostDelay");
const s3Uploader_1 = require("../utils/s3Uploader");
const instagram_1 = require("../uploaders/instagram");
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
/**
 * ✅ PHASE 9 - AUTOPILOT POSTING SYSTEM
 * STEP 3: Full execution flow - complete autopilot orchestrator
 */
// Convert video function (using FFmpeg like existing system)
async function convertVideo(inputPath, outputPath) {
    const { execSync } = require('child_process');
    console.log(`🎬 Converting video for Instagram format...`);
    // Use the same FFmpeg conversion as existing system
    const ffmpegCmd = `ffmpeg -y -i "${inputPath}" \
    -c:v libx264 -profile:v baseline -level 3.1 \
    -preset medium -tune zerolatency \
    -c:a aac -b:a 128k -ar 44100 -ac 2 \
    -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black,format=yuv420p" \
    -pix_fmt yuv420p -r 30 -g 60 \
    -bf 0 -refs 1 \
    -crf 23 -maxrate 3500k -bufsize 7000k \
    -avoid_negative_ts make_zero \
    -fflags +genpts \
    -movflags +faststart+frag_keyframe+empty_moov \
    -strict experimental \
    -f mp4 "${outputPath}"`;
    execSync(ffmpegCmd, { stdio: 'pipe' });
    // Verify output
    if (!fs_1.default.existsSync(outputPath)) {
        throw new Error(`Video conversion failed - output not created: ${outputPath}`);
    }
    console.log(`✅ Video converted successfully: ${outputPath}`);
}
// YouTube upload function (using existing system)
async function uploadToYouTubeAutopilot(videoPath, title, description) {
    console.log(`▶️ Uploading to YouTube: ${title}`);
    // Import YouTube uploader from existing system
    const { uploadToYouTube: youtubeUploader } = await Promise.resolve().then(() => __importStar(require('../uploaders/youtube')));
    const result = await youtubeUploader({
        videoPath,
        title,
        description: description || title,
        audio: null // Use trending audio automatically
    });
    console.log(`✅ YouTube upload completed: ${result}`);
    return result;
}
// Get settings function
async function getSettings() {
    const settings = await SettingsModel_1.default.findOne();
    if (!settings) {
        throw new Error('App settings not configured');
    }
    return {
        postDelayDays: 30, // Default 30 days
        instagramAccessToken: settings.instagramToken,
        instagramUserId: settings.instagramAccount,
        instagramEnabled: true,
        youtubeEnabled: true,
        selectedAudioTitle: 'Trending Audio'
    };
}
async function runAutopilot() {
    console.log('🤖 Starting Autopilot Posting System...');
    const settings = await getSettings(); // pulls delay, tokens, toggles
    const delayDays = settings.postDelayDays || 30;
    console.log(`📊 Autopilot settings: ${delayDays}-day delay, Instagram: ${settings.instagramEnabled}, YouTube: ${settings.youtubeEnabled}`);
    const posts = await (0, scrapeInstagram_1.scrapeInstagramPosts)(settings.instagramAccessToken, settings.instagramUserId);
    console.log(`🔍 Found ${posts.length} high-performing posts to process`);
    let processed = 0;
    let posted = 0;
    let skipped = 0;
    for (const post of posts) {
        processed++;
        console.log(`\n📝 Processing post ${processed}/${posts.length}: ${post.id}`);
        const canRepost = await (0, checkPostDelay_1.isRepostAllowed)(post.id, delayDays);
        if (!canRepost) {
            console.log(`⏳ Skipping ${post.id}, posted recently.`);
            skipped++;
            continue;
        }
        try {
            // Create temp directory
            const tempDir = path_1.default.join(__dirname, '../../temp');
            if (!fs_1.default.existsSync(tempDir)) {
                fs_1.default.mkdirSync(tempDir, { recursive: true });
            }
            // Download original video
            console.log(`📥 Downloading video from Instagram...`);
            const downloadPath = path_1.default.join(tempDir, `autopilot_${Date.now()}_original.mp4`);
            const writer = fs_1.default.createWriteStream(downloadPath);
            const response = await axios_1.default.get(post.url, { responseType: 'stream' });
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', () => resolve());
                writer.on('error', reject);
            });
            console.log(`✅ Video downloaded: ${downloadPath}`);
            // Convert video
            const outputPath = path_1.default.join(tempDir, `autopilot_${Date.now()}_instagram.mp4`);
            await convertVideo(downloadPath, outputPath);
            // Upload to S3
            console.log(`☁️ Uploading to S3...`);
            const s3Key = `autopilot/video_${Date.now()}.mp4`;
            const s3Url = await (0, s3Uploader_1.uploadToS3)(outputPath, s3Key);
            console.log(`🌍 S3 URL: ${s3Url}`);
            // Smart caption reuse + AI enhancements
            const originalCaption = post.caption || '';
            const caption = `${originalCaption}\n\n#RealEstate #DreamHome #TexasHomes #LuxuryLiving #AutoPost`;
            console.log(`📝 Using caption: ${caption.substring(0, 100)}...`);
            // Post to Instagram
            if (settings.instagramEnabled) {
                console.log(`📸 Posting to Instagram...`);
                await (0, instagram_1.postToInstagram)(s3Url, caption);
                console.log(`✅ Instagram posting completed`);
            }
            // Post to YouTube
            if (settings.youtubeEnabled) {
                console.log(`▶️ Posting to YouTube...`);
                const title = originalCaption.slice(0, 90) || `Property Showcase ${Date.now()}`;
                const description = `${caption}\n\n🎵 Audio: ${settings.selectedAudioTitle}\n\n📍 Texas Real Estate | Lifestyle Design Realty`;
                await uploadToYouTubeAutopilot(outputPath, title, description);
                console.log(`✅ YouTube posting completed`);
            }
            // Mark in DB
            await (0, checkPostDelay_1.markAsPosted)(post.id);
            console.log(`📝 Marked ${post.id} as posted`);
            // Cleanup
            try {
                if (fs_1.default.existsSync(downloadPath))
                    fs_1.default.unlinkSync(downloadPath);
                if (fs_1.default.existsSync(outputPath))
                    fs_1.default.unlinkSync(outputPath);
                console.log(`🧹 Cleaned up temp files`);
            }
            catch (cleanupError) {
                console.warn(`⚠️ Cleanup warning: ${cleanupError}`);
            }
            posted++;
            console.log(`✅ Post ${post.id} completed successfully!`);
            // Add delay between posts to respect rate limits
            if (processed < posts.length) {
                console.log(`⏳ Waiting 60 seconds before next post...`);
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
        }
        catch (error) {
            console.error(`❌ Failed to process post ${post.id}:`, error.message);
            skipped++;
        }
    }
    console.log(`\n🎯 Autopilot completed:`);
    console.log(`   📊 Processed: ${processed} posts`);
    console.log(`   ✅ Posted: ${posted} posts`);
    console.log(`   ⏭️ Skipped: ${skipped} posts`);
    return { processed, posted, skipped };
}
