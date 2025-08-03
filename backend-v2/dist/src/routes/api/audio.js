"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const trendingAudioService_1 = require("../../services/trendingAudioService");
const router = (0, express_1.Router)();
/**
 * GET /api/audio/trending/:platform
 * Get trending audio for a specific platform
 */
router.get('/trending/:platform', async (req, res) => {
    try {
        const { platform } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        if (platform !== 'instagram' && platform !== 'youtube') {
            return res.status(400).json({
                error: 'Invalid platform. Must be "instagram" or "youtube"'
            });
        }
        console.log(`🎵 API: Getting trending audio for ${platform} (limit: ${limit})`);
        const trendingAudio = await trendingAudioService_1.trendingAudioService.getTrendingAudio(platform, limit);
        res.json({
            success: true,
            platform,
            count: trendingAudio.length,
            data: trendingAudio
        });
    }
    catch (error) {
        console.error('❌ Error fetching trending audio:', error);
        res.status(500).json({
            error: 'Failed to fetch trending audio',
            details: error.message
        });
    }
});
/**
 * GET /api/audio/trending
 * Get trending audio from all platforms
 */
router.get('/trending', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        console.log(`🎵 API: Getting trending audio from all platforms (limit: ${limit} each)`);
        const [instagramAudio, youtubeAudio] = await Promise.all([
            trendingAudioService_1.trendingAudioService.getTrendingAudio('instagram', limit),
            trendingAudioService_1.trendingAudioService.getTrendingAudio('youtube', limit)
        ]);
        res.json({
            success: true,
            instagram: {
                count: instagramAudio.length,
                data: instagramAudio
            },
            youtube: {
                count: youtubeAudio.length,
                data: youtubeAudio
            }
        });
    }
    catch (error) {
        console.error('❌ Error fetching all trending audio:', error);
        res.status(500).json({
            error: 'Failed to fetch trending audio',
            details: error.message
        });
    }
});
/**
 * POST /api/audio/refresh
 * Refresh trending audio data from external APIs
 */
router.post('/refresh', async (req, res) => {
    try {
        console.log('🔄 API: Refreshing trending audio data...');
        const refreshResults = await trendingAudioService_1.trendingAudioService.refreshTrendingData();
        res.json({
            success: true,
            message: 'Trending audio data refreshed successfully',
            data: refreshResults
        });
    }
    catch (error) {
        console.error('❌ Error refreshing trending audio:', error);
        res.status(500).json({
            error: 'Failed to refresh trending audio data',
            details: error.message
        });
    }
});
/**
 * GET /api/audio/search
 * Search for audio by keywords
 */
router.get('/search', async (req, res) => {
    try {
        const { q: query, platform } = req.query;
        if (!query || typeof query !== 'string') {
            return res.status(400).json({
                error: 'Query parameter "q" is required'
            });
        }
        if (platform && platform !== 'instagram' && platform !== 'youtube') {
            return res.status(400).json({
                error: 'Invalid platform. Must be "instagram" or "youtube"'
            });
        }
        console.log(`🔍 API: Searching audio: "${query}" on ${platform || 'all platforms'}`);
        const results = await trendingAudioService_1.trendingAudioService.searchAudio(query, platform);
        res.json({
            success: true,
            query,
            platform: platform || 'all',
            count: results.length,
            data: results
        });
    }
    catch (error) {
        console.error('❌ Error searching audio:', error);
        res.status(500).json({
            error: 'Failed to search audio',
            details: error.message
        });
    }
});
/**
 * GET /api/audio/:audioId
 * Get specific audio metadata by ID
 */
router.get('/:audioId', async (req, res) => {
    try {
        const { audioId } = req.params;
        console.log(`🎵 API: Getting audio metadata: ${audioId}`);
        const audio = await trendingAudioService_1.trendingAudioService.getAudioMetadata(audioId);
        if (!audio) {
            return res.status(404).json({
                error: 'Audio not found'
            });
        }
        res.json({
            success: true,
            data: audio
        });
    }
    catch (error) {
        console.error('❌ Error fetching audio metadata:', error);
        res.status(500).json({
            error: 'Failed to fetch audio metadata',
            details: error.message
        });
    }
});
/**
 * GET /api/audio/random/:platform
 * Get a random trending audio for a platform
 */
router.get('/random/:platform', async (req, res) => {
    try {
        const { platform } = req.params;
        if (platform !== 'instagram' && platform !== 'youtube') {
            return res.status(400).json({
                error: 'Invalid platform. Must be "instagram" or "youtube"'
            });
        }
        console.log(`🎲 API: Getting random trending audio for ${platform}`);
        const audioId = await trendingAudioService_1.trendingAudioService.getRandomTrendingAudio(platform);
        const audio = await trendingAudioService_1.trendingAudioService.getAudioMetadata(audioId);
        res.json({
            success: true,
            platform,
            data: audio
        });
    }
    catch (error) {
        console.error('❌ Error fetching random audio:', error);
        res.status(500).json({
            error: 'Failed to fetch random audio',
            details: error.message
        });
    }
});
exports.default = router;
