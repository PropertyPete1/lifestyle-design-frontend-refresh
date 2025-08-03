"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRepostAllowed = isRepostAllowed;
exports.markAsPosted = markAsPosted;
const mongodb_1 = require("mongodb");
/**
 * ✅ PHASE 9 - AUTOPILOT POSTING SYSTEM
 * STEP 2: MongoDB logic to check 30-day delay for reposting
 */
const client = new mongodb_1.MongoClient(process.env.MONGODB_URI);
async function isRepostAllowed(postId, days) {
    await client.connect();
    const db = client.db('autoposter');
    const logs = db.collection('postedVideos');
    const previous = await logs.findOne({ postId });
    if (!previous)
        return true;
    const lastDate = new Date(previous.timestamp);
    const now = new Date();
    const diff = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= days;
}
async function markAsPosted(postId) {
    const db = client.db('autoposter');
    const logs = db.collection('postedVideos');
    await logs.updateOne({ postId }, { $set: { timestamp: new Date() } }, { upsert: true });
}
