import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  Calendar,
  Award,
} from 'lucide-react';

export default function OrganizerReports() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user?.id) return;
      try {
        const [evRes, regRes] = await Promise.all([
          eventService.getEvents({ organizer_id: user.id }),
          registrationService.getRegistrations({}),
        ]);

        if (evRes.success) setEvents(evRes.data);
        if (regRes.success && evRes.success) {
          const myEventIds = new Set(evRes.data.map((e) => e.id));
          const filtered = regRes.data.filter((r) => myEventIds.has(r.event_id));
          setRegistrations(filtered);
        }
      } catch (err) {
        console.error('Failed to load organizer reports:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Compiling event analytics..." />;
  }

  // Capacity vs Registered data for bar chart
  const capacityData = events.map((e) => ({
    name: e.title.length > 20 ? e.title.slice(0, 18) + '...' : e.title,
    registered: e.registered_count || 0,
    capacity: e.max_participants,
  }));

  // Attendance breakdown
  const attendedCount = registrations.filter((r) => r.status === 'ATTENDED').length;
  const confirmedCount = registrations.filter((r) => r.status === 'CONFIRMED').length;
  const cancelledCount = registrations.filter((r) => r.status === 'CANCELLED').length;

  const attendanceData = [
    { name: 'Attended (Verified)', value: attendedCount || 1, color: '#8b5cf6' },
    { name: 'Confirmed (Registered)', value: confirmedCount || 1, color: '#3b82f6' },
    { name: 'Cancelled', value: cancelledCount || 0, color: '#f43f5e' },
  ];

  const overallTurnout =
    registrations.length > 0
      ? Math.round((attendedCount / registrations.length) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Event Reports & Attendance Analytics
        </h1>
        <p className="text-xs text-slate-500">
          Performance metrics, venue capacity occupancy, and turnout ratios for your events
        </p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Registrations
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{registrations.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Across all your managed events</p>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Verified Attendance
          </div>
          <div className="text-2xl font-bold text-purple-600 mt-2">{attendedCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Students marked present</p>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Turnout Rate
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{overallTurnout}%</div>
          <p className="text-[11px] text-slate-400 mt-1">Attendance conversion ratio</p>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Cancellations
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">{cancelledCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">Released slots</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Capacity vs Registered */}
        <Card
          className="lg:col-span-2"
          title="Event Seat Occupancy vs Maximum Capacity"
          subtitle="Comparison of enrolled participants against venue limit"
        >
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={capacityData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="registered" fill="#3b82f6" name="Registered Students" radius={[4, 4, 0, 0]} />
                <Bar dataKey="capacity" fill="#cbd5e1" name="Max Capacity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Right Col: Attendance Distribution */}
        <Card
          title="Participant Status Breakdown"
          subtitle="Attendance ratio overview"
        >
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
