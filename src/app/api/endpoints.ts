import { API_URL } from '../config';

export const endpoints = {
  login: `${API_URL}/Auth/login`,
  logout: `${API_URL}/Auth/logout`,
  me: `${API_URL}/Auth/me`,
  setHistory: `${API_URL}/Sets`
  // add more as you build them out, e.g.:
  // users: `${API_URL}/users`,
  // user: (id: string) => `${API_URL}/users/${id}`,
};