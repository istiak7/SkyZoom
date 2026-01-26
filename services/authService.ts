import { UserResponse } from '../types';

const API_BASE = '/api';

export const authService = {
  async login(username: string, password: string): Promise<UserResponse> {
    const response = await fetch(`${API_BASE}/User/Login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Identifier: username, Password: password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Invalid credentials');
    }

    return response.json();
  },

  async refreshToken(userId: number, refreshToken: string): Promise<UserResponse> {
    const response = await fetch(`${API_BASE}/User/RefreshToken?userId=${userId}&refreshToken=${encodeURIComponent(refreshToken)}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    return response.json();
  },

  getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('skyzoom_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },
};
