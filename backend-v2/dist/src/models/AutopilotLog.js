"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutopilotLog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AutopilotLogSchema = new mongoose_1.default.Schema({
    runId: { type: String, required: true },
    type: { type: String, enum: ['scrape', 'repost', 'schedule', 'post', 'force_post', 'storage_check', 'limit_check'], required: true },
    platform: String,
    status: { type: String, enum: ['started', 'completed', 'failed', 'warning', 'blocked'], required: true },
    postsProcessed: { type: Number, default: 0 },
    postsSuccessful: { type: Number, default: 0 },
    postsFailed: { type: Number, default: 0 },
    error: String,
    details: mongoose_1.default.Schema.Types.Mixed,
    startTime: Date,
    endTime: Date,
    duration: Number, // in milliseconds
    createdAt: { type: Date, default: Date.now }
});
exports.AutopilotLog = mongoose_1.default.model('AutopilotLog', AutopilotLogSchema);
