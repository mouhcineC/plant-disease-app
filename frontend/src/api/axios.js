import axios from "axios";

const normalizeBaseUrl = (url) => {
  if (!url) {
    return "";
  }
  const trimmed = url.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const baseURL = normalizeBaseUrl(
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL
    : "http://localhost:8080/api"
);

const api = axios.create({
  baseURL,
});

const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem("auth_token");
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authRegister = (payload) => api.post("/auth/register", payload);
export const authLogin = (payload) => api.post("/auth/login", payload);

export const scanImage = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const fetchHistory = () => api.get("/scan/history");

export default api;