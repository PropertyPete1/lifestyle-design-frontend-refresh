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
exports.Phase9YouTubeReposter = void 0;
const RepostQueue_1 = require("../../models/RepostQueue");
const VideoStatus_1 = require("../../models/VideoStatus");
const prepareSmartCaption_1 = require("./prepareSmartCaption");
const matchAudioToVideo_1 = require("./matchAudioToVideo");
const schedulePostJob_1 = require("./schedulePostJob");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
class Phase9YouTubeReposter {
    constructor() {
        this.uploadsDir = path.join(__dirname, '../../../uploads');
        // Ensure uploads directory exists
        if (!fs.existsSync(this.uploadsDir)) {
            fs.mkdirSync(this.uploadsDir, { recursive: true });
        }
    }
    /**
     * Process pending YouTube reposts from the queue
     */
    async processYouTubeReposts() {
        const results = {
            processed: 0,
            successful: 0,
            failed: 0,
            errors: []
        };
        try {
            console.log('📺 Phase 9: Processing YouTube reposts...');
            // Get pending YouTube reposts that are ready to be processed
            const pendingReposts = await RepostQueue_1.RepostQueue.find({
                targetPlatform: 'youtube',
                status: 'queued',
                scheduledFor: { $lte: new Date() }
            })
                .sort({ priority: 1 }) // Process highest priority first
                .limit(5); // Process in batches
            console.log(`🎬 Found ${pendingReposts.length} YouTube reposts ready for processing`);
            for (const repost of pendingReposts) {
                results.processed++;
                try {
                    // Mark as processing
                    repost.status = 'processing';
                    repost.processedAt = new Date();
                    await repost.save();
                    console.log(`🔄 Processing YouTube repost: ${repost.sourceMediaId} (priority ${repost.priority})`);
                    // Download and process the Instagram video
                    const processedVideo = await this.downloadAndProcessVideo(repost);
                    if (!processedVideo) {
                        throw new Error('Failed to download or process video');
                    }
                    // Generate optimized caption for YouTube
                    const optimizedCaption = await this.generateYouTubeCaption(repost);
                    // Match trending YouTube audio
                    const audioMatch = await this.matchYouTubeAudio(processedVideo.filePath);
                    // Create VideoStatus entry for the repost
                    const videoStatus = await this.createVideoStatusEntry(repost, processedVideo, optimizedCaption, audioMatch);
                    // Schedule the post using Phase 6 scheduler
                    await this.scheduleYouTubePost(videoStatus, optimizedCaption, audioMatch);
                    // Update repost queue
                    repost.status = 'completed';
                    repost.repostVideoId = videoStatus.videoId;
                    repost.repostContent = {
                        newCaption: optimizedCaption.finalCaption,
                        newHashtags: optimizedCaption.hashtags,
                        audioTrackId: audioMatch === null || audioMatch === void 0 ? void 0 : audioMatch.audioId,
                        optimizedForPlatform: 'youtube'
                    };
                    await repost.save();
                    results.successful++;
                    console.log(`✅ YouTube repost completed: ${repost.sourceMediaId} -> ${videoStatus.videoId}`);
                }
                catch (error) {
                    console.error(`❌ Failed to process YouTube repost ${repost.sourceMediaId}:`, error);
                    // Update repost with error
                    repost.status = 'failed';
                    repost.errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    repost.retryCount = (repost.retryCount || 0) + 1;
                    await repost.save();
                    results.failed++;
                    results.errors.push(`${repost.sourceMediaId}: ${repost.errorMessage}`);
                }
            }
            console.log(`📺 YouTube repost processing complete: ${results.successful}/${results.processed} successful`);
            return results;
        }
        catch (error) {
            console.error('❌ Error in YouTube repost processing:', error);
            results.errors.push(error instanceof Error ? error.message : 'Unknown error');
            return results;
        }
    }
    /**
     * Download Instagram video and prepare for YouTube upload
     */
    async downloadAndProcessVideo(repost) {
        try {
            console.log(`⬇️ Downloading video from: ${repost.originalContent.media_url}`);
            // Download the video file
            const response = await (0, axios_1.default)({
                method: 'GET',
                url: repost.originalContent.media_url,
                responseType: 'stream',
                timeout: 30000 // 30 seconds timeout
            });
            // Generate unique filename
            const timestamp = Date.now();
            const hash = crypto.randomBytes(16).toString('hex');
            const filename = `${timestamp}_${hash}.mp4`;
            const filePath = path.join(this.uploadsDir, filename);
            // Save video to disk
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', () => {
                    try {
                        // Calculate file info
                        const stats = fs.statSync(filePath);
                        const fileBuffer = fs.readFileSync(filePath);
                        const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
                        console.log(`✅ Video downloaded: ${filename} (${Math.round(stats.size / 1024)}KB)`);
                        resolve({
                            filePath,
                            filename,
                            fileHash,
                            fileSize: stats.size
                        });
                    }
                    catch (error) {
                        reject(error);
                    }
                });
                writer.on('error', reject);
            });
        }
        catch (error) {
            console.error(`❌ Error downloading video for ${repost.sourceMediaId}:`, error);
            return null;
        }
    }
    /**
     * Generate optimized caption for YouTube Shorts
     */
    async generateYouTubeCaption(repost) {
        try {
            console.log(`📝 Generating YouTube caption for: ${repost.sourceMediaId}`);
            // Use Phase 4 smart caption system
            const originalContent = {
                title: repost.originalContent.caption.substring(0, 100),
                description: repost.originalContent.caption,
                tags: repost.originalContent.hashtags
            };
            // Load OpenAI API key from settings
            const settingsPath = path.join(__dirname, '../../../settings.json');
            const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            const smartCaption = await (0, prepareSmartCaption_1.prepareSmartCaption)(originalContent, settings.openaiApiKey, 'youtube');
            // Ensure no dashes in caption (as per requirements)
            let finalCaption = smartCaption.versionA.description.replace(/[-–—]/g, '');
            // Add YouTube-specific optimization
            finalCaption = this.optimizeForYouTube(finalCaption);
            // Get top 15 YouTube hashtags
            const youtubeHashtags = await this.getTop15YouTubeHashtags(repost.originalContent.caption);
            // Generate compelling title for YouTube
            const title = this.generateYouTubeTitle(repost.originalContent.caption);
            return {
                finalCaption,
                hashtags: youtubeHashtags,
                title
            };
        }
        catch (error) {
            console.error(`❌ Error generating YouTube caption for ${repost.sourceMediaId}:`, error);
            // Fallback caption
            return {
                finalCaption: this.createFallbackCaption(repost.originalContent.caption),
                hashtags: ['#Shorts', '#YouTube', '#Viral', '#RealEstate', '#LifestyleDesign'],
                title: 'Amazing Real Estate Content'
            };
        }
    }
    /**
     * Optimize caption specifically for YouTube algorithm
     */
    optimizeForYouTube(caption) {
        // Remove dashes as required
        let optimized = caption.replace(/[-–—]/g, '');
        // Add YouTube-specific hooks if not present
        const youtubeHooks = [
            'Watch till the end!',
            'Double tap if you agree!',
            'What do you think?',
            'Comment below!',
            'Save this for later!'
        ];
        // Add a hook if caption doesn't have engagement elements
        if (!optimized.match(/\?|!|watch|comment|like|share|save/i)) {
            const randomHook = youtubeHooks[Math.floor(Math.random() * youtubeHooks.length)];
            optimized += ` ${randomHook}`;
        }
        // Ensure it's not too long for YouTube Shorts
        if (optimized.length > 1000) {
            optimized = optimized.substring(0, 950) + '...';
        }
        return optimized;
    }
    /**
     * Get top 15 trending YouTube hashtags
     */
    async getTop15YouTubeHashtags(originalCaption) {
        try {
            // Extract existing hashtags from original content
            const existingHashtags = originalCaption.match(/#[\w\u0590-\u05ff]+/g) || [];
            // YouTube-optimized hashtags for real estate content
            const youtubeHashtags = [
                '#Shorts',
                '#YouTube',
                '#RealEstate',
                '#LifestyleDesign',
                '#DreamHome',
                '#LuxuryHomes',
                '#PropertyTour',
                '#RealEstateAgent',
                '#HomeBuying',
                '#RealEstateTips',
                '#PropertyInvestment',
                '#HomeDesign',
                '#Viral',
                '#Trending',
                '#MustWatch'
            ];
            // Combine and prioritize
            const combinedHashtags = [...new Set([...existingHashtags, ...youtubeHashtags])];
            // Return top 15
            return combinedHashtags.slice(0, 15);
        }
        catch (error) {
            console.error('❌ Error getting YouTube hashtags:', error);
            return ['#Shorts', '#YouTube', '#RealEstate', '#LifestyleDesign', '#Viral'];
        }
    }
    /**
     * Generate compelling YouTube title
     */
    generateYouTubeTitle(originalCaption) {
        var _a;
        // Extract key phrases from original caption
        const titlePhrases = [
            'STUNNING Luxury Home!',
            'JUST SOLD!',
            'Market Update!',
            'Real Estate Tips!',
            'Dream Home Alert!',
            'Property Tour!',
            'Behind The Scenes!',
            'Trending Neighborhoods!'
        ];
        // Try to extract a natural title from caption
        const sentences = originalCaption.split(/[.!?]/);
        const firstSentence = (_a = sentences[0]) === null || _a === void 0 ? void 0 : _a.trim();
        if (firstSentence && firstSentence.length > 10 && firstSentence.length < 60) {
            return firstSentence + '!';
        }
        // Use a random catchy title
        return titlePhrases[Math.floor(Math.random() * titlePhrases.length)];
    }
    /**
     * Match trending YouTube audio using Phase 3 logic
     */
    async matchYouTubeAudio(videoPath) {
        var _a, _b;
        try {
            console.log(`🎵 Matching YouTube audio for video: ${videoPath}`);
            // Use existing Phase 3 audio matching
            const audioMatch = await (0, matchAudioToVideo_1.matchAudioToVideo)(videoPath, 'youtube');
            if (audioMatch && audioMatch.audioTrackId) {
                console.log(`✅ YouTube audio matched: ${((_a = audioMatch.audioTrack) === null || _a === void 0 ? void 0 : _a.title) || audioMatch.audioTrackId}`);
                return {
                    audioId: audioMatch.audioTrackId,
                    audioTitle: ((_b = audioMatch.audioTrack) === null || _b === void 0 ? void 0 : _b.title) || 'Trending Audio'
                };
            }
            return null;
        }
        catch (error) {
            console.error('❌ Error matching YouTube audio:', error);
            return null;
        }
    }
    /**
     * Create VideoStatus entry for the reposted content
     */
    async createVideoStatusEntry(repost, processedVideo, caption, audioMatch) {
        try {
            // Generate unique video ID
            const videoId = `repost_yt_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
            const videoStatus = new VideoStatus_1.VideoStatus({
                videoId,
                uploadDate: new Date(),
                platform: 'youtube',
                captionGenerated: true,
                posted: false,
                fingerprintHash: processedVideo.fileHash, // Add this required field
                filename: processedVideo.filename,
                filePath: processedVideo.filePath,
                status: 'ready',
                fingerprint: {
                    hash: processedVideo.fileHash,
                    size: processedVideo.fileSize
                },
                repostData: {
                    originalVideoId: repost.sourceMediaId,
                    originalCaption: repost.originalContent.caption,
                    newCaption: caption.finalCaption,
                    isRepost: true
                },
                // Phase 9 specific fields
                phase9Status: 'repost_candidate',
                phase9SourceMediaId: repost.sourceMediaId,
                phase9PerformanceScore: repost.originalContent.performanceScore,
                phase9RepostPlatforms: ['youtube'],
                phase9ContentType: 'repurposed_from_ig',
                phase9OriginalUrl: repost.originalContent.permalink,
                phase9RepostCount: 1
            });
            await videoStatus.save();
            console.log(`✅ VideoStatus created for YouTube repost: ${videoId}`);
            return videoStatus;
        }
        catch (error) {
            console.error('❌ Error creating VideoStatus entry:', error);
            throw error;
        }
    }
    /**
     * Schedule YouTube post using Phase 6 scheduler
     */
    async scheduleYouTubePost(videoStatus, caption, audioMatch) {
        try {
            console.log(`⏰ Scheduling YouTube post: ${videoStatus.videoId}`);
            // Use Phase 6 scheduler to find optimal posting time
            await (0, schedulePostJob_1.schedulePostJob)({
                videoId: videoStatus.videoId,
                scheduledTime: new Date(Date.now() + 60000), // Schedule for 1 minute
                title: caption.title,
                description: caption.finalCaption,
                tags: caption.hashtags,
                audioTrackId: audioMatch === null || audioMatch === void 0 ? void 0 : audioMatch.audioId
            });
            console.log(`✅ YouTube post scheduled: ${videoStatus.videoId}`);
        }
        catch (error) {
            console.error(`❌ Error scheduling YouTube post for ${videoStatus.videoId}:`, error);
            throw error;
        }
    }
    /**
     * Create fallback caption when smart caption generation fails
     */
    createFallbackCaption(originalCaption) {
        // Clean up original caption
        let fallback = originalCaption.replace(/[-–—]/g, '').substring(0, 800);
        // Add YouTube engagement hook
        fallback += ' What do you think? Comment below! 👇';
        return fallback;
    }
    /**
     * Get processing statistics for YouTube reposts
     */
    async getYouTubeRepostStats() {
        try {
            const stats = await RepostQueue_1.RepostQueue.aggregate([
                { $match: { targetPlatform: 'youtube' } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 },
                        avgScore: { $avg: '$originalContent.performanceScore' }
                    }
                }
            ]);
            const result = {
                queued: 0,
                processing: 0,
                completed: 0,
                failed: 0,
                totalReposted: 0,
                avgPerformanceScore: 0
            };
            let totalScore = 0;
            let totalCount = 0;
            stats.forEach(stat => {
                const status = stat._id;
                if (status in result && typeof result[status] === 'number') {
                    result[status] = stat.count;
                    totalScore += stat.avgScore * stat.count;
                    totalCount += stat.count;
                }
            });
            result.totalReposted = result.completed;
            result.avgPerformanceScore = totalCount > 0 ? Math.round(totalScore / totalCount) : 0;
            return result;
        }
        catch (error) {
            console.error('❌ Error getting YouTube repost stats:', error);
            return {
                queued: 0,
                processing: 0,
                completed: 0,
                failed: 0,
                totalReposted: 0,
                avgPerformanceScore: 0
            };
        }
    }
}
exports.Phase9YouTubeReposter = Phase9YouTubeReposter;
