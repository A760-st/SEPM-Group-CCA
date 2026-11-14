import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, formatTime } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Textarea from '../../components/common/Textarea';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Calendar,
  Search,
  Eye,
  Edit,
  XCircle,
  CheckCircle,
  Users,
  Clock,
  MapPin,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

export default function EventManagement() {
  const { showToast } = useNotifications();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Cancel Modal
  const [eventToCancel, setEventToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Detail Modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const fetchEvents = async () => {
    try {
      const res = await eventService.getEvents({});
      if (res.success) setEvents(res.data);
    } catch {
      showToast('Failed to load campus events.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handlePublish = async (eventId) => {
    try {
      await eventService.publishEvent(eventId);
      showToast('Event published successfully by administrator.', 'success');
      fetchEvents();
    } catch (err) {
      showToast(err.message || 'Failed to publish event.', 'error');
    }
  };

  const handleConfirmCancel = async () => {
    if (!eventToCancel) return;
    if (!cancelReason.trim()) {
      showToast('Mandatory administrative cancellation reason is required.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await eventService.cancelEvent(eventToCancel.id, `[Admin Action] ${cancelReason}`);
      showToast('Event cancelled and audit note logged.', 'info');
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
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading campus events oversight..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Campus Event Oversight
          </h1>
          <p className="text-xs text-slate-500">
            System-wide oversight across all departmental and faculty event organizers
          </p>
        </div>

        <Link to="/organizer/events/create">
          <Button variant="primary" size="sm" icon={Calendar}>
            Create College Event
          </Button>
        </Link>
      </div>

      {/* Filter Card */}
      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by title or organizer name..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'ALL', label: 'All Event Statuses' },
                { value: 'PUBLISHED', label: 'Published' },
                { value: 'DRAFT', label: 'Draft' },
                { value: 'COMPLETED', label: 'Completed' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card>
          <EmptyState
            title="No events found"
            description="No events match your current filter criteria."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {paginatedEvents.map((event) => (
            <Card key={event.id} className="hover:border-slate-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={event.status}>{event.status}</Badge>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      {event.category || 'General'}
                    </span>
                    <span className="text-xs text-slate-500">
                      Organizer: <strong>{event.organizer?.name || 'Faculty Member'}</strong>
                    </span>
                    {event.status === 'CANCELLED' && event.cancel_reason && (
                      <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                        {event.cancel_reason}
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

                {/* Admin Actions */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => setSelectedEvent(event)}
                  >
                    View
                  </Button>

                  <Link to={`/student/events/${event.id}`}>
                    <Button variant="outline" size="sm">
                      Public View
                    </Button>
                  </Link>

                  <Link to={`/organizer/events/edit/${event.id}`}>
                    <Button variant="outline" size="sm" icon={Edit}>
                      Edit
                    </Button>
                  </Link>

                  {event.status === 'DRAFT' && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => handlePublish(event.id)}
                    >
                      Authorize & Publish
                    </Button>
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
                      Emergency Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredEvents.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      {/* Cancellation Modal */}
      {eventToCancel && (
        <Modal
          isOpen={Boolean(eventToCancel)}
          onClose={() => setEventToCancel(null)}
          title="Administrative Event Cancellation"
          subtitle={eventToCancel.title}
          footer={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEventToCancel(null)}
                disabled={actionLoading}
              >
                Close
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmCancel}
                loading={actionLoading}
              >
                Cancel Event & Notify All
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>
                As an Administrator, cancelling this event will immediately update the database, mark participant registrations as cancelled, and release venue bookings.
              </span>
            </div>

            <Textarea
              label="Audit Cancellation Reason"
              required
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="e.g. Venue emergency maintenance, academic schedule overlap..."
            />
          </div>
        </Modal>
      )}

      {/* Event Details View Modal */}
      {selectedEvent && (
        <Modal
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          title="Event Record Overview"
          subtitle={`Event ID: ${selectedEvent.id}`}
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedEvent(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Event Title:</span>
              <span className="font-bold text-slate-900">{selectedEvent.title}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Organizer:</span>
              <span className="font-medium text-slate-800">
                {selectedEvent.organizer?.name} ({selectedEvent.organizer?.email})
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Status:</span>
              <Badge variant={selectedEvent.status} size="sm">
                {selectedEvent.status}
              </Badge>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Venue:</span>
              <span className="text-slate-800">
                {selectedEvent.venue?.name} (Cap: {selectedEvent.venue?.capacity})
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Max Participants:</span>
              <span className="font-bold text-slate-900">{selectedEvent.max_participants}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Registered Students:</span>
              <span className="text-emerald-700 font-bold">
                {selectedEvent.registered_count || 0}
              </span>
            </div>
            <div className="py-2">
              <span className="text-slate-500 block mb-1">Description:</span>
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedEvent.description}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
