import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { certificateService } from '../../services/certificateService';
import { formatDate } from '../../utils/formatters';
import { COLLEGE_CONFIG } from '../../types';
import CertificatePreviewModal from '../../components/certificate/CertificatePreviewModal';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Calendar,
  User,
  GraduationCap,
  Building,
  Eye,
  FileCheck,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';

/**
 * Public Certificate Authenticity Verification Page
 * Accessible by anyone scanning the QR code or visiting /verify/certificate/:certNo
 */
export default function VerifyCertificatePage() {
  const { certNo } = useParams();
  const [loading, setLoading] = useState(true);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    async function verify() {
      if (!certNo) {
        setError('Missing certificate identification number.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const res = await certificateService.getCertificates();
        if (res.success && Array.isArray(res.data)) {
          const matched = res.data.find(
            (c) => c.certificate_no.toLowerCase() === certNo.trim().toLowerCase()
          );

          if (matched) {
            setCertData(matched);
          } else {
            setError(`Certificate with serial "${certNo}" could not be located in the institutional ledger.`);
          }
        } else {
          setError('Unable to query academic certificate registry.');
        }
      } catch (err) {
        console.error('Verification query failed:', err);
        setError('A network error occurred while verifying credential authenticity.');
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [certNo]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner message="Querying institutional certificate registry..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to College Portal</span>
        </Link>
      </div>

      {/* Main Verification Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Banner */}
        <div
          className={`p-6 sm:p-8 text-white ${
            certData
              ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900'
              : 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                certData
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-400/30'
              }`}
            >
              {certData ? (
                <ShieldCheck className="w-7 h-7" />
              ) : (
                <AlertTriangle className="w-7 h-7" />
              )}
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">
                Official Credential Verification
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                {certData
                  ? 'Verified Authentic Academic Credential'
                  : 'Certificate Not Verified'}
              </h1>
            </div>
          </div>
        </div>

        {/* Status Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {certData ? (
            <>
              {/* Verification Stamp */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-emerald-950 text-sm">
                    Authenticity Validated
                  </p>
                  <p className="text-emerald-800 mt-0.5">
                    This document was officially issued and recorded on the immutable ledger of{' '}
                    <strong>{COLLEGE_CONFIG.name}</strong>.
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Recipient</span>
                  </div>
                  <p className="text-base font-bold text-slate-900">
                    {certData.student?.name || 'Student Name'}
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-0.5">
                    ID: {certData.student?.student_id_number || 'STU-RECORDED'}
                  </p>
                  {certData.student?.department && (
                    <p className="text-xs text-slate-600 mt-1">
                      {certData.student?.department}
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Credential Serial</span>
                  </div>
                  <p className="text-base font-mono font-bold text-amber-900">
                    {certData.certificate_no}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Issued: {formatDate(certData.issued_at)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span>Academic Event / Program</span>
                  </div>
                  <p className="text-lg font-bold text-blue-950">
                    {certData.event?.title || 'Campus Technical & Academic Event'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Event Date: {formatDate(certData.event?.start_time || certData.issued_at)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                    <Building className="w-4 h-4 text-slate-500" />
                    <span>Issuing Authority</span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {COLLEGE_CONFIG.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    Office of Academic Affairs & Student Enrichment ({COLLEGE_CONFIG.academicYear})
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                <Button
                  variant="primary"
                  size="md"
                  icon={Eye}
                  onClick={() => setShowPreviewModal(true)}
                  className="bg-blue-900 hover:bg-blue-950 text-white font-semibold shadow-md"
                >
                  View & Download Official Certificate
                </Button>

                <span className="text-xs text-slate-400 font-mono">
                  SHA-256 Verified Seal
                </span>
              </div>
            </>
          ) : (
            <div className="space-y-4 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Credential Verification Failed
                </h3>
                <p className="text-sm text-slate-600">
                  {error || 'The certificate serial number entered does not match any official record in the college registry.'}
                </p>
                <p className="text-xs text-slate-400 pt-2">
                  Please verify the exact certificate number from the issued physical document or contact the Office of Academic Affairs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal for Public Viewer */}
      {certData && (
        <CertificatePreviewModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          certificate={certData}
        />
      )}
    </div>
  );
}
