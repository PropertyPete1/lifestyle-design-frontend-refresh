"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToInstagram = void 0;
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const trendingAudioService_1 = require("../services/trendingAudioService");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
/**
 * Convert video to Instagram-compatible format
 */
const convertVideoForInstagram = async (videoPath) => {
    const outputPath = videoPath.replace(/\.[^/.]+$/, '_instagram.mp4');
    try {
        // Check if already converted
        if (fs_1.default.existsSync(outputPath)) {
            console.log(`📸 Using existing Instagram-compatible video: ${outputPath}`);
            return outputPath;
        }
        console.log(`📸 Converting video for Instagram compatibility...`);
        // ★ FINAL SOLUTION: Instagram v23.0 Compatible Format ★ 
        // After discovering Instagram auto-upgraded v18.0→v23.0 and deprecated direct upload
        // Using EXACT specifications that work with v23.0 video_url method
        const ffmpegCmd = `ffmpeg -i "${videoPath}" ` +
            `-c:v libx264 -profile:v baseline -level 3.0 ` +
            `-c:a aac -b:a 128k -ar 44100 -ac 2 ` +
            `-vf "scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2" ` +
            `-pix_fmt yuv420p ` +
            `-r 30 ` +
            `-crf 23 ` +
            `-maxrate 1M -bufsize 2M ` +
            `-movflags +faststart ` +
            `-f mp4 ` +
            `-t 10 ` +
            `-y "${outputPath}"`;
        console.log(`🔄 Converting video for Instagram v23.0 API compatibility...`);
        (0, child_process_1.execSync)(ffmpegCmd, { stdio: 'pipe' });
        console.log(`✅ Instagram video conversion completed: ${outputPath}`);
        return outputPath;
    }
    catch (error) {
        console.error(`❌ Video conversion failed, using original:`, error);
        return videoPath; // Fallback to original
    }
};
/**
 * Post to Instagram using ORIGINAL WORKING METHOD - DIRECT FILE UPLOAD (like your old backend)
 */
