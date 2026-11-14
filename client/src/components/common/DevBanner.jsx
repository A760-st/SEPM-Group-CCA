import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { apiClient, mockBackend } from '../../services/apiClient';
import { ROLES } from '../../types';
import { Terminal, Users, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DevBanner() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, switchDemoRole, logout } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();
  const isMock = apiClient.isMockMode();

  if (collapsed) {
    return (
      <div className="fixed bottom-3 right-3 z-50">
        <button
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-mono shadow-lg hover:bg-slate-800 border border-slate-700 transition cursor-pointer"
          title="Open SEPM Development Controller"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>Dev Controller</span>
        </button>
      </div>
    );
  }

  const handleSwitch = async (role) => {
    const newUser = await switchDemoRole(role);
    if (newUser) {
      showToast(`Switched persona to ${newUser.name} (${role})`, 'info');
      if (role === ROLES.STUDENT) navigate('/student');
      else if (role === ROLES.ORGANIZER) navigate('/organizer');
      else if (role === ROLES.ADMIN) navigate('/admin');
    }
  };

  const handleResetData = () => {
    mockBackend.reset();
    showToast('Mock database reset to default seed records.', 'success');
    window.location.reload();
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-1.5 px-4 font-sans sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isMock ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isMock ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
          </span>
          <span className="font-semibold text-white tracking-wide">
            {isMock ? 'MOCK API MODE (Port 5173)' : 'LIVE REST MODE'}
          </span>
          <span className="text-slate-400 hidden sm:inline">
            | Backend Target: <code className="text-slate-300">{apiClient.getBaseUrl()}</code>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-800/80 rounded-md p-0.5 border border-slate-700">
            <span className="text-[11px] text-slate-400 px-1.5 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              Quick Switch:
            </span>
            <button
              onClick={() => handleSwitch(ROLES.STUDENT)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                user?.role === ROLES.STUDENT
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => handleSwitch(ROLES.ORGANIZER)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                user?.role === ROLES.ORGANIZER
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Organizer
            </button>
            <button
              onClick={() => handleSwitch(ROLES.ADMIN)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                user?.role === ROLES.ADMIN
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              Admin
            </button>
          </div>

          {isMock && (
            <button
              onClick={handleResetData}
              title="Reset mock local storage data"
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setCollapsed(true)}
            title="Minimize dev controller"
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
