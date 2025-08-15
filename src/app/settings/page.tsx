'use client';

import React, { useState, useEffect } from 'react';

// API configuration  
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://lifestyle-design-backend-v2-clean.onrender.com'}/api`;

// API helper functions
const api = {
  async get(endpoint: string) {
    console.log(`🔄 GET: ${API_BASE_URL}${endpoint}`);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors'
      });
      console.log(`📡 Response status: ${response.status}`);
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      const data = await response.json();
      console.log('✅ GET success:', data);
      return data;
    } catch (error) {
      console.error('❌ GET error:', error);
      throw error;
    }
  },

  async post(endpoint: string, data: Record<string, unknown>) {
    console.log(`🔄 POST: ${API_BASE_URL}${endpoint}`, data);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'cors'
      });
      console.log(`📡 Response status: ${response.status}`);
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);
      const result = await response.json();
      console.log('✅ POST success:', result);
      return result;
    } catch (error) {
      console.error('❌ POST error:', error);
      throw error;
    }
  }
};

export default function Settings() {
  // Form states
  const [instagramToken, setInstagramToken] = useState('');
  const [instagramAccount, setInstagramAccount] = useState('');
  const [facebookPage, setFacebookPage] = useState('');
  const [youtubeToken, setYoutubeToken] = useState('');
  const [youtubeRefresh, setYoutubeRefresh] = useState('');
  const [youtubeChannel, setYoutubeChannel] = useState('');
  const [youtubeClientId, setYoutubeClientId] = useState('');
  const [youtubeClientSecret, setYoutubeClientSecret] = useState('');
  const [dropboxToken, setDropboxToken] = useState('');
  const [mongodbUri, setMongodbUri] = useState('');
  
  // Optional credentials
  const [runwayApi, setRunwayApi] = useState('');
  const [openaiApi, setOpenaiApi] = useState('');
  const [s3AccessKey, setS3AccessKey] = useState('');
  const [s3SecretKey, setS3SecretKey] = useState('');
  const [s3Bucket, setS3Bucket] = useState('');
  const [s3Region, setS3Region] = useState('');
  
  // Mode settings
  const [autopilotMode, setAutopilotMode] = useState(false);
  const [manualMode, setManualMode] = useState(true);
  
  // Scheduler settings
  const [postTime, setPostTime] = useState('14:00');
  const [peakHours, setPeakHours] = useState(true);
  const [maxPosts, setMaxPosts] = useState('5');
  const [repostDelay, setRepostDelay] = useState('1');
  
  // Visual settings
  const [thumbnailMode, setThumbnailMode] = useState('first');
  const [editorStyle, setEditorStyle] = useState('simple');
  const [cartoonEnabled, setCartoonEnabled] = useState(true);
  const [postToInstagram, setPostToInstagram] = useState(true);
  const [postToYoutube, setPostToYoutube] = useState(true);
  const [crossPost, setCrossPost] = useState(true);
  
  // Storage settings
  const [dropboxFolder, setDropboxFolder] = useState('/Bulk Upload');
  const [fileRetention, setFileRetention] = useState('7');
  
  // Phase 9 specific settings
  const [minViews, setMinViews] = useState('10000');
  const [visualSimilarityRecentPosts, setVisualSimilarityRecentPosts] = useState('30');
  const [trendingAudio, setTrendingAudio] = useState(true);
  const [aiCaptions, setAiCaptions] = useState(true);
  const [dropboxSave, setDropboxSave] = useState(false);

  // 🛡️ State to prevent multiple loads and handle SSR
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Detect client-side mount (fix for Next.js SSR)
  useEffect(() => {
    setIsClient(true);
    console.log('🔄 Client-side mounted, loading settings...');
    loadSettings();
  }, []); // Empty dependency array = run once on mount

  const loadSettings = async () => {
    try {
      console.log('🔄 Starting loadSettings...');
      const response = await api.get('/settings');
      console.log('🔍 Full backend response:', response);
      
      if (response) {
        const settings = response;
        console.log('📋 Settings data:', settings);
        
        // 🧪 TEST: Log individual field loading
        console.log('🔧 Loading Instagram Token:', settings.instagramToken?.substring(0, 20) + '...');
        console.log('🔧 Loading YouTube Token:', settings.youtubeAccessToken);
        console.log('🔧 Loading YouTube Channel:', settings.youtubeChannelId);
        
        // 🛡️ Load initial values OR preserve user typing - FIXED FIELD MAPPINGS
        if (!settingsLoaded || !instagramToken) setInstagramToken(settings.instagramToken || '');
        if (!settingsLoaded || !instagramAccount) setInstagramAccount(settings.igBusinessId || '');
        if (!settingsLoaded || !facebookPage) setFacebookPage(settings.facebookPageId || '');
        if (!settingsLoaded || !youtubeToken) setYoutubeToken(settings.youtubeAccessToken || '');
        if (!settingsLoaded || !youtubeRefresh) setYoutubeRefresh(settings.youtubeRefreshToken || '');
        if (!settingsLoaded || !youtubeChannel) setYoutubeChannel(settings.youtubeChannelId || '');
        if (!settingsLoaded || !youtubeClientId) setYoutubeClientId(settings.youtubeClientId || '');
        if (!settingsLoaded || !youtubeClientSecret) setYoutubeClientSecret(settings.youtubeClientSecret || '');
        if (!settingsLoaded || !dropboxToken) setDropboxToken(settings.dropboxToken || '');
        if (!settingsLoaded || !mongodbUri) setMongodbUri(settings.mongoURI || '');
        
        // Mark as loaded
        setSettingsLoaded(true);
        
        console.log('✅ Settings loaded without overwriting user input!');
        
        // Optional credentials - load initial values OR preserve user typing - FIXED FIELD MAPPINGS
        if (!settingsLoaded || !runwayApi) setRunwayApi(settings.runwayApiKey || '');
        if (!settingsLoaded || !openaiApi) setOpenaiApi(settings.openaiApiKey || '');
        if (!settingsLoaded || !s3AccessKey) setS3AccessKey(settings.s3AccessKey || '');
        if (!settingsLoaded || !s3SecretKey) setS3SecretKey(settings.s3SecretKey || '');
        if (!settingsLoaded || !s3Bucket) setS3Bucket(settings.s3BucketName || '');
        if (!settingsLoaded || !s3Region) setS3Region(settings.s3Region || '');
        
        // Mode settings - Fix backend field mapping
        setAutopilotMode(settings.autopilotEnabled || false);
        setManualMode(!settings.autopilotEnabled); // Manual is opposite of autopilot
        
        // Scheduler settings
        setPostTime(settings.postTime || '14:00');
        setPeakHours(settings.peakHours || true);
        setMaxPosts(settings.maxPosts?.toString() || '5');
        setRepostDelay(settings.repostDelay?.toString() || '1');
        
        // Visual settings
        setThumbnailMode(settings.thumbnailMode || 'first');
        setEditorStyle(settings.editorStyle || 'simple');
        setCartoonEnabled(settings.cartoon !== false); // Default to true
        setPostToInstagram(settings.postToInstagram !== false); // Default to true
        setPostToYoutube(settings.postToYouTube !== false); // Default to true
        setCrossPost(settings.crossPost || false);
        
        // Storage settings
        setDropboxFolder(settings.dropboxFolder || '/Bulk Upload');
        setFileRetention(settings.fileRetention?.toString() || '7');
        
        // Phase 9 specific settings
        setMinViews(settings.minimumIGLikesToRepost?.toString() || settings.minViews?.toString() || '10000');
        setVisualSimilarityRecentPosts((settings.visualSimilarityRecentPosts ?? settings.visualSimilarityDays ?? 30).toString());
        setTrendingAudio(settings.trendingAudio !== false);
        setAiCaptions(settings.aiCaptions !== false);
        setDropboxSave(settings.dropboxSave || false);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      showNotification('⚠️ Failed to load existing settings');
    }
  };

  const goBack = () => {
    window.location.href = '/dashboard';
  };

  const toggleMode = async (mode: string) => {
    try {
      if (mode === 'autopilot') {
        setAutopilotMode(true);
        setManualMode(false);
        
        // Save autopilot enabled to backend
        const response = await api.post('/settings', { autopilotEnabled: true });
        console.log('✅ AutoPilot enabled and saved to backend');
        showNotification('🚀 AutoPilot Mode Enabled!');
        
        // Trigger AutoPilot run
        try {
          const autopilotResult = await api.post('/autopilot/run', {});
          console.log('✅ AutoPilot scraping triggered:', autopilotResult);
          showNotification('📊 AutoPilot scraping started!');
        } catch (autopilotError) {
          console.warn('⚠️ AutoPilot run failed, but mode is enabled:', autopilotError);
          showNotification('⚠️ AutoPilot enabled but scraping failed');
        }
        
      } else {
        setManualMode(true);
        setAutopilotMode(false);
        
        // Save autopilot disabled to backend
        await api.post('/settings', { autopilotEnabled: false });
        console.log('✅ Manual mode enabled and saved to backend');
        showNotification('✋ Manual Mode Enabled');
      }
    } catch (error) {
      console.error('❌ Failed to toggle mode:', error);
      showNotification('❌ Failed to save mode setting');
      // Revert state on error
      if (mode === 'autopilot') {
        setAutopilotMode(false);
        setManualMode(true);
      } else {
        setAutopilotMode(true);
        setManualMode(false);
      }
    }
  };

  const saveCredentials = async () => {
    try {
      // 🛡️ ONLY send fields that have values - don't overwrite existing credentials with empty strings!
      const data: Record<string, any> = {};
      
      // Core credentials - only if not empty - FIXED FIELD MAPPINGS
      if (instagramToken.trim()) data.instagramToken = instagramToken;
      if (instagramAccount.trim()) data.igBusinessId = instagramAccount;
      if (facebookPage.trim()) data.facebookPageId = facebookPage;
      if (youtubeToken.trim()) data.youtubeAccessToken = youtubeToken;
      if (youtubeRefresh.trim()) data.youtubeRefreshToken = youtubeRefresh;
      if (youtubeChannel.trim()) data.youtubeChannelId = youtubeChannel;
      if (youtubeClientId.trim()) data.youtubeClientId = youtubeClientId;
      if (youtubeClientSecret.trim()) data.youtubeClientSecret = youtubeClientSecret;
      if (dropboxToken.trim()) data.dropboxToken = dropboxToken;
      if (mongodbUri.trim()) data.mongoURI = mongodbUri;
      
      // Optional credentials - only if not empty - FIXED FIELD MAPPINGS
      if (runwayApi.trim()) data.runwayApiKey = runwayApi;
      if (openaiApi.trim()) data.openaiApiKey = openaiApi;
      if (s3AccessKey.trim()) data.s3AccessKey = s3AccessKey;
      if (s3SecretKey.trim()) data.s3SecretKey = s3SecretKey;
      if (s3Bucket.trim()) data.s3BucketName = s3Bucket;
      if (s3Region.trim()) data.s3Region = s3Region;
      
      // Always send settings (these have defaults) - FIXED FIELD MAPPINGS
      data.autopilotEnabled = autopilotMode;
      data.manual = manualMode;
      data.postTime = postTime;
      data.peakHours = peakHours;
      data.maxPosts = parseInt(maxPosts);
      data.repostDelay = parseInt(repostDelay);
      data.thumbnailMode = thumbnailMode;
      data.editorStyle = editorStyle;
      data.cartoon = cartoonEnabled;
      data.postToInstagram = postToInstagram;
      data.postToYouTube = postToYoutube;
      data.crossPost = crossPost;
      data.dropboxFolder = dropboxFolder;
      data.fileRetention = parseInt(fileRetention);
      data.minimumIGLikesToRepost = parseInt(minViews);
      data.minViews = parseInt(minViews);
      data.visualSimilarityRecentPosts = parseInt(visualSimilarityRecentPosts);
      data.trendingAudio = trendingAudio;
      data.aiCaptions = aiCaptions;
      data.dropboxSave = dropboxSave;
      
      console.log('💾 Saving only filled fields:', data);
      await api.post('/settings', data);
      showNotification('✅ All settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('❌ Failed to save settings');
    }
  };

  // All settings now save through the unified saveCredentials function
  const saveOptionalCredentials = saveCredentials;
  const saveModes = saveCredentials;
  const saveScheduler = saveCredentials;
  const saveVisuals = saveCredentials;
  const saveStorage = saveCredentials;

  const cleanupFiles = async () => {
    try {
      showNotification('🗑️ Cleaning up placeholder posts...');
      const result = await api.post('/test/cleanup', {});
      showNotification(`✅ Cleanup completed! ${result.results.filesRemoved} files removed.`);
    } catch (error) {
      console.error('Failed to cleanup files:', error);
      showNotification('❌ Cleanup failed');
    }
  };

  const validateAPIs = async () => {
    try {
      showNotification('🔍 Validating API connections...');
      const result = await api.post('/test/validate-apis', {});
      const { valid, total } = result.summary;
      showNotification(`✅ API validation completed: ${valid}/${total} APIs configured`);
    } catch (error) {
      console.error('Failed to validate APIs:', error);
      showNotification('❌ API validation failed');
    }
  };

  const testMongoDB = async () => {
    try {
      showNotification('☁️ Testing MongoDB connection...');
      const result = await api.post('/test/mongodb', {});
      showNotification(`✅ ${result.message}`);
    } catch (error) {
      console.error('Failed to test MongoDB:', error);
      showNotification('❌ MongoDB test failed');
    }
  };

  const testUpload = async () => {
    try {
      showNotification('📤 Running test upload...');
      const result = await api.post('/test/upload', {});
      showNotification(`✅ ${result.message}`);
    } catch (error) {
      console.error('Failed to test upload:', error);
      showNotification('❌ Upload test failed');
    }
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(34, 197, 94, 0.9);
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      z-index: 10000;
      backdrop-filter: blur(10px);
      animation: slideIn 0.3s ease;
      font-weight: 500;
      max-width: 300px;
    `;
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    }, 3000);
  };

  // Show loading state during SSR/hydration
  if (!isClient) {
    return (
      <div className="settings-container">
        <div className="header">
          <button className="back-btn" onClick={goBack}>
            ← Back to Dashboard
          </button>
          <h1 className="page-title">Settings</h1>
          <div></div>
        </div>
        <div style={{
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          fontSize: '1.2rem',
          color: '#fff'
        }}>
          🔄 Loading settings...
        </div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="header">
        <button className="back-btn" onClick={goBack}>
          ← Back to Dashboard
        </button>
        <h1 className="page-title">Settings</h1>
        <div></div>
      </div>

      <div className="settings-grid">
        {/* Core API Credentials */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">🔐</div>
            <h2 className="card-title">Core API Credentials</h2>
          </div>
          
          <div className="form-group">
            <label className="form-label">📸 Instagram Access Token {instagramToken ? '✅' : '❌'}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter Instagram access token..." 
              value={instagramToken}
              onChange={(e) => setInstagramToken(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem', backgroundColor: instagramToken ? '#1a4d1a' : 'transparent'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>
              Enables posting and scraping IG data {instagramToken ? `(${instagramToken.length} chars loaded)` : '(empty)'}
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">📸 IG Business Account ID</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter Business Account ID..." 
              value={instagramAccount}
              onChange={(e) => setInstagramAccount(e.target.value)}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Required for Graph API scraping</small>
          </div>

          <div className="form-group">
            <label className="form-label">📘 Facebook Page ID</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter Facebook Page ID..." 
              value={facebookPage}
              onChange={(e) => setFacebookPage(e.target.value)}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>For IG→FB linkage</small>
          </div>

          <div className="form-group">
            <label className="form-label">📺 YouTube Token {youtubeToken ? '✅' : '❌'}</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter YouTube token..." 
              value={youtubeToken}
              onChange={(e) => setYoutubeToken(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem', backgroundColor: youtubeToken ? '#1a4d1a' : 'transparent'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>
              Enables posting via YouTube Data API {youtubeToken ? `(${youtubeToken.length} chars)` : '(empty)'}
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">📺 YouTube Refresh Token</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter YouTube refresh token..." 
              value={youtubeRefresh}
              onChange={(e) => setYoutubeRefresh(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Used to auto-refresh YouTube access</small>
          </div>

          <div className="form-group">
            <label className="form-label">📺 YouTube Channel ID</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter Channel ID..." 
              value={youtubeChannel}
              onChange={(e) => setYoutubeChannel(e.target.value)}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Specifies which channel to post to</small>
          </div>

          <div className="form-group">
            <label className="form-label">📺 YouTube Client ID</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter YouTube Client ID..." 
              value={youtubeClientId}
              onChange={(e) => setYoutubeClientId(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>OAuth app identification for YouTube API</small>
          </div>

          <div className="form-group">
            <label className="form-label">📺 YouTube Client Secret</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter YouTube Client Secret..." 
              value={youtubeClientSecret}
              onChange={(e) => setYoutubeClientSecret(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>OAuth app secret for YouTube API authentication</small>
          </div>

          <div className="form-group">
            <label className="form-label">📦 Dropbox Token</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter Dropbox token..." 
              value={dropboxToken}
              onChange={(e) => setDropboxToken(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Allows syncing and retrieving bulk videos</small>
          </div>

          <div className="form-group">
            <label className="form-label">☁️ MongoDB URI</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="mongodb+srv://username:password@cluster..." 
              value={mongodbUri}
              onChange={(e) => setMongodbUri(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Main DB connection</small>
          </div>

          <button className="btn-primary" onClick={saveCredentials}>Save Core Credentials</button>
        </div>

        {/* Optional API Credentials */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">🔧</div>
            <h2 className="card-title">Optional API Credentials</h2>
          </div>
          
          <div className="form-group">
            <label className="form-label">🎨 Runway API Key <span style={{color: '#ff4458'}}>(Optional)</span></label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter Runway API key..." 
              value={runwayApi}
              onChange={(e) => setRunwayApi(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Powers cartoon generation if enabled</small>
          </div>

          <div className="form-group">
            <label className="form-label">🤖 OpenAI API Key <span style={{color: '#ff4458'}}>(Optional)</span></label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter OpenAI API key..." 
              value={openaiApi}
              onChange={(e) => setOpenaiApi(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Used to generate or rewrite captions</small>
          </div>

          <div className="form-group">
            <label className="form-label">🪣 S3 Access Key ID <span style={{color: '#ff4458'}}>(Optional)</span></label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Enter S3 Access Key..." 
              value={s3AccessKey}
              onChange={(e) => setS3AccessKey(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.9rem'}}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>If used instead of Dropbox</small>
          </div>

          <div className="form-group">
            <label className="form-label">🪣 S3 Secret Access Key <span style={{color: '#ff4458'}}>(Optional)</span></label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="Enter S3 Secret Key..." 
              value={s3SecretKey}
              onChange={(e) => setS3SecretKey(e.target.value)}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Secret key for S3 bucket access</small>
          </div>

          <div className="form-group">
            <label className="form-label">🪣 S3 Bucket Name <span style={{color: '#ff4458'}}>(Optional)</span></label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="my-video-bucket" 
              value={s3Bucket}
              onChange={(e) => setS3Bucket(e.target.value)}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Name of your S3 bucket</small>
          </div>

          <div className="form-group">
            <label className="form-label">🪣 S3 Region <span style={{color: '#ff4458'}}>(Optional)</span></label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="us-east-1" 
              value={s3Region}
              onChange={(e) => setS3Region(e.target.value)}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>AWS region for your bucket</small>
          </div>

          <button className="btn-primary" onClick={saveOptionalCredentials}>Save Optional Credentials</button>
        </div>

        {/* Mode Configuration */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">🎯</div>
            <h2 className="card-title">Operation Modes</h2>
          </div>

          <div className="form-group">
            <div className="toggle-group">
              <div>
                <label className="form-label">🤖 Autopilot Mode</label>
                <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', display: 'block'}}>Activates full automation Phase 9</small>
              </div>
              <div 
                className={`toggle-switch ${autopilotMode ? 'active' : ''}`}
                onClick={() => toggleMode('autopilot')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="toggle-group">
              <div>
                <label className="form-label">✋ Manual Mode</label>
                <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', display: 'block'}}>Activates manual post-only workflows</small>
              </div>
              <div 
                className={`toggle-switch ${manualMode ? 'active' : ''}`}
                onClick={() => toggleMode('manual')}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>

          <div className="form-group" style={{marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 68, 88, 0.1)', border: '1px solid rgba(255, 68, 88, 0.2)', borderRadius: '10px'}}>
            <small style={{color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem'}}>
              ⚠️ <strong>Note:</strong> Only one mode can be active at a time. Autopilot enables full automation, while Manual mode requires user input for each post.
            </small>
          </div>

          <button className="btn-primary" onClick={saveModes}>Save Mode Configuration</button>
        </div>

        {/* Scheduler Settings */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">🕒</div>
            <h2 className="card-title">Scheduler Settings</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Post Time (CT)</label>
            <input 
              type="time" 
              className="form-input" 
              value={postTime}
              onChange={(e) => setPostTime(e.target.value)}
            />
          </div>

          <div className="form-group">
            <div className="toggle-group">
              <label className="form-label">Peak Hour Targeting</label>
              <div 
                className={`toggle-switch ${peakHours ? 'active' : ''}`}
                onClick={() => setPeakHours(!peakHours)}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Max Scheduled Posts per Day</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="5" 
              min="1" 
              max="50"
              value={maxPosts}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 1 && parseInt(value) <= 50)) {
                  setMaxPosts(value);
                }
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reposting Delay (Days)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="1" 
              min="1" 
              max="30"
              value={repostDelay}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 1 && parseInt(value) <= 30)) {
                  setRepostDelay(value);
                }
              }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Visual Similarity Protection (Recent Posts)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="30" 
              min="1" 
              max="200"
              value={visualSimilarityRecentPosts}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 1 && parseInt(value) <= 200)) {
                  setVisualSimilarityRecentPosts(value);
                }
              }}
            />
            <small style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem'}}>Avoid duplicates against the last N recent posts (default 30)</small>
          </div>

          <button className="btn-primary" onClick={saveScheduler}>Save Scheduler Settings</button>
        </div>

        {/* App Visuals & Features */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">🎨</div>
            <h2 className="card-title">App Visuals & Features</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Default Thumbnail Mode</label>
            <div className="select-wrapper">
              <select 
                className="form-select" 
                value={thumbnailMode}
                onChange={(e) => setThumbnailMode(e.target.value)}
              >
                <option value="first">First Frame</option>
                <option value="best">Best Frame (AI Selected)</option>
                <option value="manual">Upload Manually</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Caption Editor Style</label>
            <div className="select-wrapper">
              <select 
                className="form-select" 
                value={editorStyle}
                onChange={(e) => setEditorStyle(e.target.value)}
              >
                <option value="simple">Simple</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="toggle-group">
              <label className="form-label">Enable Cartoon Feature</label>
              <div 
                className={`toggle-switch ${cartoonEnabled ? 'active' : ''}`}
                onClick={() => setCartoonEnabled(!cartoonEnabled)}
              >
                <div className="toggle-slider"></div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Platform Defaults</label>
            <div className="platform-checkboxes">
              <div className="checkbox-item">
                <div 
                  className={`custom-checkbox ${postToInstagram ? 'checked' : ''}`}
                  onClick={() => setPostToInstagram(!postToInstagram)}
                ></div>
                <span>Post to Instagram</span>
              </div>
              <div className="checkbox-item">
                <div 
                  className={`custom-checkbox ${postToYoutube ? 'checked' : ''}`}
                  onClick={() => setPostToYoutube(!postToYoutube)}
                ></div>
                <span>Post to YouTube</span>
              </div>
              <div className="checkbox-item">
                <div 
                  className={`custom-checkbox ${crossPost ? 'checked' : ''}`}
                  onClick={() => setCrossPost(!crossPost)}
                ></div>
                <span>Cross-post videos</span>
              </div>
            </div>
          </div>

          <button className="btn-primary" onClick={saveVisuals}>Save Visual Settings</button>
        </div>

        {/* Storage Settings */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">📥</div>
            <h2 className="card-title">Storage Settings</h2>
          </div>

          <div className="form-group">
            <label className="form-label">Dropbox Folder Name</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="/Bulk Upload" 
              value={dropboxFolder}
              onChange={(e) => setDropboxFolder(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Temporary File Retention (days)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="7" 
              min="1" 
              max="30"
              value={fileRetention}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (!isNaN(parseInt(value)) && parseInt(value) >= 1 && parseInt(value) <= 30)) {
                  setFileRetention(value);
                }
              }}
            />
          </div>

          <button className="btn-primary" onClick={saveStorage}>Save Storage Settings</button>
          <button className="btn-secondary" onClick={cleanupFiles}>🗑️ Cleanup Placeholder Posts</button>
        </div>

        {/* System Status & Testing */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">🧪</div>
            <h2 className="card-title">System Status & Testing</h2>
          </div>

          <div className="form-group">
            <label className="form-label">API Connection Status</label>
            <div className="status-indicator">
              <div className="status-dot"></div>
              All systems operational
            </div>
          </div>

          <button className="btn-primary" onClick={validateAPIs}>🔍 Validate All API Keys</button>
          <button className="btn-secondary" onClick={testMongoDB}>☁️ Test MongoDB Connection</button>
          <button className="btn-secondary" onClick={testUpload}>📤 Run Test Upload</button>
        </div>

        {/* Terms of Service */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">📜</div>
            <h2 className="card-title">Terms of Service</h2>
          </div>
          <div className="form-group">
            <div style={{
              background: "rgba(255,255,255,0.05)", 
              padding: "1.5rem", 
              borderRadius: "10px", 
              border: "1px solid rgba(255,255,255,0.1)",
              lineHeight: "1.6",
              color: "rgba(255,255,255,0.9)"
            }}>
              <h3 style={{color: "#fff", marginBottom: "1rem"}}>Terms of Service</h3>
              <p style={{marginBottom: "1rem"}}>
                By using this app, you agree to allow us to schedule and publish content to your connected social media accounts.
                You retain full ownership of your content. We are not responsible for platform restrictions or takedowns.
              </p>
              <ul style={{fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", paddingLeft: "1.5rem"}}>
                <li>You maintain full ownership of all content</li>
                <li>We only access accounts you explicitly connect</li>
                <li>Service is provided &quot;as-is&quot; without guarantees</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="settings-card">
          <div className="card-header">
            <div className="card-emoji">🔒</div>
            <h2 className="card-title">Privacy Policy</h2>
          </div>
          <div className="form-group">
            <div style={{
              background: "rgba(255,255,255,0.05)", 
              padding: "1.5rem", 
              borderRadius: "10px", 
              border: "1px solid rgba(255,255,255,0.1)",
              lineHeight: "1.6",
              color: "rgba(255,255,255,0.9)"
            }}>
              <h3 style={{color: "#fff", marginBottom: "1rem"}}>Privacy Policy</h3>
              <p style={{marginBottom: "1rem"}}>
                We only access the data required to connect your social media accounts and publish content on your behalf.
                We do not sell or share your data. You may disconnect your account at any time.
              </p>
              <ul style={{fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", paddingLeft: "1.5rem"}}>
                <li>Social media account information for posting</li>
                <li>Video files you choose to upload or process</li>
                <li>Settings and preferences you configure</li>
                <li>API tokens (stored securely, never shared)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
