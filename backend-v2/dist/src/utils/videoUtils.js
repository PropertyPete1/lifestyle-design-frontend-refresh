"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractVideoMetadata = extractVideoMetadata;
exports.cleanupTempVideo = cleanupTempVideo;
exports.validateVideoFile = validateVideoFile;
exports.convertVideoForInstagram = convertVideoForInstagram;
exports.getVideoProcessingStats = getVideoProcessingStats;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Extract video metadata and download video to local storage
 */
async function extractVideoMetadata(video) {
    try {
        console.log(`🎬 Extracting metadata for video: ${video.id}`);
        // Create temp directory if it doesn't exist
        const tempDir = path_1.default.join(__dirname, '../../temp');
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        }
        // Generate unique filename
        const timestamp = Date.now();
        const filename = `auto_${timestamp}_${video.id}.mp4`;
        const localPath = path_1.default.join(tempDir, filename);
        // Download video
        console.log(`⬇️ Downloading video to: ${localPath}`);
        const response = await (0, axios_1.default)({
            method: 'GET',
            url: video.url,
            responseType: 'stream',
            timeout: 60000 // 60 second timeout
        });
        const writer = fs_1.default.createWriteStream(localPath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
        // Get file stats
        const stats = fs_1.default.statSync(localPath);
        const size = stats.size;
        console.log(`✅ Video downloaded: ${(size / 1024 / 1024).toFixed(2)}MB`);
        // Try to extract additional metadata using ffprobe if available
        let duration;
        let dimensions;
        try {
            const ffprobe = require('ffprobe');
            const ffprobeStatic = require('ffprobe-static');
            const metadata = await ffprobe(localPath, { path: ffprobeStatic.path });
            if (metadata.streams && metadata.streams.length > 0) {
                const videoStream = metadata.streams.find((stream) => stream.codec_type === 'video');
                if (videoStream) {
                    duration = parseFloat(videoStream.duration) || undefined;
                    dimensions = {
                        width: videoStream.width || 0,
                        height: videoStream.height || 0
                    };
                    console.log(`📊 Video metadata: ${dimensions.width}x${dimensions.height}, ${duration === null || duration === void 0 ? void 0 : duration.toFixed(1)}s`);
                }
            }
        }
        catch (ffprobeError) {
            console.warn('⚠️ FFprobe not available, skipping detailed metadata extraction');
        }
        return {
            localPath,
            filename,
            duration,
            dimensions,
            size,
            format: 'mp4'
        };
    }
    catch (error) {
        console.error(`❌ Failed to extract video metadata for ${video.id}:`, error);
        throw new Error(`Video download failed: ${error.message}`);
    }
}
/**
 * Clean up temporary video files
 */
async function cleanupTempVideo(localPath) {
    try {
        if (fs_1.default.existsSync(localPath)) {
            fs_1.default.unlinkSync(localPath);
            console.log(`🧹 Cleaned up temp video: ${path_1.default.basename(localPath)}`);
        }
    }
    catch (error) {
        console.warn(`⚠️ Could not clean up temp video ${localPath}:`, error);
    }
}
/**
 * Validate video file
 */
function validateVideoFile(filePath) {
    const issues = [];
    try {
        if (!fs_1.default.existsSync(filePath)) {
            issues.push('File does not exist');
            return { valid: false, issues };
        }
        const stats = fs_1.default.statSync(filePath);
        const sizeInMB = stats.size / 1024 / 1024;
        // Check file size (Instagram has limits)
        if (sizeInMB > 100) {
            issues.push(`File too large: ${sizeInMB.toFixed(2)}MB (max 100MB)`);
        }
        if (sizeInMB < 0.1) {
            issues.push(`File too small: ${sizeInMB.toFixed(2)}MB (min 0.1MB)`);
        }
        // Check file extension
        const ext = path_1.default.extname(filePath).toLowerCase();
        if (!['.mp4', '.mov', '.avi'].includes(ext)) {
            issues.push(`Unsupported format: ${ext}`);
        }
        return { valid: issues.length === 0, issues };
    }
    catch (error) {
        issues.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { valid: false, issues };
    }
}
/**
 * Convert video to Instagram-compatible format using FFmpeg
 */
async function convertVideoForInstagram(inputPath) {
    try {
        const outputPath = inputPath.replace('.mp4', '_instagram.mp4');
        // Use FFmpeg to convert video
        const ffmpeg = require('fluent-ffmpeg');
        const ffmpegStatic = require('ffmpeg-static');
        ffmpeg.setFfmpegPath(ffmpegStatic);
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                '-c:v libx264',
                '-profile:v baseline',
                '-level 3.0',
                '-pix_fmt yuv420p',
                '-c:a aac',
                '-ar 44100',
                '-b:a 128k',
                '-movflags +faststart',
                '-vf scale=720:1280:force_original_aspect_ratio=decrease,pad=720:1280:(ow-iw)/2:(oh-ih)/2:black'
            ])
                .output(outputPath)
                .on('end', () => {
                console.log(`✅ Video converted for Instagram: ${path_1.default.basename(outputPath)}`);
                resolve();
            })
                .on('error', (err) => {
                console.error('❌ FFmpeg conversion failed:', err);
                reject(err);
            })
                .run();
        });
        return outputPath;
    }
    catch (error) {
        console.error('❌ Video conversion failed:', error);
        throw error;
    }
}
/**
 * Get video processing statistics
 */
async function getVideoProcessingStats() {
    try {
        const tempDir = path_1.default.join(__dirname, '../../temp');
        if (!fs_1.default.existsSync(tempDir)) {
            return { tempFiles: 0, totalTempSize: 0, oldestFile: null };
        }
        const files = fs_1.default.readdirSync(tempDir);
        let totalSize = 0;
        let oldestDate = null;
        for (const file of files) {
            try {
                const filePath = path_1.default.join(tempDir, file);
                const stats = fs_1.default.statSync(filePath);
                totalSize += stats.size;
                if (!oldestDate || stats.mtime < oldestDate) {
                    oldestDate = stats.mtime;
                }
            }
            catch (fileError) {
                console.warn(`⚠️ Could not get stats for ${file}:`, fileError);
            }
        }
        return {
            tempFiles: files.length,
            totalTempSize: totalSize,
            oldestFile: oldestDate
        };
    }
    catch (error) {
        console.error('❌ Failed to get video processing stats:', error);
        return { tempFiles: 0, totalTempSize: 0, oldestFile: null };
    }
}
