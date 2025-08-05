// hooks/useSettings.ts

import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://lifestyle-design-backend-v2-clean.onrender.com';

export type Settings = {
  instagramToken: string;
  youtubeClientId: string;
  youtubeClientSecret: string;
  s3AccessKey: string;
  s3SecretKey: string;
  mongoUri: string;
  openAiKey: string;
  schedulerEnabled: boolean;
  visualStyle: string;
  automationMode: string;
  postLimit: number;
  autopilotEnabled: boolean;
};

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/settings`);
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('❌ Failed to fetch settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updatedSettings: Partial<Settings>) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSettings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      setSettings({ ...settings, ...updatedSettings } as Settings);
    } catch (err) {
      console.error('❌ Save error:', err);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    error,
    saveSettings,
    reload: loadSettings,
  };
};
