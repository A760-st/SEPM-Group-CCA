import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportService } from '../../services/reportService';
import { eventService } from '../../services/eventService';
import { userService } from '../../services/userService';
import { formatDate } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  Calendar,
  ClipboardList,
  Award,
  ShieldCheck,
  Building,
  UserPlus,
  ArrowRight,
  TrendingUp,
  MapPin,
  FileCheck,
} from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [statsRes, evRes, userRes] = await Promise.all([
          reportService.getDashboardStats(),
          eventService.getEvents({}),
          userService.getUsers({}),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (evRes.success) setRecentEvents(evRes.data.slice(0, 4));
        if (userRes.success) setRecentUsers(userRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading administrative oversight..." />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Administration Overview
          </h1>
          <p className="text-xs text-slate-500">
            Institutional oversight of users, campus events, physical venues, and certificate credentials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/reports">
            <Button variant="outline" size="sm" icon={TrendingUp}>
              Analytics & Reports
            </Button>
          </Link>
          <Link to="/admin/users">
            <Button variant="primary" size="sm" icon={UserPlus}>
              Manage Accounts
            </Button>
          </Link>
        </div>
      </div>

      {/* Top KPI Cards (8 Metrics as requested by prompt) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="hover:border-blue-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Users
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{stats?.users?.total || 0}</span>
            <span className="text-xs text-slate-500 ml-2">Accounts</span>
          </div>
        </Card>

        {/* Students */}
        <Card className="hover:border-indigo-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Students
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-indigo-600">
              {stats?.users?.students || 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">Enrolled</span>
          </div>
        </Card>

        {/* Organizers */}
        <Card className="hover:border-amber-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Organizers
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600">
              {stats?.users?.organizers || 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">Faculty</span>
          </div>
        </Card>

        {/* Administrators */}
        <Card className="hover:border-rose-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Administrators
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-600">{stats?.users?.admins || 0}</span>
            <span className="text-xs text-slate-500 ml-2">Staff</span>
          </div>
        </Card>

        {/* Total Events */}
        <Card className="hover:border-blue-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Events
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{stats?.events?.total || 0}</span>
            <span className="text-xs text-slate-500 ml-2">Created</span>
          </div>
        </Card>

        {/* Published Events */}
        <Card className="hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Published Events
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">
              {stats?.events?.published || 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">Active</span>
          </div>
        </Card>

        {/* Total Registrations */}
        <Card className="hover:border-purple-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Registrations
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-600">
              {stats?.registrations?.total || 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">Bookings</span>
          </div>
        </Card>

        {/* Certificates Issued */}
        <Card className="hover:border-amber-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Certificates Issued
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600">
              {stats?.certificates?.total || 0}
            </span>
            <span className="text-xs text-slate-500 ml-2">Verified</span>
          </div>
        </Card>
      </div>

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Campus Events Oversight</h2>
            <Link to="/admin/events" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Manage all events
            </Link>
          </div>

          <Card noPadding>
            <div className="divide-y divide-slate-100">
              {recentEvents.map((ev) => (
                <div key={ev.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 truncate">
                    <div className="flex items-center gap-2">
                      <Badge variant={ev.status} size="sm">
                        {ev.status}
                      </Badge>
                      <span className="text-slate-400">{formatDate(ev.start_time)}</span>
                    </div>
                    <p className="font-bold text-slate-900 truncate">{ev.title}</p>
                    <p className="text-slate-500 text-[11px] truncate">
                      Venue: {ev.venue?.name || 'TBD'} | Organizer: {ev.organizer?.name || 'Faculty'}
                    </p>
                  </div>

                  <Link to="/admin/events">
                    <Button variant="ghost" size="sm">
                      Inspect
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* User Accounts Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent User Registrations</h2>
            <Link to="/admin/users" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              Manage users
            </Link>
          </div>

          <Card noPadding>
            <div className="divide-y divide-slate-100">
              {recentUsers.map((u) => (
                <div key={u.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
                      {u.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-slate-400 text-[11px]">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={u.role} size="sm">
                      {u.role}
                    </Badge>
                    <Badge variant={u.status} size="sm">
                      {u.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
