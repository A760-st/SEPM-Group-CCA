import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Lock, LogOut } from 'lucide-react';

export default function OrganizerSettings() {
  const { logout } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Faculty password updated successfully.', 'success');
    }, 600);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Organizer Account Settings
        </h1>
        <p className="text-xs text-slate-500">
          Security controls and faculty workspace preferences
        </p>
      </div>

      <Card title="Security & Authentication" subtitle="Update faculty password">
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
            <Button type="submit" variant="primary" size="sm" loading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      <Card title="Faculty Session Management" subtitle="Terminate active organizer session">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-900">Signed in with Organizer Privileges</p>
            <p className="text-slate-500">
              Ensure all draft event updates are saved before ending your session.
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
