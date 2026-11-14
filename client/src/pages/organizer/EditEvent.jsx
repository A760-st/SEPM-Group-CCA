import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { eventService } from '../../services/eventService';
import { venueService } from '../../services/venueService';
import { EVENT_CATEGORIES, EVENT_STATUS } from '../../types';
import { toDatetimeLocal } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, Save, Building, AlertCircle } from 'lucide-react';

export default function EditEvent() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    venue_id: '',
    category: EVENT_CATEGORIES[0],
    start_time: '',
    end_time: '',
    registration_deadline: '',
    max_participants: 50,
    status: EVENT_STATUS.DRAFT,
  });

  useEffect(() => {
    async function loadEventAndVenues() {
      try {
        const [evRes, vnRes] = await Promise.all([
          eventService.getEventById(id),
          venueService.getVenues(),
        ]);

        if (vnRes.success) setVenues(vnRes.data);

        if (evRes.success) {
          const ev = evRes.data;
          setFormData({
            title: ev.title || '',
            description: ev.description || '',
            venue_id: ev.venue_id || '',
            category: ev.category || EVENT_CATEGORIES[0],
            start_time: toDatetimeLocal(ev.start_time),
            end_time: toDatetimeLocal(ev.end_time),
            registration_deadline: toDatetimeLocal(ev.registration_deadline),
            max_participants: ev.max_participants || 50,
            status: ev.status || EVENT_STATUS.DRAFT,
          });
        }
      } catch (err) {
        showToast('Failed to load event for editing.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadEventAndVenues();
  }, [id, showToast]);

  const selectedVenue = venues.find((v) => v.id === formData.venue_id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Please enter an event title.');
      return;
    }
    if (!formData.venue_id) {
      setFormError('Please select a campus venue.');
      return;
    }

    const participants = parseInt(formData.max_participants, 10);
    if (selectedVenue && participants > selectedVenue.capacity) {
      setFormError(
        `Participant limit (${participants}) exceeds the maximum venue capacity (${selectedVenue.capacity}) for ${selectedVenue.name}.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        max_participants: participants,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        registration_deadline: new Date(formData.registration_deadline).toISOString(),
      };

      await eventService.updateEvent(id, payload);
      showToast('Event updated successfully.', 'success');
      navigate('/organizer/events');
    } catch (err) {
      setFormError(err.message || 'Failed to update event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading event editor..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/organizer/events"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Events</span>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Edit Event Details
        </h1>
        <p className="text-xs text-slate-500">
          Update event schedules, change status, or modify seat allocations
        </p>
      </div>

      <Card className="border-slate-200">
        {formError && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              1. Event Overview
            </h3>

            <Input
              label="Event Title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Event Status"
                name="status"
                options={[
                  { value: 'DRAFT', label: 'Draft' },
                  { value: 'PUBLISHED', label: 'Published' },
                  { value: 'COMPLETED', label: 'Completed' },
                  { value: 'CANCELLED', label: 'Cancelled' },
                ]}
                value={formData.status}
                onChange={handleChange}
              />

              <Select
                label="Category"
                name="category"
                options={EVENT_CATEGORIES}
                value={formData.category}
                onChange={handleChange}
              />

              <div>
                <Select
                  label="Campus Venue"
                  name="venue_id"
                  required
                  options={venues.map((v) => ({
                    value: v.id,
                    label: `${v.name} (Cap: ${v.capacity})`,
                  }))}
                  value={formData.venue_id}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Textarea
              label="Description & Agenda"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Timing & Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Time"
                name="start_time"
                type="datetime-local"
                required
                value={formData.start_time}
                onChange={handleChange}
              />

              <Input
                label="End Time"
                name="end_time"
                type="datetime-local"
                required
                value={formData.end_time}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Registration Deadline"
                name="registration_deadline"
                type="datetime-local"
                required
                value={formData.registration_deadline}
                onChange={handleChange}
              />

              <Input
                label="Maximum Participants"
                name="max_participants"
                type="number"
                min="1"
                required
                value={formData.max_participants}
                onChange={handleChange}
                helperText={selectedVenue ? `Venue capacity: ${selectedVenue.capacity}` : ''}
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <Link to="/organizer/events">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Save}
              loading={submitting}
            >
              Save Event Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
