import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../types';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import PublicSchedulePage from '../pages/public/PublicSchedulePage';
import LoginPage from '../pages/public/LoginPage';
import RegisterStudentPage from '../pages/public/RegisterStudentPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';
import OrganizerRestrictedPage from '../pages/public/OrganizerRestrictedPage';
import AdminRestrictedPage from '../pages/public/AdminRestrictedPage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Student Pages
import StudentOverview from '../pages/student/StudentOverview';
import BrowseEvents from '../pages/student/BrowseEvents';
import EventDetailsPage from '../pages/student/EventDetailsPage';
import MyRegistrations from '../pages/student/MyRegistrations';
import MyCertificates from '../pages/student/MyCertificates';
import StudentNotifications from '../pages/student/StudentNotifications';
import StudentProfile from '../pages/student/StudentProfile';
import StudentSettings from '../pages/student/StudentSettings';

// Organizer Pages
import OrganizerOverview from '../pages/organizer/OrganizerOverview';
import MyEvents from '../pages/organizer/MyEvents';
import CreateEvent from '../pages/organizer/CreateEvent';
import EditEvent from '../pages/organizer/EditEvent';
import Participants from '../pages/organizer/Participants';
import OrganizerReports from '../pages/organizer/OrganizerReports';
import OrganizerNotifications from '../pages/organizer/OrganizerNotifications';
import OrganizerProfile from '../pages/organizer/OrganizerProfile';
import OrganizerSettings from '../pages/organizer/OrganizerSettings';

// Admin Pages
import AdminOverview from '../pages/admin/AdminOverview';
import UserManagement from '../pages/admin/UserManagement';
import EventManagement from '../pages/admin/EventManagement';
import VenueManagement from '../pages/admin/VenueManagement';
import RegistrationManagement from '../pages/admin/RegistrationManagement';
import CertificateManagement from '../pages/admin/CertificateManagement';
import ReportsAnalytics from '../pages/admin/ReportsAnalytics';
import AdminNotifications from '../pages/admin/AdminNotifications';
import AdminSettings from '../pages/admin/AdminSettings';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<PublicSchedulePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterStudentPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route
          path="/register/organizer-restricted"
          element={<OrganizerRestrictedPage />}
        />
        <Route
          path="/register/admin-restricted"
          element={<AdminRestrictedPage />}
        />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>

      {/* Student Module (Accessible by Student, Organizer, Admin) */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.ORGANIZER, ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentOverview />} />
        <Route path="events" element={<BrowseEvents />} />
        <Route path="events/:id" element={<EventDetailsPage />} />
        <Route path="registrations" element={<MyRegistrations />} />
        <Route path="certificates" element={<MyCertificates />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Organizer Module (Accessible by Organizer, Admin) */}
      <Route
        path="/organizer"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER, ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OrganizerOverview />} />
        <Route path="events" element={<MyEvents />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="events/edit/:id" element={<EditEvent />} />
        <Route path="participants" element={<Participants />} />
        <Route path="reports" element={<OrganizerReports />} />
        <Route path="notifications" element={<OrganizerNotifications />} />
        <Route path="profile" element={<OrganizerProfile />} />
        <Route path="settings" element={<OrganizerSettings />} />
      </Route>

      {/* Admin Module (Strictly Admin Only) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="events" element={<EventManagement />} />
        <Route path="venues" element={<VenueManagement />} />
        <Route path="registrations" element={<RegistrationManagement />} />
        <Route path="certificates" element={<CertificateManagement />} />
        <Route path="reports" element={<ReportsAnalytics />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch-all Not Found */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
