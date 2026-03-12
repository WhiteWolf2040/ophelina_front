// frontend/src/config/auth.js
import api from './api';

// Guardar datos de sesión
const setAuthData = (token, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
};

// Eliminar datos de sesión
const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Obtener usuario actual
const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Verificar si está autenticado
const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

// ✅ FUNCIÓN LOGIN (verifica que esté aquí)
const login = async (correo, contrasena) => {
    try {
        const response = await api.post('/login', {
            correo,
            contrasena
        });
        
        if (response.data.success) {
            const { token, usuario } = response.data.data;
            setAuthData(token, usuario);
            return { success: true, data: usuario };
        }
        
        return { success: false, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error de conexión'
        };
    }
};

// ✅ FUNCIÓN LOGOUT
const logout = async () => {
    try {
        await api.post('/logout');
    } catch (error) {
        console.error('Error en logout:', error);
    } finally {
        clearAuthData();
    }
};

// ✅ FUNCIÓN fetchCurrentUser
const fetchCurrentUser = async () => {
    try {
        const response = await api.get('/user');
        if (response.data.success) {
            return response.data.data.usuario;
        }
        return null;
    } catch (error) {
        return null;
    }
};

// ✅ FUNCIÓN hasPermission
const hasPermission = (permiso) => {
    const user = getCurrentUser();
    if (!user || !user.permisos) return false;
    
    return user.permisos.some(p => p.nombre === permiso);
};

// ✅ FUNCIÓN hasRole
const hasRole = (rol) => {
    const user = getCurrentUser();
    return user?.rol === rol;
};

// Exportar todo
export {
    login,
    logout,
    getCurrentUser,
    isAuthenticated,
    fetchCurrentUser,
    hasPermission,
    hasRole,
    setAuthData,
    clearAuthData
};