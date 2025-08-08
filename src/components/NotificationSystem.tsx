"use client";
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