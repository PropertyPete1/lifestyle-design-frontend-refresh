"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const audioMatchingService_1 = require("../../services/audioMatchingService");
const trendingAudioScraper_1 = require("../../services/trendingAudioScraper");
const audioOverlayService_1 = require("../../services/audioOverlayService");
const AudioMatch_1 = require("../../models/AudioMatch");
const fetchTrendingAudio_1 = require("../../lib/youtube/fetchTrendingAudio");
const router = express_1.default.Router();
const audioMatchingService = new audioMatchingService_1.AudioMatchingService();
const audioScraper = new trendingAudioScraper_1.TrendingAudioScraper();
const audioOverlayService = new audioOverlayService_1.AudioOverlayService();
/**
 * GET /api/audio/match/:videoId
 * Match a specific video with trending audio
 */
router.get('/match/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const audioMatch = await audioMatchingService.matchVideoWithAudio(videoId);
        if (!audioMatch) {
            return res.status(404).json({
                success: false,
                message: 'No suitable audio match found for this video'
            });
        }
        res.json({
            success: true,
            data: audioMatch
        });
    }
    catch (error) {
        console.error('Error matching audio for video:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * POST /api/audio/match-all
 * Match all pending videos with trending audio
 */
router.post('/match-all', async (req, res) => {
    try {
        const matches = await audioMatchingService.matchAllPendingVideos();
        res.json({
            success: true,
            message: `Successfully matched ${matches.length} videos with trending audio`,
            data: matches
        });
    }
    catch (error) {
        console.error('Error matching all videos:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * GET /api/audio/trending/:platform
 * Get trending audio for a specific platform
 */
router.get('/trending/:platform', async (req, res) => {
    try {
        const { platform } = req.params;
        if (platform !== 'youtube' && platform !== 'instagram') {
            return res.status(400).json({
                success: false,
                message: 'Platform must be either "youtube" or "instagram"'
            });
        }
        let trendingAudio;
        if (platform === 'youtube') {
            trendingAudio = await audioScraper.fetchYouTubeTrendingAudio();
        }
        else {
            trendingAudio = await audioScraper.fetchInstagramTrendingAudio();
        }
        res.json({
            success: true,
            data: trendingAudio
        });
    }
    catch (error) {
        console.error('Error fetching trending audio:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * GET /api/audio/trending
 * Get trending audio from all platforms
 */
router.get('/trending', async (req, res) => {
    try {
        const trendingAudio = await audioScraper.getAllTrendingAudio();
        res.json({
            success: true,
            data: trendingAudio
        });
    }
    catch (error) {
        console.error('Error fetching all trending audio:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * GET /api/audio/matches/:videoId
 * Get audio matches for a specific video
 */
router.get('/matches/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const matches = await AudioMatch_1.AudioMatch.find({ videoId }).sort({ matchedAt: -1 });
        res.json({
            success: true,
            data: matches
        });
    }
    catch (error) {
        console.error('Error fetching audio matches:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * GET /api/audio/matches
 * Get all audio matches with optional filtering
 */
router.get('/matches', async (req, res) => {
    try {
        const { platform, status, limit = 50 } = req.query;
        const filter = {};
        if (platform)
            filter.platform = platform;
        if (status)
            filter.status = status;
        const matches = await AudioMatch_1.AudioMatch.find(filter)
            .sort({ matchedAt: -1 })
            .limit(parseInt(limit));
        res.json({
            success: true,
            data: matches
        });
    }
    catch (error) {
        console.error('Error fetching audio matches:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * PUT /api/audio/matches/:matchId/status
 * Update audio match status (e.g., mark as applied)
 */
router.put('/matches/:matchId/status', async (req, res) => {
    try {
        const { matchId } = req.params;
        const { status, errorMessage } = req.body;
        if (!['matched', 'applied', 'failed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be one of: matched, applied, failed'
            });
        }
        const audioMatch = await AudioMatch_1.AudioMatch.findByIdAndUpdate(matchId, {
            status,
            ...(errorMessage && { errorMessage })
        }, { new: true });
        if (!audioMatch) {
            return res.status(404).json({
                success: false,
                message: 'Audio match not found'
            });
        }
        res.json({
            success: true,
            data: audioMatch
        });
    }
    catch (error) {
        console.error('Error updating audio match status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * DELETE /api/audio/matches/:matchId
 * Delete an audio match
 */
router.delete('/matches/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        const audioMatch = await AudioMatch_1.AudioMatch.findByIdAndDelete(matchId);
        if (!audioMatch) {
            return res.status(404).json({
                success: false,
                message: 'Audio match not found'
            });
        }
        res.json({
            success: true,
            message: 'Audio match deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting audio match:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * POST /api/audio/overlay/:matchId
 * Apply audio overlay to video based on audio match
 */
router.post('/overlay/:matchId', async (req, res) => {
    try {
        const { matchId } = req.params;
        const result = await audioOverlayService.applyAudioOverlay(matchId);
        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.errorMessage || 'Audio overlay failed'
            });
        }
        res.json({
            success: true,
            message: 'Audio overlay applied successfully',
            data: {
                outputPath: result.outputPath,
                duration: result.duration
            }
        });
    }
    catch (error) {
        console.error('Error applying audio overlay:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * POST /api/audio/overlay/batch
 * Apply audio overlay to multiple videos
 */
router.post('/overlay/batch', async (req, res) => {
    try {
        const { matchIds } = req.body;
        if (!Array.isArray(matchIds) || matchIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'matchIds array is required'
            });
        }
        const results = [];
        for (const matchId of matchIds) {
            try {
                const result = await audioOverlayService.applyAudioOverlay(matchId);
                results.push({
                    matchId,
                    success: result.success,
                    outputPath: result.outputPath,
                    errorMessage: result.errorMessage
                });
            }
            catch (error) {
                results.push({
                    matchId,
                    success: false,
                    errorMessage: error.message || 'Unknown error occurred'
                });
            }
        }
        const successCount = results.filter(r => r.success).length;
        res.json({
            success: true,
            message: `Applied audio overlay to ${successCount}/${results.length} videos`,
            data: results
        });
    }
    catch (error) {
        console.error('Error applying batch audio overlay:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * GET /api/audio/overlay/status
 * Get status of audio overlay operations
 */
router.get('/overlay/status', async (req, res) => {
    try {
        const { platform, days = 7 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        const filter = {
            matchedAt: { $gte: startDate }
        };
        if (platform) {
            filter.platform = platform;
        }
        const totalMatches = await AudioMatch_1.AudioMatch.countDocuments(filter);
        const appliedMatches = await AudioMatch_1.AudioMatch.countDocuments({ ...filter, status: 'applied' });
        const failedMatches = await AudioMatch_1.AudioMatch.countDocuments({ ...filter, status: 'failed' });
        const pendingMatches = await AudioMatch_1.AudioMatch.countDocuments({ ...filter, status: 'matched' });
        res.json({
            success: true,
            data: {
                total: totalMatches,
                applied: appliedMatches,
                failed: failedMatches,
                pending: pendingMatches,
                successRate: totalMatches > 0 ? Math.round((appliedMatches / totalMatches) * 100) : 0,
                period: `Last ${days} days`
            }
        });
    }
    catch (error) {
        console.error('Error getting overlay status:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
/**
 * POST /api/audio/initialize
 * Initialize emotional audio tracks database
 */
router.post('/initialize', async (req, res) => {
    try {
        console.log('🎵 Initializing emotional audio tracks database...');
        // Initialize the trending audio tracks with emotional categories
        const audioTracks = await (0, fetchTrendingAudio_1.fetchTrendingAudio)();
        res.json({
            success: true,
            message: `Successfully initialized ${audioTracks.length} emotional audio tracks`,
            data: {
                total: audioTracks.length,
                categories: {
                    hype: audioTracks.filter(t => t.category === 'hype').length,
                    emotional: audioTracks.filter(t => t.category === 'emotional').length,
                    luxury: audioTracks.filter(t => t.category === 'luxury').length,
                    funny: audioTracks.filter(t => t.category === 'funny').length,
                    chill: audioTracks.filter(t => t.category === 'chill').length
                }
            }
        });
    }
    catch (error) {
        console.error('Error initializing audio tracks:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while initializing audio tracks'
        });
    }
});
/**
 * GET /api/audio/categories/:category
 * Get audio tracks by emotional category
 */
router.get('/categories/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const validCategories = ['hype', 'emotional', 'luxury', 'funny', 'chill'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Category must be one of: ${validCategories.join(', ')}`
            });
        }
        const tracks = await (0, fetchTrendingAudio_1.getAudioTracksByCategory)(category);
        res.json({
            success: true,
            data: tracks,
            count: tracks.length
        });
    }
    catch (error) {
        console.error(`Error fetching ${req.params.category} audio tracks:`, error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
