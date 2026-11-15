import React, { useRef, useState, useEffect } from 'react';
import CertificateTemplate from './CertificateTemplate';
import { downloadCertificateAsPdf } from '../../utils/certificateGenerator';
import Button from '../common/Button';
import {
  Download,
  Printer,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Maximize2,
  AlertCircle,
} from 'lucide-react';

/**
 * Premium Certificate Preview & Download Modal/Drawer
 * Provides:
 * - Scaled responsive preview (A4 aspect ratio preserved on phone, tablet, desktop)
 * - One-click PDF download using html2canvas + jsPDF (crisp vector rendering)
 * - Browser Print layout integration (@media print automatically formats for A4)
 * - Direct link to public verification portal
 * - Loading and error states
 */
export default function CertificatePreviewModal({
  isOpen,
  onClose,
  certificate,
  onDownloadSuccess,
}) {
  const certRef = useRef(null);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.75);
  const [downloading, setDownloading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Calculate appropriate zoom/scale based on viewport container width
  useEffect(() => {
    function computeScale() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 32; // padding
      // Certificate native width is 1056px
      const calculatedScale = Math.min(Math.max(containerWidth / 1056, 0.32), 0.95);
      setScale(calculatedScale);
    }

    if (isOpen) {
      computeScale();
      window.addEventListener('resize', computeScale);
    }

    return () => {
      window.removeEventListener('resize', computeScale);
    };
  }, [isOpen]);

  if (!isOpen || !certificate) return null;

  const certNo = certificate.certificate_no || 'CERTIFICATE';
  const fileName = `${certNo}.pdf`;
  const verifyUrl = `/verify/certificate/${certNo}`;

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    setFeedback({ type: '', message: '' });

    try {
      await downloadCertificateAsPdf(certRef.current, fileName);
      setFeedback({
        type: 'success',
        message: `Certificate ${fileName} generated & downloaded successfully in high-definition A4 PDF!`,
      });
      if (onDownloadSuccess) onDownloadSuccess(certificate);
    } catch (err) {
      console.error('PDF Download failed:', err);
      // Fallback: trigger print dialog directly if browser blocks canvas
      try {
        window.print();
      } catch (printErr) {
        setFeedback({
          type: 'error',
          message: 'Could not generate PDF. Please use the Print option.',
        });
      }
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[96vh]">
        
        {/* ============================================================ */}
        {/* TOP ACTION BAR                                               */}
        {/* ============================================================ */}
        <div className="px-6 py-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Academic Certificate Preview
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded">
                  {certNo}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official credential verified by College Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
              className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
            >
              Print
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              loading={downloading}
              onClick={handleDownload}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md border-none"
            >
              Download PDF (A4)
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback alert banner */}
        {feedback.message && (
          <div
            className={`px-6 py-2.5 text-xs font-medium flex items-center gap-2 border-b ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* PREVIEW VIEWPORT AREA                                        */}
        {/* ============================================================ */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto bg-slate-100 p-4 sm:p-6 flex items-center justify-center min-h-[460px]"
        >
          {/* Scaled Wrapper maintaining exact A4 landscape dimensions */}
          <div
            style={{
              width: `${1056 * scale}px`,
              height: `${747 * scale}px`,
              transition: 'all 0.15s ease',
            }}
            className="relative flex items-center justify-center shrink-0 drop-shadow-xl"
          >
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            >
              <CertificateTemplate ref={certRef} certificate={certificate} />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BOTTOM METADATA & VERIFICATION LINK                          */}
        {/* ============================================================ */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-4">
            <span>
              Format: <strong>A4 Landscape (297mm × 210mm)</strong>
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Resolution: <strong>Vector & 300 DPI Export</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={verifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              <span>Test Public Verification Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
