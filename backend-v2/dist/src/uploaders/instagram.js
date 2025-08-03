"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToInstagram = void 0;
exports.postToInstagram = postToInstagram;
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const trendingAudioService_1 = require("../services/trendingAudioService");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const s3Uploader_1 = require("../utils/s3Uploader");
/**
 * Convert video to Instagram-compatible format using FFmpeg
 * Instagram Reels format requirements:
 * - Resolution: 720x1280 (9:16 aspect ratio)
 * - Codec: H.264 (baseline profile)
 * - Audio: AAC (128k, 44100 Hz, stereo)
 * - Pixel format: yuv420p
 * - Framerate: 30fps
 * - Container: mp4 with faststart
 */
const convertVideoForInstagram = async (videoPath) => {
    var _a, _b;
    const outputPath = videoPath.replace(/\.[^/.]+$/, '_instagram.mp4');
    try {
        // Check if already converted
        if (fs_1.default.existsSync(outputPath)) {
            console.log(`📸 Using existing Instagram-compatible video: ${outputPath}`);
            return outputPath;
        }
        console.log(`📸 Converting video for Instagram Reels format (720x1280, H.264, AAC)...`);
        // FFmpeg command with ultra-specific Instagram Reels requirements
        const ffmpegCmd = `ffmpeg -y -i "${videoPath}" \
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
        console.log(`🔧 Running FFmpeg conversion...`);
        (0, child_process_1.execSync)(ffmpegCmd, { stdio: 'pipe' });
        // Verify the output file was created and has content
        if (!fs_1.default.existsSync(outputPath)) {
            throw new Error(`FFmpeg conversion failed - output file not created: ${outputPath}`);
        }
        const stats = fs_1.default.statSync(outputPath);
        if (stats.size === 0) {
            throw new Error(`FFmpeg conversion failed - output file is empty: ${outputPath}`);
        }
        // Verify video properties using ffprobe
        try {
            const probeCmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${outputPath}"`;
            const probeOutput = (0, child_process_1.execSync)(probeCmd, { encoding: 'utf8' });
            const probeData = JSON.parse(probeOutput);
            const videoStream = (_a = probeData.streams) === null || _a === void 0 ? void 0 : _a.find((s) => s.codec_type === 'video');
            const audioStream = (_b = probeData.streams) === null || _b === void 0 ? void 0 : _b.find((s) => s.codec_type === 'audio');
            console.log(`🔍 Video verification:
      - Codec: ${videoStream === null || videoStream === void 0 ? void 0 : videoStream.codec_name} (profile: ${videoStream === null || videoStream === void 0 ? void 0 : videoStream.profile})
      - Resolution: ${videoStream === null || videoStream === void 0 ? void 0 : videoStream.width}x${videoStream === null || videoStream === void 0 ? void 0 : videoStream.height}
      - Pixel format: ${videoStream === null || videoStream === void 0 ? void 0 : videoStream.pix_fmt}
      - Frame rate: ${videoStream === null || videoStream === void 0 ? void 0 : videoStream.r_frame_rate}
      - Audio codec: ${audioStream === null || audioStream === void 0 ? void 0 : audioStream.codec_name}
      - Audio sample rate: ${audioStream === null || audioStream === void 0 ? void 0 : audioStream.sample_rate}Hz`);
        }
        catch (probeError) {
            console.warn(`⚠️ Could not verify video properties: ${probeError}`);
        }
        console.log(`✅ Instagram video conversion completed: ${outputPath} (${stats.size} bytes)`);
        return outputPath;
    }
    catch (error) {
        console.error(`❌ Video conversion failed:`, error);
        console.error(`❌ Failed command would have been:`, `ffmpeg -y -i "${videoPath}" -c:v libx264 -profile:v baseline -level 3.0 -c:a aac -b:a 128k -ar 44100 -ac 2 -vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black" -pix_fmt yuv420p -r 30 -crf 23 -maxrate 1M -bufsize 2M -movflags +faststart -f mp4 "${outputPath}"`);
        throw error; // Don't fallback - force proper format
    }
};
/**
 * Upload video to Instagram using Facebook Graph API
 */
const uploadToInstagram = async (options) => {
    const { videoPath, caption, audio, scheduledTime } = options;
    try {
        console.log(`📸 Starting Instagram upload: ${videoPath}`);
        const settings = await SettingsModel_1.default.findOne();
        if (!(settings === null || settings === void 0 ? void 0 : settings.instagramToken) || !(settings === null || settings === void 0 ? void 0 : settings.instagramAccount)) {
            throw new Error('Instagram credentials not configured in settings');
        }
        // Get trending audio if not specified
        let audioToUse = audio;
        if (!audioToUse && settings.trendingAudio) {
            console.log('🎵 Getting trending audio for Instagram...');
            const trendingAudio = await trendingAudioService_1.trendingAudioService.getTrendingAudioForPosting('instagram');
            if (trendingAudio === null || trendingAudio === void 0 ? void 0 : trendingAudio.audioClusterId) {
                audioToUse = trendingAudio.audioClusterId;
                console.log(`🎵 Using trending audio: ${trendingAudio.title} (${audioToUse})`);
            }
        }
        // Check if we should post now or schedule
        const shouldPostNow = !scheduledTime || scheduledTime <= new Date();
        if (shouldPostNow) {
            // Post immediately
            return await postToInstagramNow(videoPath, caption, audioToUse, settings);
        }
        else {
            // For scheduled posts, we'll store in queue and post later
            console.log(`📅 Instagram post scheduled for: ${scheduledTime.toISOString()}`);
            return 'scheduled';
        }
    }
    catch (error) {
        console.error('❌ Instagram upload failed:', error);
        throw error;
    }
};
exports.uploadToInstagram = uploadToInstagram;
/**
 * ⚡️ INSTANT INSTAGRAM POSTING (REPLACES FIXED 30-SECOND WAIT)
 * Clean implementation matching exact specification
 */
