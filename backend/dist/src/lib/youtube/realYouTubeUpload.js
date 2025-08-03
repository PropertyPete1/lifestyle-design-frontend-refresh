"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealYouTubeUploader = void 0;
exports.createYouTubeUploader = createYouTubeUploader;
const googleapis_1 = require("googleapis");
const fs_1 = __importDefault(require("fs"));
/**
 * Real YouTube upload using Google YouTube Data API v3
 */
class RealYouTubeUploader {
    constructor(apiKey, clientId, clientSecret, refreshToken) {
        this.apiKey = apiKey;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.refreshToken = refreshToken;
        // Initialize OAuth2 client
        this.oauth2Client = new googleapis_1.google.auth.OAuth2(clientId, clientSecret, 'http://localhost:8080/oauth2callback');
        this.oauth2Client.setCredentials({
            refresh_token: refreshToken
        });
        // Initialize YouTube API client
        this.youtube = googleapis_1.google.youtube({
            version: 'v3',
            auth: this.oauth2Client
        });
    }
    /**
     * Upload video to YouTube
     */
    async uploadVideo(options) {
        var _a, _b, _c;
        try {
            console.log('🎬 Starting real YouTube upload...');
            console.log(`   Title: ${options.title}`);
            console.log(`   Description: ${options.description.substring(0, 100)}...`);
            console.log(`   Video file: ${options.videoPath}`);
            // Check if video file exists
            if (!fs_1.default.existsSync(options.videoPath)) {
                throw new Error(`Video file not found: ${options.videoPath}`);
            }
            const fileSize = fs_1.default.statSync(options.videoPath).size;
            console.log(`   File size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);
            // Prepare video metadata
            const videoMetadata = {
                snippet: {
                    title: options.title,
                    description: options.description,
                    tags: options.tags || [],
                    categoryId: options.categoryId || '22', // People & Blogs category
                    defaultLanguage: 'en',
                    defaultAudioLanguage: 'en'
                },
                status: {
                    privacyStatus: options.privacy || 'public',
                    selfDeclaredMadeForKids: false
                }
            };
            console.log('📤 Uploading to YouTube...');
            // Upload video
            const uploadResponse = await this.youtube.videos.insert({
                part: ['snippet', 'status'],
                requestBody: videoMetadata,
                media: {
                    body: fs_1.default.createReadStream(options.videoPath)
                }
            });
            const videoId = uploadResponse.data.id;
            if (!videoId) {
                throw new Error('Upload successful but no video ID returned');
            }
            console.log(`✅ Upload successful! Video ID: ${videoId}`);
            // Get video details
            const videoDetails = await this.youtube.videos.list({
                part: ['snippet', 'statistics'],
                id: [videoId]
            });
            const video = (_a = videoDetails.data.items) === null || _a === void 0 ? void 0 : _a[0];
            const snippet = video === null || video === void 0 ? void 0 : video.snippet;
            const statistics = video === null || video === void 0 ? void 0 : video.statistics;
            const result = {
                success: true,
                videoId: videoId,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                uploadDetails: {
                    title: (snippet === null || snippet === void 0 ? void 0 : snippet.title) || options.title,
                    description: (snippet === null || snippet === void 0 ? void 0 : snippet.description) || options.description,
                    publishedAt: (snippet === null || snippet === void 0 ? void 0 : snippet.publishedAt) || new Date().toISOString(),
                    viewCount: parseInt((statistics === null || statistics === void 0 ? void 0 : statistics.viewCount) || '0'),
                    channelId: (snippet === null || snippet === void 0 ? void 0 : snippet.channelId) || ''
                }
            };
            // Upload thumbnail if provided
            if (options.thumbnailPath && fs_1.default.existsSync(options.thumbnailPath)) {
                try {
                    console.log('🖼️ Uploading custom thumbnail...');
                    await this.youtube.thumbnails.set({
                        videoId: videoId,
                        media: {
                            body: fs_1.default.createReadStream(options.thumbnailPath)
                        }
                    });
                    console.log('✅ Thumbnail uploaded successfully');
                }
                catch (thumbnailError) {
                    console.warn('⚠️ Thumbnail upload failed:', thumbnailError);
                }
            }
            console.log('🎉 YouTube upload complete!');
            console.log(`   Video URL: ${result.url}`);
            return result;
        }
        catch (error) {
            console.error('❌ YouTube upload failed:', error);
            let errorMessage = 'Unknown upload error';
            if ((_c = (_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.error) {
                errorMessage = `YouTube API Error: ${error.response.data.error.message}`;
            }
            else if (error === null || error === void 0 ? void 0 : error.message) {
                errorMessage = error.message;
            }
            return {
                success: false,
                error: errorMessage
            };
        }
    }
    /**
     * Get channel information
     */
    async getChannelInfo() {
        var _a;
        try {
            const response = await this.youtube.channels.list({
                part: ['snippet', 'statistics'],
                mine: true
            });
            return (_a = response.data.items) === null || _a === void 0 ? void 0 : _a[0];
        }
        catch (error) {
            console.error('❌ Error getting channel info:', error);
            throw error;
        }
    }
    /**
     * Test the connection
     */
    async testConnection() {
        var _a;
        try {
            const channel = await this.getChannelInfo();
            return {
                success: true,
                channelTitle: (_a = channel === null || channel === void 0 ? void 0 : channel.snippet) === null || _a === void 0 ? void 0 : _a.title
            };
        }
        catch (error) {
            return {
                success: false,
                error: (error === null || error === void 0 ? void 0 : error.message) || 'Connection test failed'
            };
        }
    }
}
exports.RealYouTubeUploader = RealYouTubeUploader;
/**
 * Factory function to create YouTube uploader from settings
 */
function createYouTubeUploader(settings) {
    return new RealYouTubeUploader(settings.youtubeApiKey, settings.youtubeClientId, settings.youtubeClientSecret, settings.youtubeRefreshToken);
}
