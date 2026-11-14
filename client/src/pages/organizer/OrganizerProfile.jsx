import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { DEPARTMENTS } from '../../types';
import { formatDate } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';
import { User, Mail, Building, Save } from 'lucide-react';

export default function OrganizerProfile() {
  const { user, updateUserProfile } = useAuth();
  const { showToast } = useNotifications();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || DEPARTMENTS[0]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({ name, department });
      showToast('Organizer profile updated successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Faculty Organizer Profile
        </h1>
        <p className="text-xs text-slate-500">
          Academic credentials and departmental representation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center md:col-span-1">
          <div className="w-20 h-20 rounded-full bg-amber-600 text-white font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
            {user?.name?.charAt(0) || 'O'}
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-4 leading-tight">
            {user?.name}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
          <div className="mt-3">
            <Badge variant="ORGANIZER">{user?.role || 'ORGANIZER'}</Badge>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                Department
              </span>
              <span className="font-medium text-slate-800">{user?.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                Account Status
              </span>
              <span className="text-emerald-700 font-bold">ACTIVE (Verified Faculty)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
                Authorized Since
              </span>
              <span className="font-medium text-slate-800">{formatDate(user?.created_at)}</span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2" title="Edit Faculty Profile">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name & Title"
              icon={User}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              label="Institutional Email"
              icon={Mail}
              disabled
              value={user?.email || ''}
              helperText="Managed by the IT & Network Center."
            />

            <Select
              label="Assigned Department"
              options={DEPARTMENTS}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" variant="primary" size="md" loading={saving} icon={Save}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
