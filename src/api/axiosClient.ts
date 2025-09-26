import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:3000", // Ajusta al puerto de tu backend
  baseURL: "https://intranet-logis-backend-production.up.railway.app"
});

// Interceptor para añadir el token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;