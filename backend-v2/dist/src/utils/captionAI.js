"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOptimizedHashtags = exports.rewriteCaption = void 0;
const axios_1 = __importDefault(require("axios"));
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
// Rate limiting for AI caption generation
class CaptionRateLimit {
    constructor() {
        this.lastRequestTime = 0;
        this.requestQueue = [];
        this.isProcessing = false;
        this.RATE_LIMIT_MS = 2000; // 2 seconds between requests
    }
    async processRequest(requestFn) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push(async () => {
                try {
                    const result = await requestFn();
                    resolve(result);
                }
                catch (error) {
                    reject(error);
                }
            });
            this.processQueue();
        });
    }
    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) {
            return;
        }
        this.isProcessing = true;
        while (this.requestQueue.length > 0) {
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < this.RATE_LIMIT_MS) {
                const waitTime = this.RATE_LIMIT_MS - timeSinceLastRequest;
                console.log(`⏳ AI Rate limit: waiting ${waitTime}ms before next caption request`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
            const request = this.requestQueue.shift();
            if (request) {
                this.lastRequestTime = Date.now();
                await request();
            }
        }
        this.isProcessing = false;
    }
}
const captionRateLimit = new CaptionRateLimit();
/**
 * Rewrite caption using OpenAI for different platforms
 */
const rewriteCaption = async (originalCaption, platform) => {
    try {
        const settings = await SettingsModel_1.default.findOne();
        if (!(settings === null || settings === void 0 ? void 0 : settings.openaiApi)) {
            console.log('⚠️ OpenAI API key not configured, using fallback caption processing');
            return fallbackCaptionRewrite(originalCaption, platform);
        }
        const platformPrompts = {
            instagram: `Transform this Instagram caption into a completely fresh, engaging post while keeping the core message. 
        Requirements:
        - Remove all dashes (-)
        - Create a FULL descriptive caption (300-400 characters is perfect)
        - COMPLETELY REWRITE the content - don't copy phrases verbatim
        - Change the perspective/angle while keeping the same property/topic
        - Add compelling hook at the beginning that's different from original
        - Include call-to-action at the end
        - Use different emojis strategically throughout
        - Focus on real estate, luxury lifestyle, and motivation themes
        - Add new selling points or features not mentioned in original
        - Use synonyms and different sentence structures
        - Make it sound like a different person wrote it
        - Add personal touches like "Just toured this amazing..." or "Can't get over how stunning..."
        
        Original caption: ${originalCaption}`,
            youtube: `Rewrite this as a compelling YouTube Shorts title and description.
        Requirements:
        - Create a clickbait-worthy title (under 60 characters)
        - Remove all dashes (-)
        - Focus on viral keywords like "This will change your life", "Secret to", etc.
        - Make it curiosity-driven
        - Include relevant hashtags
        
        Original caption: ${originalCaption}`
        };
        const response = await captionRateLimit.processRequest(async () => {
            console.log(`🤖 Generating AI caption for ${platform} (rate limited)`);
            return axios_1.default.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [{
                        role: 'user',
                        content: platformPrompts[platform]
                    }],
                max_tokens: 500,
                temperature: 0.8
            }, {
                headers: {
                    'Authorization': `Bearer ${settings.openaiApi}`,
                    'Content-Type': 'application/json'
                }
            });
        });
        const rewrittenCaption = response.data.choices[0].message.content.trim();
        console.log(`🤖 AI rewrote caption for ${platform}: "${rewrittenCaption.substring(0, 50)}..."`);
        return rewrittenCaption;
    }
    catch (error) {
        console.error(`❌ AI caption generation failed for ${platform}:`, error);
        return fallbackCaptionRewrite(originalCaption, platform);
    }
};
exports.rewriteCaption = rewriteCaption;
/**
 * Fallback caption processing when AI is not available
 */
const fallbackCaptionRewrite = (originalCaption, platform) => {
    // Remove dashes and clean up
    let cleaned = originalCaption.replace(/-/g, '').trim();
    if (platform === 'instagram') {
        // Add engaging hooks that transform the original content
        const engagingHooks = [
            '💫 Just discovered this incredible property and I had to share!',
            '🔥 Walking through this home left me speechless!',
            '✨ This place exceeded every expectation!',
            '🚀 Found something that will blow your mind!',
            '💯 Had to stop everything to show you this gem!',
            '🏡 Cannot get over how stunning this property is!',
            '🎯 This is exactly what luxury living looks like!',
            '⭐ Toured this masterpiece today and wow!'
        ];
        const randomHook = engagingHooks[Math.floor(Math.random() * engagingHooks.length)];
        // Add contextual middle content
        const contextualMiddle = [
            '\n\nEvery detail tells a story of craftsmanship and elegance.',
            '\n\nThe attention to detail here is absolutely phenomenal.',
            '\n\nFrom the moment you walk in, you know this is special.',
            '\n\nThis kind of quality is rare to find in today\'s market.',
            '\n\nIt\'s properties like this that remind me why I love real estate.'
        ];
        const randomMiddle = contextualMiddle[Math.floor(Math.random() * contextualMiddle.length)];
        const callToActions = [
            '\n\n💬 What catches your eye first? Tell me in the comments!',
            '\n\n👆 Save this if you\'re looking for luxury inspiration!',
            '\n\n❤️ Heart this if this is your dream home vibe!',
            '\n\n📩 Serious inquiries? Send me a DM!',
            '\n\n🔄 Tag someone who needs to see this beauty!'
        ];
        const randomCTA = callToActions[Math.floor(Math.random() * callToActions.length)];
        // Create a completely rewritten caption
        return `${randomHook}${randomMiddle}\n\n${cleaned.split(' ').slice(2).join(' ')}${randomCTA}`;
    }
    else {
        // YouTube format
        if (cleaned.length > 60) {
            cleaned = cleaned.substring(0, 57) + '...';
        }
        const hooks = ['This will blow your mind!', 'You won\'t believe this...', 'Life-changing advice:', 'The secret to:'];
        const randomHook = hooks[Math.floor(Math.random() * hooks.length)];
        return `${randomHook} ${cleaned}`;
    }
};
/**
 * Generate optimized hashtags for different platforms
 */
