import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { venueService } from '../../services/venueService';
import { EVENT_CATEGORIES, EVENT_STATUS } from '../../types';
import { formatDate, formatTime } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Calendar,
  Search,
  MapPin,
  Users,
  Clock,
  LayoutGrid,
  List,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function BrowseEvents() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [venueFilter, setVenueFilter] = useState('ALL');
  const [availabilityFilter, setAvailabilityFilter] = useState('ALL'); // 'ALL' | 'AVAILABLE' | 'FULL'
  const [sortBy, setSortBy] = useState('date');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    async function loadData() {
      try {
        const [evRes, vnRes] = await Promise.all([
          eventService.getEvents({ status: EVENT_STATUS.PUBLISHED }),
          venueService.getVenues(),
        ]);
        if (evRes.success) setEvents(evRes.data);
        if (vnRes.success) setVenues(vnRes.data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter logic
  const filteredEvents = events
    .filter((e) => {
      const matchCat = categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchVen = venueFilter === 'ALL' || e.venue_id === venueFilter;
      const matchAvail =
        availabilityFilter === 'ALL' ||
        (availabilityFilter === 'AVAILABLE' && e.available_seats > 0) ||
        (availabilityFilter === 'FULL' && e.available_seats === 0);
      const matchSearch =
        !searchQuery ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchVen && matchAvail && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.start_time) - new Date(b.start_time);
      if (sortBy === 'popularity') return (b.registered_count || 0) - (a.registered_count || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const totalPages = Math.ceil(filteredEvents.length / pageSize) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading event catalog..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Browse College Events
          </h1>
          <p className="text-xs text-slate-500">
            Explore academic, technical, cultural, and sports events across the campus
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition cursor-pointer ${
              viewMode === 'list'
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <Card noPadding>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Search by title or keyword..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />

            <Select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'ALL', label: 'All Categories' },
                ...EVENT_CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
            />

            <Select
              value={venueFilter}
              onChange={(e) => {
                setVenueFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'ALL', label: 'All Campus Venues' },
                ...venues.map((v) => ({ value: v.id, label: v.name })),
              ]}
            />

            <Select
              value={availabilityFilter}
              onChange={(e) => {
                setAvailabilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'ALL', label: 'All Availability' },
                { value: 'AVAILABLE', label: 'Seats Open Only' },
                { value: 'FULL', label: 'At Capacity' },
              ]}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span>Sort by:</span>
              <button
                onClick={() => setSortBy('date')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  sortBy === 'date' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-slate-100'
                }`}
              >
                Upcoming Date
              </button>
              <button
                onClick={() => setSortBy('popularity')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  sortBy === 'popularity' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-slate-100'
                }`}
              >
                Popularity
              </button>
              <button
                onClick={() => setSortBy('title')}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  sortBy === 'title' ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-slate-100'
                }`}
              >
                Alphabetical
              </button>
            </div>

            <div>
              Showing <strong>{filteredEvents.length}</strong> matching event{filteredEvents.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </Card>

      {/* Main Events List / Grid */}
      {paginatedEvents.length === 0 ? (
        <Card>
          <EmptyState
            title="No events found"
            description="No published events match your selected search or filter criteria. Try resetting filters."
            actionLabel="Reset All Filters"
            onAction={() => {
              setSearchQuery('');
              setCategoryFilter('ALL');
              setVenueFilter('ALL');
              setAvailabilityFilter('ALL');
            }}
          />
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedEvents.map((event) => (
            <Card key={event.id} className="flex flex-col justify-between hover:border-blue-300">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={event.status}>{event.category || 'General'}</Badge>
                  <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(event.start_time)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                  {event.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{event.venue?.name || 'Campus Venue'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {event.registered_count || 0} registered / {event.max_participants} max
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span
                  className={`text-xs font-semibold ${
                    event.available_seats > 0 ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {event.available_seats > 0 ? `${event.available_seats} seats left` : 'At Capacity'}
                </span>

                <Link to={`/student/events/${event.id}`}>
                  <Button variant="primary" size="sm">
                    View & Register
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {paginatedEvents.map((event) => (
            <Card key={event.id} className="hover:border-blue-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={event.status}>{event.category || 'General'}</Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(event.start_time)} at {formatTime(event.start_time)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{event.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{event.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {event.venue?.name || 'Campus Venue'}
                    </span>
                    <span>
                      {event.registered_count || 0} / {event.max_participants} registered
                    </span>
                    <span className="font-semibold text-emerald-600">
                      {event.available_seats} seats left
                    </span>
                  </div>
                </div>

                <Link to={`/student/events/${event.id}`}>
                  <Button variant="primary" size="sm" iconRight={ArrowRight}>
                    View & Register
                  </Button>
                </Link>
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
    </div>
  );
}
