import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { eventService } from '../../services/eventService';
import { venueService } from '../../services/venueService';
import { EVENT_CATEGORIES, EVENT_STATUS } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import {
  CalendarPlus,
  ArrowLeft,
  Save,
  CheckCircle,
  Building,
  Clock,
  Users,
  AlertCircle,
  Info,
} from 'lucide-react';

export default function CreateEvent() {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
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
    async function loadVenues() {
      try {
        const res = await venueService.getVenues();
        if (res.success && res.data.length > 0) {
          const activeVenues = res.data.filter((v) => v.status === 'ACTIVE');
          setVenues(activeVenues);
          if (activeVenues.length > 0) {
            setFormData((prev) => ({
              ...prev,
              venue_id: activeVenues[0].id,
              max_participants: Math.min(50, activeVenues[0].capacity),
            }));
          }
        }
      } catch {
        showToast('Failed to load campus venues.', 'error');
      } finally {
        setLoadingVenues(false);
      }
    }
    loadVenues();
  }, [showToast]);

  const selectedVenue = venues.find((v) => v.id === formData.venue_id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'venue_id') {
        const v = venues.find((venue) => venue.id === value);
        if (v && parseInt(updated.max_participants, 10) > v.capacity) {
          updated.max_participants = v.capacity;
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (submitStatus) => {
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Please enter an event title.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Please provide an event description.');
      return;
    }
    if (!formData.venue_id) {
      setFormError('Please select a campus venue.');
      return;
    }
    if (!formData.start_time || !formData.end_time) {
      setFormError('Please configure event start and end dates/times.');
      return;
    }
    if (new Date(formData.end_time) <= new Date(formData.start_time)) {
      setFormError('Event end time must be after the start time.');
      return;
    }
    if (!formData.registration_deadline) {
      setFormError('Please specify a registration deadline.');
      return;
    }
    if (new Date(formData.registration_deadline) > new Date(formData.start_time)) {
      setFormError('Registration deadline must be before or at event start time.');
      return;
    }

    const participants = parseInt(formData.max_participants, 10);
    if (isNaN(participants) || participants <= 0) {
      setFormError('Maximum participants must be a positive number.');
      return;
    }

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
        status: submitStatus || formData.status,
        organizer_id: user?.id,
        // Convert local datetime to ISO 8601
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        registration_deadline: new Date(formData.registration_deadline).toISOString(),
      };

      await eventService.createEvent(payload, user?.id);
      showToast(
        submitStatus === EVENT_STATUS.PUBLISHED
          ? 'Event published successfully!'
          : 'Event draft saved.',
        'success'
      );
      navigate('/organizer/events');
    } catch (err) {
      setFormError(err.message || 'Failed to create event.');
    } finally {
      setSubmitting(false);
    }
  };

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
          Create New College Event
        </h1>
        <p className="text-xs text-slate-500">
          Define event schedules, select certified campus facilities, and set participant limits
        </p>
      </div>

      <Card className="border-slate-200">
        {formError && (
          <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {/* Basic Info */}
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
              placeholder="e.g. HackGenesis 2026: 24-Hour Hackathon"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Event Category"
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
                    label: `${v.name} (Max Capacity: ${v.capacity})`,
                  }))}
                  value={formData.venue_id}
                  onChange={handleChange}
                />
                {selectedVenue && (
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Location: {selectedVenue.location}</span>
                  </p>
                )}
              </div>
            </div>

            <Textarea
              label="Full Description & Agenda"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail the agenda, requirements, prerequisites, and learning outcomes..."
            />
          </div>

          {/* Schedule & Timing */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              2. Timing & Deadlines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date & Time"
                name="start_time"
                type="datetime-local"
                required
                value={formData.start_time}
                onChange={handleChange}
              />

              <Input
                label="End Date & Time"
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
                helperText="Students cannot register after this timestamp."
              />

              <div>
                <Input
                  label="Maximum Allowed Participants"
                  name="max_participants"
                  type="number"
                  min="1"
                  max={selectedVenue?.capacity || 1000}
                  required
                  value={formData.max_participants}
                  onChange={handleChange}
                  helperText={
                    selectedVenue
                      ? `Must not exceed venue capacity of ${selectedVenue.capacity}`
                      : 'Subject to venue maximum'
                  }
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link to="/organizer/events">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>

            <Button
              type="button"
              variant="secondary"
              size="md"
              icon={Save}
              loading={submitting}
              onClick={() => handleSubmit(EVENT_STATUS.DRAFT)}
            >
              Save as Draft
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              icon={CheckCircle}
              loading={submitting}
              onClick={() => handleSubmit(EVENT_STATUS.PUBLISHED)}
            >
              Publish Event Live
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
