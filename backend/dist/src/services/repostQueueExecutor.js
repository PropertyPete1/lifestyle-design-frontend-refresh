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
Object.defineProperty(exports, "__esModule", { value: true });
exports.repostQueueExecutor = exports.RepostQueueExecutor = void 0;
const cron = __importStar(require("node-cron"));
const RepostQueue_1 = require("../models/RepostQueue");
const phase9YouTubeReposter_1 = require("../lib/youtube/phase9YouTubeReposter");
const phase9InstagramReposter_1 = require("../lib/youtube/phase9InstagramReposter");
class RepostQueueExecutor {
    constructor() {
        this.isRunning = false;
        this.youtubeReposter = new phase9YouTubeReposter_1.Phase9YouTubeReposter();
        // Get Instagram credentials from settings file
        const settings = this.loadSettings();
        const instagramToken = settings.instagramAccessToken || '';
        const instagramBusinessId = settings.instagramBusinessId || '';
        this.instagramReposter = new phase9InstagramReposter_1.Phase9InstagramReposter(instagramToken, instagramBusinessId);
    }
    loadSettings() {
        try {
            const fs = require('fs');
            const path = require('path');
            const settingsPath = path.join(__dirname, '../../settings.json');
            const settingsData = fs.readFileSync(settingsPath, 'utf8');
            return JSON.parse(settingsData);
        }
        catch (error) {
            console.error('❌ Error loading settings:', error);
            return {};
        }
    }
    /**
     * Start the repost queue executor
     * Checks every minute for posts that should be executed
     */
    start() {
        if (this.isRunning) {
            console.log('⚠️ RepostQueue executor is already running');
            return;
        }
        // Run every minute to check for scheduled posts
        this.executorJob = cron.schedule('* * * * *', async () => {
            await this.executeScheduledPosts();
        });
        this.executorJob.start();
        this.isRunning = true;
        console.log('🚀 RepostQueue executor started - checking every minute');
    }
    /**
     * Stop the repost queue executor
     */
    stop() {
        if (this.executorJob) {
            this.executorJob.destroy();
            this.isRunning = false;
            console.log('🛑 RepostQueue executor stopped');
        }
    }
    /**
     * Execute posts that are scheduled for now or past due
     */
    async executeScheduledPosts() {
        try {
            const now = new Date();
            // Find posts that are scheduled for now or past due
            const duePosts = await RepostQueue_1.RepostQueue.find({
                status: 'queued',
                scheduledFor: { $lte: now }
            }).sort({ scheduledFor: 1 }).limit(5); // Process max 5 at a time
            if (duePosts.length === 0) {
                return; // No posts due for execution
            }
            console.log(`⏰ Found ${duePosts.length} posts ready for execution`);
            for (const post of duePosts) {
                await this.executePost(post);
            }
        }
        catch (error) {
            console.error('❌ Error in RepostQueue executor:', error);
        }
    }
    /**
     * Execute a single repost
     */
    async executePost(post) {
        try {
            console.log(`🎬 Executing ${post.targetPlatform} post: ${post.sourceMediaId}`);
            // Update status to processing
            await RepostQueue_1.RepostQueue.findByIdAndUpdate(post._id, {
                status: 'processing',
                processedAt: new Date()
            });
            // Execute based on target platform
            let result;
            if (post.targetPlatform === 'youtube') {
                // Process single YouTube repost
                const youtubeResult = await this.youtubeReposter.processYouTubeReposts();
                if (youtubeResult.successful > 0) {
                    // Update to completed
                    await RepostQueue_1.RepostQueue.findByIdAndUpdate(post._id, {
                        status: 'completed',
                        completedAt: new Date(),
                        resultData: {
                            uploadedVideoId: 'youtube_repost',
                            uploadedUrl: 'pending_youtube_upload',
                            platform: post.targetPlatform,
                            processed: youtubeResult.processed,
                            successful: youtubeResult.successful,
                            failed: youtubeResult.failed
                        }
                    });
                    console.log(`✅ Successfully processed YouTube repost for ${post.sourceMediaId}: ${youtubeResult.successful}/${youtubeResult.processed} successful`);
                }
                else {
                    throw new Error(`YouTube repost failed: ${youtubeResult.errors.join(', ') || 'Unknown error'}`);
                }
            }
            else if (post.targetPlatform === 'instagram') {
                // Process single Instagram repost  
                const instagramResult = await this.instagramReposter.processInstagramReposts();
                if (instagramResult.successful > 0) {
                    // Update to completed
                    await RepostQueue_1.RepostQueue.findByIdAndUpdate(post._id, {
                        status: 'completed',
                        completedAt: new Date(),
                        resultData: {
                            uploadedVideoId: 'instagram_repost',
                            uploadedUrl: 'pending_instagram_upload',
                            platform: post.targetPlatform,
                            processed: instagramResult.processed,
                            successful: instagramResult.successful,
                            failed: instagramResult.failed
                        }
                    });
                    console.log(`✅ Successfully processed Instagram repost for ${post.sourceMediaId}: ${instagramResult.successful}/${instagramResult.processed} successful`);
                }
                else {
                    throw new Error(`Instagram repost failed: ${instagramResult.errors.join(', ') || 'Unknown error'}`);
                }
            }
            else {
                throw new Error(`Unknown target platform: ${post.targetPlatform}`);
            }
        }
        catch (error) {
            console.error(`❌ Failed to execute post ${post.sourceMediaId}:`, error);
            // Update to failed
            await RepostQueue_1.RepostQueue.findByIdAndUpdate(post._id, {
                status: 'failed',
                failedAt: new Date(),
                errorMessage: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    /**
     * Get executor status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            nextCheck: this.isRunning ? new Date(Date.now() + 60000) : undefined // Next minute
        };
    }
}
exports.RepostQueueExecutor = RepostQueueExecutor;
// Create singleton instance
exports.repostQueueExecutor = new RepostQueueExecutor();
