// frontend/src/config/api.js

import axios from "axios";

/*
==============================
INSTANCIA DE AXIOS
==============================
*/

// ✅ USA LA VARIABLE DE ENTORNO
const API_URL =  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,  // ← CAMBIADO
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

/*
==============================
INTERCEPTOR REQUEST
AGREGA TOKEN
==============================
*/

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

/*
==============================
INTERCEPTOR RESPONSE
MANEJO DE ERRORES
==============================
*/

api.interceptors.response.use(

  (response) => response,

  (error) => {

    console.error("Error en petición:", error);

    if (error.code === "ECONNABORTED") {
      console.error("Timeout - servidor no responde");
    }

    if (!error.response) {
      console.error("Servidor Laravel apagado o sin conexión");
    }

    /*
    ==============================
    ERROR AUTENTICACIÓN
    ==============================
    */

    if (error.response?.status === 401) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("rol");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }

    }

    return Promise.reject(error);

  }

);

export default api;