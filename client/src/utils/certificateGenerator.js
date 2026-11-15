import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * High-fidelity PDF generation & browser printing for A4 Landscape Certificates
 */

/**
 * Generate and download an authentic A4 Landscape PDF from a DOM element
 * @param {HTMLElement} element - The DOM node containing CertificateTemplate
 * @param {string} fileName - Destination file name (e.g. AIT-CERT-2026-0084.pdf)
 */
export async function downloadCertificateAsPdf(element, fileName = 'certificate.pdf') {
  if (!element) {
    throw new Error('Certificate DOM element not found for PDF conversion.');
  }

  // 1. Render at 2x scale (Retina display quality) for razor-sharp vector-like text & QR code
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
    backgroundColor: '#FAFAFA',
    windowWidth: 1056,
    windowHeight: 747,
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // 2. Initialize jsPDF in A4 landscape mode (297mm x 210mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 297 mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 210 mm

  // 3. Place image precisely spanning the A4 Landscape page
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

  // 4. Trigger direct browser download
  pdf.save(fileName);
  return true;
}

/**
 * Print the certificate using standard browser print dialog, hiding all UI navigation
 */
export function printCertificateElement() {
  window.print();
}
