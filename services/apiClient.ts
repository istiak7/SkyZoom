import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://localhost:7099/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
