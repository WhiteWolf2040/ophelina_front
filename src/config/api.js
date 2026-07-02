// frontend/src/config/api.js

import axios from "axios";

console.log('🔍 VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('🔍 MODE:', import.meta.env.MODE);

const API_URL = import.meta.env.VITE_API_URL || 'https://ophelina-back-v1.onrender.com/api';

console.log('📡 API_URL final:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 40000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

// Interceptor Request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Interceptor Response CORREGIDO
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en petición:", error);

    if (error.code === "ECONNABORTED") {
      console.error("⏱️ Timeout - servidor no responde");
    }

    if (!error.response) {
      console.error("💥 Servidor Laravel apagado o sin conexión");
    }

    // ✅ MANEJO DE ERROR 401 - Redirigir a /login
    if (error.response?.status === 401) {
      console.log("🔒 Token expirado o inválido - Redirigiendo a login");
      
      // Limpiar localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rol");
      localStorage.removeItem("permisos");
      localStorage.removeItem("modulos");

      // ✅ REDIRIGIR A /login (NO a la raíz)
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;