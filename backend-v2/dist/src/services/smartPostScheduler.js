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
exports.smartPostScheduler = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const instagram_1 = require("../uploaders/instagram");
const youtube_1 = require("../uploaders/youtube");
const googleDriveService_1 = __importDefault(require("./googleDriveService"));
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const connection_1 = require("../database/connection");
const instagramScraper_1 = require("./instagramScraper");
const captionAI_1 = require("../utils/captionAI");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SmartPostScheduler {
    constructor() {
        this.isRunning = false;
        this.scheduledPosts = [];
        this.processedVideos = new Set();
        this.SCHEDULE_FILE = 'smart_schedule.json';
        // Optimal posting times based on social media research
        this.BASE_OPTIMAL_TIMES = {
            instagram: [
                { hour: 6, minute: 0 }, // 6:00 AM - Morning commute
                { hour: 11, minute: 30 }, // 11:30 AM - Pre-lunch break
                { hour: 14, minute: 0 }, // 2:00 PM - Afternoon break  
                { hour: 19, minute: 30 } // 7:30 PM - Evening engagement
            ],
            youtube: [
                { hour: 9, minute: 0 }, // 9:00 AM - Morning viewing
                { hour: 12, minute: 0 }, // 12:00 PM - Lunch break
                { hour: 15, minute: 30 }, // 3:30 PM - Afternoon break
                { hour: 21, minute: 0 } // 9:00 PM - Prime time
            ]
        };
        this.loadSchedule();
        this.loadProcessedVideos();
    }
    /**
     * Start the smart post scheduler
     * Checks every 30 minutes and posts at optimal times
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️ Smart post scheduler is already running');
            return;
        }
        console.log('🤖 Starting Smart Post Scheduler...');
        console.log('📅 Will post 4 times daily at optimal engagement times');
        // Run every 30 minutes to check for scheduled posts
        node_cron_1.default.schedule('*/30 * * * *', async () => {
            try {
                await this.checkScheduledPosts();
            }
            catch (error) {
                console.error('❌ Smart scheduler error:', error);
            }
        });
        // Generate daily schedule at midnight
        node_cron_1.default.schedule('0 0 * * *', async () => {
            try {
                await this.generateDailySchedule();
            }
            catch (error) {
                console.error('❌ Daily schedule generation error:', error);
            }
        });
        // Generate initial schedule if it's empty
        this.generateDailySchedule();
        this.isRunning = true;
        console.log('✅ Smart Post Scheduler started successfully');
    }
    /**
     * Generate daily posting schedule
     */
    async generateDailySchedule() {
        try {
            await (0, connection_1.connectToDatabase)();
            const settings = await SettingsModel_1.default.findOne();
            if (!(settings === null || settings === void 0 ? void 0 : settings.instagramToken) && !(settings === null || settings === void 0 ? void 0 : settings.youtubeToken)) {
                console.log('⚠️ No social media platforms configured');
                return;
            }
            console.log('📅 Generating smart daily posting schedule...');
            // Get new videos from Google Drive
            const driveFolder = process.env.GOOGLE_DRIVE_FOLDER_ID || '1DxLaqm1K4FuuerPNyQw_zVLuovh3xG9f';
            const folderUrl = `https://drive.google.com/drive/folders/${driveFolder}`;
            const driveVideos = await googleDriveService_1.default.getSharedFolderVideos(folderUrl);
            if (!driveVideos || driveVideos.length === 0) {
                console.log('📂 No videos found in Google Drive folder');
                return;
            }
            // Filter out already processed videos
            const newVideos = driveVideos.filter(video => !this.processedVideos.has(video.id) &&
                !this.scheduledPosts.some(post => post.driveId === video.id));
            if (newVideos.length === 0) {
                console.log('✅ No new videos to schedule');
                return;
            }
            console.log(`🆕 Found ${newVideos.length} new videos to schedule`);
            // Generate optimal times for today
            const optimalTimes = this.generateOptimalTimes();
            // Schedule videos across platforms
            let videoIndex = 0;
            for (const video of newVideos.slice(0, 8)) { // Max 8 videos per day
                // Alternate between Instagram and YouTube, prioritizing Instagram
                const platform = videoIndex % 2 === 0 ? 'instagram' : 'youtube';
                const timeSlot = Math.floor(videoIndex / 2) % 4; // 4 time slots per platform
                const scheduledTime = platform === 'instagram'
                    ? optimalTimes.instagram[timeSlot]
                    : optimalTimes.youtube[timeSlot];
                // Only schedule if the time hasn't passed
                if (scheduledTime > new Date()) {
                    this.scheduledPosts.push({
                        driveId: video.id,
                        name: video.name,
                        platform,
                        scheduledTime,
                        processed: false
                    });
                    console.log(`📋 Scheduled ${video.name} for ${platform} at ${scheduledTime.toLocaleString()}`);
                }
                videoIndex++;
            }
            this.saveSchedule();
        }
        catch (error) {
            console.error('❌ Error generating daily schedule:', error);
        }
    }
    /**
     * Generate optimal posting times for today
     */
    generateOptimalTimes() {
        const today = new Date();
        const times = { instagram: [], youtube: [] };
        // Generate Instagram times
        for (const timeSlot of this.BASE_OPTIMAL_TIMES.instagram) {
            const scheduledTime = new Date(today);
            scheduledTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
            // Add some randomization (±15 minutes) to avoid looking robotic
            const randomOffset = (Math.random() - 0.5) * 30; // ±15 minutes
            scheduledTime.setMinutes(scheduledTime.getMinutes() + randomOffset);
            times.instagram.push(scheduledTime);
        }
        // Generate YouTube times
        for (const timeSlot of this.BASE_OPTIMAL_TIMES.youtube) {
            const scheduledTime = new Date(today);
            scheduledTime.setHours(timeSlot.hour, timeSlot.minute, 0, 0);
            // Add randomization
            const randomOffset = (Math.random() - 0.5) * 30;
            scheduledTime.setMinutes(scheduledTime.getMinutes() + randomOffset);
            times.youtube.push(scheduledTime);
        }
        return times;
    }
    /**
     * Check and execute scheduled posts
     */
    async checkScheduledPosts() {
        const now = new Date();
        const postsToExecute = this.scheduledPosts.filter(post => !post.processed && post.scheduledTime <= now);
        if (postsToExecute.length === 0) {
            return;
        }
        console.log(`⏰ Executing ${postsToExecute.length} scheduled posts...`);
        for (const post of postsToExecute) {
            try {
                await this.executeScheduledPost(post);
                post.processed = true;
                this.processedVideos.add(post.driveId);
            }
            catch (error) {
                console.error(`❌ Failed to execute scheduled post for ${post.name}:`, error);
                post.processed = true; // Mark as processed to avoid retry loops
            }
        }
        // Clean up old scheduled posts
        this.scheduledPosts = this.scheduledPosts.filter(post => !post.processed);
        this.saveSchedule();
        this.saveProcessedVideos();
    }
    /**
     * Execute a scheduled post
     */
    async executeScheduledPost(post) {
        console.log(`🚀 Posting ${post.name} to ${post.platform}...`);
        // Download video from Google Drive
        const driveVideos = await googleDriveService_1.default.getSharedFolderVideos(`https://drive.google.com/drive/folders/${process.env.GOOGLE_DRIVE_FOLDER_ID}`);
        const video = driveVideos.find(v => v.id === post.driveId);
        if (!video) {
            throw new Error(`Video ${post.name} not found in Google Drive`);
        }
        const videoBuffer = await googleDriveService_1.default.downloadVideoFromDrive(video.id, video.name);
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        const tempFilePath = path.join(tempDir, `scheduled_${Date.now()}_${video.name}`);
        fs.writeFileSync(tempFilePath, videoBuffer);
        // Generate smart caption
        const cleanVideoName = video.name.replace(/\.[^/.]+$/, '');
        let finalCaption = '';
        try {
            // Get Instagram caption and rewrite for platform
            const instagramMatch = await (0, instagramScraper_1.scrapeInstagramForVideo)(cleanVideoName);
            if (instagramMatch.found && instagramMatch.caption) {
                const smartCaption = await (0, captionAI_1.rewriteCaption)(instagramMatch.caption, post.platform);
                const hashtags = await (0, captionAI_1.generateOptimizedHashtags)(smartCaption, post.platform);
                const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
                finalCaption = `${smartCaption}\n\n${hashtagString}`;
            }
            else {
                // Fallback caption
                const fallbackCaption = `🏠 ${cleanVideoName.replace(/[_-]/g, ' ')} - Amazing property showcase!`;
                const rewrittenCaption = await (0, captionAI_1.rewriteCaption)(fallbackCaption, post.platform);
                const hashtags = await (0, captionAI_1.generateOptimizedHashtags)(rewrittenCaption, post.platform);
                const hashtagString = hashtags.map(tag => `#${tag}`).join(' ');
                finalCaption = `${rewrittenCaption}\n\n${hashtagString}`;
            }
        }
        catch (captionError) {
            console.log('⚠️ Caption generation failed, using fallback');
            finalCaption = post.platform === 'instagram'
                ? `🏠 ${cleanVideoName} - Property showcase! #RealEstate #Texas #LifestyleDesign`
                : `${cleanVideoName} - Property Tour | #Shorts #RealEstate #Texas`;
        }
        // Upload to platform
        if (post.platform === 'instagram') {
            const publishedId = await (0, instagram_1.uploadToInstagram)({
                videoPath: tempFilePath,
                caption: finalCaption.substring(0, 2200),
                audio: null // Let system use trending audio automatically if configured
            });
            console.log(`✅ Posted ${post.name} to Instagram: ${publishedId}`);
        }
        else if (post.platform === 'youtube') {
            const publishedId = await (0, youtube_1.uploadToYouTube)({
                videoPath: tempFilePath,
                title: cleanVideoName.replace(/[_-]/g, ' '),
                description: finalCaption,
                audio: null
            });
            console.log(`✅ Posted ${post.name} to YouTube: ${publishedId}`);
        }
        // Clean up temp file
        try {
            fs.unlinkSync(tempFilePath);
        }
        catch (cleanupError) {
            console.warn(`⚠️ Could not clean up file: ${cleanupError}`);
        }
    }
    /**
     * Load schedule from file
     */
    loadSchedule() {
        try {
            const filePath = path.join(process.cwd(), this.SCHEDULE_FILE);
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                const parsed = JSON.parse(data);
                this.scheduledPosts = parsed.map((post) => ({
                    ...post,
                    scheduledTime: new Date(post.scheduledTime)
                }));
                console.log(`📋 Loaded ${this.scheduledPosts.length} scheduled posts`);
            }
        }
        catch (error) {
            console.warn('⚠️ Could not load schedule file:', error);
            this.scheduledPosts = [];
        }
    }
    /**
     * Save schedule to file
     */
    saveSchedule() {
        try {
            const filePath = path.join(process.cwd(), this.SCHEDULE_FILE);
            fs.writeFileSync(filePath, JSON.stringify(this.scheduledPosts, null, 2));
        }
        catch (error) {
            console.error('❌ Could not save schedule file:', error);
        }
    }
    /**
     * Load processed videos from file
     */
    loadProcessedVideos() {
        try {
            const filePath = path.join(process.cwd(), 'processed_videos_smart.json');
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                const processed = JSON.parse(data);
                this.processedVideos = new Set(processed);
                console.log(`📋 Loaded ${this.processedVideos.size} processed video records`);
            }
        }
        catch (error) {
            console.warn('⚠️ Could not load processed videos file:', error);
            this.processedVideos = new Set();
        }
    }
    /**
     * Save processed videos to file
     */
    saveProcessedVideos() {
        try {
            const filePath = path.join(process.cwd(), 'processed_videos_smart.json');
            fs.writeFileSync(filePath, JSON.stringify([...this.processedVideos], null, 2));
        }
        catch (error) {
            console.error('❌ Could not save processed videos file:', error);
        }
    }
    /**
     * Get scheduler status
     */
    getStatus() {
        const nextPost = this.scheduledPosts
            .filter(post => !post.processed)
            .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())[0];
        return {
            isRunning: this.isRunning,
            scheduledPosts: this.scheduledPosts.filter(post => !post.processed).length,
            processedVideos: this.processedVideos.size,
            nextPost: nextPost ? {
                platform: nextPost.platform,
                time: nextPost.scheduledTime,
                name: nextPost.name
            } : undefined
        };
    }
    /**
     * Stop the scheduler
     */
    stop() {
        this.isRunning = false;
        console.log('🛑 Smart Post Scheduler stopped');
    }
    /**
     * Manually trigger schedule generation
     */
    async triggerScheduleGeneration() {
        console.log('🔄 Manually triggering schedule generation...');
        await this.generateDailySchedule();
    }
}
exports.smartPostScheduler = new SmartPostScheduler();
