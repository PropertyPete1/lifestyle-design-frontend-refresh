"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkS3Storage = checkS3Storage;
exports.checkMongoStorage = checkMongoStorage;
exports.getStorageMetrics = getStorageMetrics;
exports.cleanupStorage = cleanupStorage;
const mongodb_1 = require("mongodb");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
/**
 * Storage Health Check Service
 * Monitors S3 and MongoDB storage capacity and health
 */
/**
 * Check S3 storage health and capacity
 */
async function checkS3Storage() {
    try {
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        const accessKey = process.env.AWS_ACCESS_KEY_ID;
        if (!bucketName || !accessKey) {
            console.log('ℹ️ S3 not configured, skipping S3 health check (this is optional)');
            return true; // Don't fail if S3 not configured
        }
        const s3 = new aws_sdk_1.default.S3({
            accessKeyId: accessKey,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_S3_REGION || 'us-east-1'
        });
        // Check if bucket exists and is accessible
        try {
            await s3.headBucket({ Bucket: bucketName }).promise();
            console.log('✅ S3 storage accessible');
            // Optional: Check bucket size (requires CloudWatch or detailed bucket metrics)
            // For now, we'll assume healthy if accessible
            return true;
        }
        catch (s3Error) {
            if (s3Error.code === 'NotFound') {
                console.error('❌ S3 bucket not found:', bucketName);
                return false;
            }
            else if (s3Error.code === 'Forbidden') {
                console.error('❌ S3 access denied - check credentials');
                return false;
            }
            else {
                console.error('❌ S3 health check failed:', s3Error.message);
                return false;
            }
        }
    }
    catch (error) {
        console.error('❌ S3 configuration error:', error);
        return true; // Don't fail autopilot if S3 not configured
    }
}
/**
 * Check MongoDB storage health and capacity
 */
async function checkMongoStorage() {
    let client = null;
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            console.warn('⚠️ MongoDB URI not configured');
            return false;
        }
        client = new mongodb_1.MongoClient(mongoUri);
        await client.connect();
        const db = client.db();
        // Check database stats
        const stats = await db.stats();
        const totalSizeGB = stats.dataSize / (1024 * 1024 * 1024);
        const storageSizeGB = stats.storageSize / (1024 * 1024 * 1024);
        console.log(`📊 MongoDB stats: ${totalSizeGB.toFixed(2)}GB data, ${storageSizeGB.toFixed(2)}GB storage`);
        // Check if storage is getting full (warn at 80% of typical free tier limits)
        const warningThresholdGB = 0.4; // 400MB for MongoDB Atlas free tier (512MB limit)
        if (storageSizeGB > warningThresholdGB) {
            console.warn(`⚠️ MongoDB storage approaching limits: ${storageSizeGB.toFixed(2)}GB used`);
            return false;
        }
        // Test write operation
        const testCollection = db.collection('health_check');
        await testCollection.insertOne({
            timestamp: new Date(),
            test: 'storage_health_check'
        });
        await testCollection.deleteOne({ test: 'storage_health_check' });
        console.log('✅ MongoDB storage healthy');
        return true;
    }
    catch (error) {
        console.error('❌ MongoDB health check failed:', error.message);
        return false;
    }
    finally {
        if (client) {
            await client.close();
        }
    }
}
/**
 * Get detailed storage metrics for dashboard
 */
async function getStorageMetrics() {
    let client = null;
    try {
        // MongoDB metrics
        const mongoUri = process.env.MONGODB_URI;
        const mongoResult = {
            healthy: false,
            dataSize: 0,
            storageSize: 0,
            collections: 0
        };
        if (mongoUri) {
            try {
                client = new mongodb_1.MongoClient(mongoUri);
                await client.connect();
                const db = client.db();
                const stats = await db.stats();
                mongoResult.healthy = true;
                mongoResult.dataSize = stats.dataSize;
                mongoResult.storageSize = stats.storageSize;
                mongoResult.collections = stats.collections;
            }
            catch (mongoError) {
                console.error('❌ MongoDB metrics error:', mongoError);
            }
            finally {
                if (client) {
                    await client.close();
                    client = null;
                }
            }
        }
        // S3 metrics
        const s3Result = {
            healthy: false,
            accessible: false
        };
        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (bucketName && process.env.AWS_ACCESS_KEY_ID) {
            try {
                const s3 = new aws_sdk_1.default.S3({
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                    region: process.env.AWS_S3_REGION || 'us-east-1'
                });
                await s3.headBucket({ Bucket: bucketName }).promise();
                s3Result.accessible = true;
                s3Result.healthy = true;
            }
            catch (s3Error) {
                console.error('❌ S3 metrics error:', s3Error);
            }
        }
        return {
            mongo: mongoResult,
            s3: s3Result
        };
    }
    catch (error) {
        console.error('❌ Storage metrics error:', error);
        return {
            mongo: { healthy: false, dataSize: 0, storageSize: 0, collections: 0 },
            s3: { healthy: false, accessible: false }
        };
    }
}
/**
 * Clean up old temporary files and logs to free space
 */
async function cleanupStorage() {
    let filesDeleted = 0;
    let spaceFreed = 0;
    try {
        const fs = require('fs');
        const path = require('path');
        // Clean temp directory (files older than 1 hour)
        const tempDir = path.join(__dirname, '../../temp');
        if (fs.existsSync(tempDir)) {
            const files = fs.readdirSync(tempDir);
            const oneHourAgo = Date.now() - (60 * 60 * 1000);
            for (const file of files) {
                try {
                    const filePath = path.join(tempDir, file);
                    const stats = fs.statSync(filePath);
                    if (stats.mtime.getTime() < oneHourAgo) {
                        spaceFreed += stats.size;
                        fs.unlinkSync(filePath);
                        filesDeleted++;
                        console.log(`🗑️ Deleted old temp file: ${file}`);
                    }
                }
                catch (fileError) {
                    console.warn(`⚠️ Could not delete ${file}:`, fileError);
                }
            }
        }
        // Clean old autopilot logs (older than 30 days)
        try {
            const { AutopilotLog } = await Promise.resolve().then(() => __importStar(require('../models/AutopilotLog')));
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const result = await AutopilotLog.deleteMany({
                startTime: { $lt: thirtyDaysAgo }
            });
            console.log(`🗑️ Deleted ${result.deletedCount} old autopilot logs`);
        }
        catch (logError) {
            console.warn('⚠️ Could not clean old logs:', logError);
        }
        console.log(`✅ Storage cleanup completed: ${filesDeleted} files deleted, ${(spaceFreed / 1024 / 1024).toFixed(2)}MB freed`);
    }
    catch (error) {
        console.error('❌ Storage cleanup error:', error);
    }
    return { filesDeleted, spaceFreed };
}
