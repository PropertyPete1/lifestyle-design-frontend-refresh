"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityFeed = exports.getPostingStats = exports.getRecentActivity = exports.getTodayPostCount = exports.saveToActivityLog = void 0;
const activityLog_1 = __importDefault(require("../models/activityLog"));
const saveToActivityLog = async (entry) => {
    return await activityLog_1.default.create(entry);
};
exports.saveToActivityLog = saveToActivityLog;
const getTodayPostCount = async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return await activityLog_1.default.countDocuments({ timestamp: { $gte: start } });
};
exports.getTodayPostCount = getTodayPostCount;
const getRecentActivity = async (limit = 20) => {
    return await activityLog_1.default.find().sort({ timestamp: -1 }).limit(limit);
};
exports.getRecentActivity = getRecentActivity;
const getPostingStats = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await activityLog_1.default.countDocuments({ timestamp: { $gte: today } });
    const totalCount = await activityLog_1.default.countDocuments();
    return { todayCount, totalCount };
};
exports.getPostingStats = getPostingStats;
const getActivityFeed = async (limit = 10) => {
    return await activityLog_1.default.find()
        .sort({ timestamp: -1 })
        .limit(limit)
        .select('type status timestamp message platform');
};
exports.getActivityFeed = getActivityFeed;
