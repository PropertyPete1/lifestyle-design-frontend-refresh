"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
// Old service moved to backend/src/services/autopilotService_legacy.ts for reference
const autopilot_controller_1 = require("../../controllers/autopilot.controller");
const activity_1 = __importDefault(require("./autopilot/activity"));
const router = express_1.default.Router();
const MONGODB_URI = process.env.MONGODB_URI;
router.get('/queue', async (req, res) => {
    const client = new mongodb_1.MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db();
    const queue = db.collection('smart_autopilot_queue');
    const items = await queue.find({}).sort({ createdAt: -1 }).limit(10).toArray();
    await client.close();
    res.json(items);
});
// Legacy trigger route - redirects to clean controller
router.post('/trigger', autopilot_controller_1.runAutopilot);
// Frontend button autopilot route - Enhanced Controller
router.post('/run', autopilot_controller_1.runAutopilot);
// Enhanced autopilot status endpoint
router.get('/status', autopilot_controller_1.getAutopilotStatus);
// Legacy route - now uses clean controller
router.post('/run-legacy', autopilot_controller_1.runAutopilot);
// Activity feed routes
router.use('/activity', activity_1.default);
exports.default = router;
