"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTrendingAudio = exports.getVideoMetadata = exports.reencodeVideo = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Re-encode video with modifications to break hash fingerprinting
 */
const reencodeVideo = async (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
        // Ensure output directory exists
        const outputDir = path_1.default.dirname(outputPath);
        if (!fs_1.default.existsSync(outputDir)) {
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        }
        // FFmpeg command with hash-breaking modifications:
        // - Fade in effect (30 frames)
        // - Re-encoding with different settings
        // - Audio re-encoding to break audio fingerprinting
        const ffmpegCmd = `ffmpeg -i "${inputPath}" \
      -vf "fade=in:0:30,scale=trunc(iw/2)*2:trunc(ih/2)*2" \
      -c:v libx264 \
      -preset fast \
      -crf 28 \
      -movflags +faststart \
      -c:a aac \
      -b:a 128k \
      -ar 44100 \
      -y "${outputPath}"`;
        console.log(`🎬 Re-encoding video: ${path_1.default.basename(inputPath)} -> ${path_1.default.basename(outputPath)}`);
        (0, child_process_1.exec)(ffmpegCmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ FFmpeg error: ${error.message}`);
                console.error(`❌ FFmpeg stderr: ${stderr}`);
                reject(error);
            }
            else {
                console.log(`✅ Video re-encoded successfully: ${outputPath}`);
                resolve(outputPath);
            }
        });
    });
};
exports.reencodeVideo = reencodeVideo;
/**
 * Get video metadata using ffprobe
 */
const getVideoMetadata = async (filePath) => {
    return new Promise((resolve, reject) => {
        const ffprobeCmd = `ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`;
        (0, child_process_1.exec)(ffprobeCmd, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                try {
                    const metadata = JSON.parse(stdout);
                    resolve(metadata);
                }
                catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
};
exports.getVideoMetadata = getVideoMetadata;
/**
 * Apply trending audio to video
 * Note: This feature is handled by the original backend's audio services
 */
const applyTrendingAudio = async (videoPath, audioId) => {
    // Audio overlay functionality is available in the original backend
    console.log(`🎵 Audio processing for ${path_1.default.basename(videoPath)} - use original backend services`);
    return videoPath;
};
exports.applyTrendingAudio = applyTrendingAudio;
