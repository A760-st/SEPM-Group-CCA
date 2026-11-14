# CampusEvent — College Event Management System (Frontend)
## Software Engineering & Project Management (SEPM) Project

A complete, production-ready, highly interactive frontend for a College Event Management System built with **React.js**, **Vite**, **Tailwind CSS**, and **React Router DOM**.

Engineered for seamless integration with a layered monolithic **Node.js + Express.js + Prisma + PostgreSQL** backend running on port `3000`.

---

## 🚀 Key Highlights & Architecture

- **Fixed Technology Stack:** React 19, Vite, Tailwind CSS v4, React Router DOM v7, Lucide Icons, Recharts.
- **Port Standards:** Frontend runs on `http://localhost:5173`, configured to interface with Express on `http://localhost:3000/api`.
- **Three Primary Roles:** Distinct portals, sidebars, pages, and workflows for:
  - 🎓 **STUDENT:** Overview, Browse Events, Event Details & Registration, My Registrations, My Certificates, Notifications, Profile, Settings.
  - 📋 **ORGANIZER:** Overview, My Events, Create Event (with venue capacity validation), Edit Event, Participant Rosters & CSV Export, Attendance Marking, Event Reports, Notifications, Profile, Settings.
  - 🛡️ **ADMIN:** System Overview, User Management & Role Assignment, Event Oversight & Emergency Cancellation, Venue Management & Capacities, Registration Oversight, Certificate Issuance, Interactive Analytics & Charts, Announcements Broadcast, Settings.
- **Stateful Mock & Live REST Dual Mode:**
  - `VITE_USE_MOCK=true`: Fully functional browser database (`localStorage`) allowing complete testing without running a database.
  - `VITE_USE_MOCK=false`: Directly calls real Express REST endpoints at `VITE_API_BASE_URL`.
  - **Quick Demo Switcher:** Top Dev Controller allows pair programmers and evaluators to switch between Student, Organizer, and Admin personas with a single click.

---

## 📁 Project Structure

```text
src/
├── assets/             # Static icons and assets
├── components/
│   ├── common/         # Button, Badge, Card, Input, Select, Textarea, Modal, ConfirmDialog,
│   │                   # ToastContainer, Pagination, EmptyState, LoadingSpinner, DevBanner
│   └── navigation/     # PublicNavbar, PublicFooter, Sidebar, TopNavbar
├── context/
│   ├── AuthContext.jsx         # Current user, JWT token, role, login/logout, demo switcher
│   └── NotificationContext.jsx # Toast alerts & notification center
├── layouts/
│   ├── PublicLayout.jsx        # Wrapper for landing, login, registration pages
│   └── DashboardLayout.jsx     # Responsive layout with role-based sidebar & topbar
├── pages/
│   ├── public/         # LandingPage, LoginPage, RegisterStudentPage, ForgotPasswordPage,
│   │                   # UnauthorizedPage, OrganizerRestrictedPage, AdminRestrictedPage,
│   │                   # PublicSchedulePage, NotFoundPage
│   ├── student/        # StudentOverview, BrowseEvents, EventDetailsPage, MyRegistrations,
│   │                   # MyCertificates, StudentNotifications, StudentProfile, StudentSettings
│   ├── organizer/      # OrganizerOverview, MyEvents, CreateEvent, EditEvent,
│   │                   # Participants (CSV Export), OrganizerReports, OrganizerNotifications,
│   │                   # OrganizerProfile, OrganizerSettings
│   └── admin/          # AdminOverview, UserManagement, EventManagement, VenueManagement,
│                       # RegistrationManagement, CertificateManagement, ReportsAnalytics,
│                       # AdminNotifications, AdminSettings
├── routes/
│   ├── ProtectedRoute.jsx      # Role-based route authorization gate
│   └── AppRoutes.jsx           # Central route declarations
├── services/
│   ├── apiClient.js            # Centralized API client & HTTP fetch wrapper
│   ├── mockBackend.js          # Stateful in-browser mock backend (localStorage)
│   ├── mockData.js             # Initial seeds matching 5 PostgreSQL entities
│   ├── authService.js          # /api/auth endpoints
│   ├── userService.js          # /api/users endpoints
│   ├── eventService.js         # /api/events endpoints
│   ├── venueService.js         # /api/venues endpoints
│   ├── registrationService.js  # /api/registrations endpoints
│   ├── certificateService.js   # /api/certificates endpoints
│   └── reportService.js        # /api/reports endpoints
├── types/
│   └── index.js                # Roles, Event statuses, Registration statuses, Departments
├── utils/
│   └── formatters.js           # Date/time formatting, CSV exporter, datetime-local converters
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🛠️ Setup & Running Instructions

### 1. Prerequisites
- **Node.js**: v18+ or v20+ (Node v26 verified)
- **npm**: v9+ (npm 11 verified)

### 2. Installation
```bash
cd college-event-system-frontend
npm install
```

### 3. Environment Configuration
Inspect or create `.env` in the root:
```env
# Target Express Backend REST Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# Standalone development mode (true = mock service, false = live backend)
VITE_USE_MOCK=true

