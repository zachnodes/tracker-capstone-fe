import { API_URL } from '../config';

export const endpoints = {
  login: `${API_URL}/Auth/login`,
  // add more as you build them out, e.g.:
  // users: `${API_URL}/users`,
  // user: (id: string) => `${API_URL}/users/${id}`,
};