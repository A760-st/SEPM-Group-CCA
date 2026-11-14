import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  Building,
  Award,
  Users,
} from 'lucide-react';

export default function ReportsAnalytics() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await reportService.getAnalyticsReports();
        if (res.success) setReports(res.data);
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen message="Crunching institutional analytics..." />;
  }

  const {
    eventsByStatus = [],
    registrationsOverTime = [],
    popularEvents = [],
    departmentDistribution = [],
    venueUtilization = [],
  } = reports || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Institutional Reports & Analytics
        </h1>
        <p className="text-xs text-slate-500">
          Interactive metrics covering event lifecycle, registration trends, facility utilization, and academic turnout
        </p>
      </div>

      {/* Row 1: Registrations Over Time & Events By Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registrations Trend */}
        <Card
          className="lg:col-span-2"
          title="Student Registration Growth Trend"
          subtitle="Monthly event registration volume across the academic term"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationsOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#2563eb"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#regGradient)"
                  name="Enrolled Students"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Events By Status Pie */}
        <Card title="Events by Status" subtitle="Distribution across lifecycle states">
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={eventsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {eventsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {eventsByStatus.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value} events</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 2: Most Popular Events & Venue Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Events */}
        <Card
          title="Most Popular Events"
          subtitle="Top events ranked by total student registrations"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={popularEvents}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="registrations" fill="#4f46e5" name="Registrations" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Venue Utilization */}
        <Card
          title="Campus Venue Utilization Rate"
          subtitle="Capacity occupancy percentage across facilities"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={venueUtilization}
                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="rate" fill="#059669" name="Utilization Rate" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Row 3: Department Distribution */}
      <Card
        title="Student Engagement by Department"
        subtitle="Distribution of participants across engineering and management schools"
      >
        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={departmentDistribution}
              margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dept" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#d97706" name="Enrolled Students" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
