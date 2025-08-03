"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeInstagramPosts = scrapeInstagramPosts;
const axios_1 = __importDefault(require("axios"));
async function scrapeInstagramPosts(accessToken, userId) {
    const res = await axios_1.default.get(`https://graph.facebook.com/v17.0/${userId}/media?fields=id,media_type,media_url,caption,timestamp,like_count,comments_count,video_title,insights.metric(video_views)&limit=500`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const filtered = res.data.data
        .filter((post) => post.media_type === 'VIDEO' || post.media_type === 'REEL')
        .map((post) => {
        var _a, _b, _c, _d, _e;
        return ({
            id: post.id,
            url: post.media_url,
            caption: post.caption || '',
            views: ((_e = (_d = (_c = (_b = (_a = post.insights) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.find((m) => m.name === 'video_views')) === null || _c === void 0 ? void 0 : _c.values) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.value) || 0,
            timestamp: post.timestamp
        });
    })
        .filter((p) => p.views > 10000);
    return filtered;
}
