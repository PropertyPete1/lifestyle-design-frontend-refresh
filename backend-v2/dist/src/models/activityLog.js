"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const activityLogSchema = new mongoose_1.default.Schema({
    // Core post data
    platform: {
        type: String,
        enum: ['instagram', 'youtube'],
        required: true
    },
    videoId: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String
    },
    caption: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true
    },
    // Activity tracking fields
    type: {
        type: String,
        enum: ['post', 'repost', 'scrape', 'schedule', 'upload'],
        default: 'post'
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending', 'processing'],
        required: true
    },
    message: {
        type: String
    },
    error: {
        type: String
    }
}, {
    timestamps: true
});
const ActivityLog = mongoose_1.default.model('ActivityLog', activityLogSchema);
exports.default = ActivityLog;
