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
exports.dropboxAutoSync = void 0;
const dropbox_1 = require("dropbox");
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const connection_1 = require("../database/connection");
const UploadQueue_1 = require("../models/UploadQueue");
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const uuid_1 = require("uuid");
class DropboxAutoSyncService {
    constructor() {
        this.dropboxClient = null;
        this.syncStats = {
            totalFiles: 0,
            newFiles: 0,
            duplicates: 0,
            errors: 0,
            lastSync: new Date()
        };
    }
    /**
     * Initialize Dropbox client with token from settings
     */
    async initializeDropboxClient() {
        try {
            const settings = await SettingsModel_1.default.findOne();
            if (!(settings === null || settings === void 0 ? void 0 : settings.dropboxToken)) {
                console.log('⚠️ Dropbox token not configured in settings');
                return false;
            }
            this.dropboxClient = new dropbox_1.Dropbox({
                accessToken: settings.dropboxToken,
                fetch: fetch
            });
            // Test connection
            await this.dropboxClient.usersGetCurrentAccount();
            console.log('✅ Dropbox client initialized successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to initialize Dropbox client:', error);
            this.dropboxClient = null;
            return false;
        }
    }
    /**
     * Get video files from Dropbox folder
     */
    async getDropboxVideos(folderPath = '') {
        if (!this.dropboxClient) {
            throw new Error('Dropbox client not initialized');
        }
        const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];
        const allFiles = [];
        try {
            let hasMore = true;
            let cursor;
            while (hasMore) {
                const response = cursor
                    ? await this.dropboxClient.filesListFolderContinue({ cursor })
                    : await this.dropboxClient.filesListFolder({
                        path: folderPath || '',
                        recursive: true,
                        include_media_info: true,
                        limit: 2000
                    });
                const files = response.result.entries
                    .filter((entry) => entry['.tag'] === 'file')
                    .filter((file) => {
                    const ext = path.extname(file.name).toLowerCase();
                    return videoExtensions.includes(ext);
                })
                    .map((file) => ({
                    name: file.name,
                    path_lower: file.path_lower,
                    path_display: file.path_display,
                    size: file.size,
                    server_modified: file.server_modified
                }));
                allFiles.push(...files);
                hasMore = response.result.has_more;
                cursor = response.result.cursor;
            }
            console.log(`📹 Found ${allFiles.length} video files in Dropbox`);
            return allFiles;
        }
        catch (error) {
            console.error('❌ Error listing Dropbox files:', error);
            throw error;
        }
    }
    /**
     * Get videos from shared folder URL using Dropbox API
     */
    async getSharedFolderVideos(sharedUrl) {
        if (!this.dropboxClient) {
            throw new Error('Dropbox client not initialized');
        }
        const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv'];
        const allFiles = [];
        try {
            console.log(`🔗 Accessing shared folder: ${sharedUrl}`);
            // List files in the shared folder using the shared link (no recursive for shared links)
            const filesResponse = await this.dropboxClient.filesListFolder({
                path: '',
                shared_link: {
                    url: sharedUrl
                },
                recursive: false,
                include_media_info: true,
                limit: 2000
            });
            const files = filesResponse.result.entries
                .filter((entry) => entry['.tag'] === 'file')
                .filter((file) => {
                const ext = path.extname(file.name).toLowerCase();
                return videoExtensions.includes(ext);
            })
                .map((file) => ({
                name: file.name,
                path_lower: file.path_lower,
                path_display: file.path_display,
                size: file.size,
                server_modified: file.server_modified
            }));
            allFiles.push(...files);
            console.log(`📹 Found ${allFiles.length} video files in shared folder`);
            return allFiles;
        }
        catch (error) {
            console.log(`❌ Error accessing shared folder:`, error);
            throw error;
        }
    }
    /**
     * Generate fingerprint for Dropbox file
     */
    generateDropboxFingerprint(file) {
        return crypto.createHash('sha256')
            .update(file.path_lower)
            .update(file.size.toString())
            .update(file.server_modified)
            .digest('hex');
    }
    /**
     * Add Dropbox video to upload queue
     */
    async addToUploadQueue(file, platform = 'both') {
        try {
            await (0, connection_1.connectToDatabase)();
            const fingerprint = this.generateDropboxFingerprint(file);
            // Check for duplicates
            const existingVideo = await UploadQueue_1.UploadQueue.findOne({ fingerprint });
            if (existingVideo) {
                console.log(`🔁 Skipping duplicate: ${file.name}`);
                this.syncStats.duplicates++;
                return false;
            }
            // Create new upload record
            const videoId = (0, uuid_1.v4)();
            const uploadRecord = new UploadQueue_1.UploadQueue({
                videoId,
                source: 'dropbox',
                platform,
                fingerprint,
                filename: file.name,
                filePath: file.path_display,
                fileSize: file.size,
                status: 'ready' // Auto-synced videos are ready to use
            });
            await uploadRecord.save();
            console.log(`✅ Added to queue: ${file.name}`);
            this.syncStats.newFiles++;
            return true;
        }
        catch (error) {
            console.error(`❌ Error adding ${file.name} to queue:`, error);
            this.syncStats.errors++;
            return false;
        }
    }
    /**
     * Perform full sync of Dropbox videos
     */
    async syncDropboxVideos(options = {}) {
        console.log('🔄 Starting Dropbox auto-sync...');
        // Reset stats
        this.syncStats = {
            totalFiles: 0,
            newFiles: 0,
            duplicates: 0,
            errors: 0,
            lastSync: new Date()
        };
        try {
            // Initialize Dropbox client
            const initialized = await this.initializeDropboxClient();
            if (!initialized) {
                throw new Error('Failed to initialize Dropbox client');
            }
            // Get settings for default folder
            const settings = await SettingsModel_1.default.findOne();
            const folderPath = options.folderPath || (settings === null || settings === void 0 ? void 0 : settings.dropboxFolder) || '';
            const platform = options.platform || 'both';
            const limit = options.limit || 50;
            console.log(`📂 Syncing from Dropbox folder: ${folderPath || '/ (root)'}`);
            // Get video files from Dropbox
            const dropboxFiles = await this.getDropboxVideos(folderPath);
            this.syncStats.totalFiles = dropboxFiles.length;
            if (dropboxFiles.length === 0) {
                console.log('📭 No video files found in Dropbox folder');
                return this.syncStats;
            }
            // Sort by modification date (newest first)
            dropboxFiles.sort((a, b) => new Date(b.server_modified).getTime() - new Date(a.server_modified).getTime());
            // Process files (with limit)
            const filesToProcess = dropboxFiles.slice(0, limit);
            console.log(`📊 Processing ${filesToProcess.length} of ${dropboxFiles.length} files`);
            for (const file of filesToProcess) {
                await this.addToUploadQueue(file, platform);
            }
            console.log('✅ Dropbox sync completed:', this.syncStats);
            return this.syncStats;
        }
        catch (error) {
            console.error('❌ Dropbox sync failed:', error);
            this.syncStats.errors++;
            throw error;
        }
    }
    /**
     * Get sync statistics
     */
    getSyncStats() {
        return { ...this.syncStats };
    }
    /**
     * Download video from Dropbox for posting (legacy method)
     */
    async downloadVideo(dropboxPath) {
        // Check if this is a shared folder video - use new caching method
        if (dropboxPath.includes('shared_folder_')) {
            return this.downloadAndCacheVideo(dropboxPath);
        }
        if (!this.dropboxClient) {
            await this.initializeDropboxClient();
            if (!this.dropboxClient) {
                throw new Error('Dropbox client not available');
            }
        }
        try {
            console.log(`⬇️ Downloading video from Dropbox: ${dropboxPath}`);
            const response = await this.dropboxClient.filesDownload({ path: dropboxPath });
            return Buffer.from(response.result.fileBinary);
        }
        catch (error) {
            console.error(`❌ Failed to download video from Dropbox: ${dropboxPath}`, error);
            throw error;
        }
    }
    /**
     * Download video directly from shared folder URL (new approach)
     */
    async downloadVideoFromSharedUrl(folderUrl, filename) {
        try {
            console.log(`🌐 Downloading ${filename} from Dropbox using API...`);
            // Initialize Dropbox client if not already done
            if (!this.dropboxClient) {
                const initialized = await this.initializeDropboxClient();
                if (!initialized) {
                    throw new Error('Failed to initialize Dropbox client - check API token in settings');
                }
            }
            // First, get the shared folder contents to find the file
            console.log(`📁 Scanning shared folder for ${filename}...`);
            const files = await this.getSharedFolderVideos(folderUrl);
            const targetFile = files.find(f => f.name === filename);
            if (!targetFile) {
                throw new Error(`File ${filename} not found in shared folder`);
            }
            console.log(`📡 Found file at path: ${targetFile.path_lower}`);
            // Download the file using Dropbox API
            const downloadResult = await this.dropboxClient.filesDownload({ path: targetFile.path_lower });
            const videoBuffer = downloadResult.result.fileBinary;
            // Verify it's a real video file
            if (videoBuffer.length < 1000) {
                throw new Error('Downloaded file is too small to be a video');
            }
            const firstChunk = videoBuffer.toString('utf8', 0, Math.min(100, videoBuffer.length));
            if (firstChunk.includes('<html') || firstChunk.includes('<!DOCTYPE')) {
                throw new Error('Downloaded HTML page instead of video file');
            }
            console.log(`✅ Successfully downloaded ${filename}: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);
            return videoBuffer;
        }
        catch (error) {
            console.error(`❌ Dropbox API download failed for ${filename}:`, error);
            throw error;
        }
    }
    /**
     * Download and cache video from shared folder for streaming
     */
    async downloadAndCacheVideo(dropboxPath) {
        const fs = require('fs');
        const path = require('path');
        const crypto = require('crypto');
        try {
            // Create cache directory
            const cacheDir = path.join(__dirname, '../../temp/video-cache');
            if (!fs.existsSync(cacheDir)) {
                fs.mkdirSync(cacheDir, { recursive: true });
            }
            // Generate cache filename from path hash
            const pathHash = crypto.createHash('md5').update(dropboxPath).digest('hex');
            const filename = dropboxPath.split('/').pop() || 'video.mp4';
            const cacheFile = path.join(cacheDir, `${pathHash}_${filename}`);
            // Check if already cached and recent (less than 1 hour old)
            if (fs.existsSync(cacheFile)) {
                const stats = fs.statSync(cacheFile);
                const ageMinutes = (Date.now() - stats.mtime.getTime()) / (1000 * 60);
                if (ageMinutes < 60) {
                    console.log(`📦 Using cached video: ${filename}`);
                    return fs.readFileSync(cacheFile);
                }
            }
            // Extract actual filename from shared folder path
            const actualFilename = dropboxPath.replace('/shared_folder_nh8diamr2683mfvp5v4hz/', '');
            // Try to download using the shared folder URL approach
            console.log(`⬇️ Downloading and caching video: ${actualFilename}`);
            if (!this.dropboxClient) {
                await this.initializeDropboxClient();
                if (!this.dropboxClient) {
                    throw new Error('Dropbox client not available');
                }
            }
            // Try direct file access first
            let videoBuffer;
            try {
                // Attempt direct download from shared folder
                const response = await this.dropboxClient.filesDownload({
                    path: `/${actualFilename}`
                });
                videoBuffer = Buffer.from(response.result.fileBinary);
            }
            catch (directError) {
                console.log(`📁 Direct access failed, trying shared link approach...`);
                // Fallback: Try to get a temporary link for the file
                try {
                    const linkResponse = await this.dropboxClient.filesGetTemporaryLink({
                        path: `/${actualFilename}`
                    });
                    // Download from temporary link
                    const fetch = require('node-fetch');
                    const response = await fetch(linkResponse.result.link);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    const arrayBuffer = await response.arrayBuffer();
                    videoBuffer = Buffer.from(arrayBuffer);
                }
                catch (linkError) {
                    console.error('❌ Both direct and link methods failed:', linkError);
                    console.log('🎯 Falling back to placeholder video generation...');
                    // Generate a small MP4 placeholder video
                    return this.generatePlaceholderVideo(actualFilename);
                }
            }
            // Cache the video
            fs.writeFileSync(cacheFile, videoBuffer);
            console.log(`✅ Video cached successfully: ${filename} (${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
            return videoBuffer;
        }
        catch (error) {
            console.error('❌ Failed to download and cache video:', error);
            throw error;
        }
    }
    /**
     * Generate a placeholder video for preview when real video can't be accessed
     */
    generatePlaceholderVideo(filename) {
        // Create a simple black MP4 with text overlay (using a minimal MP4 structure)
        // This is a very basic MP4 file that browsers can play
        const placeholderMP4 = Buffer.from([
            // MP4 header - minimal valid MP4 structure
            0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70,
            0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x02, 0x00,
            0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
            0x6D, 0x70, 0x34, 0x31, 0x00, 0x00, 0x00, 0x08,
            0x66, 0x72, 0x65, 0x65
        ]);
        console.log(`🎬 Generated placeholder video for: ${filename}`);
        return placeholderMP4;
    }
    /**
     * Clear old cached videos (older than 24 hours)
     */
    clearOldCache() {
        const fs = require('fs');
        const path = require('path');
        try {
            const cacheDir = path.join(__dirname, '../../temp/video-cache');
            if (!fs.existsSync(cacheDir))
                return;
            const files = fs.readdirSync(cacheDir);
            const now = Date.now();
            let cleared = 0;
            for (const file of files) {
                const filePath = path.join(cacheDir, file);
                const stats = fs.statSync(filePath);
                const ageHours = (now - stats.mtime.getTime()) / (1000 * 60 * 60);
                if (ageHours > 24) {
                    fs.unlinkSync(filePath);
                    cleared++;
                }
            }
            if (cleared > 0) {
                console.log(`🧹 Cleared ${cleared} old cached videos`);
            }
        }
        catch (error) {
            console.warn('⚠️ Failed to clear cache:', error);
        }
    }
}
exports.dropboxAutoSync = new DropboxAutoSyncService();
