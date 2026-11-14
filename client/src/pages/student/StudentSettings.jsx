import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Lock, Bell, Shield, LogOut, CheckCircle2 } from 'lucide-react';

export default function StudentSettings() {
  const { logout } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notification Preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [certificateAlerts, setCertificateAlerts] = useState(true);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Password updated successfully.', 'success');
    }, 600);
  };

  const handleSavePreferences = () => {
    showToast('Notification preferences updated.', 'success');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage your password security, alert preferences, and account session
        </p>
      </div>

      {/* Security & Password */}
      <Card title="Security & Password" subtitle="Update your account password">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            icon={Lock}
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              icon={Lock}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Min 6 characters"
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm" loading={passwordLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Notification Preferences */}
      <Card title="Notification Preferences" subtitle="Choose what alerts you receive">
        <div className="space-y-4 text-xs">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
            />
            <div>
              <span className="font-semibold text-slate-900 block">
                Event Confirmation Emails
              </span>
              <span className="text-slate-500">
                Receive instant confirmation receipts when registering for campus events.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={deadlineReminders}
              onChange={(e) => setDeadlineReminders(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
            />
            <div>
              <span className="font-semibold text-slate-900 block">
                24-Hour Event Reminders
              </span>
              <span className="text-slate-500">
                Receive schedule reminders and venue directions the day before the event.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={certificateAlerts}
              onChange={(e) => setCertificateAlerts(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
            />
            <div>
              <span className="font-semibold text-slate-900 block">
                Certificate Issuance Alerts
              </span>
              <span className="text-slate-500">
                Get notified as soon as an administrator authorizes your completion certificate.
              </span>
            </div>
          </label>

          <div className="pt-2">
            <Button variant="secondary" size="sm" onClick={handleSavePreferences}>
              Save Alert Preferences
            </Button>
          </div>
        </div>
      </Card>

      {/* Session Management */}
      <Card title="Session & Logout" subtitle="Terminate your active session">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-900">Signed in as verified student</p>
            <p className="text-slate-500">
              Always log out when accessing CampusEvent on shared campus computer labs.
            </p>
          </div>
          <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
            Sign Out Now
          </Button>
        </div>
      </Card>
    </div>
  );
}
