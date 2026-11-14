import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES, COLLEGE_CONFIG } from '../../types';
import Badge from '../common/Badge';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  ClipboardList,
  Award,
  Bell,
  User,
  Settings,
  LogOut,
  Users,
  MapPin,
  BarChart3,
  CalendarCheck,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileCheck,
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Student Links
  const studentLinks = [
    { name: 'Overview', to: '/student', icon: LayoutDashboard, end: true },
    { name: 'Browse Events', to: '/student/events', icon: Calendar },
    { name: 'My Registrations', to: '/student/registrations', icon: ClipboardList },
    { name: 'My Certificates', to: '/student/certificates', icon: Award },
    { name: 'Notifications', to: '/student/notifications', icon: Bell },
    { name: 'My Profile', to: '/student/profile', icon: User },
    { name: 'Settings', to: '/student/settings', icon: Settings },
  ];

  // Organizer Links
  const organizerLinks = [
    { name: 'Overview', to: '/organizer', icon: LayoutDashboard, end: true },
    { name: 'My Events', to: '/organizer/events', icon: Calendar },
    { name: 'Create Event', to: '/organizer/events/create', icon: CalendarPlus },
    { name: 'Participants', to: '/organizer/participants', icon: Users },
    { name: 'Event Reports', to: '/organizer/reports', icon: BarChart3 },
    { name: 'Notifications', to: '/organizer/notifications', icon: Bell },
    { name: 'My Profile', to: '/organizer/profile', icon: User },
    { name: 'Settings', to: '/organizer/settings', icon: Settings },
  ];

  // Admin Links
  const adminLinks = [
    { name: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { name: 'User Management', to: '/admin/users', icon: Users },
    { name: 'Event Management', to: '/admin/events', icon: CalendarCheck },
    { name: 'Venue Management', to: '/admin/venues', icon: MapPin },
    { name: 'Registration Management', to: '/admin/registrations', icon: ClipboardList },
    { name: 'Certificate Management', to: '/admin/certificates', icon: FileCheck },
    { name: 'Reports and Analytics', to: '/admin/reports', icon: BarChart3 },
    { name: 'Notifications', to: '/admin/notifications', icon: Bell },
    { name: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  const currentLinks =
    role === ROLES.ADMIN
      ? adminLinks
      : role === ROLES.ORGANIZER
      ? organizerLinks
      : studentLinks;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800 ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                CampusEvent
              </h1>
              <p className="text-[11px] text-slate-400 truncate">
                {COLLEGE_CONFIG.shortName} Portal
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer hidden md:block"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Role Pill Banner */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Role Workspace
            </span>
            <Badge variant={role} size="sm">
              {role}
            </Badge>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-y-auto">
        {currentLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={collapsed ? item.name : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 transition-colors" />
              {!collapsed && <span className="truncate">{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Current User Snapshot & Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-lg bg-slate-800/60">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 font-semibold text-xs flex items-center justify-center border border-blue-400/30 shrink-0">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
