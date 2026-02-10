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
  baseURL: normalizeBaseUrl(import.meta.env.VITE_API_URL) || "http://localhost:5000",
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
