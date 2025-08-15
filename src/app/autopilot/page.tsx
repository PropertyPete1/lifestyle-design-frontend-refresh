'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import VideoThumbnail from '@/components/VideoThumbnail';
import HeatmapWeekly from '@/components/HeatmapWeekly';



// API configuration
const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://lifestyle-design-backend-v2-clean.onrender.com'}/api`;

// API helper functions
const api = {
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors'
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  },

  async post(endpoint: string, data: Record<string, unknown>) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      mode: 'cors'
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
  }
};

export default function AutopilotPage() {
  const [autopilotActive, setAutopilotActive] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [autopilotStatus, setAutopilotStatus] = useState<Record<string, unknown> | null>(null);
  const [queueData, setQueueData] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const particlesRef = useRef<HTMLDivElement>(null);

  const [settings, setSettings] = useState({
    maxPosts: 3,
    postTime: '14:00',
    peakHours: true,
    repostDelay: 2,
    minViews: 10000,
    visualSimilarityRecentPosts: 30,
    trendingAudio: true,
    aiCaptions: true,
    dropboxSave: false,
    platforms: ['instagram', 'youtube']
  });
  const [burstEnabled, setBurstEnabled] = useState(false);
  const [burstConfig, setBurstConfig] = useState<{ startTime: string; endTime: string; postsPerMinute: number; maxTotal: number; preloadMinutes?: number; scrapeLimit?: number; platforms: string[] }>({ startTime: '12:00', endTime: '13:00', postsPerMinute: 1, maxTotal: 10, platforms: ['instagram'] });

  // Header status
  const [headerStatus, setHeaderStatus] = useState<{ active: boolean; igUsed: number; igLimit: number; ytUsed: number; ytLimit: number; nextRunISO: string; lastRefreshed: string }>({ active: false, igUsed: 0, igLimit: 0, ytUsed: 0, ytLimit: 0, nextRunISO: '', lastRefreshed: '' });

  // Heatmap state
  const [heatMatrix, setHeatMatrix] = useState<number[][]>(Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0)));
  const [heatViewer, setHeatViewer] = useState<number[][] | null>(null);
  const [heatPerf, setHeatPerf] = useState<number[][] | null>(null);
  const [heatMeta, setHeatMeta] = useState<any>({ scale: { min: 0, max: 100 }, generatedAt: new Date().toISOString(), method: 'weighted', weights: { viewerActivity: 0.6, postPerformance: 0.4 } });
  const [heatTopSlots, setHeatTopSlots] = useState<any[]>([]);
  const [aiTip, setAiTip] = useState<string>('');

  // Helper functions for real-time data
  const getNextPostTime = () => {
    const now = new Date();
    const optimalTimes = ['8:00 AM', '12:00 PM', '5:00 PM', '8:00 PM'];
    const currentHour = now.getHours();
    
    // Find next scheduled time
    const timeMap = [
      { time: '8:00 AM', hour: 8 },
      { time: '12:00 PM', hour: 12 },
      { time: '5:00 PM', hour: 17 },
      { time: '8:00 PM', hour: 20 }
    ];
    
    for (const slot of timeMap) {
      if (currentHour < slot.hour) {
        return slot.time;
      }
    }
    
    return 'Tomorrow 8:00 AM';
  };

  const getRemainingPosts = () => {
    const maxPosts = settings.maxPosts || 4;
    const todayPosts = autopilotStatus?.todayPosts || 0;
    const remaining = Math.max(0, maxPosts - todayPosts);
    return `${remaining} of ${maxPosts}`;
  };

  useEffect(() => {
    createParticles();
    loadAutopilotData();
    fetchHeatmap();
    fetchOptimalTimes();
    refreshHeader();
    showNotification('🚀 Autopilot Dashboard loaded!', 'success');

    // Add keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (queueOpen) {
          toggleQueue();
        }
      }
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveSettings();
      }
      if (e.ctrlKey && e.key === 'q') {
        e.preventDefault();
        toggleQueue();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [queueOpen]);

  // Refresh optimal times every 15 minutes
  useEffect(() => {
    const id = setInterval(() => {
      fetchOptimalTimes().catch(() => {});
    }, 15 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  async function fetchHeatmap() {
    try {
      const res = await api.get('/heatmap/weekly');
      if (res && res.matrix && res.meta) {
        setHeatMatrix(res.matrix);
        setHeatMeta(res.meta);
        setHeatTopSlots(res.topSlots || []);
        setHeatViewer(res.viewerMatrix || null);
        setHeatPerf(res.performanceMatrix || null);
      }
    } catch (e) {
      // silently ignore
    }
  }

  async function fetchOptimalTimes() {
    try {
      const res = await api.get('/heatmap/optimal-times');
      const slots = res?.slots || [];
      const byPlat: Record<string, any[]> = slots.reduce((acc: any, s: any) => { (acc[s.platform] ||= []).push(s); return acc; }, {});
      const fmt = (s: any) => s?.localLabel || new Date(s.iso).toLocaleString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit', hour12: true }) + ' CT';
      const igList = (byPlat['instagram'] || []).slice(0, 3).map(fmt).join(', ');
      const ytList = (byPlat['youtube'] || []).slice(0, 3).map(fmt).join(', ');
      const parts: string[] = [];
      if (igList) parts.push(`IG: ${igList}`);
      if (ytList) parts.push(`YT: ${ytList}`);
      setAiTip(parts.join('  •  '));
    } catch (_) {
      setAiTip('');
    }
  }

  const loadAutopilotData = async () => {
    try {
      setIsLoading(true);
      
      // Load settings
      const settingsRes = await api.get('/settings');
      if (settingsRes) {
        const likesThreshold = (settingsRes.minimumIGLikesToRepost ?? settingsRes.minViews ?? 0);
        setSettings({
          maxPosts: settingsRes.maxPosts || 3,
          postTime: settingsRes.postTime || '14:00',
          peakHours: settingsRes.peakHours !== false,
          repostDelay: settingsRes.repostDelay || 2,
          minViews: likesThreshold,
          visualSimilarityRecentPosts: settingsRes.visualSimilarityRecentPosts || settingsRes.visualSimilarityDays || 30,
          trendingAudio: settingsRes.trendingAudio !== false,
          aiCaptions: settingsRes.aiCaptions !== false,
          dropboxSave: settingsRes.dropboxSave || false,
          platforms: []
        });
        setAutopilotActive(settingsRes.autopilotEnabled || false);

        // Load burst mode
        setBurstEnabled(Boolean(settingsRes.burstModeEnabled));
        setBurstConfig({
          startTime: settingsRes.burstModeConfig?.startTime || '12:00',
          endTime: settingsRes.burstModeConfig?.endTime || '13:00',
          postsPerMinute: settingsRes.burstModeConfig?.postsPerMinute || 1,
          maxTotal: settingsRes.burstModeConfig?.maxTotal || 10,
          preloadMinutes: settingsRes.burstModeConfig?.preloadMinutes || undefined,
          scrapeLimit: settingsRes.burstModeConfig?.scrapeLimit || undefined,
          platforms: settingsRes.burstModeConfig?.platforms || ['instagram']
        });
      }

      // Load autopilot status from Phase 9 endpoint
      const statusRes = await api.get('/autopilot/status');
      if (statusRes.success) {
        setAutopilotStatus(statusRes);
        setAutopilotActive(statusRes.autopilotEnabled || false);
      }

      // Load queue data from Phase 9 autopilot queue endpoint
      const queueRes = await api.get('/autopilot/queue');
      console.log('📋 [QUEUE DATA] Response:', queueRes);
      const items = queueRes.queue || queueRes.posts || [];
      if (items) {
        setQueueData(items || []);
      }

    } catch (error) {
      console.error('❌ Failed to load autopilot data:', error);
      showNotification('❌ Failed to load autopilot data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  async function refreshHeader() {
    try {
      const s = await api.get('/autopilot/status');
      const sched = await api.get('/scheduler/status');
      setHeaderStatus({
        active: !!(s?.autopilotEnabled),
        igUsed: sched?.instagram?.used ?? sched?.today?.instagram ?? 0,
        igLimit: sched?.instagram?.limit ?? (settings.maxPosts || 5),
        ytUsed: sched?.youtube?.used ?? sched?.today?.youtube ?? 0,
        ytLimit: sched?.youtube?.limit ?? (settings.maxPosts || 5),
        nextRunISO: sched?.nextRun || '',
        lastRefreshed: new Date().toLocaleTimeString()
      });
    } catch {}
  }

  const createParticles = () => {
    if (!particlesRef.current) return;
    
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      particlesRef.current.appendChild(particle);
    }
  };

  const toggleQueue = () => {
    setQueueOpen(!queueOpen);
    
    if (!queueOpen) {
      document.body.style.overflow = 'hidden';
      showNotification('🔁 Smart Queue opened', 'success');
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Queue polling every 30s while drawer is open
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const start = async () => {
      setIsLoading(true);
      await loadAutopilotData();
      setIsLoading(false);
      if (pollRef.current) clearInterval(pollRef.current as any);
      pollRef.current = setInterval(async () => {
        if (queueOpen) {
          try { await loadAutopilotData(); } catch {}
        }
      }, 30000);
    };
    if (queueOpen) start();
    return () => {
      if (pollRef.current) { clearInterval(pollRef.current as any); pollRef.current = null; }
    };
  }, [queueOpen]);

  const toggleSwitch = (settingKey: string) => {
    setSettings(prev => ({
      ...prev,
      [settingKey]: !prev[settingKey as keyof typeof prev]
    }));
    
    const isActive = !settings[settingKey as keyof typeof settings];
    showNotification(`Setting ${isActive ? 'enabled' : 'disabled'}`, 'success');
  };

  const togglePlatform = (platform: string) => {
    setSettings(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
    
    const isSelected = !settings.platforms.includes(platform);
    showNotification(`${platform} ${isSelected ? 'enabled' : 'disabled'}`, 'success');
  };

  const saveSettings = async () => {
    try {
      console.log('Saving settings:', settings);
      
      // Update settings in backend
      await api.post('/settings', {
        maxPosts: settings.maxPosts,
        postTime: settings.postTime,
        peakHours: settings.peakHours,
        repostDelay: settings.repostDelay,
        // Backend uses likes; send both for compatibility
        minimumIGLikesToRepost: settings.minViews,
        minViews: settings.minViews,
        visualSimilarityRecentPosts: settings.visualSimilarityRecentPosts,
        trendingAudio: settings.trendingAudio,
        aiCaptions: settings.aiCaptions,
        dropboxSave: settings.dropboxSave,
        autopilotEnabled: autopilotActive,
        burstModeEnabled: burstEnabled,
        burstModeConfig: burstEnabled ? {
          startTime: burstConfig.startTime,
          endTime: burstConfig.endTime,
          postsPerMinute: burstConfig.postsPerMinute,
          maxTotal: burstConfig.maxTotal,
          preloadMinutes: burstConfig.preloadMinutes,
          scrapeLimit: burstConfig.scrapeLimit,
          platforms: burstConfig.platforms
        } : undefined
      });
      
      showNotification('💾 Settings saved successfully!', 'success');
      await loadAutopilotData(); // Reload data
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      showNotification('❌ Failed to save settings', 'error');
    }
  };

  const runNow = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      showNotification('🚀 Starting comprehensive autopilot run...', 'success');
      
      // Call the CORRECT comprehensive autopilot endpoint
      const res = await api.post('/autopilot/run', {
        source: 'manual-trigger'
      });

      if (res.success) {
        const scheduled = res.scheduled ?? res.videosScheduled ?? 0;
        const skipped = res.skipped ?? 0;
        showNotification(`✅ Autopilot completed! Scheduled ${scheduled} • Skipped ${skipped}`, 'success');
        await loadAutopilotData();
        await fetchHeatmap();
        await fetchOptimalTimes();
        await refreshHeader();
      } else {
        showNotification(`❌ Autopilot failed: ${res.error || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('❌ Autopilot failed:', error);
      showNotification('❌ Autopilot failed', 'error');
    }
    setTimeout(() => setIsLoading(false), 800);
  };

  const postNow = async () => {
    try {
      if (isLoading) return;
      setIsLoading(true);
      showNotification('🚀 Posting all queued videos now...', 'success');
      const result = await api.post('/post-now', {});
      
      if (result.success) {
        const posted = result.posted ?? result?.result?.posted ?? 0;
        const skipped = result.skipped ?? 0;
        showNotification(`✅ Posted ${posted} • Skipped ${skipped}`, 'success');
        await loadAutopilotData(); // Reload data to show updated statuses
        await fetchHeatmap();
        await fetchOptimalTimes();
        await refreshHeader();
      } else {
        showNotification('❌ Posting failed', 'error');
      }
    } catch (error) {
      console.error('❌ Posting failed:', error);
      showNotification('❌ Posting failed', 'error');
    }
    setTimeout(() => setIsLoading(false), 800);
  };

  // Dev-only: Why Skipped? modal
  const [whyOpen, setWhyOpen] = useState(false);
  const [whyLoading, setWhyLoading] = useState(false);
  const [whyError, setWhyError] = useState<string | null>(null);
  const [whyResult, setWhyResult] = useState<any>(null);

  const openWhy = async () => {
    setWhyOpen(true);
    setWhyLoading(true);
    setWhyError(null);
    setWhyResult(null);
    try {
      const item: any = queueData && queueData.length ? queueData[0] : null;
      if (!item) {
        setWhyError('No queued items to inspect. Run Autopilot first.');
        return;
      }
      const payload = {
        platform: (item.platform || 'instagram'),
        videoUrl: (item.videoUrl || (item.s3Url || '')),
        caption: (item.caption || ''),
        audioKey: null,
        durationSec: null
      };
      const res = await api.post('/debug/similarity-check', payload);
      setWhyResult(res);
    } catch (e: any) {
      setWhyError(e?.message || 'Failed to run similarity check');
    } finally {
      setWhyLoading(false);
    }
  };

  const startAutopilot = async () => {
    try {
      const response = await api.post('/settings', { autopilotEnabled: true });
      setAutopilotActive(true);
      showNotification('🚀 Autopilot started successfully!', 'success');
      
      // Check if Phase 9 was triggered
      if (response.autopilotTriggered) {
        showNotification('📊 Phase 9 system triggered!', 'success');
      }
      
      await loadAutopilotData();
    } catch (error) {
      console.error('❌ Failed to start autopilot:', error);
      showNotification('❌ Failed to start autopilot', 'error');
    }
  };

  const stopAutopilot = async () => {
    try {
      await api.post('/settings', { autopilotEnabled: false });
      setAutopilotActive(false);
      showNotification('⏹️ Autopilot stopped', 'success');
      await loadAutopilotData();
    } catch (error) {
      console.error('❌ Failed to stop autopilot:', error);
      showNotification('❌ Failed to stop autopilot', 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  const updateSetting = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="floating-particles" ref={particlesRef}></div>
      
      <div className="autopilot-container">
        <Link href="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>

        {/* View Queue Button */}
        <div className="queue-trigger">
          <button className="view-queue-btn" onClick={toggleQueue}>
            🔁 View Smart Queue
          </button>
        </div>

        {/* Autopilot Header */}
        <div className="autopilot-header">
          <h1 className="autopilot-title">🚀 Autopilot Dashboard</h1>
          
          {/* Header bar with CT & counters */}
          <div className="status-display" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className={`status-indicator ${headerStatus.active ? 'status-active' : 'status-paused'}`}></div>
            <span>{headerStatus.active ? '✅ Autopilot Active' : '❌ Autopilot Paused'}</span>
            <span>•</span>
            <span>Today IG {headerStatus.igUsed}/{headerStatus.igLimit}</span>
            <span>•</span>
            <span>YT {headerStatus.ytUsed}/{headerStatus.ytLimit}</span>
            <span>•</span>
            <span>Next Run {headerStatus.nextRunISO ? new Date(headerStatus.nextRunISO).toLocaleString('en-US', { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit', hour12: true }) + ' CT' : '—'}</span>
            <span>•</span>
            <span>Last refreshed {headerStatus.lastRefreshed}</span>
            <button onClick={openWhy} style={{ marginLeft: 8, fontSize: 12, padding: '4px 8px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}>Why Skipped?</button>
          </div>
        </div>

        {/* Weekly Heatmap */}
        <div style={{ marginTop: '16px' }}>
          <HeatmapWeekly matrix={heatMatrix} meta={heatMeta} topSlots={heatTopSlots} viewerMatrix={heatViewer} performanceMatrix={heatPerf} />
        </div>
        {aiTip && (
          <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.85)', fontSize: 12, fontStyle: 'italic' }}>
            Best upcoming times → {aiTip}
          </div>
        )}
        {/* AI tip line */}
        <div style={{ marginTop: 6, color: 'rgba(255,255,255,0.8)', fontSize: 12, fontStyle: 'italic' }}>
          Best times update every 15 minutes. All times shown are CT.
        </div>

        {/* Settings Panel */}
        <div className="settings-panel">
          <h2 className="settings-title">⚙️ Autopilot Settings</h2>
          
          <div className="settings-grid">
            {/* Max Posts Per Day */}
            <div className="setting-item">
              <label className="setting-label">
                📊 Max Posts Per Day
              </label>
              <input 
                type="number" 
                className="setting-input" 
                value={settings.maxPosts} 
                min="1" 
                max="10"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 10) {
                    updateSetting('maxPosts', value);
                  }
                }}
              />
              <div className="setting-description">Maximum number of posts to publish daily</div>
            </div>

            {/* Preferred Post Time */}
            <div className="setting-item">
              <label className="setting-label">
                🕐 Preferred Post Time
              </label>
              <input 
                type="time" 
                className="setting-input" 
                value={settings.postTime}
                onChange={(e) => updateSetting('postTime', e.target.value)}
              />
              <div className="setting-description">Default time to schedule posts</div>
            </div>

            {/* Peak Hour Targeting */}
            <div className="setting-item">
              <label className="setting-label">
                🎯 Peak Hour Targeting
              </label>
              <div 
                className={`toggle-switch ${settings.peakHours ? 'active' : ''}`} 
                onClick={() => toggleSwitch('peakHours')}
              >
                <div className="toggle-slider"></div>
              </div>
              <div className="setting-description">Use AI to optimize post timing for maximum engagement</div>
            </div>

            {/* Reposting Delay */}
            <div className="setting-item">
              <label className="setting-label">
                🔄 Reposting Delay (Days)
              </label>
              <input 
                type="number" 
                className="setting-input" 
                value={settings.repostDelay} 
                min="1" 
                max="30"
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty input for typing
                  if (value === '') {
                    return;
                  }
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 1 && numValue <= 30) {
                    updateSetting('repostDelay', numValue);
                  }
                }}
              />
              <div className="setting-description">Days to wait before reposting content</div>
            </div>

            {/* Minimum Likes to Repost */}
            <div className="setting-item">
              <label className="setting-label">
                👀 Minimum IG Likes to Repost
              </label>
              <input 
                type="number" 
                className="setting-input" 
                value={settings.minViews}
                min="0"
                step="1"
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty input for typing
                  if (value === '') {
                    return;
                  }
                  const numValue = parseInt(value);
                  if (!isNaN(numValue) && numValue >= 0) {
                    updateSetting('minViews', numValue);
                  }
                }}
              />
              <div className="setting-description">Minimum likes required for automatic reposting</div>
            </div>

            {/* Visual Similarity Protection (Recent Posts) */}
            <div className="setting-item">
              <label className="setting-label">
                🎨 Visual Similarity Protection (Recent Posts)
              </label>
              <input 
                type="number" 
                className="setting-input" 
                value={settings.visualSimilarityRecentPosts} 
                min="1" 
                max="200"
                step="1"
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 200) {
                    updateSetting('visualSimilarityRecentPosts', value);
                  }
                }}
              />
              <div className="setting-description">Avoid duplicates against the last N recent posts (default 30)</div>
            </div>

            {/* Attach Trending Audio */}
            <div className="setting-item">
              <label className="setting-label">
                🎵 Attach Trending Audio
              </label>
              <div 
                className={`toggle-switch ${settings.trendingAudio ? 'active' : ''}`} 
                onClick={() => toggleSwitch('trendingAudio')}
              >
                <div className="toggle-slider"></div>
              </div>
              <div className="setting-description">Automatically add trending audio to video posts</div>
            </div>

            {/* Rewrite Captions with AI */}
            <div className="setting-item">
              <label className="setting-label">
                🤖 Rewrite Captions with AI
              </label>
              <div 
                className={`toggle-switch ${settings.aiCaptions ? 'active' : ''}`} 
                onClick={() => toggleSwitch('aiCaptions')}
              >
                <div className="toggle-slider"></div>
              </div>
              <div className="setting-description">Use AI to optimize captions for better engagement</div>
            </div>

            {/* Save All to Dropbox */}
            <div className="setting-item">
              <label className="setting-label">
                💾 Save All to Dropbox
              </label>
              <div 
                className={`toggle-switch ${settings.dropboxSave ? 'active' : ''}`} 
                onClick={() => toggleSwitch('dropboxSave')}
              >
                <div className="toggle-slider"></div>
              </div>
              <div className="setting-description">Automatically backup all content to Dropbox</div>
            </div>

            {/* Platform Scope */}
            <div className="setting-item">
              <label className="setting-label">
                📱 Platform Scope
              </label>
              <div className="multi-select">
                <div 
                  className={`platform-chip ${settings.platforms.includes('instagram') ? 'selected' : ''}`} 
                  onClick={() => togglePlatform('instagram')}
                >
                  📷 Instagram
                </div>
                <div 
                  className={`platform-chip ${settings.platforms.includes('youtube') ? 'selected' : ''}`} 
                  onClick={() => togglePlatform('youtube')}
                >
                  ▶️ YouTube
                </div>
              </div>
              <div className="setting-description">Select which platforms to include in automation</div>
            </div>
          </div>

          {/* Burst Mode */}
          <div className="settings-card" style={{ marginTop: 12 }}>
            <div className="card-header">
              <div className="card-emoji">⚡</div>
              <h2 className="card-title">Burst Mode</h2>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label className="form-label">Enable Burst Mode</label>
              <div className={`toggle-switch ${burstEnabled ? 'active' : ''}`} onClick={()=>setBurstEnabled(!burstEnabled)}><div className="toggle-slider"></div></div>
            </div>
            {burstEnabled && (
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Window Start (CT)</label>
                    <input type="time" className="form-input" value={burstConfig.startTime} onChange={(e)=>setBurstConfig({ ...burstConfig, startTime: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label">Window End (CT)</label>
                    <input type="time" className="form-input" value={burstConfig.endTime} onChange={(e)=>setBurstConfig({ ...burstConfig, endTime: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Posts Per Minute (cap)</label>
                    <input type="number" className="form-input" value={burstConfig.postsPerMinute} min={1} max={120} onChange={(e)=>setBurstConfig({ ...burstConfig, postsPerMinute: Math.max(1, parseInt(e.target.value||'1')) })} />
                  </div>
                  <div>
                    <label className="form-label">Max Posts in Window</label>
                    <input type="number" className="form-input" value={burstConfig.maxTotal} min={1} max={999} onChange={(e)=>setBurstConfig({ ...burstConfig, maxTotal: Math.max(1, parseInt(e.target.value||'1')) })} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="form-label">Preload Minutes (optional)</label>
                    <input type="number" className="form-input" value={burstConfig.preloadMinutes ?? ''} min={0} onChange={(e)=>setBurstConfig({ ...burstConfig, preloadMinutes: e.target.value===''? undefined : Math.max(0, parseInt(e.target.value||'0')) })} />
                  </div>
                  <div>
                    <label className="form-label">Scrape Limit (optional)</label>
                    <input type="number" className="form-input" value={burstConfig.scrapeLimit ?? ''} min={0} onChange={(e)=>setBurstConfig({ ...burstConfig, scrapeLimit: e.target.value===''? undefined : Math.max(0, parseInt(e.target.value||'0')) })} />
                  </div>
                </div>
                <div>
                  <label className="form-label">Platforms</label>
                  <div className="multi-select">
                    {['instagram','youtube'].map(p => (
                      <div key={p} className={`platform-chip ${burstConfig.platforms.includes(p) ? 'selected' : ''}`} onClick={()=>{
                        setBurstConfig(prev => ({ ...prev, platforms: prev.platforms.includes(p) ? prev.platforms.filter(x=>x!==p) : [...prev.platforms, p] }))
                      }}>
                        {p==='instagram'?'📷 Instagram':'▶️ YouTube'}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  When Burst Mode is ON, caps override the daily/hourly limits during the window. Scheduling stays atomic + no duplicate posts (visual hash).
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn btn-save" onClick={saveSettings}>
              💾 Save Autopilot Settings
            </button>
            <button className="action-btn btn-run" onClick={runNow}>
              🔄 Run Now
            </button>

            {!autopilotActive ? (
              <button className="action-btn btn-start" onClick={startAutopilot}>
                ▶️ Start Autopilot
              </button>
            ) : (
              <button className="action-btn btn-stop" onClick={stopAutopilot}>
                ⏹️ Stop Autopilot
              </button>
            )}
            <button className="action-btn btn-run" onClick={()=>setQueueOpen(true)}>
              🔁 Open Smart Queue
            </button>
          </div>
        </div>
      </div>

      {/* Smart Queue Drawer */}
      <div 
        className={`queue-overlay ${queueOpen ? 'show' : ''}`} 
        onClick={toggleQueue}
      ></div>
      <div className={`queue-drawer ${queueOpen ? 'open' : ''}`}>
        <div className="queue-header">
          <h2 className="queue-title">🔁 Smart Autopilot Queue</h2>
          <p className="queue-subtitle">AI-optimized videos ready for automatic posting</p>
          <button className="close-queue" onClick={toggleQueue}>×</button>
        </div>
        
        <div className="queue-content">
          {isLoading ? (
            <div className="loading-state" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem',
              color: '#64748b'
            }}>
              <div className="loading-spinner" style={{
                width: '40px',
                height: '40px',
                border: '3px solid #f3f4f6',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }}></div>
              <p style={{ margin: 0, fontSize: '16px' }}>Loading queue...</p>
            </div>
          ) : queueData.length === 0 ? (
            <div className="empty-state" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3rem',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <div className="empty-icon" style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#1f2937' }}>No videos in queue</h3>
              <p style={{ margin: 0, fontSize: '16px' }}>Run autopilot to populate the queue with optimized content</p>
            </div>
          ) : (
            queueData.map((video, index) => (
              <div key={video.id || index} className="video-card">
                <div className="video-preview" style={{
                  width: '100px',
                  height: '180px',
                  borderRadius: '8px',
                  position: 'relative',
                  border: '2px solid #2d3748',
                  overflow: 'hidden'
                }}>
                  <VideoThumbnail 
                    videoUrl={video.s3Url} 
                    style={{
                      width: '100%',
                      height: '100%'
                    }}
                  />
                  <div className="play-overlay" style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    fontSize: '24px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}>▶</div>
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    right: '8px',
                    color: 'white',
                    fontSize: '12px',
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                  }}>
                    {video.platform === 'instagram' ? '📷' : '▶️'} {video.platform}
                  </div>
                  {video.engagement && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {video.engagement.toLocaleString()} 💖
                    </div>
                  )}
                </div>
                
                <div className="video-caption">
                  <div className="caption-label">🤖 AI-Generated Caption</div>
                  <div className="caption-text">
                    {video.caption || 'No caption available'}
                  </div>
                </div>
            
                <div className="video-metadata">
                  <div className="metadata-item">
                    <div className="metadata-label">📱 Platform</div>
                    <div className="platform-badges">
                      <span className={`platform-badge ${video.platform === 'instagram' ? 'badge-instagram' : 'badge-youtube'}`}>
                        {video.platform === 'instagram' ? '📷 Instagram' : '▶️ YouTube'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="metadata-item">
                    <div className="metadata-label">⏰ Scheduled Time</div>
                    <div className="metadata-value">
                      {video.scheduledAt 
                        ? new Date(video.scheduledAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          }) + ' (Peak Hour)'
                        : 'Not scheduled'
                      }
                    </div>
                  </div>
                  
                  <div className="metadata-item">
                    <div className="metadata-label">📊 Status</div>
                    <span className={`status-badge status-${video.status || 'unknown'}`}>
                      {video.status ? video.status.charAt(0).toUpperCase() + video.status.slice(1) : 'Unknown'}
                    </span>
                  </div>

                  <div className="metadata-item">
                    <div className="metadata-label">🎯 Original Engagement</div>
                    <div className="metadata-value">
                      {video.engagement ? video.engagement.toLocaleString() : 'N/A'}
                    </div>
                  </div>

                  <div className="metadata-item">
                    <div className="metadata-label">☁️ S3 Video</div>
                    <div className="metadata-value" style={{ fontSize: '10px', fontFamily: 'monospace' }}>
                      {video.s3Url ? '✅ Uploaded' : '❌ Missing'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}


          {/* Post Now Button */}
          {queueData.length > 0 && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button className="action-btn btn-run" onClick={postNow}>
                🚀 Post Now
              </button>
              <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                This will immediately post all queued videos to their platforms
              </div>
            </div>
          )}

          {/* AI Note */}
          <div className="ai-note">
            <p className="ai-note-text">
              All scheduling, captioning, and audio are optimized by AI using peak engagement trends and platform algorithms.
            </p>
          </div>
        </div>
      </div>

      {/* Why Skipped Modal */}
      {whyOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setWhyOpen(false)}>
          <div style={{ background: '#101010', border: '1px solid #333', borderRadius: 12, width: 'min(800px, 90vw)', maxHeight: '80vh', overflow: 'auto', color: '#fff', padding: 16 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>Why Skipped? (dev)</h3>
              <button onClick={() => setWhyOpen(false)} style={{ fontSize: 18, background: 'transparent', border: 'none', color: '#aaa', cursor: 'pointer' }}>×</button>
            </div>
            {whyLoading && <div>Running similarity check...</div>}
            {whyError && <div style={{ color: '#f87171' }}>{whyError}</div>}
            {whyResult && (
              <div>
                <div style={{ marginBottom: 12, fontSize: 12, color: '#aaa' }}>
                  Candidate — visualHash: {whyResult?.candidate?.visualHash || 'n/a'} • captionNorm: {(whyResult?.candidate?.captionNorm || '').slice(0, 60)}
                </div>
                <div>
                  {(whyResult?.recentSample || []).map((r: any, idx: number) => (
                    <div key={idx} style={{ borderTop: '1px solid #222', padding: '8px 0', fontSize: 13 }}>
                      <div>Posted: {r.postedAt ? new Date(r.postedAt).toLocaleString('en-US', { timeZone: 'America/Chicago' }) + ' CT' : 'unknown'}</div>
                      <div>visualHash: {r.visualHash || 'n/a'}</div>
                      <div>captionNorm: {(r.captionNorm || '').slice(0, 80)}</div>
                      <div>audioKey: {r.audioKey || 'n/a'}</div>
                      <div>durationSec: {r.durationSec ?? 'n/a'}</div>
                      <div style={{ marginTop: 4, color: '#9ca3af' }}>
                        distances → visualHamming: {r?.distances?.visualHamming ?? 'n/a'} • captionSim: {typeof r?.distances?.captionSim === 'number' ? r.distances.captionSim.toFixed(2) : 'n/a'} • Δdur: {r?.distances?.durationDelta ?? 'n/a'}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10 }}>
                  Decision: {whyResult?.decision?.duplicate ? 'Duplicate' : 'Allowed'} {whyResult?.decision?.reason ? `(${whyResult.decision.reason})` : ''}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}