const generateOptimizedHashtags = async (caption, platform) => {
    const instagramTags = [
        // Real Estate Core
        'realestate', 'luxuryhomes', 'dreamhome', 'homesforsale', 'propertyinvestment',
        'realtor', 'househunting', 'newhome', 'mansion', 'luxuryrealestate',
        'realestateagent', 'propertymarket', 'homebuyers', 'realestatelife', 'listings',
        // Location/Geographic  
        'texas', 'austin', 'sanantonio', 'dallas', 'houston', 'texashomes',
        'texasrealestate', 'atx', 'satx', 'dtx', 'htown', 'centraltexas',
        // Lifestyle/Luxury
        'luxury', 'lifestyle', 'success', 'wealth', 'millionaire', 'blessed',
        'goals', 'motivation', 'inspiration', 'winning', 'achievement', 'excellence',
        'powerful', 'vision', 'purpose', 'freedom', 'entrepreneur', 'hustle',
        // Real Estate Features
        'customhomes', 'newconstruction', 'openhouse', 'justlisted', 'sold',
        'dreamkitchen', 'luxurydesign', 'architecture', 'interiordesign', 'curb appeal',
        'masteruite', 'gourmetkitchen', 'outdoorliving', 'poollife', 'homegoals',
        // Trending/Social
        'viral', 'trending', 'fyp', 'explore', 'follow', 'like', 'share', 'save',
        'repost', 'comment', 'engage', 'community', 'network', 'connection',
        // Industry/Professional
        'realestateexpert', 'topagent', 'soldbyexxon', 'professionalservice', 'clientfirst',
        'marketexpert', 'localexpert', 'trustedadvisor', 'resultsdriven', 'teamwork'
    ];
    const youtubeTags = [
        'shorts', 'viral', 'trending', 'fyp', 'motivation', 'success',
        'lifestyle', 'mindset', 'tips', 'hack', 'secret', 'truth',
        'millionaire', 'entrepreneur', 'wealth', 'money', 'business',
        'inspiration', 'wisdom', 'powerful', 'life', 'change'
    ];
    const baseTags = platform === 'instagram' ? instagramTags : youtubeTags;
    // Extract existing hashtags from caption
    const existingTags = extractHashtagsFromText(caption);
    // Create variations and alternatives to avoid identical hashtag sets
    const hashtagVariations = {
        'realestate': ['property', 'realestatelife', 'realestateagent'],
        'luxury': ['luxuryliving', 'luxurylifestyle', 'luxuryhomes'],
        'dreamhome': ['dreamhouse', 'homegoals', 'perfecthome'],
        'texas': ['texasliving', 'lonestarstate', 'texaslife'],
        'success': ['winning', 'achievement', 'goals'],
        'lifestyle': ['living', 'luxurylife', 'blessed']
    };
    // Randomly replace some base tags with variations
    const variedTags = baseTags.map(tag => {
        if (hashtagVariations[tag] && Math.random() > 0.7) {
            const variations = hashtagVariations[tag];
            return variations[Math.floor(Math.random() * variations.length)];
        }
        return tag;
    });
    // Shuffle and combine with existing tags, but limit existing tags to avoid duplication
    const shuffledTags = [...variedTags].sort(() => 0.5 - Math.random());
    const limitedExistingTags = existingTags.slice(0, 5); // Only keep 5 original hashtags max
    const combinedTags = [...new Set([...limitedExistingTags, ...shuffledTags])];
    // Return optimized selection - 30 hashtags for Instagram, 15 for YouTube
    return combinedTags.slice(0, platform === 'instagram' ? 30 : 15);
};
exports.generateOptimizedHashtags = generateOptimizedHashtags;
/**
 * Extract hashtags from text
 */
const extractHashtagsFromText = (text) => {
    const hashtagRegex = /#([a-zA-Z0-9_]+)/g;
    const matches = text.match(hashtagRegex) || [];
    return matches.map(tag => tag.slice(1)); // Remove # symbol
};
