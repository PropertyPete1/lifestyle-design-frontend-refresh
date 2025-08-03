"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trendingAudioService = void 0;
const axios_1 = __importDefault(require("axios"));
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
class TrendingAudioService {
    constructor() {
        // Cache for trending audio to avoid hitting APIs too frequently
        this.instagramTrendingAudio = [];
        this.youtubeTrendingAudio = [];
        this.lastInstagramRefresh = new Date(0);
        this.lastYouTubeRefresh = new Date(0);
        this.cacheTimeout = 30 * 60 * 1000; // 30 minutes
        // Fallback data in case APIs fail
        this.fallbackInstagramAudio = [
            { id: 'ig_trending_1', title: 'Motivational Beat', artist: 'BeatsProducer', platform: 'instagram', trendingScore: 95, duration: 30, audioClusterId: '1652909715240982' },
            { id: 'ig_trending_2', title: 'Success Mindset', artist: 'AudioMaster', platform: 'instagram', trendingScore: 88, duration: 15, audioClusterId: '1574256409788555' },
            { id: 'ig_trending_3', title: 'Morning Energy', artist: 'VibeCreator', platform: 'instagram', trendingScore: 82, duration: 20, audioClusterId: '946407113108099' },
            { id: 'ig_trending_4', title: 'Hustle Mode', artist: 'GrindBeats', platform: 'instagram', trendingScore: 79, duration: 25, audioClusterId: '1284466425718717' },
            { id: 'ig_trending_5', title: 'Focus Flow', artist: 'ZenSounds', platform: 'instagram', trendingScore: 76, duration: 30, audioClusterId: '531728538702358' }
        ];
        this.fallbackYouTubeAudio = [
            { id: 'yt_trending_1', title: 'Viral Shorts Beat', artist: 'ShortsKing', platform: 'youtube', trendingScore: 92, duration: 60, audioAssetId: 'YT_AUDIO_LIBRARY_1' },
            { id: 'yt_trending_2', title: 'Motivation Mix', artist: 'SuccessSound', platform: 'youtube', trendingScore: 87, duration: 45, audioAssetId: 'YT_AUDIO_LIBRARY_2' },
            { id: 'yt_trending_3', title: 'Study Vibes', artist: 'BookBeats', platform: 'youtube', trendingScore: 84, duration: 30, audioAssetId: 'YT_AUDIO_LIBRARY_3' },
            { id: 'yt_trending_4', title: 'Workout Energy', artist: 'GymTracks', platform: 'youtube', trendingScore: 81, duration: 40, audioAssetId: 'YT_AUDIO_LIBRARY_4' },
            { id: 'yt_trending_5', title: 'Chill Success', artist: 'RelaxedRise', platform: 'youtube', trendingScore: 77, duration: 35, audioAssetId: 'YT_AUDIO_LIBRARY_5' }
        ];
    }
    /**
     * Get trending audio for a specific platform
     */
    async getTrendingAudio(platform, limit = 10) {
        try {
            if (platform === 'instagram') {
                return await this.getInstagramTrendingAudio(limit);
            }
            else {
                return await this.getYouTubeTrendingAudio(limit);
            }
        }
        catch (error) {
            console.error(`❌ Failed to get trending audio for ${platform}:`, error);
            return this.getFallbackAudio(platform, limit);
        }
    }
    /**
     * Get a single random trending audio for a platform
     */
    async getRandomTrendingAudio(platform) {
        const trendingList = await this.getTrendingAudio(platform, 5);
        const randomAudio = trendingList[Math.floor(Math.random() * trendingList.length)];
        return randomAudio.id;
    }
    /**
     * Get Instagram trending audio using Instagram Graph API
     */
    async getInstagramTrendingAudio(limit) {
        try {
            // Check cache first
            const now = new Date();
            if (this.instagramTrendingAudio.length > 0 &&
                (now.getTime() - this.lastInstagramRefresh.getTime()) < this.cacheTimeout) {
                console.log('🎵 Using cached Instagram trending audio');
                return this.instagramTrendingAudio.slice(0, limit);
            }
            console.log('🎵 Fetching fresh Instagram trending audio...');
            const settings = await SettingsModel_1.default.findOne();
            if (!(settings === null || settings === void 0 ? void 0 : settings.instagramToken) || !(settings === null || settings === void 0 ? void 0 : settings.instagramAccount)) {
                console.warn('⚠️ Instagram credentials not configured, using fallback audio');
                return this.fallbackInstagramAudio.slice(0, limit);
            }
            // Get trending media first to find popular audio
            const mediaResponse = await axios_1.default.get(`https://graph.facebook.com/v21.0/${settings.instagramAccount}/media?fields=id,media_type,media_url,caption,like_count,comments_count&limit=50&access_token=${settings.instagramToken}`);
            const trendingAudio = [];
            const mediaData = mediaResponse.data.data;
            // Extract audio from trending reels
            for (const media of mediaData.slice(0, 20)) {
                if (media.media_type === 'VIDEO') {
                    try {
                        // Get additional media details that might include audio info
                        const detailResponse = await axios_1.default.get(`https://graph.facebook.com/v21.0/${media.id}?fields=id,caption,like_count,comments_count&access_token=${settings.instagramToken}`);
                        const engagement = (media.like_count || 0) + (media.comments_count || 0);
                        const trendingScore = Math.min(100, Math.round(engagement / 100));
                        if (trendingScore > 10) { // Only include audio from engaging content
                            trendingAudio.push({
                                id: `ig_audio_${media.id}`,
                                title: `Trending Audio ${trendingAudio.length + 1}`,
                                artist: 'Instagram Trending',
                                platform: 'instagram',
                                trendingScore: trendingScore,
                                duration: 30,
                                audioClusterId: `cluster_${media.id}`,
                                audioUrl: media.media_url
                            });
                        }
                    }
                    catch (error) {
                        console.warn(`⚠️ Could not fetch details for media ${media.id}:`, error.message);
                    }
                }
            }
            // If we got some real trending audio, cache it
            if (trendingAudio.length > 0) {
                this.instagramTrendingAudio = trendingAudio;
                this.lastInstagramRefresh = now;
                console.log(`✅ Fetched ${trendingAudio.length} real Instagram trending audio tracks`);
                return trendingAudio.slice(0, limit);
            }
            else {
                console.warn('⚠️ No trending audio found, using fallback');
                return this.fallbackInstagramAudio.slice(0, limit);
            }
        }
        catch (error) {
            console.error('❌ Failed to fetch Instagram trending audio:', error.message);
            return this.fallbackInstagramAudio.slice(0, limit);
        }
    }
    /**
     * Get YouTube trending audio using YouTube Data API
     */
    async getYouTubeTrendingAudio(limit) {
        var _a;
        try {
            // Check cache first
            const now = new Date();
            if (this.youtubeTrendingAudio.length > 0 &&
                (now.getTime() - this.lastYouTubeRefresh.getTime()) < this.cacheTimeout) {
                console.log('🎵 Using cached YouTube trending audio');
                return this.youtubeTrendingAudio.slice(0, limit);
            }
            console.log('🎵 Fetching fresh YouTube trending audio...');
            const settings = await SettingsModel_1.default.findOne();
            if (!(settings === null || settings === void 0 ? void 0 : settings.youtubeToken) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeClientId)) {
                console.warn('⚠️ YouTube credentials not configured, using fallback audio');
                return this.fallbackYouTubeAudio.slice(0, limit);
            }
            // Search for trending shorts to extract audio
            const searchResponse = await axios_1.default.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'id,snippet',
                    type: 'video',
                    videoDuration: 'short',
                    order: 'viewCount',
                    publishedAfter: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last 7 days
                    maxResults: 25,
                    q: 'trending music beats viral audio',
                    key: settings.youtubeApiKey || settings.youtubeClientId
                },
                headers: {
                    'Authorization': `Bearer ${settings.youtubeToken}`
                }
            });
            const trendingAudio = [];
            const videos = searchResponse.data.items;
            // Get detailed stats for trending videos
            const videoIds = videos.map((v) => v.id.videoId).join(',');
            const statsResponse = await axios_1.default.get('https://www.googleapis.com/youtube/v3/videos', {
                params: {
                    part: 'statistics,contentDetails',
                    id: videoIds,
                    key: settings.youtubeApiKey || settings.youtubeClientId
                },
                headers: {
                    'Authorization': `Bearer ${settings.youtubeToken}`
                }
            });
            for (let i = 0; i < videos.length && i < limit; i++) {
                const video = videos[i];
                const stats = statsResponse.data.items[i];
                if (stats && stats.statistics) {
                    const viewCount = parseInt(stats.statistics.viewCount || '0');
                    const trendingScore = Math.min(100, Math.round(viewCount / 10000)); // Views / 10k = score
                    if (trendingScore > 5) {
                        trendingAudio.push({
                            id: `yt_audio_${video.id.videoId}`,
                            title: video.snippet.title.substring(0, 50),
                            artist: video.snippet.channelTitle,
                            platform: 'youtube',
                            trendingScore: trendingScore,
                            duration: this.parseDuration(((_a = stats.contentDetails) === null || _a === void 0 ? void 0 : _a.duration) || 'PT30S'),
                            audioAssetId: video.id.videoId,
                            audioUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`
                        });
                    }
                }
            }
            // Cache the results
            if (trendingAudio.length > 0) {
                this.youtubeTrendingAudio = trendingAudio;
                this.lastYouTubeRefresh = now;
                console.log(`✅ Fetched ${trendingAudio.length} real YouTube trending audio tracks`);
                return trendingAudio.slice(0, limit);
            }
            else {
                console.warn('⚠️ No trending audio found, using fallback');
                return this.fallbackYouTubeAudio.slice(0, limit);
            }
        }
        catch (error) {
            console.error('❌ Failed to fetch YouTube trending audio:', error.message);
            return this.fallbackYouTubeAudio.slice(0, limit);
        }
    }
    /**
     * Parse YouTube duration format (PT30S, PT1M30S) to seconds
     */
    parseDuration(duration) {
        const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);
        if (!match)
            return 30;
        const minutes = parseInt(match[1] || '0');
        const seconds = parseInt(match[2] || '0');
        return minutes * 60 + seconds;
    }
    /**
     * Fallback audio if APIs fail
     */
    getFallbackAudio(platform, limit) {
        const fallback = platform === 'instagram'
            ? this.fallbackInstagramAudio
            : this.fallbackYouTubeAudio;
        return fallback.slice(0, limit);
    }
    /**
     * Get audio metadata by ID
     */
    async getAudioMetadata(audioId) {
        const allAudio = [
            ...this.instagramTrendingAudio,
            ...this.youtubeTrendingAudio,
            ...this.fallbackInstagramAudio,
            ...this.fallbackYouTubeAudio
        ];
        return allAudio.find(audio => audio.id === audioId) || null;
    }
    /**
     * Search for audio by keywords
     */
    async searchAudio(query, platform) {
        let audioList;
        if (platform === 'instagram') {
            audioList = [...this.instagramTrendingAudio, ...this.fallbackInstagramAudio];
        }
        else if (platform === 'youtube') {
            audioList = [...this.youtubeTrendingAudio, ...this.fallbackYouTubeAudio];
        }
        else {
            audioList = [
                ...this.instagramTrendingAudio,
                ...this.youtubeTrendingAudio,
                ...this.fallbackInstagramAudio,
                ...this.fallbackYouTubeAudio
            ];
        }
        const searchTerms = query.toLowerCase().split(' ');
        return audioList.filter(audio => {
            const searchText = `${audio.title} ${audio.artist}`.toLowerCase();
            return searchTerms.some(term => searchText.includes(term));
        }).sort((a, b) => b.trendingScore - a.trendingScore);
    }
    /**
     * Refresh trending audio data by calling real APIs
     */
    async refreshTrendingData() {
        console.log('🔄 Refreshing trending audio data from real APIs...');
        try {
            // Force refresh by clearing cache
            this.lastInstagramRefresh = new Date(0);
            this.lastYouTubeRefresh = new Date(0);
            // Fetch fresh data from both platforms
            const [instagramAudio, youtubeAudio] = await Promise.all([
                this.getInstagramTrendingAudio(10),
                this.getYouTubeTrendingAudio(10)
            ]);
            return [
                { updated: instagramAudio.length, platform: 'instagram' },
                { updated: youtubeAudio.length, platform: 'youtube' }
            ];
        }
        catch (error) {
            console.error('❌ Failed to refresh trending audio data:', error);
            throw error;
        }
    }
    /**
     * Get a trending audio with full metadata for posting
     */
    async getTrendingAudioForPosting(platform) {
        const trendingList = await this.getTrendingAudio(platform, 1);
        if (trendingList.length === 0)
            return null;
        const audio = trendingList[0];
        console.log(`🎵 Selected trending audio for ${platform}: ${audio.title} by ${audio.artist} (Score: ${audio.trendingScore})`);
        return audio;
    }
}
exports.trendingAudioService = new TrendingAudioService();
