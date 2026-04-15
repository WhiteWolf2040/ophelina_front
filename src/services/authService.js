// src/config/auth.js
import api from "./api";

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      correo: email,
      contrasena: password
    });
    
    if (response.data.success) {
      const { token, usuario } = response.data.data;
      
      // Guardar token y datos básicos
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      // Guardar permisos y módulos si vienen en la respuesta
      if (usuario.permisos) {
        localStorage.setItem('permisos', JSON.stringify(usuario.permisos));
      }
      if (usuario.modulos) {
        localStorage.setItem('modulos', JSON.stringify(usuario.modulos));
      }
      
      return {
        success: true,
        data: usuario
      };
    }
    
    return {
      success: false,
      message: response.data.message || 'Error al iniciar sesión'
    };
    
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error de conexión'
    };
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await api.post('/logout');
    }
  } catch (error) {
    console.error('Error en logout:', error);
  } finally {
    // Limpiar todo el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permisos');
    localStorage.removeItem('modulos');
    localStorage.removeItem('rol');
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};