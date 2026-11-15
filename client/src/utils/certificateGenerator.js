import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

/**
 * High-fidelity PDF generation & browser printing for A4 Landscape Certificates
 * Uses a cloned, unconstrained sandbox container to guarantee rendering success
 * even if the preview DOM is scaled, scrolled, or in a modal overlay.
 */

/**
 * Generate and download an authentic A4 Landscape PDF from a DOM element
 * @param {HTMLElement} element - The DOM node containing CertificateTemplate
 * @param {string} fileName - Destination file name (e.g. BMS-CERT-2026-0084.pdf)
 */
export async function downloadCertificateAsPdf(element, fileName = 'certificate.pdf') {
  if (!element) {
    throw new Error('Certificate DOM element not found for PDF conversion.');
  }

  // 1. Clone element into an off-screen staging sandbox
  // This completely eliminates transforms (scale), scroll offsets, and CSS variable issues
  const sandbox = document.createElement('div');
  sandbox.style.position = 'fixed';
  sandbox.style.left = '-9999px';
  sandbox.style.top = '0';
  sandbox.style.width = '1056px';
  sandbox.style.height = '747px';
  sandbox.style.zIndex = '-9999';
  sandbox.style.opacity = '1';
  sandbox.style.pointerEvents = 'none';

  const clone = element.cloneNode(true);
  clone.style.transform = 'none';
  clone.style.width = '1056px';
  clone.style.height = '747px';
  clone.style.margin = '0';

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  let canvas;
  try {
    // 2. Render canvas at high DPI (scale 2)
    canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#FAFAFA',
      width: 1056,
      height: 747,
      windowWidth: 1056,
      windowHeight: 747,
    });
  } finally {
    // Clean up sandbox
    if (document.body.contains(sandbox)) {
      document.body.removeChild(sandbox);
    }
  }

  if (!canvas) {
    throw new Error('Failed to create canvas representation of certificate.');
  }

  const imgData = canvas.toDataURL('image/jpeg', 0.98);

  // 3. Initialize jsPDF in A4 landscape mode (297mm x 210mm)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // 297 mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // 210 mm

  // 4. Place image precisely spanning the A4 Landscape page
  pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');

  // 5. Trigger direct browser download
  pdf.save(fileName);
  return true;
}

/**
 * Print the certificate using standard browser print dialog, hiding all UI navigation
 */
export function printCertificateElement() {
  window.print();
}
