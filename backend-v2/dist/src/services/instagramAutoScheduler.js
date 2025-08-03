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
exports.instagramAutoScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const googleDriveService_1 = __importDefault(require("./googleDriveService"));
const instagram_1 = require("../uploaders/instagram");
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const connection_1 = require("../database/connection");
const instagramScraper_1 = require("./instagramScraper");
const captionAI_1 = require("../utils/captionAI");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class InstagramAutoScheduler {
    constructor() {
        this.isRunning = false;
        this.processedVideos = [];
        this.PROCESSED_VIDEOS_FILE = 'processed_videos.json';
        this.loadProcessedVideos();
    }
    /**
     * Start the Instagram auto-posting scheduler
     * Checks Google Drive every 5 minutes for new videos
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️ Instagram auto-scheduler is already running');
            return;
        }
        console.log('🤖 Starting Instagram auto-posting scheduler...');
        console.log('📅 Will check Google Drive every 5 minutes for new videos');
        // Run every 5 minutes: */5 * * * *
        node_cron_1.default.schedule('*/5 * * * *', async () => {
            try {
                await this.processNewVideos();
            }
            catch (error) {
                console.error('❌ Instagram auto-scheduler error:', error);
            }
        });
        this.isRunning = true;
        console.log('✅ Instagram auto-posting scheduler started successfully');
    }
    /**
     * Stop the scheduler
     */
    stop() {
        this.isRunning = false;
        console.log('🛑 Instagram auto-posting scheduler stopped');
    }
    /**
     * Process new videos from Google Drive
     */
    async processNewVideos() {
        try {
            await (0, connection_1.connectToDatabase)();
            console.log('🔍 Checking Google Drive for new videos...');
            // Get settings to ensure Instagram is configured
            const settings = await SettingsModel_1.default.findOne();
            if (!(settings === null || settings === void 0 ? void 0 : settings.instagramToken) || !(settings === null || settings === void 0 ? void 0 : settings.instagramAccount)) {
                console.log('⚠️ Instagram not configured, skipping auto-post check');
                return;
            }
            // Check if AWS S3 is configured
            if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
                console.log('⚠️ AWS S3 not configured, skipping auto-post check');
                console.log('💡 Set AWS_BUCKET_NAME, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY in .env file');
                return;
            }
            // Get the Google Drive folder URL
            const driveFolder = process.env.GOOGLE_DRIVE_FOLDER_ID || '1DxLaqm1K4FuuerPNyQw_zVLuovh3xG9f';
            const folderUrl = `https://drive.google.com/drive/folders/${driveFolder}`;
            // Get videos from Google Drive
            const driveVideos = await googleDriveService_1.default.getSharedFolderVideos(folderUrl);
            if (!driveVideos || driveVideos.length === 0) {
                console.log('📂 No videos found in Google Drive folder');
                return;
            }
            // Filter out already processed videos
            const newVideos = driveVideos.filter(video => !this.processedVideos.some(processed => processed.driveId === video.id));
            if (newVideos.length === 0) {
                console.log('✅ No new videos to process');
                return;
            }
            console.log(`🆕 Found ${newVideos.length} new videos to upload to Instagram`);
            // Process each new video (limit to 3 at a time to avoid overwhelming Instagram)
            const videosToProcess = newVideos.slice(0, 3);
            for (const video of videosToProcess) {
                // Declare tempFilePath outside try block for cleanup access
                let tempFilePath = '';
                try {
                    console.log(`🎬 Auto-posting new video: ${video.name}`);
                    // Download the video directly from Google Drive
                    const videoBuffer = await googleDriveService_1.default.downloadVideoFromDrive(video.id, video.name);
                    // Save to temp directory
                    const tempDir = path.join(process.cwd(), 'temp');
                    if (!fs.existsSync(tempDir)) {
                        fs.mkdirSync(tempDir, { recursive: true });
                    }
                    tempFilePath = path.join(tempDir, `auto_${Date.now()}_${video.name}`);
                    fs.writeFileSync(tempFilePath, videoBuffer);
                    console.log(`💾 Downloaded: ${tempFilePath}`);
                    // Generate smart caption using Instagram scraping + AI
                    console.log(`🔍 Finding Instagram match for: ${video.name}`);
                    const cleanVideoName = video.name.replace(/\.[^/.]+$/, '');
                    let finalCaption = '';
                    let smartCaption = '';
                    try {
                        // Step 1: Try to find matching Instagram video for caption
                        const instagramMatch = await (0, instagramScraper_1.scrapeInstagramForVideo)(cleanVideoName);
                        if (instagramMatch.found && instagramMatch.caption) {
                            console.log(`🎯 Found Instagram match! Original caption: "${instagramMatch.caption.substring(0, 50)}..."`);
                            // Step 2: Use AI to rewrite the found caption
                            try {
                                smartCaption = await (0, captionAI_1.rewriteCaption)(instagramMatch.caption, 'instagram');
                                console.log(`🤖 AI generated smart caption: "${smartCaption.substring(0, 50)}..."`);
                            }
                            catch (aiError) {
                                console.log('⚠️ AI caption generation failed, using original Instagram caption');
                                smartCaption = instagramMatch.caption;
                            }
                            // Step 3: Generate optimized hashtags
                            const hashtags = await (0, captionAI_1.generateOptimizedHashtags)(smartCaption, 'instagram');
                            const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
                            finalCaption = `${smartCaption}\n\n${hashtagString}`;
                        }
                        else {
                            console.log(`⚠️ No Instagram match found for "${cleanVideoName}", generating fallback caption`);
                            // Fallback: Generate property-focused caption with AI
                            const fallbackCaption = `🏠 ${cleanVideoName.replace(/[_-]/g, ' ')} - Stunning property showcase! Walking through this incredible home and the attention to detail is absolutely phenomenal. Every corner tells a story of luxury and craftsmanship. This is exactly what dream living looks like!`;
                            try {
                                smartCaption = await (0, captionAI_1.rewriteCaption)(fallbackCaption, 'instagram');
                                const hashtags = await (0, captionAI_1.generateOptimizedHashtags)(smartCaption, 'instagram');
                                const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
                                finalCaption = `${smartCaption}\n\n${hashtagString}`;
                            }
                            catch (aiError) {
                                // Final fallback
                                finalCaption = `🏠 ${cleanVideoName.replace(/[_-]/g, ' ')} - New property showcase! 
                
✨ Discover your dream home with Lifestyle Design Realty
📍 Texas Real Estate • Premium Properties

#LifestyleDesign #RealEstate #Texas #DreamHome #PropertyTour #Luxury #Investment #NewListing #AutoPost`;
                            }
                        }
                    }
                    catch (scrapingError) {
                        console.log('⚠️ Instagram scraping failed, using fallback caption');
                        finalCaption = `🏠 ${cleanVideoName.replace(/[_-]/g, ' ')} - New property showcase! 
            
✨ Discover your dream home with Lifestyle Design Realty
📍 Texas Real Estate • Premium Properties

#LifestyleDesign #RealEstate #Texas #DreamHome #PropertyTour #Luxury #Investment #NewListing #AutoPost`;
                    }
                    console.log(`📝 Final caption generated: "${finalCaption.substring(0, 100)}..."`);
                    // Upload to Instagram using our working system
                    const publishedId = await (0, instagram_1.uploadToInstagram)({
                        videoPath: tempFilePath,
                        caption: finalCaption.substring(0, 2200), // Instagram caption limit
                        audio: null // Let system use trending audio automatically if configured
                    });
                    console.log(`✅ Successfully auto-posted ${video.name} to Instagram: ${publishedId}`);
                    // Mark as processed
                    this.processedVideos.push({
                        driveId: video.id,
                        name: video.name,
                        processedAt: new Date()
                    });
                    this.saveProcessedVideos();
                    // Clean up the temporary file
                    try {
                        fs.unlinkSync(tempFilePath);
                        console.log(`🧹 Cleaned up temp file: ${tempFilePath}`);
                    }
                    catch (cleanupError) {
                        console.warn(`⚠️ Could not clean up file: ${cleanupError}`);
                    }
                    // Add delay between posts to respect Instagram rate limits
                    await new Promise(resolve => setTimeout(resolve, 5000)); // 5 seconds between posts
                }
                catch (uploadError) {
                    console.error(`❌ Failed to auto-post ${video.name}:`, uploadError.message);
                    // Clean up the temporary file even on failure
                    try {
                        if (fs.existsSync(tempFilePath)) {
                            fs.unlinkSync(tempFilePath);
                            console.log(`🧹 Cleaned up temp file after failure: ${tempFilePath}`);
                        }
                    }
                    catch (cleanupError) {
                        console.warn(`⚠️ Could not clean up failed temp file: ${cleanupError}`);
                    }
                    // Mark as processed even if failed to avoid retrying failed videos constantly
                    this.processedVideos.push({
                        driveId: video.id,
                        name: video.name,
                        processedAt: new Date()
                    });
                    this.saveProcessedVideos();
                }
            }
            // Clean up old processed video records (keep last 100)
            if (this.processedVideos.length > 100) {
                this.processedVideos = this.processedVideos.slice(-100);
                this.saveProcessedVideos();
            }
        }
        catch (error) {
            console.error('❌ Error processing new videos:', error);
        }
    }
    /**
     * Load processed videos from file
     */
    loadProcessedVideos() {
        try {
            const filePath = path.join(process.cwd(), this.PROCESSED_VIDEOS_FILE);
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                this.processedVideos = JSON.parse(data);
                console.log(`📋 Loaded ${this.processedVideos.length} processed video records`);
            }
        }
        catch (error) {
            console.warn('⚠️ Could not load processed videos file:', error);
            this.processedVideos = [];
        }
    }
    /**
     * Save processed videos to file
     */
    saveProcessedVideos() {
        try {
            const filePath = path.join(process.cwd(), this.PROCESSED_VIDEOS_FILE);
            fs.writeFileSync(filePath, JSON.stringify(this.processedVideos, null, 2));
        }
        catch (error) {
            console.error('❌ Could not save processed videos file:', error);
        }
    }
    /**
     * Get status of the scheduler
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            processedCount: this.processedVideos.length,
            lastCheck: this.processedVideos.length > 0 ?
                new Date(Math.max(...this.processedVideos.map(v => v.processedAt.getTime()))) :
                undefined
        };
    }
    /**
     * Manually trigger a check (for testing)
     */
    async triggerCheck() {
        console.log('🔄 Manually triggering Instagram auto-post check...');
        await this.processNewVideos();
    }
}
exports.instagramAutoScheduler = new InstagramAutoScheduler();
