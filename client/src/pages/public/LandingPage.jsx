import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { eventService } from '../../services/eventService';
import { reportService } from '../../services/reportService';
import { COLLEGE_CONFIG, EVENT_CATEGORIES, ROLES } from '../../types';
import { formatDate, formatTime } from '../../utils/formatters';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  Calendar,
  Search,
  MapPin,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';

export default function LandingPage() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [eventsRes, statsRes] = await Promise.all([
          eventService.getEvents({ status: 'PUBLISHED' }),
          reportService.getDashboardStats(),
        ]);
        if (eventsRes.success) setEvents(eventsRes.data);
        if (statsRes.success) setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to load landing data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
  };

  const filteredEvents = events.filter((e) => {
    const matchCat = selectedCategory === 'ALL' || e.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Campus Event Management Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover, Participate & Excel in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400">
              Campus Events
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Welcome to <span className="text-white font-medium">{COLLEGE_CONFIG.name}</span>'s centralized system.
            Register for technical hackathons, cultural festivals, research seminars, and earn verified academic certificates.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-xl border border-slate-200"
          >
            <div className="flex-1 flex items-center pl-3 gap-2 text-slate-400">
              <Search className="w-4 h-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, keyword, or domain..."
                className="w-full text-xs sm:text-sm text-slate-900 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Find Events
            </Button>
          </form>

          {/* Quick Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800/80">
            <div>
              <p className="text-2xl font-bold text-white">
                {stats?.events?.published || 12}+
              </p>
              <p className="text-xs text-slate-400">Active Events</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {stats?.registrations?.total || 150}+
              </p>
              <p className="text-xs text-slate-400">Total Registrations</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-400">
                {stats?.venues?.total || 5}
              </p>
              <p className="text-xs text-slate-400">Campus Venues</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">
                {stats?.certificates?.total || 45}+
              </p>
              <p className="text-xs text-slate-400">Certificates Issued</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Upcoming College Events
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select an event to view details, schedules, venue capacity, and register.
            </p>
          </div>

          <Link to="/events">
            <Button variant="outline" size="sm" iconRight={ArrowRight}>
              View Full Schedule
            </Button>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium shrink-0 transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.slice(0, 6).map((event) => (
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
                      {event.registered_count || 0} registered / {event.max_participants} max seats
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600">
                  {event.available_seats > 0 ? `${event.available_seats} seats left` : 'Full'}
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
      </section>

      {/* How It Works Section */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Seamless Student Participation
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Four structured steps from event discovery to receiving verified academic certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Explore & Discover</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by academic department, category, venue capacity, and dates across the college calendar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Instant Registration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Register with a single click using your verified student ID. Real-time seat allocation checks.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Attendance Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Event organizers mark presence during the session, making participants eligible for certificate issuance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900">Download Certificate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Authorized administrators issue official certificates with verifiable serial numbers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Access Information Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 sm:p-12 shadow-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Role-Based College Architecture
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Are you a Faculty Organizer or Student Society Lead?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              In accordance with academic policies, Organizer and Administrator privileges cannot be registered publicly. Accounts are provisioned and verified through the College Dean’s office.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link to="/register/organizer-restricted">
              <Button variant="secondary" size="md">
                Organizer Guidelines
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="md">
                Student Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
