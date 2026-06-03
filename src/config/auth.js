// frontend/src/config/auth.js

import api from "./api";

/*
==============================
GUARDAR SESIÓN
==============================
*/

const setAuthData = (token, usuario) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(usuario));
  localStorage.setItem("rol", usuario.rol);
  
  // ============================================
  // 🔥 AGREGAR ESTAS DOS LÍNEAS 🔥
  // ============================================
  if (usuario.id_empresa) {
    localStorage.setItem("empresa_id", usuario.id_empresa);
  }
  if (usuario.correo) {
    localStorage.setItem("user_email", usuario.correo);
  }
};

/*
==============================
ELIMINAR SESIÓN
==============================
*/

const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("rol");
  localStorage.removeItem("empresa_id");   // ← AGREGAR
  localStorage.removeItem("user_email");   // ← AGREGAR
};

/*
==============================
OBTENER USUARIO ACTUAL
==============================
*/

const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

/*
==============================
VERIFICAR SI ESTÁ LOGUEADO
==============================
*/

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/*
==============================
LOGIN
==============================
*/

const login = async (correo, contrasena) => {
  try {

    const response = await api.post("/login", {
      correo: correo,
      contrasena: contrasena
    });

    if (response.data.success) {

      const { token, usuario } = response.data.data;

      setAuthData(token, usuario);

      return {
        success: true,
        data: usuario
      };

    }

    return {
      success: false,
      message: response.data.message
    };

  } catch (error) {

    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error de conexión con el servidor"
    };

  }
};

/*
==============================
LOGOUT
==============================
*/

const logout = async () => {
  try {

    await api.post("/logout");

  } catch (error) {

    console.error("Error cerrando sesión:", error);

  } finally {

    clearAuthData();

  }
};

/*
==============================
OBTENER USUARIO DESDE API
==============================
*/

const fetchCurrentUser = async () => {
  try {

    const response = await api.get("/user");

    if (response.data.success) {

      const usuario = response.data.data.usuario;

      localStorage.setItem("user", JSON.stringify(usuario));
      
      // 🔥 También actualizar empresa_id si viene
      if (usuario.id_empresa) {
        localStorage.setItem("empresa_id", usuario.id_empresa);
      }
      if (usuario.correo) {
        localStorage.setItem("user_email", usuario.correo);
      }

      return usuario;

    }

    return null;

  } catch (error) {

    return null;

  }
};

/*
==============================
VERIFICAR ROL
==============================
*/

const hasRole = (rol) => {
  const user = getCurrentUser();

  if (!user) return false;

  return user.rol === rol;
};

/*
==============================
VERIFICAR PERMISOS
==============================
*/

const hasPermission = (permiso) => {

  const user = getCurrentUser();

  if (!user || !user.permisos) return false;

  return user.permisos.some(p => p.nombre === permiso);

};


/*
==============================
EXPORTACIONES
==============================
*/

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