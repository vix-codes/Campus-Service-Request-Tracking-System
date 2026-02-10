
import axios from "axios";

const normalizeBaseUrl = (value) => {
  if (!value) return "";
  const v = String(value).trim().replace(/\/+$/, "");
  if (!v) return "";
  // If the user sets `VITE_API_URL=example.com`, axios treats it as a relative URL
  // and the browser will POST to the frontend origin (causing 405). Force a scheme.
  if (!/^https?:\/\//i.test(v)) return `https://${v}`;
  return v;
};

const API = axios.create({
  // In production, prefer same-origin requests so Vercel rewrites can proxy to the backend
  // without needing CORS or a baked-in API URL.
  baseURL:
    (normalizeBaseUrl(import.meta.env.VITE_API_URL) ||
    (import.meta.env.DEV ? "http://localhost:5000" : "")) + "/api"
});

// attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
