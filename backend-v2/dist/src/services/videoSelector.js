"use strict";
/**
 * Video Selection Service
 * Handles repost strategy logic for selecting videos based on performance
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopVideos = getTopVideos;
exports.getAllVideos = getAllVideos;
exports.selectVideosByStrategy = selectVideosByStrategy;
exports.calculatePerformanceScore = calculatePerformanceScore;
exports.filterVideosByAge = filterVideosByAge;
exports.selectVideosAdvanced = selectVideosAdvanced;
exports.getSelectionStats = getSelectionStats;
/**
 * Get top-performing videos based on engagement and insights
 */
function getTopVideos(videos, limit = 5) {
    // Calculate dynamic threshold based on top 50% of videos
    const sortedByViews = [...videos].sort((a, b) => b.views - a.views);
    const topPercentileIndex = Math.floor(sortedByViews.length * 0.5);
    const dynamicThreshold = topPercentileIndex < sortedByViews.length
        ? sortedByViews[topPercentileIndex].views
        : 500; // Fallback minimum
    return videos
        .filter(video => video.views >= dynamicThreshold)
        .sort((a, b) => {
        // Sort by performance score if available, otherwise by views
        const scoreA = a.performanceScore || a.views + (a.likes || 0) * 10 + (a.comments || 0) * 50;
        const scoreB = b.performanceScore || b.views + (b.likes || 0) * 10 + (b.comments || 0) * 50;
        return scoreB - scoreA;
    })
        .slice(0, limit);
}
/**
 * Get all eligible videos (basic filtering)
 */
function getAllVideos(videos, minViews = 500) {
    return videos
        .filter(video => video.views >= minViews)
        .sort((a, b) => b.views - a.views); // Sort by views descending
}
/**
 * Apply repost strategy selection
 */
function selectVideosByStrategy(videos, strategy, options = {}) {
    const { limit = 5, minViews = 5000 } = options;
    console.log(`📊 Applying repost strategy: ${strategy}`);
    console.log(`📋 Input videos: ${videos.length}, min views: ${minViews}, limit: ${limit}`);
    let selectedVideos;
    if (strategy === 'high-performers') {
        selectedVideos = getTopVideos(videos, limit);
        console.log(`🏆 High-performer strategy: ${selectedVideos.length} videos selected`);
    }
    else {
        selectedVideos = getAllVideos(videos, minViews).slice(0, limit);
        console.log(`📈 All-videos strategy: ${selectedVideos.length} videos selected`);
    }
    // Log performance details
    selectedVideos.forEach((video, index) => {
        console.log(`   ${index + 1}. ${video.id}: ${video.views.toLocaleString()} views`);
    });
    return selectedVideos;
}
/**
 * Calculate performance score for a video
 */
function calculatePerformanceScore(views, likes = 0, comments = 0) {
    // Weighted scoring: views + (likes * 10) + (comments * 50)
    // Comments are weighted highest as they indicate strong engagement
    return Math.round(views + (likes * 10) + (comments * 50));
}
/**
 * Filter videos by age (repost delay consideration)
 */
function filterVideosByAge(videos, maxAgeDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
    return videos.filter(video => {
        const videoDate = new Date(video.timestamp);
        return videoDate >= cutoffDate;
    });
}
/**
 * Enhanced video selection with multiple criteria
 */
function selectVideosAdvanced(videos, criteria) {
    let filteredVideos = [...videos];
    // Filter by age if specified
    if (criteria.maxAgeDays) {
        filteredVideos = filterVideosByAge(filteredVideos, criteria.maxAgeDays);
        console.log(`📅 After age filter (${criteria.maxAgeDays} days): ${filteredVideos.length} videos`);
    }
    // Exclude recently posted videos
    if (criteria.excludeRecentlyPosted && criteria.excludeRecentlyPosted.length > 0) {
        filteredVideos = filteredVideos.filter(video => !criteria.excludeRecentlyPosted.includes(video.id));
        console.log(`🚫 After excluding recently posted: ${filteredVideos.length} videos`);
    }
    // Apply strategy selection
    return selectVideosByStrategy(filteredVideos, criteria.strategy, {
        limit: criteria.limit,
        minViews: criteria.minViews
    });
}
/**
 * Get video selection statistics
 */
function getSelectionStats(videos) {
    const total = videos.length;
    const highPerformers = videos.filter(v => v.views >= 10000).length;
    const eligibleForRepost = videos.filter(v => v.views >= 5000).length;
    const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
    const averageViews = total > 0 ? Math.round(totalViews / total) : 0;
    const topViews = total > 0 ? Math.max(...videos.map(v => v.views)) : 0;
    return {
        total,
        highPerformers,
        averageViews,
        topViews,
        eligibleForRepost
    };
}
