"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = connectToDatabase;
exports.disconnectFromDatabase = disconnectFromDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
let isConnected = false;
async function connectToDatabase() {
    if (isConnected) {
        return;
    }
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lifestyle-design-auto-poster-v2';
        await mongoose_1.default.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000, // 30 second timeout
            maxPoolSize: 10
        });
        isConnected = true;
        console.log('✅ Connected to MongoDB:', mongoUri.replace(/:[^:@]*@/, ':****@')); // Hide password in logs
    }
    catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}
async function disconnectFromDatabase() {
    if (isConnected) {
        await mongoose_1.default.disconnect();
        isConnected = false;
        console.log('✅ Disconnected from MongoDB');
    }
}
