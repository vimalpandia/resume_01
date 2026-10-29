import { apiRequest, setToken, removeToken } from './api';

export const authService = {
  async register({ name, email, password, targetRole }) {
    const res = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password, targetRole },
    });
    if (res.token) {
      setToken(res.token);
    }
    return res;
  },

  async login({ email, password }) {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (res.token) {
      setToken(res.token);
    }
    return res;
  },

  async getMe() {
    return apiRequest('/auth/me');
  },

  async updateProfile(updates) {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: updates,
    });
  },

  async deleteAccount() {
    const res = await apiRequest('/auth/account', {
      method: 'DELETE',
    });
    removeToken();
    return res;
  },

  logout() {
    removeToken();
  },
};
