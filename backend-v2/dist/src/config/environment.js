"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
require("dotenv/config");
class EnvironmentConfig {
    constructor() {
        this.config = this.loadConfig();
    }
    loadConfig() {
        return {
            port: parseInt(process.env.PORT || '3002'),
            nodeEnv: process.env.NODE_ENV || 'development',
            mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/lifestyle-design-auto-poster-v2',
            corsOrigins: [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:3002',
                'http://localhost:3003',
                'http://localhost:3004',
                'http://localhost:3005',
                'http://localhost:3006',
                'https://lifestyle-design-auto-poster.vercel.app',
                'https://frontend-v2-3kkrk5gf6-peter-allens-projects.vercel.app',
                'https://frontend-v2-gbye2ptxz-peter-allens-projects.vercel.app',
                'https://frontend-v2-12pnnk37y-peter-allens-projects.vercel.app',
                'https://frontend-v2-pwrubpyxk-peter-allens-projects.vercel.app',
                'https://demo-ffnex3x5y-peter-allens-projects.vercel.app',
                'https://peter-allens-projects.vercel.app',
                // Allow any Vercel preview deployments
                /^https:\/\/.*\.vercel\.app$/
            ]
        };
    }
    getConfig() {
        return this.config;
    }
    get(key) {
        return this.config[key];
    }
}
// Export singleton instance
exports.appConfig = new EnvironmentConfig();
exports.default = exports.appConfig;
