import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, formatTime, formatDateTime, isPastDate } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  User,
  Mail,
  ShieldCheck,
  Building,
  CalendarCheck,
  XCircle,
} from 'lucide-react';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [existingRegistration, setExistingRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const evRes = await eventService.getEventById(id);
        if (evRes.success) setEvent(evRes.data);

        if (user?.id) {
          const regRes = await registrationService.getRegistrations({
            event_id: id,
            student_id: user.id,
          });
          if (regRes.success && regRes.data.length > 0) {
            setExistingRegistration(regRes.data[0]);
          }
        }
      } catch (err) {
        showToast(err.message || 'Failed to load event details.', 'error');
      } finally {
        setLoading(false);
      }
    }
    fetchEventDetails();
  }, [id, user?.id, showToast]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/student/events/${id}`);
      return;
    }

    setActionLoading(true);
    try {
      const res = await registrationService.registerForEvent(id, user.id);
      showToast(res.message || 'Registration confirmed successfully!', 'success');
      setExistingRegistration(res.data);
      // Refresh event to get updated seat count
      const updated = await eventService.getEventById(id);
      if (updated.success) setEvent(updated.data);
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!existingRegistration) return;
    setActionLoading(true);
    try {
      await registrationService.cancelRegistration(existingRegistration.id, user.id);
      showToast('Your registration has been cancelled.', 'info');
      setExistingRegistration(null);
      setShowCancelModal(false);
      // Refresh event to update seats
      const updated = await eventService.getEventById(id);
      if (updated.success) setEvent(updated.data);
    } catch (err) {
      showToast(err.message || 'Failed to cancel registration.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-lg font-bold text-slate-800">Event Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">This event may have been removed or unpublished.</p>
        <Link to="/student/events" className="mt-4 inline-block">
          <Button variant="outline" size="sm" icon={ArrowLeft}>
            Back to Browse Events
          </Button>
        </Link>
      </div>
    );
  }

  const isDeadlinePassed = isPastDate(event.registration_deadline);
  const isFull = event.available_seats <= 0;
  const isConfirmed = existingRegistration && existingRegistration.status === 'CONFIRMED';
  const isAttended = existingRegistration && existingRegistration.status === 'ATTENDED';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/student/events"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Event Catalog</span>
        </Link>

        <Badge variant={event.status}>{event.status}</Badge>
      </div>

      {/* Main Event Overview Card */}
      <Card className="border-slate-200">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={event.status}>{event.category || 'General'}</Badge>
              {isConfirmed && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  You are registered for this event
                </span>
              )}
              {isAttended && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
                  <Award className="w-3.5 h-3.5" />
                  Attendance Verified
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {event.title}
            </h1>
          </div>

          {/* Description */}
          <div className="text-sm text-slate-700 leading-relaxed space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Event Overview & Agenda
            </h4>
            <p className="whitespace-pre-line">{event.description}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Schedule & Deadlines</span>
              </div>
              <div className="space-y-1 text-slate-600 pl-6">
                <p>
                  <strong>Starts:</strong> {formatDateTime(event.start_time)}
                </p>
                <p>
                  <strong>Ends:</strong> {formatDateTime(event.end_time)}
                </p>
                <p>
                  <strong>Registration Deadline:</strong>{' '}
                  <span className={isDeadlinePassed ? 'text-rose-600 font-semibold' : ''}>
                    {formatDateTime(event.registration_deadline)}
                  </span>
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Venue & Seating</span>
              </div>
              <div className="space-y-1 text-slate-600 pl-6">
                <p>
                  <strong>Venue:</strong> {event.venue?.name || 'Assigned Campus Facility'}
                </p>
                <p>
                  <strong>Location:</strong> {event.venue?.location || 'Central Campus'}
                </p>
                <p>
                  <strong>Capacity:</strong> {event.max_participants} max participants ({event.available_seats} remaining)
                </p>
              </div>
            </div>
          </div>

          {/* Organizer Card */}
          {event.organizer && (
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 shrink-0">
                  {event.organizer.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{event.organizer.name}</p>
                  <p className="text-slate-500">{event.organizer.department || 'Faculty Organizer'}</p>
                  <p className="text-slate-400 text-[11px]">{event.organizer.email}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="ORGANIZER" size="sm">
                  Authorized Faculty Organizer
                </Badge>
              </div>
            </div>
          )}

          {/* Registration Action Section */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900">
                  {event.available_seats} seats remaining
                </span>
                <span className="text-xs text-slate-500">
                  out of {event.max_participants} total
                </span>
              </div>
              {isDeadlinePassed ? (
                <p className="text-xs text-rose-600 font-medium mt-0.5">
                  Registration deadline has closed.
                </p>
              ) : isFull ? (
                <p className="text-xs text-amber-600 font-medium mt-0.5">
                  Event is currently at full capacity.
                </p>
              ) : (
                <p className="text-xs text-emerald-600 font-medium mt-0.5">
                  Open for verified student registration.
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isConfirmed ? (
                <>
                  <Button
                    variant="danger"
                    size="md"
                    onClick={() => setShowCancelModal(true)}
                    disabled={actionLoading}
                  >
                    Cancel Registration
                  </Button>
                  <Button variant="outline" size="md" disabled>
                    ✓ Registered
                  </Button>
                </>
              ) : isAttended ? (
                <Button variant="outline" size="md" disabled className="text-purple-700 bg-purple-50">
                  ✓ Attendance Verified
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleRegister}
                  loading={actionLoading}
                  disabled={isDeadlinePassed || isFull || event.status !== 'PUBLISHED'}
                  icon={CalendarCheck}
                >
                  {isDeadlinePassed
                    ? 'Registration Closed'
                    : isFull
                    ? 'At Capacity'
                    : 'Register for Event'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Confirmation Modal for Cancellation */}
      <ConfirmDialog
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelRegistration}
        title="Cancel Event Registration"
        message={`Are you sure you want to cancel your seat for "${event.title}"? Your seat will be returned to the available capacity pool.`}
        confirmText="Confirm Cancellation"
        confirmVariant="danger"
        loading={actionLoading}
      />
    </div>
  );
}
