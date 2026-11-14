import React, { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import { registrationService } from '../../services/registrationService';
import { eventService } from '../../services/eventService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { COLLEGE_CONFIG } from '../../types';
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
  Award,
  Search,
  Plus,
  Eye,
  Download,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export default function CertificateManagement() {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [certificates, setCertificates] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');

  // Issue Certificate Modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedRegToIssue, setSelectedRegToIssue] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Preview Modal
  const [previewCert, setPreviewCert] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadData = async () => {
    try {
      const [certRes, regRes] = await Promise.all([
        certificateService.getCertificates({}),
        registrationService.getRegistrations({}),
      ]);

      if (certRes.success) setCertificates(certRes.data);
      if (regRes.success) setRegistrations(regRes.data);
    } catch {
      showToast('Failed to load certificates.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Eligible registrations that do NOT already have a certificate
  const issuedRegIds = new Set(certificates.map((c) => c.registration_id));
  const eligibleRegistrations = registrations.filter(
    (r) =>
      (r.status === 'ATTENDED' || r.certificate_eligible) &&
      !issuedRegIds.has(r.id)
  );

  const handleIssueCertificate = async (e) => {
    e.preventDefault();
    if (!selectedRegToIssue) {
      showToast('Please select an eligible student registration.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const res = await certificateService.issueCertificate(selectedRegToIssue, user?.id);
      showToast(res.message || 'Certificate successfully authorized and issued.', 'success');
      setShowIssueModal(false);
      setSelectedRegToIssue('');
      loadData();
    } catch (err) {
      showToast(err.message || 'Failed to issue certificate.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCerts = certificates.filter(
    (c) =>
      !searchQuery ||
      c.certificate_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.student?.student_id_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.event?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCerts.length / pageSize) || 1;
  const paginatedList = filteredCerts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading certificate records..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Certificate Credential Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit, authorize, issue, and verify official institutional completion certificates
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowIssueModal(true)}
          disabled={eligibleRegistrations.length === 0}
        >
          Issue Certificate ({eligibleRegistrations.length} eligible)
        </Button>
      </div>

      {/* Filter Card */}
      <Card noPadding>
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              placeholder="Search by serial no, student, or event..."
              icon={Search}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <span className="text-xs text-slate-500">
            Total <strong>{certificates.length}</strong> certificates issued
          </span>
        </div>
      </Card>

      {/* Certificates Table */}
      {filteredCerts.length === 0 ? (
        <Card>
          <EmptyState
            title="No certificates found"
            description="No issued certificates match your search query."
            icon={Award}
          />
        </Card>
      ) : (
        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Serial Number</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Issued At</th>
                  <th className="py-3 px-4">Authorized By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedList.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-amber-800 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>{cert.certificate_no}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{cert.student?.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {cert.student?.student_id_number || cert.student?.email}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1 max-w-xs">
                        {cert.event?.title}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(cert.issued_at)}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {cert.issuer?.name || 'Administrator'}
                    </td>

                    <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => setPreviewCert(cert)}
                      >
                        Preview
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
            totalItems={filteredCerts.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </Card>
      )}

      {/* Issue Certificate Modal */}
      <Modal
        isOpen={showIssueModal}
        onClose={() => setShowIssueModal(false)}
        title="Issue Official Certificate"
        subtitle="Authorize completion credentials for verified student attendees"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowIssueModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={actionLoading}
              onClick={handleIssueCertificate}
              disabled={!selectedRegToIssue}
            >
              Generate & Issue
            </Button>
          </>
        }
      >
        <form onSubmit={handleIssueCertificate} className="space-y-4">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs">
            Students listed below have been marked as <strong>ATTENDED</strong> by the organizer and do not currently have a certificate issued.
          </div>

          <Select
            label="Eligible Attendee & Event"
            required
            value={selectedRegToIssue}
            onChange={(e) => setSelectedRegToIssue(e.target.value)}
            options={eligibleRegistrations.map((r) => ({
              value: r.id,
              label: `${r.student?.name} (${r.student?.student_id_number || r.student?.email}) — ${r.event?.title}`,
            }))}
            placeholder="Select eligible student record..."
          />
        </form>
      </Modal>

      {/* Preview Modal */}
      {previewCert && (
        <Modal
          isOpen={Boolean(previewCert)}
          onClose={() => setPreviewCert(null)}
          title="Certificate Credential Preview"
          subtitle={previewCert.certificate_no}
          maxWidth="max-w-2xl"
          footer={
            <Button variant="outline" size="sm" onClick={() => setPreviewCert(null)}>
              Close
            </Button>
          }
        >
          <div className="border-4 border-double border-blue-900 p-8 rounded-xl bg-gradient-to-b from-white to-amber-50/30 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center mx-auto shadow-sm">
              <GraduationCap className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold tracking-tight text-blue-950 uppercase">
                {COLLEGE_CONFIG.name}
              </h2>
              <p className="text-xs text-slate-500 font-serif italic">
                Office of Academic Affairs & Student Enrichment
              </p>
            </div>

            <div className="py-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest border-y border-amber-300 py-1 px-4 inline-block">
                Certificate of Completion
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">This is to certify that</p>

            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-1 max-w-sm mx-auto">
              {previewCert.student?.name}
            </h3>

            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Student ID: <span className="font-mono font-semibold">{previewCert.student?.student_id_number || 'N/A'}</span> has successfully completed
            </p>

            <h4 className="text-base font-bold text-blue-900 max-w-md mx-auto">
              "{previewCert.event?.title || 'Campus Event'}"
            </h4>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 max-w-md mx-auto">
              <div>
                <p className="font-semibold text-slate-800">College Administration</p>
                <p>Authorized Issuer</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Credential</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{formatDate(previewCert.issued_at)}</p>
                <p>Issued Date</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
