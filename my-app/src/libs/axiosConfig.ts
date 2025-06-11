import axios from 'axios';

const api = axios.create({
  baseURL: 'https://redibo-back-wtt.vercel.app/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;