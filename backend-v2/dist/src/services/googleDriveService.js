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
const googleapis_1 = require("googleapis");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const connection_1 = require("../database/connection");
const UploadQueue_1 = require("../models/UploadQueue");
const SettingsModel_1 = __importDefault(require("../models/SettingsModel"));
const uuid_1 = require("uuid");
class GoogleDriveService {
    constructor() {
        this.drive = null;
        this.syncStats = {
            totalFiles: 0,
            newFiles: 0,
            duplicates: 0,
            errors: 0,
            lastSync: new Date()
        };
    }
    /**
     * Initialize Google Drive client with YouTube OAuth credentials
     */
    async initializeDriveClient() {
        try {
            const settings = await SettingsModel_1.default.findOne();
            if (!(settings === null || settings === void 0 ? void 0 : settings.youtubeToken) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeClientId) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeClientSecret)) {
                console.log('⚠️ YouTube OAuth credentials not configured in settings');
                return false;
            }
            // Create OAuth2 client using YouTube credentials
            const oauth2Client = new googleapis_1.google.auth.OAuth2(settings.youtubeClientId, settings.youtubeClientSecret, 'http://localhost:3000' // Redirect URI
            );
            // Set credentials
            oauth2Client.setCredentials({
                access_token: settings.youtubeToken,
                refresh_token: settings.youtubeRefresh
            });
            // Initialize Drive API
            this.drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
            // Test the connection
            await this.drive.about.get({ fields: 'user' });
            console.log('✅ Google Drive client initialized successfully');
            return true;
        }
        catch (error) {
            console.error('❌ Failed to initialize Google Drive client:', error);
            return false;
        }
    }
    /**
     * Get video files from a shared Google Drive folder
     */
    async getSharedFolderVideos(folderUrl) {
        try {
            if (!this.drive) {
                const initialized = await this.initializeDriveClient();
                if (!initialized) {
                    throw new Error('Failed to initialize Google Drive client');
                }
            }
            // Extract folder ID from shared URL
            const folderId = this.extractFolderIdFromUrl(folderUrl);
            if (!folderId) {
                throw new Error('Invalid Google Drive folder URL');
            }
            console.log(`📁 Scanning Google Drive folder: ${folderId}`);
            // Get files from the folder
            const response = await this.drive.files.list({
                q: `'${folderId}' in parents and mimeType contains 'video/' and trashed=false`,
                fields: 'files(id,name,size,modifiedTime,mimeType,webViewLink)',
                orderBy: 'modifiedTime desc',
                pageSize: 50
            });
            const files = response.data.files || [];
            console.log(`📊 Found ${files.length} video files in Google Drive folder`);
            return files.map((file) => ({
                id: file.id,
                name: file.name,
                size: file.size || '0',
                modifiedTime: file.modifiedTime,
                mimeType: file.mimeType,
                webViewLink: file.webViewLink
            }));
        }
        catch (error) {
            console.error('❌ Failed to get Google Drive videos:', error);
            throw error;
        }
    }
    /**
     * Download video file from Google Drive
     */
    async downloadVideoFromDrive(fileId, filename) {
        try {
            console.log(`🌐 Downloading ${filename} from Google Drive...`);
            if (!this.drive) {
                const initialized = await this.initializeDriveClient();
                if (!initialized) {
                    throw new Error('Failed to initialize Google Drive client');
                }
            }
            // Download the file
            const response = await this.drive.files.get({
                fileId: fileId,
                alt: 'media'
            }, { responseType: 'stream' });
            // Convert stream to buffer
            const chunks = [];
            return new Promise((resolve, reject) => {
                response.data.on('data', (chunk) => chunks.push(chunk));
                response.data.on('end', () => {
                    const videoBuffer = Buffer.concat(chunks);
                    // Verify it's a real video file
                    if (videoBuffer.length < 1000) {
                        reject(new Error('Downloaded file is too small to be a video'));
                        return;
                    }
                    console.log(`✅ Successfully downloaded ${filename}: ${(videoBuffer.length / 1024 / 1024).toFixed(2)} MB`);
                    resolve(videoBuffer);
                });
                response.data.on('error', reject);
            });
        }
        catch (error) {
            console.error(`❌ Google Drive download failed for ${filename}:`, error);
            throw error;
        }
    }
    /**
     * Extract folder ID from Google Drive share URL
     */
    extractFolderIdFromUrl(url) {
        try {
            // Handle different Google Drive URL formats
            const patterns = [
                /\/folders\/([a-zA-Z0-9-_]+)/, // Standard folder URL
                /id=([a-zA-Z0-9-_]+)/, // ID parameter
                /\/drive\/folders\/([a-zA-Z0-9-_]+)/ // Alternative format
            ];
            for (const pattern of patterns) {
                const match = url.match(pattern);
                if (match) {
                    return match[1];
                }
            }
            return null;
        }
        catch (error) {
            console.error('❌ Failed to extract folder ID:', error);
            return null;
        }
    }
    /**
     * Sync videos from Google Drive folder to upload queue
     */
    async syncDriveVideos(options) {
        try {
            await (0, connection_1.connectToDatabase)();
            const { folderUrl, limit = 10, autoDownload = false } = options;
            const videos = [];
            this.syncStats = {
                totalFiles: 0,
                newFiles: 0,
                duplicates: 0,
                errors: 0,
                lastSync: new Date()
            };
            console.log(`🔄 Starting Google Drive sync from: ${folderUrl}`);
            console.log(`📊 Limit: ${limit} videos, Auto-download: ${autoDownload}`);
            // Get videos from shared folder
            const files = await this.getSharedFolderVideos(folderUrl);
            this.syncStats.totalFiles = files.length;
            // Process each file (up to limit)
            const filesToProcess = files.slice(0, limit);
            for (const file of filesToProcess) {
                try {
                    // Check if already in queue
                    const existing = await UploadQueue_1.UploadQueue.findOne({
                        originalFilename: file.name,
                        source: 'google_drive'
                    });
                    if (existing) {
                        console.log(`⏭️ Skipping duplicate: ${file.name}`);
                        this.syncStats.duplicates++;
                        continue;
                    }
                    let filePath = '';
                    if (autoDownload) {
                        // Download the video file
                        const videoBuffer = await this.downloadVideoFromDrive(file.id, file.name);
                        // Save to temp folder
                        const uniqueFilename = `drive_${Date.now()}_${(0, uuid_1.v4)().replace(/-/g, '')}.${file.name.split('.').pop()}`;
                        filePath = path.join(process.cwd(), 'temp', uniqueFilename);
                        // Ensure temp directory exists
                        const tempDir = path.dirname(filePath);
                        if (!fs.existsSync(tempDir)) {
                            fs.mkdirSync(tempDir, { recursive: true });
                        }
                        fs.writeFileSync(filePath, videoBuffer);
                        console.log(`💾 Saved to: ${filePath}`);
                    }
                    // Add to upload queue
                    const uploadRecord = new UploadQueue_1.UploadQueue({
                        originalFilename: file.name,
                        filePath: filePath || '',
                        fileSize: parseInt(file.size) || 0,
                        mimeType: file.mimeType,
                        source: 'google_drive',
                        googleDriveId: file.id,
                        status: 'pending',
                        uploadedAt: new Date(),
                        metadata: {
                            originalUrl: file.webViewLink,
                            modifiedTime: file.modifiedTime
                        }
                    });
                    await uploadRecord.save();
                    videos.push(uploadRecord);
                    this.syncStats.newFiles++;
                    console.log(`✅ Added to queue: ${file.name}`);
                }
                catch (fileError) {
                    console.error(`❌ Error processing ${file.name}:`, fileError);
                    this.syncStats.errors++;
                }
            }
            console.log(`🎯 Google Drive sync complete!`);
            console.log(`📊 Stats: ${this.syncStats.newFiles} new, ${this.syncStats.duplicates} duplicates, ${this.syncStats.errors} errors`);
            return {
                success: true,
                stats: this.syncStats,
                videos
            };
        }
        catch (error) {
            console.error('❌ Google Drive sync failed:', error);
            this.syncStats.errors++;
            return {
                success: false,
                stats: this.syncStats,
                videos: []
            };
        }
    }
    /**
     * Get sync statistics
     */
    getSyncStats() {
        return this.syncStats;
    }
}
exports.default = new GoogleDriveService();
