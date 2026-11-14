import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { formatDate, formatTime } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  Calendar,
  CalendarPlus,
  Users,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function OrganizerOverview() {
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
        if (regRes.success) {
          // Filter registrations belonging to organizer's events
          const orgEventIds = new Set(evRes.data.map((e) => e.id));
          const orgRegs = regRes.data.filter((r) => orgEventIds.has(r.event_id));
          setRegistrations(orgRegs);
        }
      } catch (err) {
        console.error('Failed to load organizer dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.id]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading organizer dashboard..." />;
  }

  const publishedEvents = events.filter((e) => e.status === 'PUBLISHED');
  const draftEvents = events.filter((e) => e.status === 'DRAFT');
  const totalRegistrations = registrations.length;

  return (
    <div className="space-y-8">
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Organizer Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Manage your faculty events, monitor registrations, and verify participant attendance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/organizer/events/create">
            <Button variant="primary" size="sm" icon={CalendarPlus}>
              Create New Event
            </Button>
          </Link>
          <Link to="/organizer/participants">
            <Button variant="outline" size="sm" icon={Users}>
              Manage Participants
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            <span className="text-2xl font-bold text-slate-900">{events.length}</span>
            <span className="text-xs text-slate-500 ml-2">Assigned</span>
          </div>
        </Card>

        <Card className="hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Published Events
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">{publishedEvents.length}</span>
            <span className="text-xs text-slate-500 ml-2">Active</span>
          </div>
        </Card>

        <Card className="hover:border-amber-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Draft Events
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600">{draftEvents.length}</span>
            <span className="text-xs text-slate-500 ml-2">Unpublished</span>
          </div>
        </Card>

        <Card className="hover:border-indigo-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Participants
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-indigo-600">{totalRegistrations}</span>
            <span className="text-xs text-slate-500 ml-2">Students</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: My Events & Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Assigned Events Overview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Managed Events</h2>
              <p className="text-xs text-slate-500">Live overview of your upcoming sessions</p>
            </div>
            <Link to="/organizer/events" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all ({events.length})
            </Link>
          </div>

          {events.length === 0 ? (
            <Card>
              <EmptyState
                title="No events created yet"
                description="Start by creating your first college event. You can save as draft or publish directly."
                actionLabel="Create Event"
                onAction={() => window.location.assign('/organizer/events/create')}
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {events.slice(0, 4).map((event) => (
                <Card key={event.id} className="hover:border-slate-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={event.status}>{event.status}</Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(event.start_time)}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {event.venue?.name || 'Campus Venue'}
                        </span>
                        <span>
                          {event.registered_count || 0} / {event.max_participants} seats filled
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/organizer/participants?event_id=${event.id}`}>
                        <Button variant="outline" size="sm" icon={Users}>
                          Roster
                        </Button>
                      </Link>
                      <Link to={`/organizer/events/edit/${event.id}`}>
                        <Button variant="secondary" size="sm">
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Recent Registrations Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Registrations</h2>
            <Link to="/organizer/participants" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View roster
            </Link>
          </div>

          <Card noPadding>
            {registrations.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No student registrations yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {registrations.slice(0, 5).map((reg) => (
                  <div key={reg.id} className="p-3.5 text-xs hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{reg.student?.name}</span>
                      <Badge variant={reg.status} size="sm">
                        {reg.status}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {reg.event?.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Enrolled: {formatDate(reg.registered_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
