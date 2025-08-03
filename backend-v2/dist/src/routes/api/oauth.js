"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleapis_1 = require("googleapis");
const SettingsModel_1 = __importDefault(require("../../models/SettingsModel"));
const connection_1 = require("../../database/connection");
const router = express_1.default.Router();
// POST /api/oauth/youtube/initiate
// Start YouTube OAuth flow with Google Drive access
router.post('/youtube/initiate', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const settings = await SettingsModel_1.default.findOne();
        if (!(settings === null || settings === void 0 ? void 0 : settings.youtubeClientId) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeClientSecret)) {
            return res.status(400).json({
                error: 'YouTube OAuth credentials not configured. Please add Client ID and Client Secret in Settings.'
            });
        }
        // Create OAuth2 client
        const oauth2Client = new googleapis_1.google.auth.OAuth2(settings.youtubeClientId, settings.youtubeClientSecret, 'http://localhost:3002/api/oauth/youtube/callback');
        // Generate auth URL with both YouTube and Google Drive scopes
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/youtube.upload',
                'https://www.googleapis.com/auth/drive.readonly'
            ],
            prompt: 'consent' // Force consent screen to get refresh token
        });
        res.json({
            success: true,
            authUrl,
            message: 'Visit this URL to authorize YouTube and Google Drive access'
        });
    }
    catch (error) {
        console.error('❌ OAuth initiation error:', error);
        res.status(500).json({
            error: 'Failed to initiate OAuth flow',
            details: error.message
        });
    }
});
// GET /api/oauth/youtube/callback
// Handle OAuth callback and exchange code for tokens
router.get('/youtube/callback', async (req, res) => {
    var _a, _b, _c;
    try {
        const { code, error } = req.query;
        if (error) {
            return res.status(400).send(`
        <html>
          <head><title>OAuth Error</title></head>
          <body>
            <h2>❌ OAuth Authorization Failed</h2>
            <p>Error: ${error}</p>
            <p><a href="/settings">Return to Settings</a></p>
          </body>
        </html>
      `);
        }
        if (!code) {
            return res.status(400).send(`
        <html>
          <head><title>OAuth Error</title></head>
          <body>
            <h2>❌ No authorization code received</h2>
            <p><a href="/settings">Return to Settings</a></p>
          </body>
        </html>
      `);
        }
        await (0, connection_1.connectToDatabase)();
        const settings = await SettingsModel_1.default.findOne();
        if (!(settings === null || settings === void 0 ? void 0 : settings.youtubeClientId) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeClientSecret)) {
            return res.status(400).send(`
        <html>
          <head><title>OAuth Error</title></head>
          <body>
            <h2>❌ YouTube OAuth credentials not configured</h2>
            <p>Please add Client ID and Client Secret in Settings.</p>
            <p><a href="/settings">Go to Settings</a></p>
          </body>
        </html>
      `);
        }
        // Create OAuth2 client
        const oauth2Client = new googleapis_1.google.auth.OAuth2(settings.youtubeClientId, settings.youtubeClientSecret, 'http://localhost:3002/api/oauth/youtube/callback');
        // Exchange code for tokens
        const { tokens } = await oauth2Client.getToken(code);
        if (!tokens.access_token || !tokens.refresh_token) {
            return res.status(400).send(`
        <html>
          <head><title>OAuth Error</title></head>
          <body>
            <h2>❌ Failed to get tokens</h2>
            <p>Please try the authorization process again.</p>
            <p><a href="/settings">Return to Settings</a></p>
          </body>
        </html>
      `);
        }
        // Save tokens to database
        await SettingsModel_1.default.updateOne({}, {
            $set: {
                youtubeToken: tokens.access_token,
                youtubeRefresh: tokens.refresh_token
            }
        }, { upsert: true });
        console.log('✅ YouTube and Google Drive OAuth tokens saved successfully');
        // Test the tokens work for both YouTube and Google Drive
        oauth2Client.setCredentials(tokens);
        try {
            // Test YouTube access
            const youtube = googleapis_1.google.youtube({ version: 'v3', auth: oauth2Client });
            const channelResponse = await youtube.channels.list({
                part: ['snippet'],
                mine: true
            });
            // Test Google Drive access
            const drive = googleapis_1.google.drive({ version: 'v3', auth: oauth2Client });
            await drive.about.get({ fields: 'user' });
            const channelTitle = ((_c = (_b = (_a = channelResponse.data.items) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.snippet) === null || _c === void 0 ? void 0 : _c.title) || 'Unknown';
            res.send(`
        <html>
          <head><title>OAuth Success</title></head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h2>✅ Authorization Successful!</h2>
            <p>YouTube Channel: <strong>${channelTitle}</strong></p>
            <p>✅ YouTube upload access granted</p>
            <p>✅ Google Drive read access granted</p>
            <p>You can now:</p>
            <ul>
              <li>Upload videos to YouTube</li>
              <li>Download videos from Google Drive folders</li>
              <li>Use the "Add Videos from Google Drive" feature</li>
            </ul>
            <p><a href="http://localhost:3000" style="color: #1976d2;">Return to App</a></p>
          </body>
        </html>
      `);
        }
        catch (testError) {
            console.error('⚠️ Token test failed:', testError);
            res.send(`
        <html>
          <head><title>OAuth Warning</title></head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px;">
            <h2>⚠️ Tokens saved but testing failed</h2>
            <p>The OAuth tokens were saved, but we couldn't verify they work properly.</p>
            <p>Error: ${testError.message}</p>
            <p><a href="http://localhost:3000" style="color: #1976d2;">Return to App</a></p>
          </body>
        </html>
      `);
        }
    }
    catch (error) {
        console.error('❌ OAuth callback error:', error);
        res.status(500).send(`
      <html>
        <head><title>OAuth Error</title></head>
        <body>
          <h2>❌ OAuth callback failed</h2>
          <p>Error: ${error.message}</p>
          <p><a href="/settings">Return to Settings</a></p>
        </body>
      </html>
    `);
    }
});
// POST /api/oauth/youtube/refresh
// Refresh YouTube access token
router.post('/youtube/refresh', async (req, res) => {
    try {
        await (0, connection_1.connectToDatabase)();
        const settings = await SettingsModel_1.default.findOne();
        if (!(settings === null || settings === void 0 ? void 0 : settings.youtubeClientId) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeClientSecret) || !(settings === null || settings === void 0 ? void 0 : settings.youtubeRefresh)) {
            return res.status(400).json({
                error: 'YouTube OAuth credentials not complete. Please re-authorize.'
            });
        }
        // Create OAuth2 client and refresh token
        const oauth2Client = new googleapis_1.google.auth.OAuth2(settings.youtubeClientId, settings.youtubeClientSecret, 'http://localhost:3002/api/oauth/youtube/callback');
        oauth2Client.setCredentials({
            refresh_token: settings.youtubeRefresh
        });
        const { credentials } = await oauth2Client.refreshAccessToken();
        if (credentials.access_token) {
            // Save new access token
            await SettingsModel_1.default.updateOne({}, { $set: { youtubeToken: credentials.access_token } }, { upsert: true });
            console.log('✅ YouTube access token refreshed successfully');
            res.json({
                success: true,
                message: 'Access token refreshed successfully'
            });
        }
        else {
            throw new Error('No access token received from refresh');
        }
    }
    catch (error) {
        console.error('❌ Token refresh error:', error);
        res.status(500).json({
            error: 'Failed to refresh access token',
            details: error.message,
            suggestion: 'You may need to re-authorize'
        });
    }
});
exports.default = router;
