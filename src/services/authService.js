// src/config/auth.js
import api from "./api";

export const login = async (email, password) => {
  try {
    console.log(' Iniciando login para:', email);
    
    const response = await api.post('/login', {
      correo: email,
      contrasena: password
    });
    
    console.log(' Respuesta del servidor:', response.data);
    
    if (response.data.success) {
      const { token, usuario } = response.data.data;
      
      console.log(' Usuario recibido:', usuario);
      console.log(' id_empresa del usuario:', usuario.id_empresa);
      console.log(' correo del usuario:', usuario.correo);
      
      // Guardar token y datos básicos
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(usuario));
      
      // Guardar empresa_id
      if (usuario.id_empresa) {
        localStorage.setItem('empresa_id', usuario.id_empresa);
        console.log(' empresa_id guardado:', usuario.id_empresa);
      } else {
        console.warn(' usuario.id_empresa es null o undefined');
      }
      
      // Guardar email
      if (usuario.correo) {
        localStorage.setItem('user_email', usuario.correo);
        console.log(' user_email guardado:', usuario.correo);
      } else {
        console.warn(' usuario.correo es null o undefined');
      }
      
      // Guardar permisos y módulos
      if (usuario.permisos) {
        localStorage.setItem('permisos', JSON.stringify(usuario.permisos));
      }
      if (usuario.modulos) {
        localStorage.setItem('modulos', JSON.stringify(usuario.modulos));
      }
      
      console.log('=== VERIFICACIÓN FINAL ===');
      console.log('empresa_id en localStorage:', localStorage.getItem('empresa_id'));
      console.log('user_email en localStorage:', localStorage.getItem('user_email'));
      
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
    console.error(' Error en login:', error);
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
    localStorage.removeItem('empresa_id');
    localStorage.removeItem('user_email');
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