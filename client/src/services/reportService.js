/**
 * Reports and Analytics Service
 * Endpoints:
 * - GET /api/reports/dashboard
 * - GET /api/reports/analytics
 */

import { apiClient, mockBackend } from './apiClient';

export const reportService = {
  async getDashboardStats() {
    if (apiClient.isMockMode()) {
      return mockBackend.getDashboardStats();
    }
    return apiClient.get('/reports/dashboard');
  },

  async getAnalyticsReports() {
    if (apiClient.isMockMode()) {
      return mockBackend.getAnalyticsReports();
    }
    return apiClient.get('/reports/analytics');
  },
};
