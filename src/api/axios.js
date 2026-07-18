// src/api/axios.js

import axios from 'axios';

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Crear instancia de axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 30000, // 30 segundos
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        // Obtener token del localStorage
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Manejar errores de autenticación (401)
        if (error.response && error.response.status === 401) {
            // Token expirado o inválido
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirigir al login si no está ya en esa página
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        // Manejar errores de permisos (403)
        if (error.response && error.response.status === 403) {
            console.error('No tienes permisos para realizar esta acción');
        }
        
        // Manejar errores de servidor (500)
        if (error.response && error.response.status === 500) {
            console.error('Error del servidor. Por favor, intenta más tarde.');
        }
        
        return Promise.reject(error);
    }
);

export default api;