// frontend/src/config/api.js
import axios from 'axios';

// Crear instancia de axios con la URL base de Laravel
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // URL de tu backend Laravel
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para agregar el token a cada petición
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
    response => response,
    error => {
        console.error('Error en la petición:', error);
        
        if (error.code === 'ECONNABORTED') {
            console.error('Timeout - El servidor no responde');
        }
        
        if (!error.response) {
            console.error('No hay respuesta del servidor. ¿Está corriendo Laravel?');
        }
        
        // Si el error es 401 (No autorizado) o 419 (CSRF token mismatch)
        if (error.response?.status === 401 || error.response?.status === 419) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirigir al login si no estamos ya ahí
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;