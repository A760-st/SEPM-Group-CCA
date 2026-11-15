import React, { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import { registrationService } from '../../services/registrationService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { formatDate } from '../../utils/formatters';
import { COLLEGE_CONFIG } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CertificatePreviewModal from '../../components/certificate/CertificatePreviewModal';
import {
  Award,
  Search,
  Plus,
  Eye,
  Download,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
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

  // High-def preview modal
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
            Audit, authorize, issue, and verify official institutional completion certificates for {COLLEGE_CONFIG.name}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setShowIssueModal(true)}
          disabled={eligibleRegistrations.length === 0}
          className="bg-blue-950 hover:bg-blue-900"
        >
          Issue Certificate ({eligibleRegistrations.length} eligible)
        </Button>
      </div>

      {/* Filter Card */}
      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
            Total <strong>{certificates.length}</strong> certificates registered
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
                      <div className="font-mono font-bold text-amber-900 flex items-center gap-1.5">
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
                        variant="outline"
                        size="sm"
                        icon={Eye}
                        onClick={() => setPreviewCert(cert)}
                      >
                        Preview & PDF
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
        title="Issue Official Academic Certificate"
        subtitle="Authorize verified completion credentials with tamper-proof verification seal"
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
              className="bg-blue-950 hover:bg-blue-900"
            >
              Generate & Issue Certificate
            </Button>
          </>
        }
      >
        <form onSubmit={handleIssueCertificate} className="space-y-4">
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs">
            Students listed below have been verified with <strong>ATTENDED</strong> status by the event coordinator and are eligible for official institutional certification.
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
            placeholder="Select eligible student attendee..."
          />
        </form>
      </Modal>

      {/* High-Definition Certificate Preview & Download Modal */}
      {previewCert && (
        <CertificatePreviewModal
          isOpen={Boolean(previewCert)}
          onClose={() => setPreviewCert(null)}
          certificate={previewCert}
          onDownloadSuccess={(c) => {
            showToast(`Certificate ${c.certificate_no} downloaded successfully.`, 'success');
          }}
        />
      )}
    </div>
  );
}
