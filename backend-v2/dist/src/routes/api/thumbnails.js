"use strict";
// ✅ /src/routes/api/thumbnails.ts - S3 Dashboard Preview Thumbnails
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const router = express_1.default.Router();
// Configure AWS S3
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
});
/**
 * GET /api/thumbnails/list
 * Get all thumbnails from S3 for dashboard preview
 */
router.get('/list', async (req, res) => {
    try {
        console.log('📸 Fetching S3 thumbnails for dashboard...');
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: 'thumbnails/', // Only get files in thumbnails folder
            MaxKeys: 100 // Limit for performance
        };
        const s3Response = await s3.listObjectsV2(params).promise();
        if (!s3Response.Contents) {
            return res.json({ thumbnails: [] });
        }
        const thumbnails = s3Response.Contents
            .filter(obj => obj.Key && obj.Key.endsWith('.jpg')) // Only image files
            .map(obj => {
            var _a, _b, _c;
            return ({
                key: obj.Key,
                url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${obj.Key}`,
                lastModified: obj.LastModified,
                size: obj.Size,
                platform: ((_a = obj.Key) === null || _a === void 0 ? void 0 : _a.includes('instagram')) ? 'instagram' :
                    ((_b = obj.Key) === null || _b === void 0 ? void 0 : _b.includes('youtube')) ? 'youtube' :
                        ((_c = obj.Key) === null || _c === void 0 ? void 0 : _c.includes('autopilot')) ? 'autopilot' : 'general'
            });
        })
            .sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime()); // Newest first
        console.log(`📸 Found ${thumbnails.length} thumbnails in S3`);
        res.json({
            success: true,
            count: thumbnails.length,
            thumbnails
        });
    }
    catch (error) {
        console.error('❌ Error fetching S3 thumbnails:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch thumbnails from S3'
        });
    }
});
/**
 * GET /api/thumbnails/recent/:platform
 * Get recent thumbnails for specific platform (instagram, youtube, autopilot)
 */
router.get('/recent/:platform', async (req, res) => {
    try {
        const { platform } = req.params;
        const limit = parseInt(req.query.limit) || 20;
        console.log(`📸 Fetching recent ${platform} thumbnails...`);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: `thumbnails/${platform}_`, // Platform-specific prefix
            MaxKeys: limit
        };
        const s3Response = await s3.listObjectsV2(params).promise();
        if (!s3Response.Contents) {
            return res.json({ thumbnails: [] });
        }
        const thumbnails = s3Response.Contents
            .filter(obj => obj.Key && obj.Key.endsWith('.jpg'))
            .map(obj => ({
            key: obj.Key,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${obj.Key}`,
            lastModified: obj.LastModified,
            size: obj.Size,
            platform
        }))
            .sort((a, b) => new Date(b.lastModified || 0).getTime() - new Date(a.lastModified || 0).getTime());
        console.log(`📸 Found ${thumbnails.length} recent ${platform} thumbnails`);
        res.json({
            success: true,
            platform,
            count: thumbnails.length,
            thumbnails
        });
    }
    catch (error) {
        console.error(`❌ Error fetching ${req.params.platform} thumbnails:`, error);
        res.status(500).json({
            success: false,
            error: `Failed to fetch ${req.params.platform} thumbnails`
        });
    }
});
/**
 * DELETE /api/thumbnails/:key
 * Delete a specific thumbnail from S3
 */
router.delete('/:key', async (req, res) => {
    try {
        const { key } = req.params;
        const fullKey = `thumbnails/${key}`;
        console.log(`🗑️ Deleting S3 thumbnail: ${fullKey}`);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fullKey
        };
        await s3.deleteObject(params).promise();
        console.log(`✅ Deleted thumbnail: ${fullKey}`);
        res.json({
            success: true,
            message: `Thumbnail ${key} deleted successfully`
        });
    }
    catch (error) {
        console.error('❌ Error deleting thumbnail:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete thumbnail'
        });
    }
});
exports.default = router;
