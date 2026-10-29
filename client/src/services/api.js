/**
 * Centralized API client with automatic JWT token attachment
 * and unified response/error parsing.
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '') : '') + '/api';

export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export async function apiRequest(endpoint, { method = 'GET', body = null, isFormData = false, customHeaders = {} } = {}) {
  const token = getToken();
  const headers = { ...customHeaders };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData && body) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
    ...(body && { body: isFormData ? body : JSON.stringify(body) }),
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.details = data?.details;
      throw error;
    }

    return data;
  } catch (err) {
    throw err;
  }
}
