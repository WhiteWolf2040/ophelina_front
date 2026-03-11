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

// Interceptor para manejar errores
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
        return Promise.reject(error);
    }
);

export default api;