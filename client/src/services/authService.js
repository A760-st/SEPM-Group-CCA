/**
 * Authentication Service
 * Endpoints:
 * - POST /api/auth/login
 * - POST /api/auth/register (Student public registration)
 * - GET  /api/auth/me
 * - POST /api/auth/logout
 * - POST /api/auth/forgot-password
 */

import { apiClient, mockBackend, setAuthToken } from './apiClient';

export const authService = {
  async login(email, password) {
    if (apiClient.isMockMode()) {
      const response = await mockBackend.login(email, password);
      setAuthToken(response.token);
      return response;
    }
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  async registerStudent(studentData) {
    if (apiClient.isMockMode()) {
      const response = await mockBackend.registerStudent(studentData);
      setAuthToken(response.token);
      return response;
    }
    const response = await apiClient.post('/auth/register', studentData);
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  async getCurrentUser(cachedUserId) {
    if (apiClient.isMockMode()) {
      return mockBackend.getCurrentUser(cachedUserId);
    }
    return apiClient.get('/auth/me');
  },

  async logout() {
    setAuthToken(null);
    if (!apiClient.isMockMode()) {
      try {
        await apiClient.post('/auth/logout', {});
      } catch {
        // Safe to ignore logout failure on client
      }
    }
    return { success: true };
  },

  async forgotPassword(email) {
    if (apiClient.isMockMode()) {
      await mockBackend.delay();
      return {
        success: true,
        message: 'Password reset instructions have been dispatched to your college email address.',
      };
    }
    return apiClient.post('/auth/forgot-password', { email });
  },
};
