import axios from 'axios';
import { BACK_URL } from "@/libs/config";

const api = axios.create({
  baseURL: `${BACK_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;