async function postToInstagram(videoUrl, caption, audioId) {
    const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID || await SettingsModel_1.default.findOne().then(s => s === null || s === void 0 ? void 0 : s.instagramAccount);
    const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN || await SettingsModel_1.default.findOne().then(s => s === null || s === void 0 ? void 0 : s.instagramToken);
    if (!INSTAGRAM_USER_ID || !INSTAGRAM_ACCESS_TOKEN) {
        throw new Error('❌ Instagram credentials not configured');
    }
    // 1. Create media container
    const containerRes = await fetch(`https://graph.facebook.com/v17.0/${INSTAGRAM_USER_ID}/media`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${INSTAGRAM_ACCESS_TOKEN}` },
        body: new URLSearchParams({
            media_type: 'REELS',
            video_url: videoUrl,
            caption,
            share_to_feed: 'true',
            ...(audioId ? { audio_name: audioId } : {})
        })
    });
    const containerData = await containerRes.json();
    if (!containerData.id)
        throw new Error('❌ Failed to create media container.');
    const containerId = containerData.id;
    // 2. Wait + check status instead of sleeping blindly
    let attempts = 0;
    const maxAttempts = 10;
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    let publishReady = false;
    while (attempts < maxAttempts && !publishReady) {
        await delay(4000); // 4 seconds per retry
        attempts++;
        const statusRes = await fetch(`https://graph.facebook.com/v17.0/${containerId}?fields=status_code`, {
            headers: { Authorization: `Bearer ${INSTAGRAM_ACCESS_TOKEN}` }
        });
        const statusData = await statusRes.json();
        if (statusData.status_code === 'FINISHED') {
            publishReady = true;
            break;
        }
        console.log(`⏳ Attempt ${attempts}: Still processing...`);
    }
    if (!publishReady)
        throw new Error('❌ Instagram video never finished processing.');
    // 3. Publish the container
    const publishRes = await fetch(`https://graph.facebook.com/v17.0/${INSTAGRAM_USER_ID}/media_publish`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${INSTAGRAM_ACCESS_TOKEN}` },
        body: new URLSearchParams({ creation_id: containerId })
    });
    const publishData = await publishRes.json();
    if (!publishData.id)
        throw new Error('❌ Failed to publish Instagram post.');
    console.log(`✅ Instagram Post Published! ID: ${publishData.id}`);
    return publishData.id;
}
/**
 * Post to Instagram immediately (legacy wrapper using new instant posting)
 */
const postToInstagramNow = async (videoPath, caption, audioClusterId, settings) => {
    try {
        // Step 0: Convert video to Instagram-compatible format if needed
        const compatibleVideoPath = await convertVideoForInstagram(videoPath);
        // Step 1: Upload to S3 for public access
        console.log(`📸 Preparing video for instant Instagram posting...`);
        // Check AWS configuration
        if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
            throw new Error('❌ AWS S3 credentials not properly configured! Set AWS_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY in .env file');
        }
        // Check if source video exists and has content
        if (!fs_1.default.existsSync(compatibleVideoPath)) {
            throw new Error(`Source video file does not exist: ${compatibleVideoPath}`);
        }
        const stats = fs_1.default.statSync(compatibleVideoPath);
        if (stats.size === 0) {
            throw new Error(`Source video file is empty (0 bytes): ${compatibleVideoPath}`);
        }
        console.log(`🔍 Source video: ${compatibleVideoPath} (${stats.size} bytes)`);
        // Upload to S3
        const videoFileName = `instagram_${Date.now()}.mp4`;
        const s3Key = `temp/${videoFileName}`;
        console.log(`☁️ Uploading video to S3...`);
        const publicVideoUrl = await (0, s3Uploader_1.uploadToS3)(compatibleVideoPath, s3Key);
        console.log(`🌍 Using public S3 URL: ${publicVideoUrl}`);
        // Step 2: Use the new instant posting function
        console.log(`📝 FULL CAPTION (${caption.length} chars): "${caption}"`);
        if (audioClusterId) {
            console.log(`🎵 AUDIO CLUSTER ID: ${audioClusterId}`);
        }
        else {
            console.log(`⚠️ NO AUDIO CLUSTER ID - audio will not be attached`);
        }
        const publishedId = await postToInstagram(publicVideoUrl, caption, audioClusterId || undefined);
        // Clean up S3 file after successful posting
        try {
            const AWS = require('aws-sdk');
            const s3 = new AWS.S3();
            await s3.deleteObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: s3Key
            }).promise();
            console.log(`🧹 Cleaned up S3 file: ${s3Key}`);
        }
        catch (error) {
            console.warn(`⚠️ Could not clean up S3 file: ${error}`);
        }
        // Clean up local video file after successful posting
        try {
            if (fs_1.default.existsSync(compatibleVideoPath)) {
                fs_1.default.unlinkSync(compatibleVideoPath);
                console.log(`🧹 Cleaned up local file: ${compatibleVideoPath}`);
            }
        }
        catch (error) {
            console.warn(`⚠️ Could not clean up local file: ${error}`);
        }
        return publishedId;
    }
    catch (error) {
        console.error('❌ Instagram posting failed:', error);
        throw error;
    }
};
