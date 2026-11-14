import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { eventService } from '../../services/eventService';
import { formatDate, formatTime } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Calendar,
  CalendarPlus,
  Search,
  Users,
  Edit,
  Trash2,
  XCircle,
  CheckCircle,
  Eye,
  Clock,
  MapPin,
  AlertTriangle,
} from 'lucide-react';

export default function MyEvents() {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Cancel Event Modal
  const [eventToCancel, setEventToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvents = async () => {
    if (!user?.id) return;
    try {
      const res = await eventService.getEvents({ organizer_id: user.id });
      if (res.success) setEvents(res.data);
    } catch {
      showToast('Failed to load events.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user?.id]);

  const handlePublish = async (eventId) => {
    try {
      await eventService.publishEvent(eventId);
      showToast('Event has been published successfully!', 'success');
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to publish event.', 'error');
    }
  };

  const handleConfirmCancel = async () => {
    if (!eventToCancel) return;
    if (!cancelReason.trim()) {
      showToast('Please provide a cancellation reason.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await eventService.cancelEvent(eventToCancel.id, cancelReason);
      showToast('Event has been marked as cancelled.', 'info');
      setEventToCancel(null);
      setCancelReason('');
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to cancel event.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading events..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Events
          </h1>
          <p className="text-xs text-slate-500">
            Manage your faculty events, edit details, and track participant rosters
          </p>
        </div>

        <Link to="/organizer/events/create">
          <Button variant="primary" size="sm" icon={CalendarPlus}>
            Create New Event
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search by event title..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Events Table / Card List */}
      {filteredEvents.length === 0 ? (
        <Card>
          <EmptyState
            title="No events found"
            description="You have no events matching the selected status or search filter."
            actionLabel="Create Event"
            onAction={() => window.location.assign('/organizer/events/create')}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:border-slate-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={event.status}>{event.status}</Badge>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      {event.category || 'General'}
                    </span>
                    {event.status === 'CANCELLED' && event.cancel_reason && (
                      <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                        Reason: {event.cancel_reason}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(event.start_time)} at {formatTime(event.start_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {event.venue?.name || 'Assigned Venue'}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      {event.registered_count || 0} / {event.max_participants} registered
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                  <Link to={`/student/events/${event.id}`}>
                    <Button variant="outline" size="sm" icon={Eye}>
                      Preview
                    </Button>
                  </Link>

                  <Link to={`/organizer/participants?event_id=${event.id}`}>
                    <Button variant="secondary" size="sm" icon={Users}>
                      Roster ({event.registered_count || 0})
                    </Button>
                  </Link>

                  {event.status === 'DRAFT' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => handlePublish(event.id)}
                    >
                      Publish
                    </Button>
                  )}

                  {event.status !== 'CANCELLED' && (
                    <Link to={`/organizer/events/edit/${event.id}`}>
                      <Button variant="outline" size="sm" icon={Edit}>
                        Edit
                      </Button>
                    </Link>
                  )}

                  {event.status === 'PUBLISHED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      onClick={() => {
                        setEventToCancel(event);
                        setCancelReason('');
                      }}
                    >
                      Cancel Event
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Event with Reason Modal */}
      {eventToCancel && (
        <Modal
          isOpen={Boolean(eventToCancel)}
          onClose={() => setEventToCancel(null)}
          title="Cancel Campus Event"
          subtitle={eventToCancel.title}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEventToCancel(null)}
                disabled={actionLoading}
              >
                Keep Event
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
                loading={actionLoading}
              >
                Confirm Event Cancellation
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Cancelling this event will notify all registered students and release venue reservations.
              </span>
            </div>

            <Textarea
              label="Mandatory Reason for Cancellation"
              required
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Unforeseen academic scheduling conflict, severe weather..."
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
