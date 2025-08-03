"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = uploadToS3;
exports.uploadVideoWithThumbnail = uploadVideoWithThumbnail;
exports.uploadThumbnailToS3 = uploadThumbnailToS3;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateThumbnail_1 = require("./generateThumbnail");
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
});
const s3 = new aws_sdk_1.default.S3();
async function uploadToS3(localPath, s3Key) {
    // If S3 is not configured, return the local path as fallback
    if (!process.env.AWS_BUCKET_NAME || !process.env.AWS_ACCESS_KEY_ID) {
        console.log('ℹ️ S3 not configured, using local path');
        return localPath;
    }
    // Generate S3 key if not provided
    const filename = path_1.default.basename(localPath);
    const key = s3Key || `autopilot/${Date.now()}_${filename}`;
    const fileContent = fs_1.default.readFileSync(localPath);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: fileContent,
        ACL: 'public-read',
        ContentType: localPath.endsWith('.jpg') ? 'image/jpeg' : 'video/mp4',
    };
    await s3.upload(params).promise();
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
/**
 * Upload video and thumbnail to S3 for dashboard previews
 */
async function uploadVideoWithThumbnail(videoPath, videoS3Key, thumbnailPrefix = 'thumbnails') {
    // Generate thumbnail first
    const thumbnailFileName = `${thumbnailPrefix}_${Date.now()}.jpg`;
    const thumbnailPath = await (0, generateThumbnail_1.generateThumbnail)(videoPath, thumbnailFileName);
    console.log(`📸 Generated thumbnail for S3 dashboard: ${thumbnailPath}`);
    // Upload video
    const videoUrl = await uploadToS3(videoPath, videoS3Key);
    // Upload thumbnail
    const thumbnailS3Key = `${thumbnailPrefix}/${thumbnailFileName}`;
    const thumbnailUrl = await uploadThumbnailToS3(thumbnailPath, thumbnailS3Key);
    // Clean up local thumbnail
    try {
        if (fs_1.default.existsSync(thumbnailPath)) {
            fs_1.default.unlinkSync(thumbnailPath);
            console.log(`🧹 Cleaned up local thumbnail: ${thumbnailPath}`);
        }
    }
    catch (cleanupError) {
        console.warn(`⚠️ Could not clean up thumbnail: ${cleanupError}`);
    }
    console.log(`✅ Uploaded video + thumbnail to S3 for dashboard preview`);
    console.log(`🎬 Video: ${videoUrl}`);
    console.log(`📸 Thumbnail: ${thumbnailUrl}`);
    return { videoUrl, thumbnailUrl };
}
/**
 * Upload thumbnail image to S3
 */
async function uploadThumbnailToS3(thumbnailPath, s3Key) {
    const fileContent = fs_1.default.readFileSync(thumbnailPath);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
        Body: fileContent,
        ACL: 'public-read',
        ContentType: 'image/jpeg',
    };
    await s3.upload(params).promise();
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
}
