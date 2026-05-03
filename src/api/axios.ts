import axios from 'axios';
import type { AxiosInstance } from 'axios';

export interface ApiError {
  response?: {
    data?: {
      code?: string;
      msg?: string;
    };
  };
}

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default instance;