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
exports.InstagramContent = exports.InstagramArchive = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const InstagramArchiveSchema = new mongoose_1.Schema({
    videoId: { type: String, required: true, unique: true },
    caption: { type: String, required: true },
    hashtags: [{ type: String }],
    audioId: { type: String, default: '' },
    publishDate: { type: Date, required: true },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    performanceScore: { type: Number, required: true },
    originalPostDate: { type: Date, required: true },
    repostEligible: { type: Boolean, default: false },
    reposted: { type: Boolean, default: false },
    media_url: { type: String, required: true },
    permalink: { type: String, required: true },
    mediaType: { type: String, enum: ['VIDEO', 'IMAGE', 'CAROUSEL_ALBUM'], required: true },
    scrapedAt: { type: Date, default: Date.now },
    repostPriority: { type: Number, default: 0 },
    lastRepostDate: { type: Date },
    repostCount: { type: Number, default: 0 },
    dropboxSynced: { type: Boolean, default: false },
    dropboxPath: { type: String }
});
// Optimized indexes for Phase 9 operations
InstagramArchiveSchema.index({ performanceScore: -1 });
InstagramArchiveSchema.index({ repostEligible: 1, reposted: 1 });
InstagramArchiveSchema.index({ originalPostDate: -1 });
InstagramArchiveSchema.index({ scrapedAt: -1 });
InstagramArchiveSchema.index({ repostPriority: 1 });
InstagramArchiveSchema.index({ lastRepostDate: -1 });
// Virtual for age calculation
InstagramArchiveSchema.virtual('daysSincePost').get(function () {
    return Math.floor((Date.now() - this.originalPostDate.getTime()) / (1000 * 60 * 60 * 24));
});
// Calculate performance score before saving
InstagramArchiveSchema.pre('save', function () {
    this.performanceScore = this.viewCount + (this.likeCount * 2) + (this.commentCount * 3);
});
exports.InstagramArchive = mongoose_1.default.model('InstagramArchive', InstagramArchiveSchema);
// Legacy export for compatibility
exports.InstagramContent = exports.InstagramArchive;
