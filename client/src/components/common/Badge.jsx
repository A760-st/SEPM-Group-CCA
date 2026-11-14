import React from 'react';

const statusStyles = {
  // Event Statuses
  PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
  COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',

  // Registration Statuses
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200',
  ATTENDED: 'bg-purple-50 text-purple-700 border-purple-200',
  WAITLISTED: 'bg-amber-50 text-amber-700 border-amber-200',

  // User Roles
  STUDENT: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  ORGANIZER: 'bg-amber-50 text-amber-800 border-amber-300',
  ADMIN: 'bg-rose-50 text-rose-800 border-rose-300',

  // General Status
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INACTIVE: 'bg-slate-100 text-slate-500 border-slate-300',

  // Default
  DEFAULT: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function Badge({
  children,
  variant,
  size = 'md',
  className = '',
}) {
  const resolvedKey = (variant || children || '').toString().toUpperCase();
  const badgeColor = statusStyles[resolvedKey] || statusStyles.DEFAULT;

  const sizeStyles = {
    sm: 'text-[11px] px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${badgeColor} ${sizeStyles[size]} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 mr-1.5" />
      {children}
    </span>
  );
}
