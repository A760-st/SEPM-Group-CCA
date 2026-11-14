import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockBackend } from '../services/mockBackend';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [inAppNotifications, setInAppNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Show floating toast alert
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch in-app notifications for user
  const fetchInAppNotifications = useCallback(async (userId) => {
    if (!userId) return;
    try {
      const res = await mockBackend.getNotifications(userId);
      if (res.success) {
        setInAppNotifications(res.data);
        setUnreadCount(res.unreadCount);
      }
    } catch {
      // ignore
    }
  }, []);

  const markNotificationRead = useCallback(async (id) => {
    await mockBackend.markNotificationRead(id);
    setInAppNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        inAppNotifications,
        unreadCount,
        fetchInAppNotifications,
        markNotificationRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
