/**
 * Centralized REST API Client
 *
 * Configurable via environment variables:
 * - VITE_API_BASE_URL (defaults to http://localhost:3000/api)
 * - VITE_USE_MOCK (defaults to true for standalone frontend development)
 *
 * Provides a clean unified interface. In mock mode, requests route to mockBackend
 * while preserving the identical JSON signatures and async contracts expected by the
 * Node.js + Express backend.
 */

import { mockBackend } from './mockBackend';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'; // defaults to true unless explicitly 'false'

export class ApiError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Retrieve auth token from storage
 */
export function getAuthToken() {
  return localStorage.getItem('sepm_auth_token');
}

/**
 * Set auth token in storage
 */
export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('sepm_auth_token', token);
  } else {
    localStorage.removeItem('sepm_auth_token');
  }
}

/**
 * Core HTTP request handler for real REST calls
 */
async function httpRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle 204 No Content
    if (response.status === 204) {
      return { success: true };
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.message || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // Network failure / connection refused to backend port 3000
    throw new ApiError(
      `Unable to connect to backend server at ${API_BASE_URL}. Ensure your Express backend is running on port 3000, or toggle VITE_USE_MOCK=true in .env`,
      0,
      { originalError: error.message }
    );
  }
}

export const apiClient = {
  isMockMode: () => USE_MOCK,
  getBaseUrl: () => API_BASE_URL,

  get: (endpoint, options) => httpRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) =>
    httpRequest(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) =>
    httpRequest(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  patch: (endpoint, body, options) =>
    httpRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => httpRequest(endpoint, { method: 'DELETE', ...options }),
};

export { mockBackend };
