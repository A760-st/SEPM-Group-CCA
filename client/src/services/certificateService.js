/**
 * Certificate Management Service
 * Endpoints:
 * - GET  /api/certificates
 * - GET  /api/certificates/:id
 * - POST /api/certificates/issue
 * - GET  /api/certificates/:id/download
 */

import { apiClient, mockBackend } from './apiClient';

export const certificateService = {
  async getCertificates(params = {}) {
    if (apiClient.isMockMode()) {
      return mockBackend.getCertificates(params);
    }
    const query = new URLSearchParams(params).toString();
    return apiClient.get(`/certificates${query ? `?${query}` : ''}`);
  },

  async issueCertificate(registrationId, issuedByUserId) {
    if (apiClient.isMockMode()) {
      return mockBackend.issueCertificate(registrationId, issuedByUserId);
    }
    return apiClient.post('/certificates/issue', { registration_id: registrationId });
  },

  async downloadCertificate(certificateId) {
    if (apiClient.isMockMode()) {
      await mockBackend.delay(100);
      return { success: true, downloadUrl: `/mock/certificates/${certificateId}.pdf` };
    }
    return apiClient.get(`/certificates/${certificateId}/download`);
  },
};