const postToInstagramOriginalMethod = async (videoPath, caption, settings, selectedAudio) => {
    var _a, _b, _c;
    try {
        console.log('📱 Using ORIGINAL WORKING METHOD (direct file upload) - like your old backend!');
        // ORIGINAL METHOD: Create FormData with direct file upload
        const FormData = require('form-data');
        const form = new FormData();
        form.append('video', fs_1.default.createReadStream(videoPath));
        form.append('caption', caption);
        form.append('media_type', 'REELS'); // Ensure it's treated as a video reel
        form.append('access_token', settings.instagramToken);
        console.log('📤 Uploading video directly to Instagram API (v18.0 method)...');
        // Upload video directly to Instagram API (using v18.0 like original backend)
        const uploadResponse = await axios_1.default.post(`https://graph.facebook.com/v18.0/${settings.instagramAccount}/media`, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Type': 'multipart/form-data'
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 120000 // 2 minutes timeout for video upload
        });
        const containerId = uploadResponse.data.id;
        console.log(`📱 Video container created with ORIGINAL METHOD: ${containerId}`);
        // Wait for video processing (like original backend)
        console.log('⏳ Waiting for Instagram video processing (original method)...');
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5 second delay like original
        // Publish the video (using v18.0 like original)
        const publishResponse = await axios_1.default.post(`https://graph.facebook.com/v18.0/${settings.instagramAccount}/media_publish`, {
            creation_id: containerId,
            access_token: settings.instagramToken
        });
        console.log('✅ VIDEO successfully posted to Instagram using ORIGINAL WORKING METHOD!');
        return publishResponse.data.id;
    }
    catch (error) {
        console.error('❌ Instagram ORIGINAL METHOD posting failed:', error);
        if (error.response) {
            console.error('❌ Error response details:', error.response.data);
        }
        throw new Error(((_c = (_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.message) || error.message || 'Instagram upload failed');
    }
};
/**
 * Upload video to Instagram using Facebook Graph API - WORKING METHOD FROM ORIGINAL BACKEND
 */
const uploadToInstagram = async (options) => {
    try {
        const { videoPath, caption, audio, scheduledTime } = options;
        const settings = await SettingsModel_1.default.findOne();
        if (!(settings === null || settings === void 0 ? void 0 : settings.instagramToken) || !(settings === null || settings === void 0 ? void 0 : settings.instagramAccount)) {
            throw new Error('Instagram credentials not configured');
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
            // Post using v23.0 video_url method (v18.0 deprecated) with PROPER format
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
 * Post to Instagram immediately - EXACT WORKING METHOD FROM ORIGINAL BACKEND
 */
const postToInstagramNow = async (videoPath, caption, audioClusterId, settings) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        // Step 0: Convert video to Instagram-compatible format if needed
        const compatibleVideoPath = await convertVideoForInstagram(videoPath);
        console.log(`📸 Starting Instagram upload with WORKING approach from original backend...`);
        console.log(`📹 Video path: ${compatibleVideoPath}`);
        // Verify video file exists
        if (!fs_1.default.existsSync(compatibleVideoPath)) {
            throw new Error(`Video file does not exist: ${compatibleVideoPath}`);
        }
        const stats = fs_1.default.statSync(compatibleVideoPath);
        console.log(`📁 Video size: ${stats.size} bytes`);
        // API has changed! Instagram now requires video_url instead of direct file upload
        // We need to temporarily serve the video via our own server
        console.log(`📤 Using NEW Instagram API method (v23.0 requires video_url)...`);
        const videoFileName = `temp_instagram_${Date.now()}.mp4`;
        const tempDir = path_1.default.resolve(process.cwd(), 'temp');
        const tempVideoPath = path_1.default.join(tempDir, videoFileName);
        const publicVideoUrl = `http://localhost:3002/temp/${videoFileName}`;
        // Copy video to temp public directory
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        }
        fs_1.default.copyFileSync(compatibleVideoPath, tempVideoPath);
        console.log(`📂 Video served at: ${publicVideoUrl}`);
        // Use the NEW API method that requires video_url
        const mediaPayload = {
            media_type: 'REELS',
            video_url: publicVideoUrl,
            caption: caption,
            access_token: settings.instagramToken
        };
        console.log(`📤 Creating Instagram container with video_url...`);
        // Create media container using the modern API approach
        const uploadResponse = await axios_1.default.post(`https://graph.facebook.com/v23.0/${settings.instagramAccount}/media`, mediaPayload, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 120000
        });
        const containerId = uploadResponse.data.id;
        console.log(`📱 Video container created: ${containerId}`);
        // Step 2: Wait for video processing (MUCH LONGER for modern API)
        console.log('⏳ Waiting for Instagram video processing (giving Instagram EXTRA time)...');
        await new Promise(resolve => setTimeout(resolve, 45000)); // 45 second delay (was 15) 
        // Step 3: Publish the video with retry logic (Updated for v23.0)
        let publishResponse;
        let retryCount = 0;
        const maxRetries = 6; // Increased from 3 to 6
        while (retryCount < maxRetries) {
            try {
                console.log(`📤 Attempting to publish Instagram video (attempt ${retryCount + 1}/${maxRetries})...`);
                publishResponse = await axios_1.default.post(`https://graph.facebook.com/v23.0/${settings.instagramAccount}/media_publish`, {
                    creation_id: containerId,
                    access_token: settings.instagramToken
                });
                break; // Success!
            }
            catch (publishError) {
                const errorCode = (_c = (_b = (_a = publishError.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.code;
                const errorSubcode = (_f = (_e = (_d = publishError.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.error) === null || _f === void 0 ? void 0 : _f.error_subcode;
                // Check if it's a "media not ready" error
                if (errorCode === 9007 && errorSubcode === 2207027) {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        console.log(`⏳ Media not ready yet, waiting 30 more seconds before retry ${retryCount + 1}...`);
                        await new Promise(resolve => setTimeout(resolve, 30000)); // Increased from 10 to 30 seconds
                    }
                    else {
                        console.error('❌ Media still not ready after all retries');
                        throw publishError;
                    }
                }
                else {
                    // Different error, don't retry
                    throw publishError;
                }
            }
        }
        console.log('✅ VIDEO successfully posted to Instagram using UPDATED method!');
        // Clean up temp file
        try {
            if (fs_1.default.existsSync(tempVideoPath)) {
                fs_1.default.unlinkSync(tempVideoPath);
                console.log(`🧹 Cleaned up temp file: ${tempVideoPath}`);
            }
        }
        catch (cleanupError) {
            console.warn(`⚠️ Failed to clean up temp file: ${cleanupError}`);
        }
        return publishResponse.data.id;
    }
    catch (error) {
        console.error('❌ Instagram VIDEO posting failed:', error);
        if (error.response) {
            console.error('❌ Error response details:', error.response.data);
        }
        throw new Error(((_j = (_h = (_g = error.response) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.error) === null || _j === void 0 ? void 0 : _j.message) || error.message || 'Instagram upload failed');
    }
};
