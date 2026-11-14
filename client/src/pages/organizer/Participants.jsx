import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { registrationService } from '../../services/registrationService';
import { eventService } from '../../services/eventService';
import { formatDate, formatDateTime, exportToCSV } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Users,
  Search,
  Download,
  CheckCircle,
  Eye,
  Filter,
  UserCheck,
  Calendar,
  Mail,
  Hash,
} from 'lucide-react';

export default function Participants() {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEventId = searchParams.get('event_id') || 'ALL';

  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState(initialEventId);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal Detail
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadData = async () => {
    if (!user?.id) return;
    try {
      const [evRes, regRes] = await Promise.all([
        eventService.getEvents({ organizer_id: user.id }),
        registrationService.getRegistrations({}),
      ]);

      if (evRes.success) setEvents(evRes.data);

      if (regRes.success && evRes.success) {
        const myEventIds = new Set(evRes.data.map((e) => e.id));
        const filtered = regRes.data.filter((r) => myEventIds.has(r.event_id));
        setRegistrations(filtered);
      }
    } catch {
      showToast('Failed to load participants.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleToggleAttendance = async (registrationId, currentStatus) => {
    const isAttended = currentStatus === 'ATTENDED';
    try {
      await registrationService.markAttendance(registrationId, !isAttended);
      showToast(
        !isAttended ? 'Participant marked as ATTENDED.' : 'Attendance revoked to CONFIRMED.',
        'success'
      );
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to update attendance.', 'error');
    }
  };

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      showToast('No participant records to export.', 'warning');
      return;
    }

    const exportData = filteredRegistrations.map((r) => ({
      Registration_ID: r.id,
      Student_Name: r.student?.name || 'N/A',
      Student_ID: r.student?.student_id_number || 'N/A',
      Email: r.student?.email || 'N/A',
      Department: r.student?.department || 'N/A',
      Event_Title: r.event?.title || 'N/A',
      Status: r.status,
      Certificate_Eligible: r.certificate_eligible ? 'YES' : 'NO',
      Registered_At: formatDateTime(r.registered_at),
    }));

    exportToCSV(exportData, `Participants_Export_${Date.now()}.csv`);
    showToast('Participant roster exported to CSV successfully.', 'success');
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchEvent = selectedEventId === 'ALL' || r.event_id === selectedEventId;
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      r.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student?.student_id_number?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchEvent && matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / pageSize) || 1;
  const paginatedList = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading participant roster..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Participant Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit registered student rosters, mark session attendance, and export reports
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={handleExportCSV}
          disabled={filteredRegistrations.length === 0}
        >
          Export CSV Roster
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card noPadding>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            placeholder="Search by student name, ID or email..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Select
            value={selectedEventId}
            onChange={(e) => {
              setSelectedEventId(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All My Events' },
              ...events.map((ev) => ({ value: ev.id, label: ev.title })),
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'CONFIRMED', label: 'Confirmed (Registered)' },
              { value: 'ATTENDED', label: 'Attended (Present)' },
              { value: 'CANCELLED', label: 'Cancelled' },
            ]}
          />
        </div>

        <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total: <strong>{filteredRegistrations.length}</strong> student record{filteredRegistrations.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[11px] text-slate-400">
            Tip: Marking attendance qualifies students for verified certificates.
          </span>
        </div>
      </Card>

      {/* Table */}
      {filteredRegistrations.length === 0 ? (
        <Card>
          <EmptyState
            title="No participants found"
            description="No registrations match your search or event selection."
          />
        </Card>
      ) : (
        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Student ID / Dept</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Enrolled Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Attendance Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedList.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{reg.student?.name}</div>
                      <div className="text-[11px] text-slate-400">{reg.student?.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-medium text-slate-800">
                        {reg.student?.student_id_number || '—'}
                      </div>
                      <div className="text-[11px] text-slate-500">{reg.student?.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                        {reg.event?.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(reg.registered_at)}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={reg.status} size="sm">
                        {reg.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {reg.status !== 'CANCELLED' && (
                        <Button
                          variant={reg.status === 'ATTENDED' ? 'secondary' : 'outline'}
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => handleToggleAttendance(reg.id, reg.status)}
                          className={reg.status === 'ATTENDED' ? 'text-purple-700 bg-purple-50' : ''}
                        >
                          {reg.status === 'ATTENDED' ? 'Marked Present' : 'Mark Attended'}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedStudent(reg)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredRegistrations.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </Card>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <Modal
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
          title="Participant Enrollment Record"
          subtitle={`Registration ID: ${selectedStudent.id}`}
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Full Name:</span>
                <span className="font-bold text-slate-900">{selectedStudent.student?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">College Email:</span>
                <span className="text-slate-800">{selectedStudent.student?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Student ID / Roll No:</span>
                <span className="font-mono font-bold text-slate-900">
                  {selectedStudent.student?.student_id_number || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department:</span>
                <span className="text-slate-800">{selectedStudent.student?.department}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Event Title:</span>
                <span className="font-bold text-slate-900">{selectedStudent.event?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registration Date:</span>
                <span className="text-slate-800">{formatDateTime(selectedStudent.registered_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <Badge variant={selectedStudent.status} size="sm">
                  {selectedStudent.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Certificate Eligible:</span>
                <span className={selectedStudent.certificate_eligible ? 'text-emerald-700 font-semibold' : 'text-slate-500'}>
                  {selectedStudent.certificate_eligible ? 'Yes (Attended)' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
