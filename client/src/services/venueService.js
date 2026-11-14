/**
 * Venue Management Service
 * Endpoints:
 * - GET   /api/venues
 * - POST  /api/venues
 * - PUT   /api/venues/:id
 * - PATCH /api/venues/:id/status
 */

import { apiClient, mockBackend } from './apiClient';

export const venueService = {
  async getVenues() {
    if (apiClient.isMockMode()) {
      return mockBackend.getVenues();
    }
    return apiClient.get('/venues');
  },

  async createVenue(venueData) {
    if (apiClient.isMockMode()) {
      return mockBackend.createVenue(venueData);
    }
    return apiClient.post('/venues', venueData);
  },

  async updateVenue(id, venueData) {
    if (apiClient.isMockMode()) {
      return mockBackend.updateVenue(id, venueData);
    }
    return apiClient.put(`/venues/${id}`, venueData);
  },

  async toggleVenueStatus(id) {
    if (apiClient.isMockMode()) {
      return mockBackend.toggleVenueStatus(id);
    }
    return apiClient.patch(`/venues/${id}/status`, {});
  },
};
