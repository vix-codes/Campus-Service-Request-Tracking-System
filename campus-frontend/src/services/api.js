
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

const withApiPrefix = (base) => {
  if (!base) return "";
  const v = String(base).trim().replace(/\/+$/, "");
  if (!v) return "";
  return /\/api$/i.test(v) ? v : `${v}/api`;
};

const API = axios.create({
  // Default all requests to the backend's `/api` prefix.
  // Recommended setup:
  // - Dev: Vite proxy in `vite.config.js` forwards `/api/*` to http://localhost:5000
  // - Prod (Vercel): a Serverless Function proxies `/api/*` to Railway (see `campus-frontend/api/[...path].js`)
  // You can also bypass the proxy by setting `VITE_API_URL` to your backend origin.
  baseURL: (() => {
    const envBase = normalizeBaseUrl(import.meta.env.VITE_API_URL);
    if (envBase) return withApiPrefix(envBase);
    return "/api";
  })(),
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
