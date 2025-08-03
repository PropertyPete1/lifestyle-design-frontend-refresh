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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const VideoStatusSchema = new mongoose_1.Schema({
    videoId: { type: String, required: true, unique: true },
    uploadDate: { type: Date, default: Date.now },
    platform: { type: String, enum: ['youtube', 'instagram'], required: true },
    captionGenerated: { type: Boolean, default: false },
    posted: { type: Boolean, default: false },
    lastPosted: { type: Date },
    fingerprintHash: { type: String, required: true }, // Required field as specified
    fingerprint: {
        hash: { type: String, required: true },
        size: { type: Number, required: true },
        duration: { type: Number },
        sha256Hash: { type: String }, // Enhanced SHA256 hash for Phase 1
        perceptualHash: { type: String }, // Perceptual hash for content similarity
        contentSignature: { type: String } // Additional content signature
    },
    filename: { type: String, required: true },
    filePath: { type: String },
    status: { type: String, enum: ['pending', 'processing', 'ready', 'posted', 'failed'], default: 'pending' },
    errorMessage: { type: String },
    repostData: {
        originalVideoId: { type: String },
        originalCaption: { type: String },
        newCaption: { type: String },
        isRepost: { type: Boolean, default: false }
    },
    phase8Status: { type: String, enum: ['not_processed', 'processing', 'completed', 'failed'], default: 'not_processed' },
    phase8ProcessedAt: { type: Date },
    phase8Platform: { type: String, enum: ['youtube', 'instagram'] },
    phase8PolishedTitle: { type: String },
    phase8PolishedDescription: { type: String },
    phase8Hashtags: [{ type: String }],
    phase8AudioTrackId: { type: String },
    phase8ProcessedVideoPath: { type: String },
    // Phase 9: Intelligent Content Repurposing
    phase9Status: { type: String, enum: ['source_video', 'repost_candidate', 'reposted', 'excluded'], default: 'source_video' },
    phase9SourceMediaId: { type: String }, // Original IG media ID for reposts
    phase9PerformanceScore: { type: Number },
    phase9RepostPlatforms: [{ type: String, enum: ['youtube', 'instagram'] }],
    phase9RepostedAt: { type: Date },
    phase9ContentType: { type: String, enum: ['original', 'repurposed_from_ig'], default: 'original' },
    phase9OriginalUrl: { type: String }, // Original Instagram URL
    phase9RepostCount: { type: Number, default: 0 } // How many times this content has been reposted
});
// Add indexes for efficient queries - Enhanced for Phase 1
VideoStatusSchema.index({ fingerprintHash: 1 }); // Index for new required field
VideoStatusSchema.index({ 'fingerprint.hash': 1 });
VideoStatusSchema.index({ platform: 1, posted: 1 });
VideoStatusSchema.index({ uploadDate: -1 });
VideoStatusSchema.index({ lastPosted: -1 }); // For repost cooldown queries
VideoStatusSchema.index({ platform: 1, lastPosted: -1 }); // Combined index for platform-specific repost queries
exports.VideoStatus = mongoose_1.default.model('VideoStatus', VideoStatusSchema);
