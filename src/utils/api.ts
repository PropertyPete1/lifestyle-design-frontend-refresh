/**
 * API Configuration for Frontend-v2
 * Handles development and production API endpoints
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://lifestyle-design-backend-v2-clean.onrender.com';

/**
 * Creates full API endpoint URL
 */
export const apiUrl = (endpoint: string): string => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

/**
 * Common API endpoints
 */
export const API_ENDPOINTS = {
  // Chart and dashboard
  chartStatus: () => apiUrl('api/chart/status'),
  settings: () => apiUrl('api/settings'),
  
  // Autopilot - Fixed to match backend endpoints
  autopilotRun: () => apiUrl('api/autopilot/run'), // ✅ CORRECT AUTOPILOT ENDPOINT
  // Use clean backend manual-post endpoint which redirects to Post Now flow
  autopilotManualPost: () => apiUrl('api/autopilot/manual-post'),
  autopilotStatus: () => apiUrl('api/autopilot/status'),
  autopilotQueue: (limit?: number) => apiUrl(`api/autopilot/queue${limit ? `?limit=${limit}` : ''}`),
  schedulerStatus: () => apiUrl('api/scheduler/status'), // Enhanced scheduler endpoint
  
  // Activity and analytics
  analytics: () => apiUrl('api/analytics'), // UNIFIED ANALYTICS ENDPOINT
  activityFeed: (limit?: number) => apiUrl(`api/activity/feed${limit ? `?limit=${limit}` : ''}`),
  instagramAnalytics: () => apiUrl('api/instagram/analytics'),
  youtubeAnalytics: () => apiUrl('api/youtube/analytics'),

  // Audience heatmaps and scheduling
  audienceHeatmap: (platform: 'instagram' | 'youtube' = 'instagram', days?: number) => apiUrl(`api/audience-heatmap?platform=${platform}${days ? `&days=${days}` : ''}`),
  optimalTimes: (platform: 'instagram' | 'youtube' = 'instagram', days?: number) => apiUrl(`api/optimal-times?platform=${platform}${days ? `&days=${days}` : ''}`),
  performanceHeatmap: (platform: 'instagram' | 'youtube' = 'instagram', days?: number) => apiUrl(`api/performance-heatmap?platform=${platform}${days ? `&days=${days}` : ''}`),

  // Smart Scheduler + AI
  schedulerAutofill: (platform: 'instagram' | 'youtube' = 'instagram', maxPostsPerDay?: number) => apiUrl(`api/scheduler/autofill?platform=${platform}${maxPostsPerDay ? `&maxPostsPerDay=${maxPostsPerDay}` : ''}`),
  audienceSummary: (platform: 'instagram' | 'youtube' = 'instagram', days?: number) => apiUrl(`api/audience-summary?platform=${platform}${days ? `&days=${days}` : ''}`),
  
  // Events
  eventsRecent: (since: number) => apiUrl(`api/events/recent?since=${since}`),
  
  // Manual page endpoints
  manualVideos: () => apiUrl('api/manual/videos'),
  manualRefreshAudio: (videoId: string) => apiUrl(`api/manual/refresh-audio/${videoId}`),
  manualRefreshCaption: (videoId: string) => apiUrl(`api/manual/refresh-caption/${videoId}`),
  manualVideo: (videoId: string) => apiUrl(`api/manual/videos/${videoId}`),
  manualPostNow: (videoId: string) => apiUrl(`api/manual/post-now/${videoId}`),
  manualSchedule: (videoId: string) => apiUrl(`api/manual/schedule/${videoId}`),
  manualVideoStream: (videoId: string) => apiUrl(`api/manual/video/${videoId}/stream`),
  
  // Upload page endpoints
  uploadGoogleDrive: () => apiUrl('api/upload/google-drive'),
  uploadDragDrop: () => apiUrl('api/upload/drag-drop'),
  uploadRefreshCaption: () => apiUrl('api/upload/refresh-caption'),
  uploadGetRealInstagramCaptions: () => apiUrl('api/upload/get-real-instagram-captions'),
  uploadDirectVideo: () => apiUrl('api/upload/direct-video'),
  uploadDropboxStats: () => apiUrl('api/upload/dropbox-stats'),
  uploadSmartVideoAnalyze: () => apiUrl('api/upload/smart-video-analyze'),
  uploadDropboxFolder: () => apiUrl('api/upload/dropbox-folder'),
  uploadDropbox: () => apiUrl('api/upload/dropbox'),
  uploadSmartDriveSync: () => apiUrl('api/upload/smart-drive-sync'),
  uploadSyncDropbox: () => apiUrl('api/upload/sync-dropbox'),
} as const;

export default API_ENDPOINTS;