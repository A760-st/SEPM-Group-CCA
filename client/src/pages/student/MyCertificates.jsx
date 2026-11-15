import React, { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { COLLEGE_CONFIG } from '../../types';
import { formatDate } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import CertificatePreviewModal from '../../components/certificate/CertificatePreviewModal';
import {
  Award,
  Download,
  Eye,
  Calendar,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function MyCertificates() {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    async function loadCertificates() {
      if (!user?.id) return;
      try {
        const res = await certificateService.getCertificates({ student_id: user.id });
        if (res.success) setCertificates(res.data);
      } catch (err) {
        showToast('Failed to load certificates.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadCertificates();
  }, [user?.id, showToast]);

  const handleOpenPreview = (cert) => {
    setSelectedCert(cert);
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading academic certificates..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Academic Certificates
          </h1>
          <p className="text-xs text-slate-500">
            Official, verifiable completion and participation certificates issued by {COLLEGE_CONFIG.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-semibold border border-blue-200">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Tamper-Proof QR Verified</span>
          </span>
        </div>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <Card>
          <EmptyState
            title="No certificates available yet"
            description="Certificates are issued by the College Administration after event organizers verify attendance and completion of scheduled campus events."
            icon={Award}
            actionLabel="Browse Events"
            onAction={() => window.location.assign('/student/events')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card
              key={cert.id}
              className="border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all duration-200 relative overflow-hidden group"
            >
              {/* Subtle accent border on card top */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-900 via-amber-500 to-blue-900" />

              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200/80 shadow-xs">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Verified Credential
                  </span>
                  <span className="text-xs text-slate-400">
                    Issued: {formatDate(cert.issued_at)}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-900 transition">
                    {cert.event?.title || 'Campus Event Certificate'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Serial:
                    </span>
                    <span className="font-mono text-xs text-amber-900 font-bold bg-amber-50/70 px-2 py-0.5 rounded border border-amber-200/50">
                      {cert.certificate_no}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span>Recipient:</span>
                    <span className="font-semibold text-slate-800">{cert.student?.name || user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Department:</span>
                    <span className="text-slate-700">{cert.student?.department || user?.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Issuing Authority:</span>
                    <span className="text-slate-700">{COLLEGE_CONFIG.name}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleOpenPreview(cert)}
                    className="flex-1"
                  >
                    Preview & Print
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Download}
                    onClick={() => handleOpenPreview(cert)}
                    className="flex-1 bg-blue-950 hover:bg-blue-900 text-white font-semibold"
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* High-Definition Certificate Preview & Download Modal */}
      {selectedCert && (
        <CertificatePreviewModal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          certificate={selectedCert}
          onDownloadSuccess={(c) => {
            showToast(`Certificate ${c.certificate_no} downloaded successfully.`, 'success');
          }}
        />
      )}
    </div>
  );
}
