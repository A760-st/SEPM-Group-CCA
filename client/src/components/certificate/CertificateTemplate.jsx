import React, { useEffect, useState, forwardRef } from 'react';
import QRCode from 'qrcode';
import { COLLEGE_CONFIG } from '../../types';
import { formatDate } from '../../utils/formatters';

/**
 * Premium Academic Institutional Certificate Template
 * Inspired by professional academic and industry credentials (e.g. Great Learning, Stanford Online, MITx)
 * 
 * Design Features:
 * - A4 Landscape aspect ratio (1123 x 794 standard print ratio / 1056 x 747 in 96dpi)
 * - Ivory / Clean off-white background with subtle concentric guilloche geometric security pattern
 * - Deep navy-blue (#0A2540 / #0F2A4A) typography for main heading
 * - Sophisticated geometric border with ornamental gold guilloche right-border panel
 * - Circular Gold/Navy 'VERIFIED CERTIFICATE' emblem with embossed stars and security rings
 * - Real scannable high-contrast QR Code pointing directly to public certificate verification endpoint
 * - Configurable Signatory with authentic calligraphic signature stroke
 * - Watermark emblem with low opacity
 */
const CertificateTemplate = forwardRef(function CertificateTemplate(
  {
    certificate,
    scale = 1,
    className = '',
  },
  ref
) {
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Extract certificate dynamic properties
  const certNo = certificate?.certificate_no || 'AIT-CERT-2026-0001';
  const studentName =
    certificate?.student?.name ||
    certificate?.student_name ||
    'Student Name';
  const studentId =
    certificate?.student?.student_id_number ||
    certificate?.student_id_number ||
    '';
  const department =
    certificate?.student?.department ||
    certificate?.department ||
    '';
  const eventTitle =
    certificate?.event?.title ||
    certificate?.event_title ||
    'Institutional Academic Event';
  const eventDate =
    certificate?.event?.start_time ||
    certificate?.event_date ||
    certificate?.issued_at;
  const issueDate = certificate?.issued_at || new Date().toISOString();
  
  // Certificate Type determination
  const certType = certificate?.type || 'COMPLETION'; // COMPLETION, PARTICIPATION, ACHIEVEMENT
  
  const getSubheading = () => {
    switch (certType) {
      case 'PARTICIPATION':
        return 'OF PARTICIPATION';
      case 'ACHIEVEMENT':
        return 'OF ACHIEVEMENT';
      case 'COMPLETION':
      default:
        return 'OF COMPLETION';
    }
  };

  const getPreamble = () => {
    switch (certType) {
      case 'PARTICIPATION':
        return 'This certificate is proudly presented in recognition of active participation in';
      case 'ACHIEVEMENT':
        return 'In recognition of outstanding achievement and excellence demonstrated in';
      case 'COMPLETION':
      default:
        return 'For successfully completing the institutional program';
    }
  };

  // Signatory details (configurable via props or defaults)
  const signatoryName = certificate?.signatory?.name || 'Dr. Arthur Vance';
  const signatoryTitle = certificate?.signatory?.title || 'Dean of Academic Affairs';
  const signatoryInst = certificate?.signatory?.institution || COLLEGE_CONFIG.name;

  // Real public verification URL
  const verifyUrl = `${window.location.origin}/verify/certificate/${certNo}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(verifyUrl, {
      width: 160,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [verifyUrl]);

  return (
    <div
      ref={ref}
      id="certificate-print-root"
      className={`relative overflow-hidden bg-[#FAFAFA] text-slate-800 shadow-2xl select-none ${className}`}
      style={{
        width: '1056px',
        height: '747px',
        minWidth: '1056px',
        minHeight: '747px',
        maxWidth: '1056px',
        maxHeight: '747px',
        fontFamily: "'Playfair Display', Georgia, Cambria, 'Times New Roman', serif",
        boxSizing: 'border-box',
      }}
    >
      {/* ============================================================ */}
      {/* BACKGROUND GRAPHICS & WATERMARKS                             */}
      {/* ============================================================ */}

      {/* Subtle guilloche concentric arcs (SVG overlay) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.065]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1056 747"
      >
        <g stroke="#0F2A4A" strokeWidth="1" fill="none">
          {/* Concentric guilloche rosette left */}
          <circle cx="120" cy="370" r="140" strokeDasharray="4 6" />
          <circle cx="120" cy="370" r="180" />
          <circle cx="120" cy="370" r="230" strokeDasharray="3 5" />
          <circle cx="120" cy="370" r="280" />
          <circle cx="120" cy="370" r="340" strokeDasharray="2 4" />
          <circle cx="120" cy="370" r="410" />

          {/* Concentric guilloche rosette top center */}
          <circle cx="680" cy="80" r="160" stroke="#C59B27" strokeDasharray="4 8" />
          <circle cx="680" cy="80" r="220" stroke="#C59B27" />
          <circle cx="680" cy="80" r="300" stroke="#C59B27" strokeDasharray="3 6" />
          <circle cx="680" cy="80" r="380" stroke="#0F2A4A" />
          <circle cx="680" cy="80" r="480" stroke="#0F2A4A" strokeDasharray="2 4" />
        </g>
      </svg>

      {/* Faint center watermark emblem */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
        <img
          src="/assets/bmsit-logo.png"
          alt="Watermark"
          className="w-[380px] h-[380px] object-contain filter grayscale"
        />
      </div>

      {/* ============================================================ */}
      {/* RIGHT-HAND ORNAMENTAL PANEL (Signature Great Learning Style) */}
      {/* ============================================================ */}
      <div className="absolute top-0 right-0 bottom-0 w-[64px] bg-gradient-to-l from-amber-50/70 to-transparent border-l border-amber-200/40 pointer-events-none overflow-hidden">
        {/* Intricate guilloche lattice SVG */}
        <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 747" preserveAspectRatio="none">
          <defs>
            <pattern id="guilloche-lattice" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 0 16 Q 8 0 16 16 T 32 16" fill="none" stroke="#B8860B" strokeWidth="0.8" />
              <path d="M 0 16 Q 8 32 16 16 T 32 16" fill="none" stroke="#0F2A4A" strokeWidth="0.8" />
              <path d="M 16 0 Q 0 8 16 16 T 16 32" fill="none" stroke="#D4AF37" strokeWidth="0.8" />
              <path d="M 16 0 Q 32 8 16 16 T 16 32" fill="none" stroke="#1E3A8A" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="64" height="747" fill="url(#guilloche-lattice)" />
        </svg>
      </div>

      {/* Outer Fine Border */}
      <div className="absolute inset-[18px] border border-slate-300 pointer-events-none" />
      <div className="absolute inset-[22px] border-2 border-[#0A2540] pointer-events-none" />
      <div className="absolute inset-[26px] border border-amber-500/50 pointer-events-none" />

      {/* Corner Cornerstones */}
      <div className="absolute top-[20px] left-[20px] w-6 h-6 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
      <div className="absolute top-[20px] right-[20px] w-6 h-6 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
      <div className="absolute bottom-[20px] left-[20px] w-6 h-6 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
      <div className="absolute bottom-[20px] right-[20px] w-6 h-6 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

      {/* ============================================================ */}
      {/* MAIN CONTENT CONTAINER                                       */}
      {/* ============================================================ */}
      <div className="relative z-10 h-full w-full flex flex-col justify-between pt-[44px] pb-[42px] pl-[64px] pr-[96px] box-border">

        {/* 1. HEADER ROW: Institution Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Official BMSITM Emblem Logo */}
            <div className="w-[62px] h-[62px] flex items-center justify-center shrink-0">
              <img
                src="/assets/bmsit-logo.png"
                alt="BMSITM Official Logo"
                className="w-[62px] h-[62px] object-contain drop-shadow"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[20px] font-black tracking-tight text-[#0A2540] uppercase font-sans">
                  {COLLEGE_CONFIG.name}
                </span>
                <span className="text-[11px] font-bold tracking-widest text-amber-700 font-sans border-l-2 border-amber-400 pl-2 uppercase">
                  AUTONOMOUS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans tracking-wide">
                Affiliated to VTU, Belagavi • Approved by AICTE • Accredited by NAAC with 'A+' Grade
              </p>
            </div>
          </div>

          {/* Certificate Serial Metadata */}
          <div className="text-right">
            <span className="text-[10px] uppercase font-sans tracking-widest text-slate-400 block font-semibold">
              Credential ID
            </span>
            <span className="text-[13px] font-mono font-bold text-[#0A2540] tracking-wider">
              {certNo}
            </span>
          </div>
        </div>

        {/* 2. BODY CONTENT: Headings, Recipient & Event Details */}
        <div className="mt-2 space-y-4">

          {/* Main Title */}
          <div>
            <h1
              className="text-[44px] font-serif font-black tracking-[0.16em] text-[#0A2540] uppercase leading-none"
              style={{ letterSpacing: '0.14em' }}
            >
              CERTIFICATE
            </h1>
            <h2
              className="text-[16px] font-sans font-semibold tracking-[0.32em] text-[#C59B27] uppercase mt-1.5"
              style={{ letterSpacing: '0.28em' }}
            >
              {getSubheading()}
            </h2>
          </div>

          {/* Recipient Section */}
          <div className="pt-2">
            <p className="text-[13px] font-sans font-medium text-slate-500 uppercase tracking-widest mb-1">
              Presented to
            </p>
            <div className="inline-block relative">
              <h3 className="text-[34px] font-serif font-bold text-[#0F2A4A] tracking-normal border-b-2 border-[#C59B27]/60 pb-1 pr-6 leading-tight">
                {studentName}
              </h3>
            </div>
            {(studentId || department) && (
              <p className="text-[12px] font-sans text-slate-600 mt-1 font-medium tracking-wide">
                {studentId && <span>Student ID: <span className="font-mono font-semibold text-slate-800">{studentId}</span></span>}
                {studentId && department && <span className="mx-2 text-slate-300">•</span>}
                {department && <span>Department of {department}</span>}
              </p>
            )}
          </div>

          {/* Preamble & Event Name */}
          <div className="pt-1 max-w-[620px]">
            <p className="text-[14px] font-serif italic text-slate-600 leading-relaxed">
              {getPreamble()}
            </p>
            <h4 className="text-[22px] font-sans font-bold text-[#0A2540] mt-1 tracking-tight leading-snug">
              {eventTitle}
            </h4>
            <p className="text-[12px] font-sans text-slate-500 mt-1 font-medium">
              Conducted under institutional supervision on{' '}
              <span className="font-semibold text-slate-700">{formatDate(eventDate)}</span>
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 3. FOOTER ROW: Signatures & Authenticity Verification        */}
        {/* ============================================================ */}
        <div className="flex items-end justify-between pt-2 border-t border-slate-200/80">

          {/* Signatory Area */}
          <div className="space-y-1">
            {/* Calligraphic Stylized Signature */}
            <div className="h-[44px] flex items-end">
              <svg width="150" height="42" viewBox="0 0 150 42" fill="none" className="text-[#0A2540]">
                <path
                  d="M10 28 C 25 10, 35 36, 45 15 C 50 5, 55 35, 70 20 C 85 5, 95 28, 110 18 C 120 12, 130 30, 145 22"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 34 C 40 32, 90 35, 135 31"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="w-[180px] border-t border-slate-400 pt-1">
              <p className="text-[13px] font-sans font-bold text-slate-900 leading-tight">
                {signatoryName}
              </p>
              <p className="text-[10px] font-sans text-slate-500 leading-tight">
                {signatoryTitle}
              </p>
              <p className="text-[9px] font-sans text-slate-400 uppercase tracking-wider">
                {signatoryInst}
              </p>
            </div>
          </div>

          {/* Date of Issue */}
          <div className="text-center pb-1">
            <span className="text-[9px] uppercase font-sans tracking-widest text-slate-400 block font-semibold">
              Date of Issue
            </span>
            <span className="text-[12px] font-sans font-bold text-slate-700">
              {formatDate(issueDate)}
            </span>
          </div>

          {/* Authenticity Seal & Scannable QR Code */}
          <div className="flex items-center gap-5">

            {/* Circular Embossed Verified Seal (Inspired by reference) */}
            <div className="relative w-[86px] h-[86px] rounded-full flex items-center justify-center p-[4px] bg-gradient-to-br from-[#E2B755] via-[#F4D068] to-[#C59B27] shadow-lg border border-[#B8860B]/60">
              {/* Inner ring */}
              <div className="w-full h-full rounded-full border-2 border-dashed border-[#8A6508]/60 flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/90 to-amber-100/90 text-[#0A2540] p-1 text-center">
                <span className="text-[7.5px] font-sans font-extrabold uppercase tracking-widest text-[#8A6508]">
                  ★ VERIFIED ★
                </span>
                
                {/* Shield / Institutional Monogram */}
                <div className="w-[28px] h-[28px] my-0.5 rounded-full bg-[#0A2540] text-amber-300 flex items-center justify-center shadow-inner font-serif font-black text-[10px] tracking-tighter">
                  BMS
                </div>

                <span className="text-[7.5px] font-sans font-extrabold uppercase tracking-widest text-[#8A6508]">
                  CREDENTIAL
                </span>
              </div>
            </div>

            {/* QR Code Verification Box */}
            <div className="flex flex-col items-center text-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Certificate Verification QR"
                  className="w-[62px] h-[62px] object-contain"
                />
              ) : (
                <div className="w-[62px] h-[62px] bg-slate-100 animate-pulse rounded" />
              )}
              <span className="text-[8px] font-sans font-bold text-[#0A2540] uppercase tracking-wider mt-1">
                VERIFY AUTHENTICITY
              </span>
              <span className="text-[7px] font-mono text-slate-400">
                Scan to validate
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default CertificateTemplate;