# College Branding Placeholders
VITE_COLLEGE_NAME=Apex Institute of Technology
VITE_COLLEGE_SHORT_NAME=AIT
VITE_SUPPORT_EMAIL=events-support@apex.edu
```

### 4. Running the Development Server
```bash
npm run dev
```
The application will launch on:
```
http://localhost:5173
```

### 5. Running Production Build
```bash
npm run build
npm run preview
```

---

## 🧪 Demonstration & Testing Guide

### Preloaded Demo Accounts:
| Role | Email | Password | Preloaded Persona |
|---|---|---|---|
| **Student** | `student@apex.edu` | `student123` | Alex Rivera (STU-2024-001, CSE Dept) |
| **Organizer** | `organizer@apex.edu` | `organizer123` | Prof. Priya Sharma (IT Dept) |
| **Admin** | `admin@apex.edu` | `admin123` | Dr. Arthur Vance (Dean of Student Affairs) |

> 💡 **Quick Switch Tip:** You do not even have to type credentials! Use the **Dev Controller** banner at the top of the screen or the quick-fill buttons on the login card to instantly switch between Student, Organizer, and Admin personas.

---

## ✅ Verified Testing Checklist

- [x] **1. Landing Page Navigation:** Hero search, upcoming events grid, category pills, college branding placeholders.
- [x] **2. Login Form Validation:** Real API error handling, redirect by role.
- [x] **3. Student Registration Form:** Validates name, institutional email, Student ID, department; assigns STUDENT role.
- [x] **4. Restricted Organizer Registration:** Informs user why organizer accounts cannot be self-registered and provides a verification request workflow.
- [x] **5. Restricted Admin Registration:** Displays "Administrator Registration Restricted" and explains administrative protocol.
- [x] **6. Student Dashboard Navigation:** Overview KPI cards, registered events schedule, certificates preview.
- [x] **7. Event Search & Filters:** Grid/list toggle, search, category filter, venue filter, availability filter, pagination.
- [x] **8. Event Details:** Full metadata, organizer info, venue location & capacity, deadline warning.
- [x] **9. Event Registration:** Functional registration check with real capacity and deadline validation.
- [x] **10. Registration Cancellation:** Cancel registration modal with state update and capacity restoration.
- [x] **11. Certificate Listing & Downloads:** Real printable certificate view with verification serial and HTML/PDF download.
- [x] **12. Organizer Event Creation:** Full multi-field form with venue capacity validation and Draft/Publish options.
- [x] **13. Organizer Event Editing:** Edits existing event details and saves to API.
- [x] **14. Organizer Participant Management:** Roster filtering, attendance marking, detail modal, real CSV export download.
- [x] **15. Admin User Management:** User list, search, role assignment dropdown, provision user modal, activate/deactivate.
- [x] **16. Admin Venue Management:** Add venue modal, capacity limits, edit venue, activate/deactivate.
- [x] **17. Admin Event Management:** System-wide event oversight, emergency cancel with mandatory audit reason modal.
- [x] **18. Reports and Analytics:** Recharts visualizations for registration trends, events by status, venue utilization, and popular events.
- [x] **19. Responsive Navigation:** Fully responsive sidebar, mobile drawer, topbar notifications dropdown.
- [x] **20. API Loading and Error States:** Spinners, empty states, and toast notifications for all operations.
- [x] **21. Unauthorized (403) and 404 Route Handling:** Friendly academic unauthorized page and 404 handler.

---

## 📑 Integration Documentation

- Refer to [`API_CONTRACT.md`](./API_CONTRACT.md) for full endpoint specifications, request payloads, and status codes.
- Refer to [`BACKEND_INTEGRATION_GUIDE.md`](./BACKEND_INTEGRATION_GUIDE.md) for backend Express developer instructions.
