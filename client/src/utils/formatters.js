/**
 * Formatting and Utility Helpers
 */

/**
 * Format ISO 8601 date string to human-readable date
 * e.g., "Nov 20, 2026"
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Format ISO 8601 date string to readable time
 * e.g., "10:00 AM"
 */
export function formatTime(isoString) {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Format date & time combined
 * e.g., "Nov 20, 2026 at 10:00 AM"
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  return `${formatDate(isoString)} at ${formatTime(isoString)}`;
}

/**
 * Format for HTML <input type="datetime-local">
 */
export function toDatetimeLocal(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

/**
 * Convert datetime-local value to ISO 8601
 */
export function fromDatetimeLocal(localString) {
  if (!localString) return '';
  return new Date(localString).toISOString();
}

/**
 * Check if a date has passed
 */
export function isPastDate(isoString) {
  if (!isoString) return false;
  return new Date(isoString) < new Date();
}

/**
 * Export array of objects to CSV file and trigger browser download
 */
export function exportToCSV(data, filename = 'export.csv') {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((obj) =>
    headers
      .map((header) => {
        const val = obj[header] === null || obj[header] === undefined ? '' : String(obj[header]);
        const escaped = val.replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
