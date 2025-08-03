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
exports.SmartRepostService = void 0;
const PostInsights_1 = __importDefault(require("../models/PostInsights"));
const TopHashtags_1 = __importDefault(require("../models/TopHashtags"));
const VideoStatus_1 = require("../models/VideoStatus");
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SmartRepostService {
    constructor() {
        this.newUploadThreshold = 20; // PHASE 2: Wait for 20 new uploads
    }
    /**
     * Check if we should trigger reposting based on new upload count - PHASE 2 ENHANCED
     */
    async shouldTriggerRepost() {
        try {
            // Get last repost trigger date from settings
            const lastRepostDate = await this.getLastRepostTriggerDate();
            // Count new uploads since last repost trigger from VideoStatus
            const recentUploads = await VideoStatus_1.VideoStatus.countDocuments({
                status: { $in: ['ready', 'posted'] },
                uploadDate: { $gte: lastRepostDate }
            });
            console.log(`📊 Found ${recentUploads} new uploads since last repost trigger (${lastRepostDate})`);
            console.log(`🎯 Threshold: ${this.newUploadThreshold} uploads needed to trigger repost`);
            const shouldTrigger = recentUploads >= this.newUploadThreshold;
            console.log(`🔄 Should trigger repost: ${shouldTrigger}`);
            return shouldTrigger;
        }
        catch (error) {
            console.error('❌ Error checking repost trigger:', error);
            return false;
        }
    }
    /**
     * Get the date of the last repost trigger from settings - PHASE 2 ENHANCED
     */
    async getLastRepostTriggerDate() {
        try {
            const settingsPath = path.join(process.cwd(), 'backend', 'settings.json');
            if (fs.existsSync(settingsPath)) {
                const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                if (settings.lastRepostTriggerDate) {
                    return new Date(settings.lastRepostTriggerDate);
                }
            }
            // Default: 30 days ago for first run
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return thirtyDaysAgo;
        }
        catch (error) {
            console.warn('Could not read last repost date from settings, using 30 days ago');
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return thirtyDaysAgo;
        }
    }
    /**
     * Update the last repost trigger date in settings - PHASE 2 ENHANCED
     */
    async updateLastRepostTriggerDate() {
        try {
            const settingsPath = path.join(process.cwd(), 'backend', 'settings.json');
            let settings = {};
            if (fs.existsSync(settingsPath)) {
                settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
            }
            settings.lastRepostTriggerDate = new Date().toISOString();
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
            console.log('✅ Updated last repost trigger date in settings');
        }
        catch (error) {
            console.error('❌ Error updating last repost trigger date:', error);
        }
    }
    /**
     * Get 1-3 top performing videos eligible for reposting - PHASE 2 ENHANCED
     */
    async getRepostCandidates(count = 3) {
        try {
            // Get repost cooldown days from settings (minimum days between posts)
            const cooldownDays = await this.getRepostCooldownDays();
            const cooldownDate = new Date();
            cooldownDate.setDate(cooldownDate.getDate() - cooldownDays);
            console.log(`🔍 Looking for repost candidates with ${cooldownDays} day cooldown`);
            // Find eligible videos from PostInsights that haven't been reposted
            const candidates = await PostInsights_1.default.find({
                repostEligible: true,
                reposted: false,
                performanceScore: { $gte: 70 }, // PHASE 2: Minimum performance threshold
                originalPostDate: { $lt: cooldownDate } // Respect cooldown period
            })
                .sort({ performanceScore: -1 })
                .limit(count * 2) // Get more candidates to filter from
                .lean();
            console.log(`📋 Found ${candidates.length} potential repost candidates`);
            // Convert to RepostCandidate format
            const repostCandidates = candidates.map(video => ({
                _id: video._id.toString(),
                videoId: video.videoId,
                platform: video.platform,
                performanceScore: video.performanceScore,
                originalCaption: video.caption,
                hashtags: video.hashtags,
                title: video.title,
                views: video.views || 0,
                likes: video.likes || 0,
                originalPostDate: video.originalPostDate
            }));
            // Return top candidates up to requested count
            const finalCandidates = repostCandidates.slice(0, count);
            console.log(`✅ Selected ${finalCandidates.length} candidates for reposting`);
            return finalCandidates;
        }
        catch (error) {
            console.error('❌ Error getting repost candidates:', error);
            throw error;
        }
    }
    /**
     * Get repost cooldown days from settings (defaults to 20) - PHASE 2 ENHANCED
     */
    async getRepostCooldownDays() {
        try {
            const settingsPath = path.join(process.cwd(), 'backend', 'settings.json');
            if (fs.existsSync(settingsPath)) {
                const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                return settings.minDaysBetweenPosts || 20; // Use existing setting from Phase 1
            }
            return 20; // Default cooldown
        }
        catch (error) {
            console.warn('Could not read repost cooldown from settings, using default of 20 days');
            return 20;
        }
    }
    /**
     * Get top performing hashtags for repost caption generation - PHASE 2 ENHANCED
     */
    async getTopHashtags(platform, limit = 20) {
        try {
            const query = platform ? { platform } : {};
            const topHashtags = await TopHashtags_1.default.find(query)
                .sort({ avgViewScore: -1, usageCount: -1 })
                .limit(limit) // PHASE 2: Get top 20 hashtags
                .select('hashtag')
                .lean();
            const hashtags = topHashtags.map(h => h.hashtag);
            console.log(`📊 Retrieved ${hashtags.length} top hashtags for ${platform || 'all platforms'}`);
            return hashtags;
        }
        catch (error) {
            console.error('❌ Error fetching top hashtags:', error);
            return [];
        }
    }
    /**
     * Generate new caption with GPT and fresh hooks + top hashtags - PHASE 2 ENHANCED
     */
    async generateNewCaption(candidate) {
        try {
            console.log(`🎨 Generating new caption for ${candidate.platform} video: ${candidate.videoId}`);
            // Get OpenAI API key from settings
            const openaiApiKey = await this.getOpenAIApiKey();
            if (openaiApiKey) {
                // Try GPT caption generation
                try {
                    const gptCaption = await this.generateGPTCaption(candidate, openaiApiKey);
                    if (gptCaption) {
                        console.log('✅ Generated caption using GPT');
                        return gptCaption;
                    }
                }
                catch (gptError) {
                    console.warn('⚠️ GPT caption generation failed, falling back to template approach');
                }
            }
            else {
                console.warn('⚠️ No OpenAI API key found, using template-based caption generation');
            }
            // Fallback: Use template-based approach
            const templateCaption = await this.generateTemplateCaption(candidate);
            console.log('✅ Generated caption using template approach');
            return templateCaption;
        }
        catch (error) {
            console.error('❌ Error generating new caption:', error);
            // Final fallback: original caption with new hashtags
            return await this.generateFallbackCaption(candidate);
        }
    }
    /**
     * Generate caption using GPT with fresh hooks and top hashtags - PHASE 2 NEW
     */
    async generateGPTCaption(candidate, apiKey) {
        var _a, _b, _c;
        try {
            const topHashtags = await this.getTopHashtags(candidate.platform, 15);
            const originalContent = this.extractContentWithoutHashtags(candidate.originalCaption);
            const prompt = `Create a fresh, engaging social media caption for a repost on ${candidate.platform}.
      
Original content: "${originalContent}"
Performance score: ${candidate.performanceScore}
Views: ${candidate.views}, Likes: ${candidate.likes}

Requirements:
- Create a completely new hook that's engaging and different from the original
- Keep the core message and value proposition
- Make it feel fresh, not like a repost
- Use an engaging, conversational tone
- Platform: ${candidate.platform}
- Target audience: Real estate professionals and potential homebuyers
- Include 3-5 relevant emojis
- End with a clear call to action

DO NOT include hashtags in your response - they will be added separately.

Generate a captivating caption:`;
            const response = await axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert social media content creator specializing in real estate content. Create engaging, professional captions that drive engagement.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 300,
                temperature: 0.8
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            const gptCaption = (_c = (_b = (_a = response.data.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
            if (gptCaption) {
                // Add top hashtags to GPT-generated caption
                const hashtagString = topHashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
                return `${gptCaption}\n\n${hashtagString}`;
            }
            return null;
        }
        catch (error) {
            console.error('❌ GPT caption generation error:', error);
            return null;
        }
    }
    /**
     * Generate caption using template approach - PHASE 2 ENHANCED
     */
    async generateTemplateCaption(candidate) {
        const topHashtags = await this.getTopHashtags(candidate.platform, 15);
        const originalContent = this.extractContentWithoutHashtags(candidate.originalCaption);
        // Generate new hook variations
        const hooks = this.generateHookVariations(originalContent, candidate.platform);
        const selectedHook = hooks[Math.floor(Math.random() * hooks.length)];
        // Combine with top hashtags
        const hashtagString = topHashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
        return `${selectedHook}\n\n${hashtagString}`;
    }
    /**
     * Generate fallback caption - PHASE 2 ENHANCED
     */
    async generateFallbackCaption(candidate) {
        const topHashtags = await this.getTopHashtags(candidate.platform, 10);
        const originalContent = this.extractContentWithoutHashtags(candidate.originalCaption);
        const hashtagString = topHashtags.map(tag => tag.startsWith('#') ? tag : `#${tag}`).join(' ');
        return `${originalContent}\n\n${hashtagString}`;
    }
    /**
     * Get OpenAI API key from settings - PHASE 2 NEW
     */
    async getOpenAIApiKey() {
        try {
            const settingsPath = path.join(process.cwd(), 'backend', 'settings.json');
            if (fs.existsSync(settingsPath)) {
                const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
                return settings.openaiApiKey || null;
            }
            return null;
        }
        catch (error) {
            console.error('❌ Error getting OpenAI API key:', error);
            return null;
        }
    }
    /**
     * Extract content without hashtags from original caption - PHASE 2 ENHANCED
     */
    extractContentWithoutHashtags(caption) {
        // Remove hashtags and clean up
        const withoutHashtags = caption.replace(/#[a-zA-Z0-9_]+/g, '').trim();
        // Remove extra whitespace and newlines
        const cleaned = withoutHashtags.replace(/\s+/g, ' ').trim();
        return cleaned || 'Check out this amazing content!';
    }
    /**
     * Generate hook variations for repost captions - PHASE 2 ENHANCED
     */
    generateHookVariations(originalContent, platform) {
        const platformEmojis = platform === 'instagram' ? ['📸', '✨', '💎'] : ['🎥', '📺', '🚀'];
        const emoji = platformEmojis[Math.floor(Math.random() * platformEmojis.length)];
        const hooks = [
            `${emoji} This one's still fire! ${originalContent}`,
            `✨ Had to share this gem again! ${originalContent}`,
            `💎 This content hits different every time! ${originalContent}`,
            `🚀 Still one of our favorites! ${originalContent}`,
            `🎯 This never gets old! ${originalContent}`,
            `⚡ Bringing this back by popular demand! ${originalContent}`,
            `🌟 This content deserves another spotlight! ${originalContent}`,
            `💥 Can't get enough of this! ${originalContent}`,
            `🔄 Throwback to this amazing moment! ${originalContent}`,
            `✅ Still relevant, still amazing! ${originalContent}`,
            `🔥 Worth resharing! ${originalContent}`,
            `💡 This insight bears repeating! ${originalContent}`,
            `🏆 One of our top performers! ${originalContent}`,
            `📢 Sharing this again for those who missed it! ${originalContent}`,
            `⭐ This content aged like fine wine! ${originalContent}`
        ];
        return hooks;
    }
    /**
     * Create repost plans for candidates - PHASE 2 ENHANCED
     */
    async createRepostPlans(candidates) {
        try {
            const plans = [];
            for (const candidate of candidates) {
                const newCaption = await this.generateNewCaption(candidate);
                const newHashtags = await this.getTopHashtags(candidate.platform, 15);
                // Schedule for optimal posting time (integrate with peak hours when available)
                const scheduledTime = this.getNextOptimalPostTime();
                plans.push({
                    candidate,
                    newCaption,
                    newHashtags,
                    scheduledTime
                });
            }
            console.log(`✅ Created ${plans.length} repost plans`);
            return plans;
        }
        catch (error) {
            console.error('❌ Error creating repost plans:', error);
            throw error;
        }
    }
    /**
     * Get next optimal posting time - PHASE 2 ENHANCED
     */
    getNextOptimalPostTime() {
        // Schedule for optimal times based on platform best practices
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        // Real estate content performs well at 2 PM on weekdays
        if (tomorrow.getDay() >= 1 && tomorrow.getDay() <= 5) { // Monday-Friday
            tomorrow.setHours(14, 0, 0, 0); // 2 PM
        }
        else {
            tomorrow.setHours(10, 0, 0, 0); // 10 AM on weekends
        }
        return tomorrow;
    }
    /**
     * Schedule reposts in VideoStatus queue - PHASE 2 ENHANCED
     */
    async scheduleReposts(plans) {
        try {
            for (const plan of plans) {
                // Create new VideoStatus entry for repost
                await VideoStatus_1.VideoStatus.create({
                    videoId: `repost_${plan.candidate.videoId}_${Date.now()}`,
                    platform: plan.candidate.platform,
                    captionGenerated: true,
                    status: 'ready',
                    fingerprint: {
                        hash: `repost_${plan.candidate.videoId}`,
                        size: 0,
                        duration: 0
                    },
                    filename: `repost_${plan.candidate.videoId}`,
                    filePath: null, // Repost uses original video
                    uploadDate: plan.scheduledTime || new Date(),
                    repostData: {
                        originalVideoId: plan.candidate.videoId,
                        originalCaption: plan.candidate.originalCaption,
                        newCaption: plan.newCaption,
                        isRepost: true,
                        performanceScore: plan.candidate.performanceScore
                    }
                });
                // Mark original as reposted in PostInsights
                await PostInsights_1.default.findByIdAndUpdate(plan.candidate._id, {
                    reposted: true,
                    repostedAt: new Date()
                });
                console.log(`📅 Scheduled repost for ${plan.candidate.platform} video: ${plan.candidate.videoId}`);
            }
            console.log(`✅ Scheduled ${plans.length} reposts in VideoStatus queue`);
        }
        catch (error) {
            console.error('❌ Error scheduling reposts:', error);
            throw error;
        }
    }
    /**
     * Full smart repost process - PHASE 2 ENHANCED
     */
    async performSmartRepost() {
        try {
            console.log('🚀 Starting Phase 2 smart repost process...');
            // 1. Check if we should trigger reposting
            const shouldTrigger = await this.shouldTriggerRepost();
            // Get current upload count for reporting
            const lastRepostDate = await this.getLastRepostTriggerDate();
            const newUploads = await VideoStatus_1.VideoStatus.countDocuments({
                status: { $in: ['ready', 'posted'] },
                uploadDate: { $gte: lastRepostDate }
            });
            if (!shouldTrigger) {
                console.log(`📊 Repost threshold not met: ${newUploads}/${this.newUploadThreshold} uploads`);
                return {
                    triggered: false,
                    candidatesFound: 0,
                    repostsScheduled: 0,
                    threshold: this.newUploadThreshold,
                    newUploads
                };
            }
            console.log(`🎯 Repost threshold reached! Processing ${newUploads} new uploads...`);
            // 2. Get repost candidates (1-3 based on performance)
            const maxReposts = this.calculateMaxReposts(newUploads);
            const candidates = await this.getRepostCandidates(maxReposts);
            if (candidates.length === 0) {
                console.log('⚠️ No eligible repost candidates found');
                await this.updateLastRepostTriggerDate(); // Update trigger date anyway
                return {
                    triggered: true,
                    candidatesFound: 0,
                    repostsScheduled: 0,
                    threshold: this.newUploadThreshold,
                    newUploads
                };
            }
            // 3. Create repost plans with new captions and hashtags
            const plans = await this.createRepostPlans(candidates);
            // 4. Schedule reposts in VideoStatus queue
            await this.scheduleReposts(plans);
            // 5. Update last repost trigger date
            await this.updateLastRepostTriggerDate();
            console.log(`✅ Phase 2 smart repost process completed: ${plans.length} reposts scheduled`);
            return {
                triggered: true,
                candidatesFound: candidates.length,
                repostsScheduled: plans.length,
                threshold: this.newUploadThreshold,
                newUploads
            };
        }
        catch (error) {
            console.error('❌ Error in Phase 2 smart repost process:', error);
            throw error;
        }
    }
    /**
     * Calculate maximum reposts based on new upload volume - PHASE 2 NEW
     */
    calculateMaxReposts(newUploads) {
        // Scale reposts based on volume: 20-39 uploads = 1 repost, 40-59 = 2 reposts, 60+ = 3 reposts
        if (newUploads >= 60)
            return 3;
        if (newUploads >= 40)
            return 2;
        return 1;
    }
    /**
     * Get smart repost analytics - PHASE 2 NEW
     */
    async getRepostAnalytics() {
        try {
            // Get repost statistics
            const [totalReposted, pendingReposts, recentActivity] = await Promise.all([
                PostInsights_1.default.countDocuments({ reposted: true }),
                VideoStatus_1.VideoStatus.countDocuments({ 'repostData.isRepost': true, status: 'ready' }),
                PostInsights_1.default.find({ reposted: true })
                    .sort({ repostedAt: -1 })
                    .limit(10)
                    .select('platform videoId performanceScore repostedAt originalPostDate')
                    .lean()
            ]);
            // Get upcoming scheduled reposts
            const upcomingReposts = await VideoStatus_1.VideoStatus.find({
                'repostData.isRepost': true,
                status: 'ready'
            })
                .sort({ uploadDate: 1 })
                .limit(10)
                .lean();
            // Calculate repost performance
            const repostPerformance = await PostInsights_1.default.aggregate([
                { $match: { reposted: true } },
                {
                    $group: {
                        _id: '$platform',
                        avgPerformanceScore: { $avg: '$performanceScore' },
                        count: { $sum: 1 }
                    }
                }
            ]);
            return {
                summary: {
                    totalReposted,
                    pendingReposts,
                    repostPerformance: repostPerformance.reduce((acc, item) => {
                        acc[item._id] = {
                            avgScore: Math.round(item.avgPerformanceScore),
                            count: item.count
                        };
                        return acc;
                    }, {})
                },
                upcomingReposts: upcomingReposts.map(repost => {
                    var _a;
                    return ({
                        videoId: repost.videoId,
                        platform: repost.platform,
                        scheduledTime: repost.uploadDate,
                        originalVideoId: (_a = repost.repostData) === null || _a === void 0 ? void 0 : _a.originalVideoId
                    });
                }),
                recentActivity: recentActivity.map((activity) => ({
                    platform: activity.platform,
                    videoId: activity.videoId,
                    performanceScore: activity.performanceScore,
                    originalDate: activity.originalPostDate,
                    repostedAt: activity.repostedAt
                }))
            };
        }
        catch (error) {
            console.error('❌ Error getting repost analytics:', error);
            throw error;
        }
    }
    /**
     * Manual repost trigger for specific platform - PHASE 2 NEW
     */
    async triggerManualRepost(platform, count = 1) {
        try {
            console.log(`🔧 Manual repost trigger for ${platform || 'all platforms'}, count: ${count}`);
            // Get candidates filtered by platform if specified
            let candidates = await this.getRepostCandidates(count * 2); // Get more to filter
            if (platform) {
                candidates = candidates.filter(c => c.platform === platform);
            }
            candidates = candidates.slice(0, count); // Limit to requested count
            if (candidates.length === 0) {
                return {
                    success: false,
                    candidatesFound: 0,
                    repostsScheduled: 0,
                    message: `No eligible repost candidates found for ${platform || 'any platform'}`
                };
            }
            // Create and schedule reposts
            const plans = await this.createRepostPlans(candidates);
            await this.scheduleReposts(plans);
            return {
                success: true,
                candidatesFound: candidates.length,
                repostsScheduled: plans.length,
                message: `Successfully scheduled ${plans.length} manual reposts`
            };
        }
        catch (error) {
            console.error('❌ Error in manual repost trigger:', error);
            return {
                success: false,
                candidatesFound: 0,
                repostsScheduled: 0,
                message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
exports.SmartRepostService = SmartRepostService;
