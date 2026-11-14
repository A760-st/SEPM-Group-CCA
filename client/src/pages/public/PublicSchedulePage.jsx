import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { venueService } from '../../services/venueService';
import { EVENT_CATEGORIES, EVENT_STATUS } from '../../types';
import { formatDate, formatTime } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Calendar,
  Search,
  MapPin,
  Users,
  Clock,
  Filter,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function PublicSchedulePage() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [venueFilter, setVenueFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    async function fetchData() {
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
    fetchData();
  }, []);

  const filteredEvents = events
    .filter((e) => {
      const matchCat = categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchVen = venueFilter === 'ALL' || e.venue_id === venueFilter;
      const matchSearch =
        !searchTerm ||
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchVen && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.start_time) - new Date(b.start_time);
      if (sortBy === 'popularity') return (b.registered_count || 0) - (a.registered_count || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading public event schedule..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Introduction */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>College Academic Calendar</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Public Event Schedule
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Browse upcoming academic conferences, technical hackathons, cultural festivals, and competitive sports championships.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Input
            placeholder="Search by title or keyword..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Categories' },
              ...EVENT_CATEGORIES.map((c) => ({ value: c, label: c })),
            ]}
          />

          <Select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Campus Venues' },
              ...venues.map((v) => ({ value: v.id, label: `${v.name} (${v.capacity} seats)` })),
            ]}
          />

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'date', label: 'Sort by: Upcoming Date' },
              { value: 'popularity', label: 'Sort by: Most Popular' },
              { value: 'title', label: 'Sort by: Alphabetical (A-Z)' },
            ]}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Found <strong className="text-slate-800">{filteredEvents.length}</strong> published event{filteredEvents.length !== 1 ? 's' : ''}
          </span>
          {(searchTerm || categoryFilter !== 'ALL' || venueFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('ALL');
                setVenueFilter('ALL');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="No events matched your filters"
          description="Try modifying your keyword search or resetting category filters."
          actionLabel="Clear all filters"
          onAction={() => {
            setSearchTerm('');
            setCategoryFilter('ALL');
            setVenueFilter('ALL');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="flex flex-col justify-between hover:shadow-md transition">
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
                      {event.registered_count || 0} registered / {event.max_participants} capacity
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600">
                  {event.available_seats > 0 ? `${event.available_seats} seats remaining` : 'At Capacity'}
                </span>

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
    </div>
  );
}
