/**
 * Event Management Service
 * Endpoints:
 * - GET   /api/events
 * - GET   /api/events/:id
 * - POST  /api/events
 * - PUT   /api/events/:id
 * - PATCH /api/events/:id/publish
 * - PATCH /api/events/:id/cancel
 * - DELETE /api/events/:id
 */

import { apiClient, mockBackend } from './apiClient';

export const eventService = {
  async getEvents(params = {}) {
    if (apiClient.isMockMode()) {
      return mockBackend.getEvents(params);
    }
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/events${query ? `?${query}` : ''}`);
  },

  async getEventById(id) {
    if (apiClient.isMockMode()) {
      return mockBackend.getEventById(id);
    }
    return apiClient.get(`/events/${id}`);
  },

  async createEvent(eventData, organizerId) {
    if (apiClient.isMockMode()) {
      return mockBackend.createEvent(eventData, organizerId);
    }
    return apiClient.post('/events', eventData);
  },

  async updateEvent(id, eventData) {
    if (apiClient.isMockMode()) {
      return mockBackend.updateEvent(id, eventData);
    }
    return apiClient.put(`/events/${id}`, eventData);
  },

  async publishEvent(id) {
    if (apiClient.isMockMode()) {
      return mockBackend.publishEvent(id);
    }
    return apiClient.patch(`/events/${id}/publish`, {});
  },

  async cancelEvent(id, cancelReason) {
    if (apiClient.isMockMode()) {
      return mockBackend.cancelEvent(id, cancelReason);
    }
    return apiClient.patch(`/events/${id}/cancel`, { cancel_reason: cancelReason });
  },

  async deleteEvent(id) {
    if (apiClient.isMockMode()) {
      return mockBackend.deleteEvent(id);
    }
    return apiClient.delete(`/events/${id}`);
  },
};
