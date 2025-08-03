"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateThumbnail = generateThumbnail;
exports.generateThumbnailAtTime = generateThumbnailAtTime;
exports.generateMultipleThumbnails = generateMultipleThumbnails;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * ✅ EXTRACT FIRST-FRAME THUMBNAIL
 * Generate a thumbnail image from the first frame of a video using FFmpeg
 */
function generateThumbnail(inputPath, outputName = 'thumbnail.jpg') {
    const outputPath = path_1.default.join(__dirname, '../temp', outputName);
    // Ensure temp directory exists
    const tempDir = path_1.default.dirname(outputPath);
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    const ffmpegCmd = `ffmpeg -y -ss 0 -i "${inputPath}" -vframes 1 -q:v 2 "${outputPath}"`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(ffmpegCmd, (err, stdout, stderr) => {
            if (err) {
                console.error('❌ Thumbnail generation error:', stderr);
                return reject(err);
            }
            // Verify the thumbnail was created
            if (!fs_1.default.existsSync(outputPath)) {
                console.error('❌ Thumbnail file was not created:', outputPath);
                return reject(new Error('Thumbnail file not created'));
            }
            console.log('✅ Thumbnail saved at:', outputPath);
            resolve(outputPath);
        });
    });
}
/**
 * Generate thumbnail with custom timestamp
 */
function generateThumbnailAtTime(inputPath, timeSeconds = 0, outputName = 'thumbnail.jpg') {
    const outputPath = path_1.default.join(__dirname, '../temp', outputName);
    // Ensure temp directory exists
    const tempDir = path_1.default.dirname(outputPath);
    if (!fs_1.default.existsSync(tempDir)) {
        fs_1.default.mkdirSync(tempDir, { recursive: true });
    }
    const ffmpegCmd = `ffmpeg -y -ss ${timeSeconds} -i "${inputPath}" -vframes 1 -q:v 2 "${outputPath}"`;
    return new Promise((resolve, reject) => {
        (0, child_process_1.exec)(ffmpegCmd, (err, stdout, stderr) => {
            if (err) {
                console.error('❌ Thumbnail generation error:', stderr);
                return reject(err);
            }
            if (!fs_1.default.existsSync(outputPath)) {
                console.error('❌ Thumbnail file was not created:', outputPath);
                return reject(new Error('Thumbnail file not created'));
            }
            console.log(`✅ Thumbnail saved at: ${outputPath} (time: ${timeSeconds}s)`);
            resolve(outputPath);
        });
    });
}
/**
 * Generate multiple thumbnails at different timestamps
 */
async function generateMultipleThumbnails(inputPath, timestamps = [0, 1, 2], outputPrefix = 'thumb') {
    const results = [];
    for (let i = 0; i < timestamps.length; i++) {
        const outputName = `${outputPrefix}_${i + 1}.jpg`;
        const thumbnailPath = await generateThumbnailAtTime(inputPath, timestamps[i], outputName);
        results.push(thumbnailPath);
    }
    return results;
}
