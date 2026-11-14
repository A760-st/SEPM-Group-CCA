import React, { useState, useEffect } from 'react';
import { certificateService } from '../../services/certificateService';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { COLLEGE_CONFIG } from '../../types';
import { formatDate } from '../../utils/formatters';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  Award,
  Download,
  Eye,
  Calendar,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Printer,
  Sparkles,
} from 'lucide-react';

export default function MyCertificates() {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);

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

  const handleDownload = async (cert) => {
    setDownloadingId(cert.id);
    try {
      await certificateService.downloadCertificate(cert.id);
      showToast(`Downloading certificate ${cert.certificate_no}...`, 'success');

      // Create a printable simulated certificate blob download
      const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${cert.certificate_no} - Certificate of Participation</title>
          <style>
            body { font-family: 'Times New Roman', serif; text-align: center; padding: 40px; background: #fff; color: #1e293b; }
            .border-box { border: 8px double #1e3a8a; padding: 40px; max-width: 800px; margin: 0 auto; position: relative; }
            h1 { font-size: 32px; color: #1e3a8a; text-transform: uppercase; margin-bottom: 5px; }
            h2 { font-size: 20px; color: #475569; font-style: italic; margin-top: 0; }
            .content { font-size: 16px; margin: 30px 0; line-height: 1.8; }
            .name { font-size: 26px; font-weight: bold; color: #0f172a; border-bottom: 2px solid #cbd5e1; display: inline-block; padding: 0 20px; }
            .event-name { font-size: 22px; font-weight: bold; color: #1d4ed8; }
            .footer { display: flex; justify-content: space-between; margin-top: 50px; font-size: 14px; }
            .sign { border-top: 1px solid #94a3b8; width: 200px; padding-top: 5px; }
            .cert-no { font-family: monospace; font-size: 12px; color: #64748b; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="border-box">
            <h1>${COLLEGE_CONFIG.name}</h1>
            <h2>Office of Student Affairs & Academic Extensions</h2>
            <hr style="border: 1px solid #cbd5e1; margin: 20px 0;" />
            <div style="font-size: 24px; font-weight: bold; color: #b45309; letter-spacing: 2px;">CERTIFICATE OF PARTICIPATION</div>
            <div class="content">
              This is to officially certify that<br/><br/>
              <span class="name">${cert.student?.name || user?.name}</span><br/><br/>
              bearing Student ID <strong>${cert.student?.student_id_number || user?.student_id_number || 'STU-2024-001'}</strong> of the 
              <strong>${cert.student?.department || user?.department}</strong><br/>
              has actively attended and successfully completed the institutional event<br/><br/>
              <span class="event-name">${cert.event?.title || 'Campus Technical Event'}</span><br/><br/>
              Issued on <strong>${formatDate(cert.issued_at)}</strong>.
            </div>
            <div class="footer">
              <div class="sign">Faculty Coordinator<br/><small>Event Organizer</small></div>
              <div class="sign">Dean of Student Affairs<br/><small>Authorized Signatory</small></div>
            </div>
            <div class="cert-no">Verification Serial: ${cert.certificate_no}</div>
          </div>
          <script>window.print();</script>
        </body>
        </html>
      `;

      const blob = new Blob([certificateHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      if (!printWindow) {
        // Fallback to direct download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${cert.certificate_no}.html`;
        link.click();
      }
    } catch {
      showToast('Error downloading certificate.', 'error');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading certificates..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My Academic Certificates
        </h1>
        <p className="text-xs text-slate-500">
          Verified certificates of completion issued by the College Administration
        </p>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <Card>
          <EmptyState
            title="No certificates available yet"
            description="Certificates are issued by the College Administration for students who attend and complete scheduled campus events."
            icon={Award}
            actionLabel="Browse Completed Events"
            onAction={() => window.location.assign('/student/events')}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="border-amber-200/80 hover:shadow-md transition">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                    <Award className="w-3.5 h-3.5" />
                    Verified Credential
                  </span>
                  <span className="text-xs text-slate-400">
                    Issued: {formatDate(cert.issued_at)}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {cert.event?.title || 'Campus Event Certificate'}
                  </h3>
                  <p className="font-mono text-xs text-amber-800 font-semibold mt-1">
                    Serial: {cert.certificate_no}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Eye}
                    onClick={() => setSelectedCert(cert)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Download}
                    loading={downloadingId === cert.id}
                    onClick={() => handleDownload(cert)}
                  >
                    Download / Print
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <Modal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          title="Certificate of Participation"
          subtitle={`Verification No: ${selectedCert.certificate_no}`}
          maxWidth="max-w-2xl"
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedCert(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={Download}
                onClick={() => handleDownload(selectedCert)}
              >
                Download / Print Certificate
              </Button>
            </>
          }
        >
          {/* Certificate Design View */}
          <div className="border-4 border-double border-blue-900 p-8 rounded-xl bg-gradient-to-b from-white via-slate-50 to-amber-50/20 text-center space-y-4">
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

            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              This is to certify that
            </p>

            <h3 className="text-xl font-bold text-slate-900 border-b border-slate-300 pb-1 max-w-sm mx-auto">
              {selectedCert.student?.name || user?.name}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
              Student ID: <span className="font-mono font-semibold">{selectedCert.student?.student_id_number || user?.student_id_number}</span> ({selectedCert.student?.department || user?.department}) has successfully participated in
            </p>

            <h4 className="text-base font-bold text-blue-900 max-w-md mx-auto">
              "{selectedCert.event?.title || 'Campus Event'}"
            </h4>

            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 max-w-md mx-auto">
              <div>
                <p className="font-semibold text-slate-800">Faculty Coordinator</p>
                <p>Event Organizer</p>
              </div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified by Dean</span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{formatDate(selectedCert.issued_at)}</p>
                <p>Date of Issue</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
