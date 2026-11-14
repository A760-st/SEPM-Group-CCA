/**
 * Registration Service
 * Endpoints:
 * - GET   /api/registrations
 * - POST  /api/registrations
 * - PATCH /api/registrations/:id/cancel
 * - PATCH /api/registrations/:id/attendance
 */

import { apiClient, mockBackend } from './apiClient';

export const registrationService = {
  async getRegistrations(params = {}) {
    if (apiClient.isMockMode()) {
      return mockBackend.getRegistrations(params);
    }
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/registrations${query ? `?${query}` : ''}`);
  },

  async registerForEvent(eventId, studentId) {
    if (apiClient.isMockMode()) {
      return mockBackend.registerForEvent(eventId, studentId);
    }
    return apiClient.post('/registrations', { event_id: eventId });
  },

  async cancelRegistration(registrationId, studentId) {
    if (apiClient.isMockMode()) {
      return mockBackend.cancelRegistration(registrationId, studentId);
    }
    return apiClient.patch(`/registrations/${registrationId}/cancel`, {});
  },

  async markAttendance(registrationId, attended = true) {
    if (apiClient.isMockMode()) {
      return mockBackend.markAttendance(registrationId, attended);
    }
    return apiClient.patch(`/registrations/${registrationId}/attendance`, { attended });
  },
};
