import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registrationService } from '../../services/registrationService';
import { certificateService } from '../../services/certificateService';
import { eventService } from '../../services/eventService';
import { formatDate, formatTime } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import {
  Calendar,
  ClipboardList,
  Award,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

export default function StudentOverview() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      if (!user?.id) return;
      try {
        const [regRes, certRes, eventRes] = await Promise.all([
          registrationService.getRegistrations({ student_id: user.id }),
          certificateService.getCertificates({ student_id: user.id }),
          eventService.getEvents({ status: 'PUBLISHED' }),
        ]);

        if (regRes.success) setRegistrations(regRes.data);
        if (certRes.success) setCertificates(certRes.data);
        if (eventRes.success) setUpcomingEvents(eventRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load student overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [user?.id]);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading student workspace..." />;
  }

  const activeRegistrations = registrations.filter((r) => r.status === 'CONFIRMED');
  const completedRegistrations = registrations.filter((r) => r.status === 'ATTENDED');
  const upcomingRegisteredEvents = registrations
    .filter((r) => r.status === 'CONFIRMED' && r.event)
    .map((r) => ({ ...r.event, registration_id: r.id, registered_at: r.registered_at }));

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
          <CalendarDays className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enrolled Student Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
            Department of {user?.department || 'Engineering'} | Student ID: <span className="font-mono font-semibold text-white">{user?.student_id_number || 'STU-2024-001'}</span>
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/student/events">
              <Button variant="secondary" size="sm" icon={Calendar}>
                Browse All Campus Events
              </Button>
            </Link>
            <Link to="/student/registrations">
              <Button variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                View My Registrations
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-blue-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Registrations
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{registrations.length}</span>
            <span className="text-xs text-slate-500 ml-2">Lifetime</span>
          </div>
        </Card>

        <Card className="hover:border-emerald-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Events
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">{activeRegistrations.length}</span>
            <span className="text-xs text-slate-500 ml-2">Active seats</span>
          </div>
        </Card>

        <Card className="hover:border-purple-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed Events
            </span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-purple-600">{completedRegistrations.length}</span>
            <span className="text-xs text-slate-500 ml-2">Attended</span>
          </div>
        </Card>

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
            <span className="text-2xl font-bold text-amber-600">{certificates.length}</span>
            <span className="text-xs text-slate-500 ml-2">Available</span>
          </div>
        </Card>
      </div>

      {/* Main Grid: Upcoming Registered Events & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Registered Events */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Your Upcoming Registered Events
              </h2>
              <p className="text-xs text-slate-500">
                Events you have secured an official seat for
              </p>
            </div>
            <Link to="/student/registrations" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>

          {upcomingRegisteredEvents.length === 0 ? (
            <Card>
              <EmptyState
                title="No active registrations"
                description="You are not registered for any upcoming events yet. Explore open events and reserve your slot!"
                actionLabel="Explore Open Events"
                onAction={() => window.location.assign('/student/events')}
              />
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingRegisteredEvents.map((event) => (
                <Card key={event.id} className="hover:border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="CONFIRMED">Registered</Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(event.start_time)} at {formatTime(event.start_time)}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">{event.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {event.venue?.name || 'Campus Venue'}
                        </span>
                        <span>•</span>
                        <span>Registered on {formatDate(event.registered_at)}</span>
                      </div>
                    </div>

                    <Link to={`/student/events/${event.id}`}>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Available Certificates & Quick Shortcuts */}
        <div className="space-y-6">
          <Card
            title="My Certificates"
            subtitle="Verified academic credentials"
            action={
              <Link to="/student/certificates" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                View all ({certificates.length})
              </Link>
            }
          >
            {certificates.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                No certificates issued yet. Certificates are issued by the Administration after attending completed events.
              </p>
            ) : (
              <div className="space-y-3">
                {certificates.slice(0, 2).map((cert) => (
                  <div
                    key={cert.id}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-2"
                  >
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5 text-amber-700">
                        <Award className="w-4 h-4 shrink-0" />
                        <span className="text-xs font-semibold truncate">
                          {cert.certificate_no}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">
                        {cert.event?.title || 'Campus Event Certificate'}
                      </p>
                    </div>
                    <Link to="/student/certificates">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Notice Card */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs text-blue-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-blue-900">
              <Calendar className="w-4 h-4 text-blue-600" />
              Attendance Policy Reminder
            </h4>
            <p className="leading-relaxed text-blue-800">
              Attendance is recorded at the start of each event by the event organizer. To qualify for a verified certificate of completion, ensure you are marked as attended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
