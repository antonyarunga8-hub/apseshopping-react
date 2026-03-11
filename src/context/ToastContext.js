import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  // Clear all timers on unmount to prevent setState on unmounted component
  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete timersRef.current[id];
    }, 300);
  }, []);

  const toast = useCallback(({ message, type = 'info', duration = 3000 }) => {
    const id = ++toastId;
    setToasts(prev => [...prev.slice(-4), { id, message, type, exiting: false }]);
    timersRef.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  const success = useCallback((msg, duration) => toast({ message: msg, type: 'success', duration }), [toast]);
  const error   = useCallback((msg, duration) => toast({ message: msg, type: 'error',   duration }), [toast]);
  const info    = useCallback((msg, duration) => toast({ message: msg, type: 'info',    duration }), [toast]);
  const warning = useCallback((msg, duration) => toast({ message: msg, type: 'warning', duration }), [toast]);

  const typeStyles = {
    success: { bg: '#22c55e', icon: '✅' },
    error:   { bg: '#ef4444', icon: '❌' },
    info:    { bg: '#2e6dce', icon: 'ℹ️' },
    warning: { bg: '#f59e0b', icon: '⚠️' },
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 99999,
        display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
      }}>
        {toasts.map(t => {
          const s = typeStyles[t.type] || typeStyles.info;
          return (
            <div key={t.id} style={{
              background: s.bg, color: '#fff',
              padding: '12px 18px', borderRadius: 8,
              fontSize: 13, fontWeight: 600,
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              display: 'flex', alignItems: 'center', gap: 10,
              maxWidth: 320, pointerEvents: 'auto',
              opacity: t.exiting ? 0 : 1,
              transform: t.exiting ? 'translateX(40px)' : 'translateX(0)',
              transition: 'opacity 0.3s, transform 0.3s',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => dismiss(t.id)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: 16, opacity: 0.8, padding: 0, marginLeft: 4 }}>
                ×
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
