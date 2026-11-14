import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { mockBackend } from '../../services/mockBackend';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import { Bell, Send, Megaphone, CheckCircle2 } from 'lucide-react';

export default function AdminNotifications() {
  const { showToast } = useNotifications();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('all');
  const [type, setType] = useState('ANNOUNCEMENT');
  const [sending, setSending] = useState(false);

  const handleBroadcast = (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Please provide an announcement title and message.', 'error');
      return;
    }

    setSending(true);
    setTimeout(() => {
      const db = mockBackend.getDb();
      const newNotif = {
        id: `n-${Date.now()}`,
        userId: targetAudience,
        title,
        message,
        type,
        read: false,
        created_at: new Date().toISOString(),
      };
      db.notifications.unshift(newNotif);
      mockBackend.saveDb(db);

      showToast('Institutional announcement broadcast successfully!', 'success');
      setTitle('');
      setMessage('');
      setSending(false);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Campus Announcements & Bulletins
        </h1>
        <p className="text-xs text-slate-500">
          Broadcast official event updates, schedule revisions, or semester-wide notifications
        </p>
      </div>

      <Card title="Broadcast Institutional Announcement" subtitle="Delivered to student and faculty dashboards">
        <form onSubmit={handleBroadcast} className="space-y-4">
          <Input
            label="Announcement Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Symphony 2026 Registration Deadline Extended"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Recipient Audience"
              options={[
                { value: 'all', label: 'All Campus Members (Global)' },
                { value: 'STUDENT', label: 'Enrolled Students Only' },
                { value: 'ORGANIZER', label: 'Faculty Organizers Only' },
              ]}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />

            <Select
              label="Notice Priority / Type"
              options={[
                { value: 'ANNOUNCEMENT', label: 'Standard Announcement' },
                { value: 'SUCCESS', label: 'Milestone / Success' },
                { value: 'INFO', label: 'General Information' },
              ]}
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>

          <Textarea
            label="Message Content"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide concise, relevant details regarding the campus event policy or schedule..."
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              loading={sending}
            >
              Broadcast Bulletin
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
