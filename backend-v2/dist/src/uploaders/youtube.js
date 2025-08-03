"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToYouTube = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const trendingAudioService_1 = require("../services/trendingAudioService");
/**
 * Upload video to YouTube using YouTube Data API v3
 */
const uploadToYouTube = async (options) => {
    const { videoPath, title, description, audio, scheduledTime } = options;
    try {
        console.log(`▶️ Starting YouTube upload: ${videoPath}`);
        const settings = await SettingsModel_1.default.findOne();
        if (!(settings === null || settings === void 0 ? void 0 : settings.youtubeRefresh) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeClientId) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeClientSecret)) {
            throw new Error('YouTube credentials not configured in settings');
        }
        // Get trending audio if not specified
        let audioToUse = audio;
        if (!audioToUse && settings.trendingAudio) {
            console.log('🎵 Getting trending audio for YouTube...');
            const trendingAudio = await trendingAudioService_1.trendingAudioService.getTrendingAudioForPosting('youtube');
            if (trendingAudio === null || trendingAudio === void 0 ? void 0 : trendingAudio.audioAssetId) {
                audioToUse = trendingAudio.audioAssetId;
                console.log(`🎵 Using trending audio: ${trendingAudio.title} (${audioToUse})`);
            }
        }
        // Check if we should post now or schedule
        const shouldPostNow = !scheduledTime || scheduledTime <= new Date();
        if (shouldPostNow) {
            // Post immediately
            return await postToYouTubeNow(videoPath, title, description, audioToUse, settings);
        }
        else {
            // For scheduled posts, we'll store in queue and post later
            console.log(`📅 YouTube post scheduled for: ${scheduledTime.toISOString()}`);
            return 'scheduled';
        }
    }
    catch (error) {
        console.error('❌ YouTube upload failed:', error);
        throw error;
    }
};
exports.uploadToYouTube = uploadToYouTube;
/**
 * Post to YouTube immediately
 */
const postToYouTubeNow = async (videoPath, title, description, audioAssetId, settings) => {
    try {
        // Step 1: Refresh access token if needed
        let accessToken = settings.youtubeToken;
        try {
            // Test current token
            await axios_1.default.get('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        }
        catch (tokenError) {
            // Token expired, refresh it
            console.log('🔄 Refreshing YouTube access token...');
            const refreshResponse = await axios_1.default.post('https://oauth2.googleapis.com/token', {
                client_id: settings.youtubeClientId,
                client_secret: settings.youtubeClientSecret,
                refresh_token: settings.youtubeRefresh,
                grant_type: 'refresh_token'
            });
            accessToken = refreshResponse.data.access_token;
            // Update settings with new token
            await SettingsModel_1.default.findOneAndUpdate({}, { youtubeToken: accessToken });
        }
        // Step 2: Create form data for multipart upload
        const form = new form_data_1.default();
        // Video metadata with smart description
        let finalDescription = description || `${title}\n\n#Shorts #RealEstate #Texas #SanAntonio`;
        // Ensure description includes YouTube Shorts optimization
        if (!finalDescription.includes('#Shorts')) {
            finalDescription = finalDescription + '\n\n#Shorts';
        }
        const metadata = {
            snippet: {
                title: title.substring(0, 100), // YouTube title limit
                description: finalDescription.substring(0, 5000), // YouTube description limit
                tags: ['shorts', 'realestate', 'texas', 'sanantonio', 'property', 'homes', 'luxury'],
                categoryId: '22', // People & Blogs category
                defaultLanguage: 'en'
            },
            status: {
                privacyStatus: 'public',
                selfDeclaredMadeForKids: false,
                embeddable: true
            }
        };
        // TEMPORARY: Skip trending audio to avoid copyright issues
        if (audioAssetId) {
            console.log(`🎵 Skipping trending audio to avoid copyright issues: ${audioAssetId}`);
            // Note: Trending audio might be causing YouTube to remove videos
        }
        // Use direct multipart upload (simpler and works reliably)
        console.log('📹 Starting YouTube multipart upload...');
        // Step 3: Use simple multipart upload with correct format
        const boundary = `----formdata-youtube-${Date.now()}`;
        const videoBuffer = fs_1.default.readFileSync(videoPath);
        // Build multipart body manually
        const metadataPart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
        const videoPart = `--${boundary}\r\nContent-Type: video/mp4\r\n\r\n`;
        const endBoundary = `\r\n--${boundary}--\r\n`;
        const body = Buffer.concat([
            Buffer.from(metadataPart),
            Buffer.from(videoPart),
            videoBuffer,
            Buffer.from(endBoundary)
        ]);
        const uploadResponse = await axios_1.default.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet,status', body, {
            headers: {
                'Content-Type': `multipart/related; boundary=${boundary}`,
                'Authorization': `Bearer ${accessToken}`,
                'Content-Length': body.length.toString()
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });
        const responseData = uploadResponse.data;
        const videoId = responseData.id;
        console.log('📹 YouTube API Response:', JSON.stringify(responseData, null, 2));
        // Check if video was actually published
        if (responseData.status && responseData.status.privacyStatus) {
            console.log(`📱 Video privacy status: ${responseData.status.privacyStatus}`);
            if (responseData.status.privacyStatus !== 'public') {
                console.warn(`⚠️ Video uploaded but not public! Status: ${responseData.status.privacyStatus}`);
            }
        }
        // Verify the video exists by making a quick check
        try {
            const verifyResponse = await axios_1.default.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${videoId}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (verifyResponse.data.items && verifyResponse.data.items.length > 0) {
                const video = verifyResponse.data.items[0];
                console.log(`✅ YouTube video confirmed: ${videoId}`);
                console.log(`📺 Title: ${video.snippet.title}`);
                console.log(`🔗 URL: https://www.youtube.com/watch?v=${videoId}`);
                console.log(`👁️ Privacy: ${video.status.privacyStatus}`);
                // Wait 30 seconds and check again for auto-removal
                console.log('⏳ Waiting 30 seconds to check for auto-removal...');
                setTimeout(async () => {
                    try {
                        const recheckResponse = await axios_1.default.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet,status&id=${videoId}`, {
                            headers: { 'Authorization': `Bearer ${accessToken}` }
                        });
                        if (recheckResponse.data.items && recheckResponse.data.items.length > 0) {
                            console.log(`✅ Video still available after 30 seconds: ${videoId}`);
                        }
                        else {
                            console.log(`❌ Video was removed by YouTube after upload: ${videoId}`);
                            console.log(`🚨 POSSIBLE CAUSES: Copyright, Spam Detection, or Content Policy`);
                        }
                    }
                    catch (recheckError) {
                        console.warn(`⚠️ Could not recheck video: ${recheckError.message}`);
                    }
                }, 30000);
            }
            else {
                console.error(`❌ Video ${videoId} not found after upload!`);
            }
        }
        catch (verifyError) {
            console.warn(`⚠️ Could not verify video upload: ${verifyError.message}`);
        }
        console.log(`✅ YouTube video uploaded successfully: ${videoId}`);
        return videoId;
    }
    catch (error) {
        console.error('❌ YouTube posting failed:', error);
        throw error;
    }
};
