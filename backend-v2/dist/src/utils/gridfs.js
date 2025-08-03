"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideoFromGridFS = exports.videoExistsInGridFS = exports.getVideoFromGridFS = exports.saveVideoToGridFS = void 0;
const fs_1 = __importDefault(require("fs"));
const mongodb_1 = require("mongodb");
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/lifestyle-design-auto-poster';
const DB_NAME = 'lifestyle-design-auto-poster';
/**
 * Save video file to MongoDB GridFS
 */
const saveVideoToGridFS = async (filePath, fileId) => {
    const client = await mongodb_1.MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    const bucket = new mongodb_1.GridFSBucket(db, { bucketName: 'videos' });
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe(bucket.openUploadStream(fileId, {
            metadata: {
                uploadedAt: new Date(),
                originalPath: filePath
            }
        }))
            .on('finish', () => {
            client.close();
            resolve();
        })
            .on('error', (err) => {
            client.close();
            reject(err);
        });
    });
};
exports.saveVideoToGridFS = saveVideoToGridFS;
/**
 * Retrieve video file from MongoDB GridFS
 */
const getVideoFromGridFS = async (fileId, outputPath) => {
    const client = await mongodb_1.MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    const bucket = new mongodb_1.GridFSBucket(db, { bucketName: 'videos' });
    return new Promise((resolve, reject) => {
        const downloadStream = bucket.openDownloadStreamByName(fileId);
        const writeStream = fs_1.default.createWriteStream(outputPath);
        let hasData = false;
        downloadStream.on('data', () => {
            hasData = true;
        });
        downloadStream.on('error', (err) => {
            if (err.message.includes('FileNotFound')) {
                client.close();
                resolve(false);
            }
            else {
                client.close();
                reject(err);
            }
        });
        downloadStream.pipe(writeStream)
            .on('finish', () => {
            client.close();
            resolve(hasData);
        })
            .on('error', (err) => {
            client.close();
            reject(err);
        });
    });
};
exports.getVideoFromGridFS = getVideoFromGridFS;
/**
 * Check if video exists in GridFS
 */
const videoExistsInGridFS = async (fileId) => {
    const client = await mongodb_1.MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    const bucket = new mongodb_1.GridFSBucket(db, { bucketName: 'videos' });
    try {
        const files = await bucket.find({ filename: fileId }).toArray();
        client.close();
        return files.length > 0;
    }
    catch (error) {
        client.close();
        return false;
    }
};
exports.videoExistsInGridFS = videoExistsInGridFS;
/**
 * Delete video from GridFS
 */
const deleteVideoFromGridFS = async (fileId) => {
    const client = await mongodb_1.MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    const bucket = new mongodb_1.GridFSBucket(db, { bucketName: 'videos' });
    try {
        const files = await bucket.find({ filename: fileId }).toArray();
        if (files.length > 0) {
            await bucket.delete(files[0]._id);
        }
        client.close();
    }
    catch (error) {
        client.close();
        throw error;
    }
};
exports.deleteVideoFromGridFS = deleteVideoFromGridFS;
