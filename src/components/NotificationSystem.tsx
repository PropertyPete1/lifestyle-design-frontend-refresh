import React, { useCallback, useEffect, useRef, useState } from 'react';

export type Toast = { id: number; message: string; type?: 'success' | 'error' | 'info' };

let enqueueToastExternal: ((t: Omit<Toast, 'id'>) => void) | null = null;
export const toast = {
  show: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    enqueueToastExternal?.({ message, type });
  }
};

const NotificationSystem: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(1);

  const enqueue = useCallback((t: Omit<Toast, 'id'>) => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    enqueueToastExternal = enqueue;
    return () => { enqueueToastExternal = null; };
  }, [enqueue]);

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16, display: 'flex', flexDirection: 'column', gap: 10, zIndex: 9999 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          padding: '10px 14px',
          borderRadius: 10,
          background: t.type === 'success' ? 'rgba(34,197,94,0.15)' : t.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(148,163,184,0.15)',
          border: `1px solid ${t.type === 'success' ? 'rgba(34,197,94,0.4)' : t.type === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(148,163,184,0.35)'}`,
          color: '#e5e7eb',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
        }}>
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;
// ✅ /frontend-v2/src/components/NotificationSystem.tsx

import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

interface NotificationSystemProps {
  onShowNotification?: (fn: (message: string, type?: 'success' | 'error' | 'info') => void) => void;
}

const NotificationSystem: React.FC<NotificationSystemProps> = ({ onShowNotification }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const notification: Notification = {
      id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: Date.now()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  useEffect(() => {
    onShowNotification?.(showNotification);
  }, [onShowNotification]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            p-4 rounded-lg shadow-lg transition-all duration-300 transform
            ${notification.type === 'success' ? 'bg-green-600 text-white' :
              notification.type === 'error' ? 'bg-red-600 text-white' :
              notification.type === 'info' ? 'bg-blue-600 text-white' :
              'bg-gray-600 text-white'}
            animate-pulse
          `}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;