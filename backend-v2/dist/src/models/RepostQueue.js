"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepostQueue = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const RepostQueueSchema = new mongoose_1.default.Schema({
    originalPostId: { type: String, required: true },
    originalUrl: String,
    targetPlatform: { type: String, enum: ['instagram', 'youtube'], required: true },
    status: { type: String, enum: ['queued', 'processing', 'completed', 'failed'], default: 'queued' },
    scheduledFor: Date,
    priority: { type: Number, default: 1 },
    newCaption: String,
    hashtags: [String],
    audioId: String,
    mediaUrl: String,
    dropboxPath: String,
    error: String,
    processedAt: Date,
    postedAt: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
// Update timestamps on save
RepostQueueSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.RepostQueue = mongoose_1.default.model('RepostQueue', RepostQueueSchema);
