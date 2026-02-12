import axios from 'axios';

export const apiService = axios.create({
  baseURL: import.meta.env.VITE_EMPLOYEE_API,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
