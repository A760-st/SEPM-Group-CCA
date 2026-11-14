/**
 * User Management Service
 * Endpoints:
 * - GET   /api/users
 * - POST  /api/users
 * - GET   /api/users/:id
 * - PUT   /api/users/:id
 * - PATCH /api/users/:id/role
 * - PATCH /api/users/:id/status
 */

import { apiClient, mockBackend } from './apiClient';

export const userService = {
  async getUsers(params = {}) {
    if (apiClient.isMockMode()) {
      return mockBackend.getUsers(params);
    }
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/users${query ? `?${query}` : ''}`);
  },

  async createUser(userData) {
    if (apiClient.isMockMode()) {
      return mockBackend.createUser(userData);
    }
    return apiClient.post('/users', userData);
  },

  async updateUser(id, updateData) {
    if (apiClient.isMockMode()) {
      return mockBackend.updateUser(id, updateData);
    }
    return apiClient.put(`/users/${id}`, updateData);
  },

  async updateUserRole(id, role) {
    if (apiClient.isMockMode()) {
      return mockBackend.updateUserRole(id, role);
    }
    return apiClient.patch(`/users/${id}/role`, { role });
  },

  async toggleUserStatus(id) {
    if (apiClient.isMockMode()) {
      return mockBackend.toggleUserStatus(id);
    }
    return apiClient.patch(`/users/${id}/status`, {});
  },
};
