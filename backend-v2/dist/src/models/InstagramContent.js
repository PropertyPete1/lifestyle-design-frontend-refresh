"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstagramArchive = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const InstagramContentSchema = new mongoose_1.default.Schema({
    igPostId: { type: String, required: true, unique: true },
    caption: String,
    hashtags: [String],
    audioId: String,
    mediaUrl: String,
    mediaType: { type: String, enum: ['VIDEO', 'IMAGE', 'CAROUSEL'], default: 'VIDEO' },
    postTime: Date,
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    performanceScore: { type: Number, default: 0 },
    repostEligible: { type: Boolean, default: false },
    scraped: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Update timestamps on save
InstagramContentSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.InstagramArchive = mongoose_1.default.model('InstagramArchive', InstagramContentSchema);
