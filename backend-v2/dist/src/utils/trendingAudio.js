"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrendingAudio = void 0;
const trendingAudioService_1 = require("../services/trendingAudioService");
/**
 * Get trending audio for platform
 */
const getTrendingAudio = async (platform) => {
    try {
        const audioId = await trendingAudioService_1.trendingAudioService.getRandomTrendingAudio(platform);
        console.log(`🎵 Selected trending audio for ${platform}: ${audioId || 'none'}`);
        return audioId;
    }
    catch (error) {
        console.error(`❌ Failed to get trending audio for ${platform}:`, error);
        return null;
    }
};
exports.getTrendingAudio = getTrendingAudio;
