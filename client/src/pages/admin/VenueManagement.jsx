import React, { useState, useEffect } from 'react';
import { venueService } from '../../services/venueService';
import { useNotifications } from '../../context/NotificationContext';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  MapPin,
  Building,
  Plus,
  Edit,
  Users,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export default function VenueManagement() {
  const { showToast } = useNotifications();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [venueToEdit, setVenueToEdit] = useState(null);
  const [venueToToggle, setVenueToToggle] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [newVenue, setNewVenue] = useState({
    name: '',
    location: '',
    capacity: 100,
  });

  const fetchVenues = async () => {
    try {
      const res = await venueService.getVenues();
      if (res.success) setVenues(res.data);
    } catch {
      showToast('Failed to load campus venues.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const handleAddVenue = async (e) => {
    e.preventDefault();
    if (!newVenue.name.trim() || !newVenue.location.trim()) {
      showToast('Please provide a venue name and location.', 'error');
      return;
    }

    const cap = parseInt(newVenue.capacity, 10);
    if (isNaN(cap) || cap <= 0) {
      showToast('Capacity must be a positive number.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      await venueService.createVenue({ ...newVenue, capacity: cap });
      showToast('Campus venue added successfully.', 'success');
      setShowAddModal(false);
      setNewVenue({ name: '', location: '', capacity: 100 });
      fetchVenues();
    } catch (err) {
      showToast(err.message || 'Failed to add venue.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditVenue = async (e) => {
    e.preventDefault();
    if (!venueToEdit) return;

    setActionLoading(true);
    try {
      await venueService.updateVenue(venueToEdit.id, venueToEdit);
      showToast('Venue updated successfully.', 'success');
      setVenueToEdit(null);
      fetchVenues();
    } catch (err) {
      showToast(err.message || 'Failed to update venue.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!venueToToggle) return;
    setActionLoading(true);
    try {
      await venueService.toggleVenueStatus(venueToToggle.id);
      showToast(
        `Venue ${venueToToggle.status === 'ACTIVE' ? 'deactivated' : 'activated'}.`,
        'info'
      );
      setVenueToToggle(null);
      fetchVenues();
    } catch (err) {
      showToast(err.message || 'Failed to toggle venue status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredVenues = venues.filter(
    (v) =>
      !searchQuery ||
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading campus venues..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Venue Management
          </h1>
          <p className="text-xs text-slate-500">
            Manage college auditoriums, innovation halls, labs, and authorized room capacities
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowAddModal(true)}
        >
          Add Campus Venue
        </Button>
      </div>

      {/* Search */}
      <Card noPadding>
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by venue name or location..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span className="text-xs text-slate-500">
            Total <strong>{venues.length}</strong> facilities registered
          </span>
        </div>
      </Card>

      {/* Grid of Venues */}
      {filteredVenues.length === 0 ? (
        <Card>
          <EmptyState
            title="No venues found"
            description="No campus venues matched your search."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="flex flex-col justify-between hover:border-slate-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={venue.status}>{venue.status}</Badge>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    {venue.capacity} Seats Max
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {venue.name}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{venue.location}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit}
                  onClick={() => setVenueToEdit(venue)}
                >
                  Edit
                </Button>

                <Button
                  variant={venue.status === 'ACTIVE' ? 'ghost' : 'secondary'}
                  size="sm"
                  className={venue.status === 'ACTIVE' ? 'text-rose-600' : 'text-emerald-700'}
                  onClick={() => setVenueToToggle(venue)}
                >
                  {venue.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Venue Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Campus Venue"
        subtitle="Register a new academic hall or outdoor amphitheatre"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={actionLoading}
              onClick={handleAddVenue}
            >
              Add Venue
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddVenue} className="space-y-4">
          <Input
            label="Venue Facility Name"
            required
            value={newVenue.name}
            onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
            placeholder="e.g. Science Block Seminar Hall 3"
          />

          <Input
            label="Campus Location / Directions"
            required
            value={newVenue.location}
            onChange={(e) => setNewVenue({ ...newVenue, location: e.target.value })}
            placeholder="e.g. Engineering Wing B, 2nd Floor Room 204"
          />

          <Input
            label="Maximum Fire & Seating Capacity"
            type="number"
            min="10"
            required
            value={newVenue.capacity}
            onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })}
            helperText="Maximum allowed attendees according to campus safety guidelines."
          />
        </form>
      </Modal>

      {/* Edit Venue Modal */}
      {venueToEdit && (
        <Modal
          isOpen={Boolean(venueToEdit)}
          onClose={() => setVenueToEdit(null)}
          title="Edit Venue Details"
          subtitle={venueToEdit.name}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setVenueToEdit(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={actionLoading}
                onClick={handleEditVenue}
              >
                Save Updates
              </Button>
            </>
          }
        >
          <form onSubmit={handleEditVenue} className="space-y-4">
            <Input
              label="Venue Name"
              required
              value={venueToEdit.name}
              onChange={(e) => setVenueToEdit({ ...venueToEdit, name: e.target.value })}
            />

            <Input
              label="Location"
              required
              value={venueToEdit.location}
              onChange={(e) => setVenueToEdit({ ...venueToEdit, location: e.target.value })}
            />

            <Input
              label="Capacity"
              type="number"
              min="10"
              required
              value={venueToEdit.capacity}
              onChange={(e) => setVenueToEdit({ ...venueToEdit, capacity: e.target.value })}
            />
          </form>
        </Modal>
      )}

      {/* Toggle Venue Status Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(venueToToggle)}
        onClose={() => setVenueToToggle(null)}
        onConfirm={handleToggleStatus}
        title={venueToToggle?.status === 'ACTIVE' ? 'Deactivate Venue' : 'Activate Venue'}
        message={`Are you sure you want to ${
          venueToToggle?.status === 'ACTIVE' ? 'deactivate' : 'activate'
        } "${venueToToggle?.name}"? Inactive venues cannot be selected for new event bookings.`}
        confirmText={venueToToggle?.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        confirmVariant={venueToToggle?.status === 'ACTIVE' ? 'danger' : 'primary'}
        loading={actionLoading}
      />
    </div>
  );
}
