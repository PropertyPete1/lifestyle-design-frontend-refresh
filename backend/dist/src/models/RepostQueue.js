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
exports.RepostQueue = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const RepostQueueSchema = new mongoose_1.Schema({
    sourceMediaId: { type: String, required: true },
    targetPlatform: { type: String, enum: ['youtube', 'instagram'], required: true },
    status: { type: String, enum: ['queued', 'processing', 'completed', 'failed', 'cancelled'], default: 'queued' },
    priority: { type: Number, required: true, min: 1, max: 50 },
    scheduledFor: { type: Date, required: true },
    queuedAt: { type: Date, default: Date.now },
    processedAt: { type: Date },
    repostVideoId: { type: String },
    originalContent: {
        caption: { type: String, required: true },
        hashtags: [{ type: String }],
        performanceScore: { type: Number, required: true },
        viewCount: { type: Number, default: 0 },
        likeCount: { type: Number, default: 0 },
        commentCount: { type: Number, default: 0 },
        media_url: { type: String, required: true },
        permalink: { type: String, required: true }
    },
    repostContent: {
        newCaption: { type: String },
        newHashtags: [{ type: String }],
        audioTrackId: { type: String },
        optimizedForPlatform: { type: String, enum: ['youtube', 'instagram'] }
    },
    errorMessage: { type: String },
    retryCount: { type: Number, default: 0 }
});
// Add indexes for efficient queries
RepostQueueSchema.index({ status: 1, scheduledFor: 1 });
RepostQueueSchema.index({ priority: 1 });
RepostQueueSchema.index({ targetPlatform: 1, status: 1 });
RepostQueueSchema.index({ queuedAt: -1 });
// Compound index for unique queued items per platform
RepostQueueSchema.index({ sourceMediaId: 1, targetPlatform: 1 }, { unique: true });
exports.RepostQueue = mongoose_1.default.model('RepostQueue', RepostQueueSchema);
