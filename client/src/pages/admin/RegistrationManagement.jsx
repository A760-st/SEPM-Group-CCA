import React, { useState, useEffect } from 'react';
import { registrationService } from '../../services/registrationService';
import { useNotifications } from '../../context/NotificationContext';
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
  ClipboardList,
  Search,
  Download,
  Eye,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';

export default function RegistrationManagement() {
  const { showToast } = useNotifications();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Detail Modal
  const [selectedReg, setSelectedReg] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const fetchRegistrations = async () => {
    try {
      const res = await registrationService.getRegistrations({});
      if (res.success) setRegistrations(res.data);
    } catch {
      showToast('Failed to load registrations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleToggleAttendance = async (regId, currentStatus) => {
    const isAttended = currentStatus === 'ATTENDED';
    try {
      await registrationService.markAttendance(regId, !isAttended);
      showToast(
        !isAttended ? 'Attendance marked as ATTENDED.' : 'Attendance reverted to CONFIRMED.',
        'success'
      );
      fetchRegistrations();
    } catch (err) {
      showToast(err.message || 'Failed to update attendance.', 'error');
    }
  };

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) return;
    const exportData = filteredRegistrations.map((r) => ({
      Registration_ID: r.id,
      Student_Name: r.student?.name || 'N/A',
      Student_ID: r.student?.student_id_number || 'N/A',
      Email: r.student?.email || 'N/A',
      Department: r.student?.department || 'N/A',
      Event: r.event?.title || 'N/A',
      Status: r.status,
      Certificate_Eligible: r.certificate_eligible ? 'YES' : 'NO',
      Registered_At: formatDateTime(r.registered_at),
    }));
    exportToCSV(exportData, `All_Registrations_${Date.now()}.csv`);
    showToast('All registrations exported to CSV.', 'success');
  };

  const filteredRegistrations = registrations.filter((r) => {
    const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchSearch =
      !searchQuery ||
      r.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.student?.student_id_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.event?.title?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filteredRegistrations.length / pageSize) || 1;
  const paginatedList = filteredRegistrations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading system registrations..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            System Registration Oversight
          </h1>
          <p className="text-xs text-slate-500">
            Track student bookings across all campus events, monitor seat capacities, and audit attendance
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={handleExportCSV}
          disabled={filteredRegistrations.length === 0}
        >
          Export All to CSV
        </Button>
      </div>

      {/* Filter Card */}
      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search student, roll number, or event..."
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
                { value: 'ALL', label: 'All Statuses' },
                { value: 'CONFIRMED', label: 'Confirmed' },
                { value: 'ATTENDED', label: 'Attended' },
                { value: 'CANCELLED', label: 'Cancelled' },
              ]}
            />
          </div>
        </div>

        <div className="px-4 py-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total: <strong>{filteredRegistrations.length}</strong> record{filteredRegistrations.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[11px] text-slate-400">
            Confirmed: {registrations.filter((r) => r.status === 'CONFIRMED').length} | Attended: {registrations.filter((r) => r.status === 'ATTENDED').length}
          </span>
        </div>
      </Card>

      {/* Table */}
      {filteredRegistrations.length === 0 ? (
        <Card>
          <EmptyState
            title="No registrations found"
            description="No registrations match your search query."
          />
        </Card>
      ) : (
        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Eligible for Cert</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedList.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{reg.student?.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {reg.student?.student_id_number || reg.student?.email}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                        {reg.event?.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Venue: {reg.event?.venue?.name || 'TBD'}
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
                    <td className="py-3 px-4">
                      {reg.certificate_eligible ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Eligible
                        </span>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {reg.status !== 'CANCELLED' && (
                        <Button
                          variant={reg.status === 'ATTENDED' ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => handleToggleAttendance(reg.id, reg.status)}
                          className={reg.status === 'ATTENDED' ? 'text-purple-700 bg-purple-50' : ''}
                        >
                          {reg.status === 'ATTENDED' ? 'Attended' : 'Mark Attended'}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedReg(reg)}
                      >
                        Audit
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

      {/* Audit Detail Modal */}
      {selectedReg && (
        <Modal
          isOpen={Boolean(selectedReg)}
          onClose={() => setSelectedReg(null)}
          title="Registration Audit Record"
          subtitle={`Record ID: ${selectedReg.id}`}
          footer={
            <Button variant="outline" size="sm" onClick={() => setSelectedReg(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Student Name:</span>
              <span className="font-bold text-slate-900">{selectedReg.student?.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Student ID:</span>
              <span className="font-mono text-slate-800">
                {selectedReg.student?.student_id_number || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Email:</span>
              <span className="text-slate-800">{selectedReg.student?.email}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Event Title:</span>
              <span className="font-bold text-slate-900">{selectedReg.event?.title}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Registered Timestamp:</span>
              <span className="text-slate-800">{formatDateTime(selectedReg.registered_at)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500">Status:</span>
              <Badge variant={selectedReg.status} size="sm">
                {selectedReg.status}
              </Badge>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Certificate Status:</span>
              <span className="font-semibold text-slate-800">
                {selectedReg.certificate ? `Issued: ${selectedReg.certificate.certificate_no}` : 'Not Issued'}
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
