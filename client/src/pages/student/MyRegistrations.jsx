import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, formatTime, isPastDate } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  Award,
  ArrowRight,
  Filter,
} from 'lucide-react';

export default function MyRegistrations() {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'UPCOMING' | 'PAST' | 'CANCELLED'

  const [selectedRegToCancel, setSelectedRegToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchRegistrations = async () => {
    if (!user?.id) return;
    try {
      const res = await registrationService.getRegistrations({ student_id: user.id });
      if (res.success) setRegistrations(res.data);
    } catch (err) {
      showToast('Failed to load registrations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [user?.id]);

  const handleCancel = async () => {
    if (!selectedRegToCancel) return;
    setCancelLoading(true);
    try {
      await registrationService.cancelRegistration(selectedRegToCancel.id, user.id);
      showToast('Registration cancelled successfully.', 'info');
      setSelectedRegToCancel(null);
      await fetchRegistrations();
    } catch (err) {
      showToast(err.message || 'Failed to cancel registration.', 'error');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'CANCELLED') return reg.status === 'CANCELLED';
    if (activeTab === 'UPCOMING') {
      return (
        reg.status === 'CONFIRMED' &&
        reg.event &&
        !isPastDate(reg.event.end_time)
      );
    }
    if (activeTab === 'PAST') {
      return (
        reg.status === 'ATTENDED' ||
        (reg.event && isPastDate(reg.event.end_time) && reg.status !== 'CANCELLED')
      );
    }
    return true;
  });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading your registrations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My Event Registrations
        </h1>
        <p className="text-xs text-slate-500">
          Track all campus sessions, workshops, and competitions you have enrolled in
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {[
          { key: 'ALL', label: `All Registrations (${registrations.length})` },
          {
            key: 'UPCOMING',
            label: `Upcoming (${registrations.filter((r) => r.status === 'CONFIRMED' && !isPastDate(r.event?.end_time)).length})`,
          },
          {
            key: 'PAST',
            label: `Completed / Past (${registrations.filter((r) => r.status === 'ATTENDED' || (isPastDate(r.event?.end_time) && r.status !== 'CANCELLED')).length})`,
          },
          {
            key: 'CANCELLED',
            label: `Cancelled (${registrations.filter((r) => r.status === 'CANCELLED').length})`,
          },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Registration List */}
      {filteredRegistrations.length === 0 ? (
        <Card>
          <EmptyState
            title="No registrations found"
            description={
              activeTab === 'CANCELLED'
                ? 'You have not cancelled any event registrations.'
                : 'You have no event registrations in this category.'
            }
            actionLabel={activeTab !== 'CANCELLED' ? 'Browse Campus Events' : undefined}
            onAction={() => window.location.assign('/student/events')}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRegistrations.map((reg) => {
            const event = reg.event;
            const canCancel = reg.status === 'CONFIRMED' && event && !isPastDate(event.start_time);

            return (
              <Card key={reg.id} className="hover:border-slate-300">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={reg.status}>{reg.status}</Badge>
                      {event?.category && (
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {event.category}
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        Registered on {formatDate(reg.registered_at)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {event?.title || 'Event Record'}
                    </h3>

                    {event && (
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(event.start_time)} at {formatTime(event.start_time)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {event.venue?.name || 'Campus Venue'}
                        </span>
                        {reg.certificate && (
                          <span className="flex items-center gap-1 text-amber-700 font-medium">
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            Certificate Issued ({reg.certificate.certificate_no})
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start lg:self-center">
                    {event && (
                      <Link to={`/student/events/${event.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    )}

                    {canCancel && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setSelectedRegToCancel(reg)}
                      >
                        Cancel
                      </Button>
                    )}

                    {reg.certificate && (
                      <Link to="/student/certificates">
                        <Button variant="secondary" size="sm" icon={Award}>
                          Certificate
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(selectedRegToCancel)}
        onClose={() => setSelectedRegToCancel(null)}
        onConfirm={handleCancel}
        title="Confirm Registration Cancellation"
        message={`Are you sure you want to cancel your seat for "${selectedRegToCancel?.event?.title}"? This cannot be undone once confirmed.`}
        confirmText="Confirm Cancellation"
        confirmVariant="danger"
        loading={cancelLoading}
      />
    </div>
  );
}
