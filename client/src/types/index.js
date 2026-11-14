/**
 * System Data Types and Constants
 * Matches the PostgreSQL database schema for the College Event Management System
 */

// User Roles
export const ROLES = {
  STUDENT: 'STUDENT',
  ORGANIZER: 'ORGANIZER',
  ADMIN: 'ADMIN',
};

// Event Statuses
export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};

// Registration Statuses
export const REGISTRATION_STATUS = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  ATTENDED: 'ATTENDED',
  WAITLISTED: 'WAITLISTED',
};

// Academic Departments
export const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Information Technology',
  'Electronics & Communication Engineering',
  'Electrical & Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Biotechnology',
  'School of Management Studies',
  'Department of Applied Sciences',
  'School of Architecture & Design',
];

// Event Categories
export const EVENT_CATEGORIES = [
  'Technical & Coding',
  'Cultural & Arts',
  'Workshops & Seminars',
  'Sports & Fitness',
  'Entrepreneurship',
  'Academic Lecture',
  'Career & Networking',
];

// College Configuration Default Fallbacks
export const COLLEGE_CONFIG = {
  name: import.meta.env.VITE_COLLEGE_NAME || 'Apex Institute of Technology',
  shortName: import.meta.env.VITE_COLLEGE_SHORT_NAME || 'AIT',
  supportEmail: import.meta.env.VITE_SUPPORT_EMAIL || 'events-support@apex.edu',
  academicYear: '2026-2027',
};
