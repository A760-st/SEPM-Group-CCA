import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { COLLEGE_CONFIG } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Settings, Save, LogOut, Building, ShieldCheck, Mail } from 'lucide-react';

export default function AdminSettings() {
  const { logout } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  // Branding Placeholders
  const [collegeName, setCollegeName] = useState(COLLEGE_CONFIG.name);
  const [shortName, setShortName] = useState(COLLEGE_CONFIG.shortName);
  const [supportEmail, setSupportEmail] = useState(COLLEGE_CONFIG.supportEmail);
  const [academicYear, setAcademicYear] = useState(COLLEGE_CONFIG.academicYear);

  // Policy Settings
  const [autoWaitlist, setAutoWaitlist] = useState(true);
  const [requireAttendanceForCert, setRequireAttendanceForCert] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Institutional portal settings saved successfully.', 'success');
    }, 400);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          College System Configuration
        </h1>
        <p className="text-xs text-slate-500">
          Editable institutional branding, accreditation parameters, and event policy rules
        </p>
      </div>

      {/* Institutional Branding */}
      <Card
        title="College Branding & Identity"
        subtitle="Configurable placeholders for institutional representation"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="College / University Name"
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Short Acronym / Code"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="e.g. AIT"
            />
            <Input
              label="Active Academic Term"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="e.g. 2026-2027"
            />
          </div>

          <Input
            label="Support & Inquiries Email"
            type="email"
            icon={Mail}
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
          />

          <div className="pt-2">
            <Button type="submit" variant="primary" size="sm" icon={Save} loading={saving}>
              Save Branding Configuration
            </Button>
          </div>
        </form>
      </Card>

      {/* System Policies */}
      <Card
        title="Event Registration & Certificate Policies"
        subtitle="Institutional attendance rules enforced across all events"
      >
        <div className="space-y-4 text-xs">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireAttendanceForCert}
              onChange={(e) => setRequireAttendanceForCert(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
            />
            <div>
              <span className="font-semibold text-slate-900 block">
                Strict Attendance Verification for Certificates
              </span>
              <span className="text-slate-500">
                Only students with confirmed attendance marked by the faculty organizer can receive an authorized certificate serial number.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoWaitlist}
              onChange={(e) => setAutoWaitlist(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
            />
            <div>
              <span className="font-semibold text-slate-900 block">
                Automatic Waitlist & Seat Reallocation
              </span>
              <span className="text-slate-500">
                Automatically release seat back to the general student pool when a registration is cancelled.
              </span>
            </div>
          </label>
        </div>
      </Card>

      {/* Administrator Session */}
      <Card title="Administrative Session" subtitle="Sign out of privileged administrator console">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-semibold text-slate-900">Signed in as Dean / System Administrator</p>
            <p className="text-slate-500">
              Audit logs are recorded for all administrative actions and role alterations.
            </p>
          </div>
          <Button variant="danger" size="sm" icon={LogOut} onClick={handleLogout}>
            Terminate Session
          </Button>
        </div>
      </Card>
    </div>
  );
}
