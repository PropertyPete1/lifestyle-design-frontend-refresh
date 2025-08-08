// ZillowAppDashboard.tsx
// Production-ready dashboard UI styled to match the modern design
// Stack: React + TypeScript + Tailwind

import React, { useEffect, useState } from 'react';
import { 
  Home, Search, MessageCircle, FileText, Settings, 
  TestTube, BarChart3, RefreshCw, Download, Save,
  Zap, Filter, CheckCircle, XCircle, Clock, TrendingUp
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

type PropertyType = 'rent' | 'sale' | 'both';

interface BatchResult {
  address: string;
  status: 'sent' | 'failed';
  reason?: string;
  type: 'rent' | 'sale';
}

export default function ZillowAppDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [propertyType, setPropertyType] = useState<PropertyType>('both');
  const [zipCodes, setZipCodes] = useState<string>('');
  const [dailyMessageLimit, setDailyMessageLimit] = useState<number>(10);
  const [messageWindowStart, setMessageWindowStart] = useState('10:00');
  const [messageWindowEnd, setMessageWindowEnd] = useState('18:00');
  const [redFlagDetection, setRedFlagDetection] = useState(true);
  const [testMode, setTestMode] = useState(true);
  const [googleSheetUrl, setGoogleSheetUrl] = useState('');
  const [zillowEmail, setZillowEmail] = useState('');
  const [zillowPassword, setZillowPassword] = useState('');
  const [maxBatch, setMaxBatch] = useState<number>(10);
  const [autoMessage, setAutoMessage] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [showBatchResults, setShowBatchResults] = useState(false);

  // Sample stats for dashboard
  const [scraperStats] = useState({
    lastRun: '2 hours ago',
    totalListings: 47,
    messagesSentToday: 12,
    successRate: '78%'
  });

  const notify = (msg: string) => {
    if (typeof window === 'undefined') return;
    alert(msg);
  };

  const apiFetch = async (path: string, init?: RequestInit) => {
    if (!API_BASE) throw new Error('NEXT_PUBLIC_API_URL is not set');
    const res = await fetch(`${API_BASE}${path}`, init);
    if (!res.ok) {
      const t = await res.text().catch(() => '');
      throw new Error(`${res.status} ${res.statusText}: ${t}`);
    }
    return res.json().catch(() => ({}));
  };

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load settings on mount
  useEffect(() => {
    (async () => {
      try {
        const s = await apiFetch('/api/zillow/settings');
        if (s?.propertyType) setPropertyType(s.propertyType);
        if (Array.isArray(s?.zipCodes)) setZipCodes(s.zipCodes.join(','));
        if (typeof s?.dailyMessageLimit === 'number') setDailyMessageLimit(s.dailyMessageLimit);
        if (Array.isArray(s?.messageWindow) && s.messageWindow.length === 2) {
          setMessageWindowStart(s.messageWindow[0]);
          setMessageWindowEnd(s.messageWindow[1]);
        }
        if (typeof s?.redFlagDetection === 'boolean') setRedFlagDetection(s.redFlagDetection);
        if (typeof s?.testMode === 'boolean') setTestMode(s.testMode);
        if (s?.googleSheetUrl) setGoogleSheetUrl(s.googleSheetUrl);
        if (s?.zillowLogin?.email) setZillowEmail(s.zillowLogin.email);
        if (s?.zillowLogin?.password) setZillowPassword(s.zillowLogin.password);
      } catch {
        // ignore
      }
    })();
  }, []);

  // Save settings
  const saveSettings = async () => {
    try {
      setLoading(true);
      await apiFetch('/api/zillow/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyType,
          zipCodes: zipCodes.split(',').map((z) => z.trim()).filter(Boolean),
          dailyMessageLimit,
          messageWindow: [messageWindowStart, messageWindowEnd],
          redFlagDetection,
          testMode,
          googleSheetUrl,
          zillowLogin: {
            email: zillowEmail || undefined,
            password: zillowPassword || undefined,
          },
        }),
      });
      notify('✅ Settings saved');
    } catch (e: any) {
      notify(`❌ Failed to save settings\n${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  // Re-run scraper
  const runScraper = async () => {
    try {
      setLoading(true);
      const payload = {
        propertyType,
        zipCodes: zipCodes.split(',').map((z) => z.trim()).filter(Boolean),
      };
      const data = await apiFetch('/api/scraper/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      notify(`✅ Scraper run complete. Found: ${data?.count ?? 0} listings`);
    } catch (e: any) {
      notify(`❌ Scraper failed\n${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  // Send all messages
  const sendAll = async () => {
    if (!confirm(`Send messages to up to ${maxBatch} listings for "${propertyType}"?`)) return;
    try {
      setLoading(true);
      const data = await apiFetch('/api/message/send-batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyType, maxMessages: maxBatch }),
      });
      
      setBatchResults(data?.results || []);
      setShowBatchResults(true);
      
      const ok = (data?.results || []).filter((r: any) => r.status === 'sent').length;
      const fail = (data?.results || []).filter((r: any) => r.status !== 'sent').length;
      notify(`✅ Batch finished: ${ok} sent, ${fail} failed`);
    } catch (e: any) {
      notify(`❌ Batch failed\n${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  // Export logs to Google Sheets
  const exportLogs = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/logs/export-to-sheets', { method: 'POST' });
      notify(`✅ Exported ${data?.appended ?? 0} rows to Google Sheets`);
    } catch (e: any) {
      notify(`❌ Export failed\n${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'scraper', icon: Search, label: 'Scraper' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'logs', icon: FileText, label: 'Logs' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'test', icon: TestTube, label: 'Test Mode' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
  ];

  const ListingModeToggle = ({ className = "" }) => (
    <div className={`flex bg-gray-900 rounded-full p-1 ${className}`}>
      {[
        { id: 'rent', label: '🏠 Rent', color: 'from-blue-500 to-cyan-500' },
        { id: 'sale', label: '🏡 Sale', color: 'from-green-500 to-emerald-500' },
        { id: 'both', label: '🔁 Both', color: 'from-purple-500 to-pink-500' }
      ].map(mode => (
        <button
          key={mode.id}
          onClick={() => setPropertyType(mode.id as PropertyType)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            propertyType === mode.id
              ? `bg-gradient-to-r ${mode.color} text-white shadow-lg`
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <ListingModeToggle />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Last Run', value: scraperStats.lastRun, icon: Clock, color: 'from-blue-500 to-cyan-500' },
          { title: 'Total Listings', value: scraperStats.totalListings, icon: Home, color: 'from-green-500 to-emerald-500' },
          { title: 'Messages Today', value: scraperStats.messagesSentToday, icon: MessageCircle, color: 'from-purple-500 to-pink-500' },
          { title: 'Success Rate', value: scraperStats.successRate, icon: TrendingUp, color: 'from-orange-500 to-red-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} p-3 mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Scraper Controls</h3>
          <div className="space-y-4">
            <button 
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
              onClick={runScraper}
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Running...' : 'Re-Run Scraper'}
            </button>
            
            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-300">Auto Messages</span>
              <button
                onClick={() => setAutoMessage(!autoMessage)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  autoMessage ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  autoMessage ? 'translate-x-6' : 'translate-x-0.5'
                } mt-0.5`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
          </div>
          <div className="space-y-3">
            <button
              onClick={sendAll}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              {loading ? 'Sending...' : 'Send All Messages'}
            </button>
            <button
              onClick={exportLogs}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Exporting...' : 'Export Logs'}
            </button>
          </div>
        </div>
      </div>

      {/* Batch Results */}
      {showBatchResults && batchResults.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CheckCircle className="w-6 h-6 mr-2 text-green-400" />
            Batch Send Results
          </h3>
          <div className="space-y-3">
            {batchResults.map((result, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center">
                  {result.status === 'sent' ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mr-3" />
                  )}
                  <span className="text-white font-medium">{result.address}</span>
                  <span className={`ml-3 px-2 py-1 rounded text-xs font-medium ${
                    result.type === 'rent' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {result.type === 'rent' ? 'Rent' : 'Sale'}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${
                    result.status === 'sent' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.status === 'sent' ? '✅ Sent' : '❌ Failed'}
                  </span>
                  {result.reason && (
                    <p className="text-xs text-gray-400">{result.reason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const SettingsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <button
          onClick={saveSettings}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center"
        >
          <Save className="w-5 h-5 mr-2" />
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Default Search Mode</h3>
            <ListingModeToggle />
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Targeting</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Zip Codes (comma-separated)</label>
                <input
                  value={zipCodes}
                  onChange={(e) => setZipCodes(e.target.value)}
                  placeholder="78704, 78745"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Daily Message Limit</label>
                <input
                  type="number"
                  min={1}
                  value={dailyMessageLimit}
                  onChange={(e) => setDailyMessageLimit(Math.max(1, Number(e.target.value || 1)))}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Zillow Login</h3>
            <div className="space-y-4">
              <input
                type="email"
                value={zillowEmail}
                onChange={(e) => setZillowEmail(e.target.value)}
                placeholder="Zillow Email"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="password"
                value={zillowPassword}
                onChange={(e) => setZillowPassword(e.target.value)}
                placeholder="Password (optional)"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Message Window</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Start Time</label>
                <input
                  type="time"
                  value={messageWindowStart}
                  onChange={(e) => setMessageWindowStart(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">End Time</label>
                <input
                  type="time"
                  value={messageWindowEnd}
                  onChange={(e) => setMessageWindowEnd(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={redFlagDetection}
                  onChange={(e) => setRedFlagDetection(e.target.checked)}
                  className="mr-3 text-cyan-500"
                />
                Auto-detect Red Flags
              </label>
              <label className="flex items-center text-gray-300">
                <input
                  type="checkbox"
                  checked={testMode}
                  onChange={(e) => setTestMode(e.target.checked)}
                  className="mr-3 text-cyan-500"
                />
                Test Mode
              </label>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Google Sheets</h3>
            <input
              type="url"
              value={googleSheetUrl}
              onChange={(e) => setGoogleSheetUrl(e.target.value)}
              placeholder="Google Sheet URL for logs"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Batch Settings</h3>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Max Messages per Batch</label>
              <input
                type="number"
                min={1}
                value={maxBatch}
                onChange={(e) => setMaxBatch(Math.max(1, Number(e.target.value || 1)))}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardContent />;
      case 'settings': return <SettingsContent />;
      default: return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-['Space_Grotesk',sans-serif]">
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-gray-900/90 backdrop-blur-sm border-r border-gray-800 z-50 transition-all duration-300 ${
        isMobile ? (sidebarCollapsed ? '-translate-x-full' : 'w-64') : (sidebarCollapsed ? 'w-16' : 'w-64')
      }`}>
        <div className="p-6">
          <div className="flex items-center mb-8">
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Zillow Assistant
                </h2>
                <p className="text-xs text-gray-400">FRBO + FSBO Ready</p>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${sidebarCollapsed ? '' : 'mr-3'} ${
                    activeTab === item.id ? 'text-cyan-400' : 'group-hover:text-white'
                  }`} />
                  {!sidebarCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-6 w-6 h-6 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-300"
        >
          <div className={`w-2 h-2 border-t border-r border-gray-400 transform transition-transform duration-300 ${
            sidebarCollapsed ? 'rotate-45' : '-rotate-135'
          }`} />
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : (sidebarCollapsed ? 'ml-16' : 'ml-64')
      }`}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-gray-900/90 backdrop-blur-sm border-b border-gray-800 p-4 flex items-center justify-between">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white"
            >
              <div className="w-4 h-3 flex flex-col justify-between">
                <div className="w-full h-0.5 bg-current" />
                <div className="w-full h-0.5 bg-current" />
                <div className="w-full h-0.5 bg-current" />
              </div>
            </button>
            <h1 className="text-lg font-bold text-white">Zillow Assistant</h1>
            <div className="w-8" />
          </div>
        )}

        <div className="p-6 min-h-screen">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}


