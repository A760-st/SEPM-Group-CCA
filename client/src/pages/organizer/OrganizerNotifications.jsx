import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { mockBackend } from '../../services/mockBackend';
import { formatDateTime } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { Bell, CheckCheck, CheckCircle2 } from 'lucide-react';

export default function OrganizerNotifications() {
  const { user } = useAuth();
  const { markNotificationRead, showToast } = useNotifications();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifs() {
      if (!user?.id) return;
      try {
        const res = await mockBackend.getNotifications(user.id);
        if (res.success) setNotifications(res.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    loadNotifs();
  }, [user?.id]);

  const handleMarkAllRead = async () => {
    for (const n of notifications) {
      if (!n.read) await markNotificationRead(n.id);
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Organizer Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500">
            Registration milestones, venue confirmations, and administrative notices
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <Button variant="outline" size="sm" icon={CheckCheck} onClick={handleMarkAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <EmptyState
            title="No notifications"
            description="You have no pending alerts or messages."
            icon={Bell}
          />
        </Card>
      ) : (
        <Card noPadding>
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  !n.read ? 'bg-amber-50/20' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h4>
                      {!n.read && (
                        <span className="text-[10px] bg-amber-600 text-white font-semibold px-2 py-0.2 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                    <p className="text-[11px] text-slate-400 pt-1">
                      {formatDateTime(n.created_at)}
                    </p>
                  </div>
                </div>

                {!n.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-500 hover:text-amber-700"
                    onClick={async () => {
                      await markNotificationRead(n.id);
                      setNotifications((prev) =>
                        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                      );
                    }}
                  >
                    Mark Read
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
